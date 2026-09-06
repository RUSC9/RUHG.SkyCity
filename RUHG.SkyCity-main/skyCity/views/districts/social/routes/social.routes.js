// districts/social/routes/social.routes.js
const router = require("express").Router();
const SocialController = require("../controllers/socialController");

router.get("/", SocialController.getDistrictHome);

module.exports = router;

