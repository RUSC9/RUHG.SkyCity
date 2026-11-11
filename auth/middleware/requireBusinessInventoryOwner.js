
const BusinessListing = require("../models/businessListing");

const requireBusinessInventoryOwner = async (req, res, next) => {
  try {
    if (
      !req.session ||
      req.session.role !== "business" ||
      !req.session.userId
    ) {
      return res.status(401).send("Business login required.");
    }

    const listing = await BusinessListing.findOne({
      _id: req.params.id,
      businessOwner: req.session.userId
    });

    if (!listing) {
      return res.status(404).send(
        "Business listing not found or access denied."
      );
    }

    req.businessListing = listing;
    return next();
  } catch (error) {
    console.error("Inventory authorization error:", error);
    return res.status(500).send(
      "Unable to verify business inventory access."
    );
  }
};

module.exports = requireBusinessInventoryOwner;
