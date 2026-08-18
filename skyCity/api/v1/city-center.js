const express = require("express");
const router = express.Router();
const CityCenterController = require("../../districts/city-center/controllers/homeController");

router.get("/", CityCenterController.getHomePage);

module.exports = router;
