require("dotenv").config();

module.exports = {
  APP_PORT: process.env.APP_PORT || 3000,
  DB_URL: process.env.DB_URL,
};
