// districts/infrastructure/routes/infrastructure.routes.js
const router = require("express").Router();
const InfrastructureController = require("../controllers/infrastructureController");

router.get("/", InfrastructureController.getDistrictHome);

module.exports = router;

