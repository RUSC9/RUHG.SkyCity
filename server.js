const app = require("./app");
const { APP_PORT } = require("./core/config/appConfig");

app.listen(APP_PORT, () => {
  console.log(`Sky City backend running on port ${APP_PORT}`);
});

const express = require("express");
const app = express();
const cityCenterRoutes = require("./districts/city-center/routes/home");

app.use(express.json());
app.use("/", cityCenterRoutes); // City Center as root

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sky City running on port ${PORT}`);
});
const express = require("express");
const app = express();
const routeLoader = require("./loaders/routeLoader");

app.use(express.json());

// Load all district routes automatically
routeLoader(app);

module.exports = app;
