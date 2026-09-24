// auth/routes/auth.routes.js
const router = require("express").Router();
const authController = require("../controller/auth.Controller");

//Get Login Page with Business and Consumer options
router.get("/login", authController.getLoginPage);


//Business registration and login

//show business registration
router.get("/register/business", authController.getBusinessRegisterPage);

//handle business registration
router.post("/register-business", authController.registerBusiness);

//get business login page
router.get("/login/business", authController.getBusinessLoginPage);

//handle business login page
router.post("/login/business", authController.loginBusiness);

//Consumer registration and login

//show consumer registration
router.get("/register/consumer", authController.getConsumerRegisterPage);

//handle consumer registration
router.post("/register-consumer", authController.registerConsumer);

//get consumer login page
router.get("/login/consumer", authController.getConsumerLoginPage);

//handle consumer login page
router.post("/login/consumer", authController.loginConsumer);

module.exports = router;


