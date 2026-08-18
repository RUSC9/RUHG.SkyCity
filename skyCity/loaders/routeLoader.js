const fs = require("fs");
const path = require("path");

module.exports = (app) => {
  const districtsPath = path.join(__dirname, "../districts");

  fs.readdirSync(districtsPath).forEach((district) => {
    const routesPath = path.join(districtsPath, district, "routes");

    if (fs.existsSync(routesPath)) {
      fs.readdirSync(routesPath).forEach((file) => {
        const route = require(path.join(routesPath, file));
        app.use(`/${district}`, route);
      });
    }
  });
};
