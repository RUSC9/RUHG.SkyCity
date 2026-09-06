// districts/entertainment/routes/entertainment.routes.js
const router = require("express").Router();
const EntertainmentController = require("../controllers/entertainmentController");

router.get("/", EntertainmentController.getDistrictHome);

module.exports = router;

