const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve CSS, JS, images

app.set("view engine", "ejs"); // 👈 important
app.set("views", "./views");

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "callinside_official",
  port: 3306
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL database");
});

// ROUTES
app.get("/", (req, res) => {
  res.render("pages/home", { title: "Home" });
});

app.get("/about", (req, res) => {
  res.render("pages/about", { title: "About Us" });
});

app.get("/signin", (req, res) => {
  res.render("pages/signin", { title: "Sign In" });
});

app.get("/signup", (req, res) => {
  res.render("pages/signup", { title: "Sign Up" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
