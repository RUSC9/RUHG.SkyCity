//connect business controller to routes
const express = require("express");
const router = express.Router();

const businessListingController = require("../controller/businessListingController");

// Show the create business listing page
router.get(
    "/create",
    businessListingController.getCreateBusinessListing
);

// Save a new business listing
router.post(
    "/create",
    businessListingController.createBusinessListing
);

module.exports = router;
