const BusinessListing = require("../models/businessListing");
const Admin = require("../models/Admin");

// Display items requiring administrator review
exports.getModerationQueue = async (req, res) => {
try {
if (
!req.session ||
req.session.role !== "admin" ||
!req.session.userId
) {
return res.status(403).send("Administrator access required.");
}

const admin = await Admin.findById(req.session.userId);

if (!admin || !admin.isActive || admin.role !== "admin") {
return res.status(403).send("Administrator access denied.");
}


const listings = await BusinessListing.find({
"items.moderationStatus": { $in: ["pending", "flagged"] }
});

const reviewItems = [];

listings.forEach((listing) => {
listing.items.forEach((item) => {
if (["pending", "flagged"].includes(item.moderationStatus)) {
reviewItems.push({
businessId: listing._id,
businessName: listing.businessName,
item
});
}
});
});

return res.render("admin/moderationQueue", {
layout: false,
title: "Sky City Moderation",
reviewItems
});
} catch (error) {
console.error("Moderation queue error:", error);
return res.status(500).send("Unable to load moderation queue.");
}
};
