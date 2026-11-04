const express = require("express");
const path = require("path");
const app = express();
// Trust the first reverse proxy in production.
// Required for secure session cookies behind an HTTPS proxy.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//secure login to avoid access by entering url in browser without logging in first
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly:true,
      secure: process.env.NODE_ENV ==="production",
      sameSite: "lax",
      maxAge: 1000*60*60*2
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

// Authentication routes
app.use("/auth", require("./auth/routes/auth.routes"));

// Administrator moderation routes
const adminModerationRoutes = require("./auth/routes/adminModeration.routes");
app.use("/admin", adminModerationRoutes);

// Administrator management routes
const adminRoutes = require("./auth/routes/admin.routes");
app.use("/admin", adminRoutes);

// Business listing routes
 app.use(
  "/business-listings",
  require("./auth/routes/businessListing.routes")
 );

// Business district routes
 app.use(
  "/business",
  require("./views/districts/business/routes/business.routes")
 );

app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname,"public", "aboutSkyCity.html"));
});
module.exports = app;
