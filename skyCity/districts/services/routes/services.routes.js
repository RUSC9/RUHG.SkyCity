// districts/services/routes/services.routes.js
const router = require("express").Router();
const ServicesController = require("../controllers/servicesController");

router.get("/", ServicesController.getDistrictHome);

module.exports = router;

