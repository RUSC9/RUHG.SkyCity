const express = require("express");
const path = require("path");
const app = express();
const expressLayouts = require("express-ejs-layouts");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set("layout", "layout");


// View engine
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "auth", "views")
]);
// Static files
app.use(express.static(path.join(__dirname, "public")));

// District routes
app.use("/city-center", require("./districts/cityCenter/routes/cityCenter.routes"));
//Authentication routes
app.use("/auth", require("./auth/routes/auth.routes"));
app.get("/", (req,res) => { res.redirect("/city-center");});

module.exports = app;
