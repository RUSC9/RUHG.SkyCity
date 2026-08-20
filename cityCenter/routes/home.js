const express = require("express");
const router = express.Router();
const HomeController = require("../controllers/homeController");

// Main landing page
router.get("/", HomeController.getHomePage);

// Featured sections
router.get("/featured/businesses", HomeController.getFeaturedBusinesses);
router.get("/featured/entertainment", HomeController.getFeaturedEntertainment);

// Announcements
router.get("/announcements", HomeController.getAnnouncements);

// Registration
router.post("/register/consumer", HomeController.registerConsumer);
router.post("/register/business", HomeController.registerBusiness);

module.exports = router;
