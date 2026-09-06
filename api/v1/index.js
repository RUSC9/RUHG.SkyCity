const express = require("express");
const router = express.Router();

router.use("/city-center", require("./city-center"));

module.exports = router;
