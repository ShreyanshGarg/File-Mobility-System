const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "config/dev.env" });
const pool = require("./queries");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer();
const { createFolder, uploadFile } = require("./test");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const {automate} = require("./autoUpload");
const nodemailer = require("nodemailer");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

pool.connect();

// officer obj
let officerObj;

// user object
let userObj;
let formOrStatus = 0;

let applicationData = [];
function LeftPadWithZeros(number, length) {}

const execute_async = (data) => {
  try {
    pool.query(
      "Select * from application where applicationno=$1",
      [data],
      (err, result) => {
        if (result) {
          // console.log(result.rows[0]);
          applicationData.push(result.rows[0]);
          // return result.rows[0].applicationno;
        } else console.log(err);
      }
    );
    // console.log(res);

    // return res;
  } catch (err) {
    throw err;
  }
};

// nodemailer functions
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: process.env.user,
      pass: process.env.pass
  }
});
// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//       user: 'noel.gaylord@ethereal.email',
//       pass: 'zx6Wy6rHmHX8K3Weds'
//   }
// });

app.get("/", function (req, res) {
  res.render("landing-page");
});

app.get("/officerlogin", function (req, res) {
  res.render("officerlogin", { danger: "none" });
});

app.get("/userlogin", function (req, res) {
  res.render("userlogin", { danger: "none" });
});

app.get("/usersignup", function (req, res) {
  res.render("usersignup", { danger: "none" });
});

app.get("/userdashboard", (req, res) => {
  console.log(userObj);
  if (Object.keys(userObj).length === 0) res.redirect("/userlogin");

  const email = userObj.email;
  pool.query(
    "select * from customer where email=$1",
    [email],
    (err, result) => {
      if (err) console.log(err);
      else {
        let appli = result.rows[0].applicationno;
        if (appli === {} || appli === null) {
          appli = {};
          res.render("application", {
            formOrStatus: formOrStatus,
            email: email,
            applications: appli,
            data: [],
          });
        } else {
          applicationData = [];
          for (i in appli) {
            // console.log(appli[i]);
            execute_async(appli[i]);
          }
          setTimeout(() => {
            res.render("application", {
              formOrStatus: formOrStatus,
              email: email,
              applications: appli,
              data: applicationData,
            });
          }, 8000);
        }
      }
    }
  );

  // res.render("application", { formOrStatus: formOrStatus });
});

app.get("/officerdashboard", (req, res) => {
  // console.log(officerObj);
  if (Object.keys(officerObj).length === 0) res.redirect("/officerlogin");
  pool.query(
    "Select * from officers where username=$1",
    [officerObj.username],
    (err, result) => {
      if (err) console.log(err);
      else {
        let appli = result.rows[0].applications;
        if (appli === {} || appli === null) {
          appli = {};
          res.render("officer-dashboard", {
            name: result.rows[0].name,
            designation: result.rows[0].designation,
            username: result.rows[0].username,
            applications: appli,
          });
        } else {
          applicationData = [];
          // console.log("before");
          for (i in appli) {
            // console.log(appli[i]);
            execute_async(appli[i]);
          }
          setTimeout(() => {
            // console.log("after");
            // console.log(applicationData[0]);
            res.render("officer-dashboard", {
              name: result.rows[0].name,
              designation: result.rows[0].designation,
              username: result.rows[0].username,
              applications: appli,
              data: applicationData,
            });
          }, 8000);
        }
      }
    }
  );
});

app.get("/logoutuser", (req, res) => {
  userObj = [];
  res.redirect("/userlogin");
});

app.get("/logoutofficer", (req, res) => {
  officerObj = [];
  res.redirect("/officerlogin");
});

app.post("/userViewMore", (req, res) => {
  const result = JSON.parse(req.body.viewmore);
  if (userObj == null) res.redirect("/userLogin");
  else res.render("user-viewmore", { email: userObj.email, data: result });
});

app.post("/officerviewmore", (req, res) => {
  const result = JSON.parse(req.body.viewmore);
  if (officerObj === null) res.redirect("/officerlogin");
  // console.log(officerObj);
  res.render("viewmore.ejs", { user: officerObj, data: result });
});

