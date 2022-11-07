const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "config/dev.env" });
const pool = require("./queries.js");
const { v4: uuidv4 } = require("uuid");
const e = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

pool.connect();

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
  res.render("user-dashboard");
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
        // console.log(result);
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

app.listen(process.env.PORT, function () {
  console.log("Server Started on 3000");
});
