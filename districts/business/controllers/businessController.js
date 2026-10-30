const BusinessListing = require("../../../auth/models/businessListing");

//Show business district home
exports.getDistrictHome = (req, res) => {
  res.render("districts/business/index", {
    title: "Sky City | Business District"
  });
};

//show an individual business page
exports.getBusinessPage = async (req, res) => {
  try{
    const business = await BusinessListing.findById(req.params.id);
    if (!business) {
      return res.status(404).send("Business listing not found");
    }

    //Determine whether the logged-in business owns this listing
    const isOwner =
      req.session &&
      req.session.role === "business" &&
      req.session.userId === business.businessOwner.toString();

// Only approved and available items are public
    const visibleItems = isOwner
     ? business.items
     : business.items.filter(
      (item) =>
     item.moderationStatus === "approved" &&
     item.isAvailable === true
);
    res.render("districts/business/businessPage", {
      layout: false,
      title: business.businessName || "Sky City Business",
      business: {
        ...business.toObject(),
        items: visibleItems
},
      isOwner: isOwner,
      visibleItems: visibleItems
    });

  } catch (error) {
    console.error("Error loading business page:", error);

    return res
    .status(500)
    .send("Unable to load business page");

  }
};


