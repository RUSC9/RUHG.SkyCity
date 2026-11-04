const express = require("express");
const router = express.Router();

const adminModerationController = require(
"../controller/adminModerationController"
);

// Administrator moderation dashboard
router.get(
"/moderation",
adminModerationController.getModerationQueue
);

module.exports = router;