app.post("/usersignup", function (req, res) {
  // console.log(req.body);
  const { firstName, lastName, mobileno, email, password } = req.body;
  let hashedPassword = "";
  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    hashedPassword = hash;
  });
  // console.log(hashedPassword);
  pool.query(
    "SELECT * from customer where email=$1",
    [email],
    (err, result) => {
      if (err) res.render("usersignup", { danger: "block" });
      else {
        if (result.rows.length) res.render("usersignup", { danger: "block" });
        else {
          pool.query(
            "INSERT INTO customer (customer_id,name,email,password,mobileno,applicationno,dob,gender) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *",
            [
              uuidv4(),
              firstName,
              email,
              hashedPassword,
              mobileno,
              [],
              "1998-10-1",
              "M",
            ],
            (error, results) => {
              if (error) {
                throw error;
              }
              res.redirect("/userlogin");
            }
          );
        }
      }
    }
  );
});

app.post("/userlogin", function (req, res) {
  userObj = req.body;
  // console.log(userObj);
  const { name, email, password } = req.body;
  pool.query(
    "Select * from customer where email=$1",
    [email],
    (err, result) => {
      if (err) res.render("userlogin", { danger: "block" });
      else {
        // console.log(result);
        if (!result.rows.length) res.render("userlogin", { danger: "block" });
        else {
          bcrypt.compare(
            password,
            result.rows[0].password,
            function (err, result) {
              if (result) 
              {
                automate(userObj);
                res.redirect("/userdashboard");                  
              }
              else res.render("userlogin", { danger: "block" });
            }
          );
        }
      }
    }
  );

});

app.post("/officerlogin", function (req, res) {
  officerObj = req.body;
  const { username, password } = req.body;
  pool.query(
    "Select * from officers where username=$1",
    [username],
    (err, result) => {
      if (err) {
        res.render("officerlogin", { danger: "block" });
      } else {
        // console.log(result);
        if (!result.rows.length)
          res.render("officerlogin", { danger: "block" });
        else if (result.rows[0].password == password) {
          res.redirect("/officerdashboard");
        } else res.render("officerlogin", { danger: "block" });
      }
    }
  );
});

app.post("/upload", upload.any(), async function (req, res) {
  try {
    const { body, files } = req;

    // creating application no and date
    let applicationNo = Math.floor(100000000 + Math.random() * 900000000);
    var str = "" + applicationNo;
    while (str.length < 10) {
      str = "0" + str;
    }
    applicationNo = parseInt(str);
    const date = new Date().toLocaleDateString();
    // console.log(date);

    // passing application no as folder name on google drive
    const folderId = await createFolder(applicationNo);

    // file array of all fileId
    let fileArr = [];
    for (let f = 0; f < files.length; f += 1) {
      fileArr.push(await uploadFile(files[f], folderId));
    }

    // fetching data from req.body
    let {
      sellerName,
      sellerFatherName,
      sellerAge,
      sellerEmail,
      sellerHouseNo,
      sellerAddressLine1,
      sellerAddressLine2,
      sellerCity,
      sellerPincode,
      sellerAadharCard,
      sellerPanCard,
      buyerName,
      buyerFatherName,
      buyerAge,
      buyerEmail,
      buyerHouseNo,
      buyerAddressLine1,
      buyerAddressLine2,
      buyerCity,
      buyerPincode,
      buyerAadharCard,
      buyerPanCard,
    } = body;

    let sellerAddress =
      sellerHouseNo +
      ", " +
      sellerAddressLine1 +
      " " +
      sellerAddressLine2 +
      ", " +
      sellerCity +
      " (" +
      sellerPincode +
      ")";
    let buyerAddress =
      buyerHouseNo +
      ", " +
      buyerAddressLine1 +
      " " +
      buyerAddressLine2 +
      ", " +
      buyerCity +
      " (" +
      buyerPincode +
      ")";

    console.log("File pushed on google drive");

    // insert application data into the database
    pool.query(
      "INSERT INTO application VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *",
      [
        applicationNo,
        date,
        sellerName,
        sellerFatherName,
        sellerAge,
        sellerAddress,
        sellerEmail,
        sellerAadharCard,
        sellerPanCard,
        buyerName,
        buyerFatherName,
        buyerAge,
        buyerAddress,
        buyerEmail,
        buyerAadharCard,
        buyerPanCard,
        fileArr,
        "{officer1}",
      ],
      (error, results) => {
        if (error) {
          throw error;
        }
        // res.render("application", { formOrStatus: 1 });
        formOrStatus = 1;
        res.redirect("/userdashboard");
      }
    );

    // Inserting the application to the first level officer(officer1)
    pool.query(
      "update officers set applications = array_append(applications,$1) where designation=$2",
      [applicationNo, "officer1"],
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );

    // Inserting the application to the customer
    pool.query(
      "update customer set applicationno = array_append(applicationno,$1) where email=$2",
      [applicationNo, userObj.email],
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );
  } catch (f) {
    res.send(f.message);
  }
});

