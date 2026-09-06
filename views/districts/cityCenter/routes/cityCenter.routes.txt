// districts/cityCenter/routes/cityCenter.routes.js
const router = require("express").Router();
const CityCenterController = require("../controllers/cityCenterController");

router.get("/", CityCenterController.getDistrictHome);

module.exports = router;

