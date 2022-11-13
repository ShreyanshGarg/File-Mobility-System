const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "config/dev.env" });
const pool = require("./queries");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer();
const {createFolder, uploadFile} = require("./test")

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

pool.connect();

function LeftPadWithZeros(number, length)
{
    
}

app.get("/", function (req, res) {
  res.render("landing-page");
})

app.get("/officerlogin", function (req, res) {
  res.render("officerlogin",{danger:"none"});
});

app.get("/userlogin", function (req, res) {
  res.render("userlogin",{danger:"none"});
});

app.get("/usersignup", function (req, res) {
  res.render("usersignup",{danger:"none"});
});

app.get("/userdashboard", function (req, res) {
  res.render("application");
});

app.get("/officerdashboard", function (req, res) {
  res.render("officer-dashboard");
});

app.post("/usersignup", function (req, res) {
  // console.log(req.body);
  const { firstName, lastname, mobileno, email, password } = req.body;
  pool.query("SELECT * from customer where email=$1", [email], (err, result) => {
    if(err) res.render("usersignup",{danger:"block"});
    else{
      if(result.rows.length) res.render("usersignup",{danger:"block"});
      else {
        pool.query(
          "INSERT INTO customer VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *",
          [uuidv4(), firstName, email, password,mobileno, "{455555}", "1998-10-1", "M"],
          (error, results) => {
            if (error) {
              throw error;
            }
            res.redirect("/userdashboard");
          }
        );
      }
    }
  })
});

app.post("/userlogin", function (req, res) {
  console.log(req.body);
  const { name, email, password } = req.body;
  pool.query(
    "Select * from customer where email=$1",
    [email],
    (err, result) => {
      if (err) res.render("userlogin",{danger:"block"});
      else {
        console.log(result);
        if(!result.rows.length) res.render("userlogin",{danger:"block"});
        else if (result.rows[0].password == password) res.redirect("/userdashboard");
        else res.render("userlogin",{danger:"block"});
      }
    }
  );
});

app.post("/officerlogin", function (req, res) {
  // console.log(req.body);
  const { name, username, password } = req.body;
  pool.query(
    "Select * from officers where username=$1",
    [username],
    (err, result) => {
      if (err) {
        res.render("officerlogin",{danger:"block"});
      } else {
        // console.log(result);
        if(!result.rows.length) res.render("officerlogin",{danger:"block"});
        else if (result.rows[0].password == password) {
          res.redirect("/officerdashboard");
        } else res.render("officerlogin",{danger:"block"});
      }
    }
  );
});

app.post("/upload", upload.any(), async function (req, res) {
  try {
    const { body, files } = req;
    
    // creating application no and date
    let applicationNo = Math.floor(100000000 + Math.random() * 900000000);
    var str = '' + applicationNo;
    while (str.length < 10) {
        str = '0' + str;
    }
    applicationNo = parseInt(str);
    const date = new Date();
    console.log(date);

    // passing application no as folder name on google drive
    const folderId = await createFolder(applicationNo);

    // file array of all fileId
    let fileArr = [];
    for (let f = 0; f < files.length; f += 1) {
      fileArr.push(await uploadFile(files[f],folderId));
    }

    // fetching data from req.body
    let {sellerName, sellerFatherName, sellerAge, sellerEmail, sellerHouseNo, sellerAddressLine1, sellerAddressLine2, sellerCity, sellerPincode, sellerAadharCard, sellerPanCard, 
     buyerName, buyerFatherName, buyerAge, buyerEmail, buyerHouseNo, buyerAddressLine1, buyerAddressLine2, buyerCity, buyerPincode, buyerAadharCard, buyerPanCard} = body;

    let sellerAddress = sellerHouseNo + ", " + sellerAddressLine1 + " " + sellerAddressLine2 + ", " + sellerCity + " (" + sellerPincode + ")";
    let buyerAddress = buyerHouseNo + ", " + buyerAddressLine1 + " " + buyerAddressLine2 + ", " + buyerCity + " (" + buyerPincode + ")";

    console.log('File pushed on google drive');

    // insert application data into the database
    pool.query(
      "INSERT INTO application VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *",
      [applicationNo,date,sellerName,sellerFatherName,sellerAge,sellerAddress,sellerEmail,sellerAadharCard,sellerPanCard,
       buyerName,buyerFatherName,buyerAge,buyerAddress,buyerEmail,buyerAadharCard,buyerPanCard,fileArr],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.redirect("/");
      }
    );

  } catch (f) {
    res.send(f.message);
  }
});

app.listen(process.env.PORT, function () {
  console.log("Server Started on 3000");
});


// create table application (
// 	application_no bigint PRIMARY KEY NOT NULL,
// 	app_date date NOT NULL,
// 	seller_name varchar(255) NOT NULL,
// 	seller_fname varchar(255) NOT NULL,
// 	seller_age int NOT NULL,
// 	seller_address varchar(200) NOT NULL,
// 	seller_email varchar(50) NOT NULL,
// 	seller_aadhar bigint NOT NULL,
// 	seller_pan varchar(11) NOT NULL,
// 	buyer_name varchar(255) NOT NULL,
// 	buyer_fname varchar(255) NOT NULL,
// 	buyer_age int NOT NULL,
// 	buyer_address varchar(200) NOT NULL,
// 	buyer_email varchar(50) NOT NULL,
// 	buyer_aadhar bigint NOT NULL,
// 	buyer_pan varchar(11) NOT NULL,
//  file_array TEXT[]
// );