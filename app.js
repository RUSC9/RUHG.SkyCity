const express = require("express");
const path = require("path");
const app = express();
const routeLoader = require("./loaders/routeLoader");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Load all district routes automatically
routeLoader(app);

module.exports = app;