app.post("/processing", async (req, res) => {
  console.log(req.body);
  const { username, password } = officerObj;
  if ("accept" in req.body) {
    const applicationNo = req.body.accept;
    pool.query(
      "Select * from officers where username=$1",
      [username],
      (err, result) => {
        if (err) {
          res.render("officerlogin", { danger: "block" });
        } else {
          // console.log(result);
          if (!result.rows.length)
            res.render("officerlogin", { danger: "block" });
          else if (result.rows[0].password == password) {
            // Hard - Co..... for officer 1
            if (result.rows[0].designation == "officer1") {
              // pop the application from officer 1 array and push to officer 2 array
              // push status in application for officer 2

              //query for removing from officer 1
              pool.query(
                "update officers set applications = array_remove(applications,$1) where username=$2",
                [applicationNo, username],
                (error, results) => {
                  if (error) {
                    throw error;
                  }
                }
              );

              //query for adding appli in officer 2
              pool.query(
                "update officers set applications = array_append(applications,$1) where designation=$2",
                [applicationNo, "officer2"],
                (error, results) => {
                  if (error) {
                    throw error;
                  }
                }
              );

              // query for updating staus of application
              pool.query(
                "update application set status = array_append(status,$1) where applicationno=$2",
                ["officer2", applicationNo],
                (error, results) => {
                  if (error) {
                    throw error;
                  } else {
                    res.redirect("/officerdashboard");
                  }
                }
              );
              
              // send mail to seller that email is accepted by officer 1
              let text = `<HTML>
    <HEAD>
    </HEAD>
    <TITLE> FMS </TITLE>
    <BODY>
    <h4>Hello ${req.body.sellerName},</h4>
    <p>Greetings from File Mobility System!</p>
    
    <p>We are please to inform you that your application number ${applicationNo} is accepted by officer1</p> 
    
    
    <p>Thanks and Regards,
    <br>Chief Officer
    <br>File Mobility System.</p>
    </BODY>
    </HTML>`
              let details = {
                from: "File Mobility System <tjsg1022@gmail.com>",
                to: req.body.sellerEmail,
                subject: "Application Status",
                html: text
              }
            
              console.log("started");
              transporter.sendMail(details, err => {
                if(err){
                  console.log(err);
                } else {
                  console.log("Success");
                }
              })
            }

            // Hard - Co..... for officer 2
            if (result.rows[0].designation == "officer2") {
              //pop the application from officer 2 array
              //update the status of application as accepted

              //query for removing from officer 2
              pool.query(
                "update officers set applications = array_remove(applications,$1) where username=$2",
                [applicationNo, username],
                (error, results) => {
                  if (error) {
                    throw error;
                  }
                }
              );

              // query for updating staus of application
              pool.query(
                "update application set status = array_append(status,$1) where applicationno=$2",
                ["accepted", applicationNo],
                (error, results) => {
                  if (error) {
                    throw error;
                  } else {
                    res.redirect("/officerdashboard");
                  }
                }
              );

              // send mail to seller that email is accepted by officer 2
                 let text = `<HTML>
    <HEAD>
    </HEAD>
    <TITLE> FMS </TITLE>
    <BODY>
    <h4>Hello ${req.body.sellerName},</h4>
    <p>Greetings from File Mobility System!</p>
    
    <p>We are please to inform you that your application number ${applicationNo} is accepted by officer1 and officer 2.</p> 
    
    
    <p>Thanks and Regards,
    <br>Chief Officer
    <br>File Mobility System.</p>
    </BODY>
    </HTML>`
              let details = {
                from: "File Mobility System <tjsg1022@gmail.com>",
                to: req.body.sellerEmail,
                subject: "Application Status",
                html: text
              }
            
              console.log("started");
              transporter.sendMail(details, err => {
                if(err){
                  console.log(err);
                } else {
                  console.log("Success");
                }
              })
            }
          } else res.render("officerlogin", { danger: "block" });
        }
      }
    );
  } else {
    const applicationNo = req.body.reject;

    // oficer 1 or officer 2 can reject and that application status should be updated as rejected
    // remove the application from respective officer application array

    // send mail to seller that email is rejected
    let text = `<HTML>
    <HEAD>
    </HEAD>
    <TITLE> FMS </TITLE>
    <BODY>
    <h4>Hello ${req.body.sellerName},</h4>
    <p>Greetings from File Mobility System!</p>
    
    <p>We are sorry to inform you that your application number ${applicationNo} is rejected.Please check all the documents and upload the correct documents again.</p> 
    
    
    <p>Thanks and Regards,
    <br>Chief Officer
    <br>File Mobility System.</p>
    </BODY>
    </HTML>`
    // console.log(text);
    let details = {
      from: "File Mobility System <tjsg1022@gmail.com>",
      to: req.body.sellerEmail,
      subject: "Application Status",
      html: text
    }
  
    console.log("started");
    transporter.sendMail(details, err => {
      if(err){
        console.log(err);
      } else {
        console.log("Success");
      }
    })

    // query for updating staus of application
    pool.query(
      "update application set status = array_append(status,$1) where applicationno=$2",
      ["rejected", applicationNo],
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );

    pool.query(
      "Select * from officers where username=$1",
      [username],
      (err, result) => {
        if (err) {
          res.render("officerlogin", { danger: "block" });
        } else {
          // console.log(result);
          if (!result.rows.length)
            res.render("officerlogin", { danger: "block" });
          else if (result.rows[0].password == password) {
            // Hard - Co..... for officer 1 nd officer 2
            //query for removing from officer
            pool.query(
              "update officers set applications = array_remove(applications,$1) ",
              [applicationNo],
              (error, results) => {
                if (error) {
                  throw error;
                } else {
                  res.redirect("/officerdashboard");
                }
              }
            );
          } else res.render("officerlogin", { danger: "block" });
        }
      }
    );
  }
});

