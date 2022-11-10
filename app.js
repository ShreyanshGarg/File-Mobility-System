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
  res.render("officerlogin");
});

app.get("/userlogin", function (req, res) {
  res.render("userlogin");
});

app.get("/usersignup", function (req, res) {
  res.render("usersignup");
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
  pool.query(
    "INSERT INTO customer VALUES ($1, $2,$3,$4,$5,$6,$7) RETURNING *",
    [uuidv4(), firstName, email, password, "{455555}", "1998-10-1", "M"],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.redirect("/userdashboard");
    }
  );
});

app.post("/userlogin", function (req, res) {
  console.log(req.body);
  const { name, email, password } = req.body;
  pool.query(
    "Select * from customer where email=$1",
    [email],
    (err, result) => {
      if (err) console.log(err);
      else {
        console.log(result);
        if (result.rows[0].password == password) res.redirect("/userdashboard");
        else console.log("Password Incorrect!!");
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
        console.log(err);
      } else {
        // console.log(result);
        if (result.rows[0].password == password) {
          res.redirect("/officerdashboard");
        } else console.log("password not correct!!");
      }
    }
  );
});

app.post("/upload", upload.any(), async function (req, res) {
  try {
    const { body, files } = req;
    console.log(files);
    const folderId = await createFolder(body.Name);
    for (let f = 0; f < files.length; f += 1) {
      // console.log("up");
      // console.log(folderId)
      await uploadFile(files[f],folderId);
      // console.log("down");
    }

    console.log('Form Submitted');

    let applicationNo = Math.floor(100000000 + Math.random() * 900000000);
    var str = '' + applicationNo;
    while (str.length < 10) {
        str = '0' + str;
    }
    applicationNo = parseInt(str);
    const date = new Date();
    console.log(applicationNo);
    pool.query(
      "INSERT INTO application VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,19,$20,$21,$22) RETURNING *",
      [applicationNo,date,seller_name,seller_fname,
        seller_age,
        seller_house_no,
        seller_addressline1,
        seller_addressline2,
        seller_email,
        seller_photo,
        seller_aadhar,
        seller_pan,
        buyer_name,
        buyer_fname,
        buyer_age,
        buyer_house_no,
        buyer_addressline1,
        buyer_addressline2,
        buyer_email,
        buyer_photo,
        buyer_aadhar,
        buyer_pan],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.redirect("/");
      }
    );
    // console.log("Not redirecting");
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
// 	seller_house_no varchar(10) NOT NULL,
// 	seller_addressline1 varchar(50) NOT NULL,
// 	seller_addressline2 varchar(50),
// 	seller_email varchar(50) NOT NULL,
// 	seller_photo varchar(255),
// 	seller_aadhar bigint NOT NULL,
// 	seller_pan varchar(11) NOT NULL,
// 	buyer_name varchar(255) NOT NULL,
// 	buyer_fname varchar(255) NOT NULL,
// 	buyer_age int NOT NULL,
// 	buyer_house_no varchar(10) NOT NULL,
// 	buyer_addressline1 varchar(50) NOT NULL,
// 	buyer_addressline2 varchar(50),
// 	buyer_email varchar(50) NOT NULL,
// 	buyer_photo varchar(255),
// 	buyer_aadhar bigint NOT NULL,
// 	buyer_pan varchar(11) NOT NULL
// );