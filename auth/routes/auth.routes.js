// auth/routes/auth.routes.js
const router = require("express").Router();
const authController = require("../controller/auth.Controller");

//show login page
router.get("/login", authController.getLoginPage);
//show business registration
router.get("/register/business", authController.getBusinessRegisterPage);
//show consumer registration
router.get("/register/consumer", authController.getConsumerRegisterPage);

//handle consumer registration
router.post("/register-consumer", authController.registerConsumer);

module.exports = router;


