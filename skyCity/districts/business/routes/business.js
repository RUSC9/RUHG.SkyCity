// districts/business/routes/business.routes.js
const router = require("express").Router();
const BusinessController = require("../controllers/businessController");

router.get("/", BusinessController.getDistrictHome);

module.exports = router;
