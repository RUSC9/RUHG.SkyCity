// loaders/routeLoader.js
const path = require("path");

module.exports = (app) => {
  // City Center
  app.use("/city-center", require("../city-center/routes/cityCenter.routes"));

  // Districts
  app.use("/districts/business", require("../districts/business/routes/business.routes"));
  app.use("/districts/entertainment", require("../districts/entertainment/routes/entertainment.routes"));
  app.use("/districts/food-drink", require("../districts/food-drink/routes/foodDrink.routes"));
  app.use("/districts/services", require("../districts/services/routes/services.routes"));
  app.use("/districts/social", require("../districts/social/routes/social.routes"));
  app.use("/districts/infrastructure", require("../districts/infrastructure/routes/infrastructure.routes"));

  // Auth
  app.use("/auth", require("../auth/routes/auth.routes"));

  // Root redirect
  app.get("/", (req, res) => res.redirect("/city-center"));
};
