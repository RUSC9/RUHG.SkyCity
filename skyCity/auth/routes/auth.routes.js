// auth/routes/auth.routes.js
const router = require("express").Router();
const AuthController = require("../controllers/authController");

router.get("/login", AuthController.getLoginPage);
router.get("/register/business", AuthController.getBusinessRegisterPage);
router.get("/register/consumer", AuthController.getConsumerRegisterPage);

module.exports = router;


