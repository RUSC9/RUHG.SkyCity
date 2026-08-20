const express = require("express");
const app = express();
const routeLoader = require("./loaders/routeLoader");

app.use(express.json());

// Load all district routes automatically
routeLoader(app);

module.exports = app;
