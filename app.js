const express = require("express");
const path = require("path");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//secure login to avoid access by entering url in browser without logging in first
app.use(
  session({
    secret: "sky-city-secret", 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false
    }
  })
);

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

// Business listing routes
 app.use(
  "/business-listings", 
  require("./auth/routes/businessListing.routes")
 );

app.get("/", (req,res) => { res.sendFile(path.join(__dirname,"public", "aboutSkyCity.html"));
});
module.exports = app;
