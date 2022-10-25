const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "config/dev.env" });

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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

app.listen(process.env.PORT, function () {
  console.log("Server Started on 3000");
});
