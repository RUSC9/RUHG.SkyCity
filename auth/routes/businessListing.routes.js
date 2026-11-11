//connect business controller to routes
const express = require("express");
const router = express.Router();

const businessListingController = require("../controller/businessListingController");
const businessInventoryImportController = require("../controller/businessInventoryImportController");
const businessInventoryUpload = require("../middleware/businessInventoryUpload");
const requireBusinessInventoryOwner = require("../middleware/requireBusinessInventoryOwner");
const {
  ensureBusinessInventoryCsrf,
  requireBusinessInventoryCsrf
} = require("../middleware/businessInventoryCsrf");


router.get(
    "/create",
    businessListingController.getCreateBusinessListing
);

// Save a new business listing
router.post(
    "/create",
    businessListingController.createBusinessListing
);

//Show the edit business listing page
router.get(
    "/:id/edit",
    businessListingController.getEditBusinessListing
);

//Save changes to an existing business listing
router.post(
    "/:id/edit",
    businessListingController.updateBusinessListing
);

// Display the Add Product or Service form
router.get(
    "/:id/items/new",
    businessListingController.getAddBusinessItemForm
);

// Add a product or service
router.post(
    "/:id/items",
    businessListingController.addBusinessItem
);

 // Display Quick Add Multiple Items form
router.get(
    "/:id/items/quick-add",
    businessListingController.getQuickAddBusinessItemsForm
);

// Save multiple products or services
router.post(
    "/:id/items/quick-add",
    businessListingController.quickAddBusinessItems
);


/* ==========================================
   SKY CITY — BULK INVENTORY UPLOAD
   ========================================== */

// Display the Bulk Inventory Upload page
router.get(
  "/:id/items/bulk-upload",
  requireBusinessInventoryOwner,
  ensureBusinessInventoryCsrf,
  businessListingController.getBulkUploadBusinessItemsForm
);

// Validate and preview uploaded inventory
router.post(
  "/:id/items/bulk-upload/preview",
  requireBusinessInventoryOwner,
  requireBusinessInventoryCsrf,
  businessInventoryUpload,
  businessInventoryImportController.previewInventoryUpload
);


//Edit a product or a service
router.post(
    "/:id/items/:itemId/edit",
    businessListingController.updateBusinessItem
);

//Delete a product or service
//router.post(
  //  "/:id/items/:itemId/delete",
    //businessListingController.deleteBusinessItem
//);

module.exports = router;