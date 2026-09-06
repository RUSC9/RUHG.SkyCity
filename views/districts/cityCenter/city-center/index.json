const express = require("express");
const router = express.Router();
const CityCenterController = require("../controllers/cityCenterController");

// Home page
router.get("/", CityCenterController.getHomePage);

// Featured sections
router.get("/featured/businesses", CityCenterController.getFeaturedBusinesses);
router.get("/featured/entertainment", CityCenterController.getFeaturedEntertainment);

// Announcements
router.get("/announcements", CityCenterController.getAnnouncements);

// Registration
router.post("/register/consumer", CityCenterController.registerConsumer);
router.post("/register/business", CityCenterController.registerBusiness);

module.exports = router;
