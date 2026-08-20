const app = require("./app");
const { APP_PORT } = require("./core/config/appConfig");

app.listen(APP_PORT, () => {
  console.log(`Sky City backend running on port ${APP_PORT}`);
});
