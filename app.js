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
  res.render("officerlogin");
});

app.get("/userlogin", function (req, res) {
  res.render("userlogin");
});

app.get("/usersignup", function (req, res) {
  res.render("usersignup");
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

app.listen(process.env.PORT, function () {
  console.log("Server Started on 3000");
});
