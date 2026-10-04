//connect business-page controller to businessListing.js model//
const BusinessListing = require("../../../../auth/models/businessListing");

// districts/business/controllers/businessController.js
exports.getDistrictHome = (req, res) => {
  res.render("districts/business/index", {
    title: "Sky City | Business District",
  });
};

//new business-page controller//
exports.getBusinessPage = async (req, res) => {
  try{
    const business = await BusinessListing.findById(req.params.id);

    if (!business) {
      return res.status(404).send("Business listing not found");
    }
    
    const isOwner =
        req.session &&
        req.session.role === "business" &&
        req.session.userId === business.businessOwner.toString();

    res.render("districts/business/businessPage", {
      layout: false,
      title: business.businessName || "Sky City Business",
      business: business,
      isOwner: isOwner
    });

  } catch (error) {
       console.error("Error loading business page:", error);
       res.status(500) .send("Unable to load business page");
  }
};
