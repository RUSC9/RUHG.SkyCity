const express = require("express");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// District routes
app.use("/city-center", require("./districts/cityCenter/routes/cityCenter.routes"));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SkyCity server running on port ${PORT}`);
});

