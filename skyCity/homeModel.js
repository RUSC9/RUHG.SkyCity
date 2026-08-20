const mongoose = require("mongoose");
const { DB_URL } = require("../config/appConfig");

mongoose.connect(DB_URL)
  .then(() => console.log("Sky City database connected"))
  .catch((err) => console.error("DB connection error:", err));

module.exports = mongoose;
