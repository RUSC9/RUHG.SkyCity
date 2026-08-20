const express = require("express");
const router = express.Router();
const CityCenterController = require("../controllers/cityCenterController");

// Home page
router.get("/", BusinessController.getHomePage);

// Featured sections
router.get("/featured/businesses", BusinessController.getFeaturedBusinesses);
router.get("/featured/entertainment", BusinessController.getFeaturedEntertainment);

// Announcements
router.get("/announcements", BusinessController.getAnnouncements);

// Registration
router.post("/register/business", BusinessController.registerBusiness);

module.exports = router;