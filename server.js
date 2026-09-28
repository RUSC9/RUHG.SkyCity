// server.js
require ("./core/database/connection");
const app = require("./app");
const { APP_PORT } = require("./core/config/appConfig");

app.get("/city-center/business",  (req, res) => {
  res.render("businessCityCenter", {layout: false});
});

app.get("/city-center/consumer",  (req, res) => {
  res.render("consumerCityCenter", {layout: false});
});  

app.listen(APP_PORT, () => {
  console.log(`Sky City backend running on port ${APP_PORT}`);
});


