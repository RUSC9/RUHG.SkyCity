// districts/business/routes/business.routes.js
const router = require("express").Router();
const BusinessController = require("../controllers/businessController");

router.get("/", BusinessController.getDistrictHome);
router.get("/:id", BusinessController.getBusinessPage);

module.exports = router;