app.get("/table", (req,res) => {
  pool.query("Select * from application", (err,result) => {
    if(err){
      console.log(err); 
    } else {
      console.log(result.rows);
      res.render("table", {applications : result.rows});
    }
  })
  
})

app.listen(process.env.PORT, function () {
  console.log("Server Started on 3000");

});

// create table application (
// 	applicationNo bigint PRIMARY KEY NOT NULL,
// 	date date NOT NULL,
// 	sellerName varchar(255) NOT NULL,
// 	sellerFatherName varchar(255) NOT NULL,
// 	sellerAge int NOT NULL,
// 	sellerAddress varchar(200) NOT NULL,
// 	sellerEmail varchar(50) NOT NULL,
// 	sellerAadharCard bigint NOT NULL,
// 	sellerPanCard varchar(11) NOT NULL,
// 	buyerName varchar(255) NOT NULL,
// 	buyerfatherName varchar(255) NOT NULL,
// 	buyerAge int NOT NULL,
// 	buyerAddress varchar(200) NOT NULL,
// 	buyerEmail varchar(50) NOT NULL,
// 	buyerAadharCard bigint NOT NULL,
// 	buyerPanCard varchar(11) NOT NULL,
//  fileArr TEXT[],
//  status TEXT[]
// );

// create table customer (
// 	customer_id varchar(255) PRIMARY KEY NOT NULL,
// 	name varchar(255) NOT NULL,
// 	email varchar(255) NOT NULL,
// 	password varchar(255) NOT NULL,
// 	mobileno bigint NOT NULL,
// 	applicationno int[] ,
// 	dob date NOT NULL,
// 	gender varchar(20) NOT NULL
// );

// create table officers (
// 	officer_id varchar(255) PRIMARY KEY NOT NULL,
// 	name varchar(255) NOT NULL,
// 	username varchar(255) NOT NULL,
// 	password varchar(255) NOT NULL,
// 	applications int[] ,
// 	designation varchar(20) NOT NULL
// );
