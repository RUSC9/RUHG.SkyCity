//connect controller to busines Listing model
const BusinessListing = require("../models/businessListing");

//Show the create business listing page
exports.getCreateBusinessListing = (req, res) => {
    // Only logged-in business accounts can access this page
    if (
        !req.session ||
        req.session.role !== "business" ||
        !req.session.userId
    ) {
        return res.status(401).send("Business login required.");
    }
    res.render("business/createBusinessListing", {
        layout: false
    });
};

//Create and save a new business listing
exports.createBusinessListing = async (req, res) => {
    try {
        //Make sure a business user is logged in 
        if (
           !req.session ||
           req.session.role !== "business" ||
           !req.session.userId
        ) {
            return res.status(401).send("Business login required.");
        }

    const {
        businessName,
        businessCategory,
        description,
        contactPhone,
        contactEmail,
        website,
        street,
        city,
        state,
        zipCode,
        serviceArea,
        businessHours,
        pickup,
        delivery,
        appointment,
        mobileService
    } = req.body;

    //Make sure required listing information is present
    if (
        !businessName ||
        !businessCategory ||
        !contactPhone ||
        !contactEmail ||
        !street ||
        !city ||
        !state ||
        !zipCode ||
        !businessHours
    ) {
        return res.status(400).send("Please complete all required fields.");
    }

    const newListing = new BusinessListing({
        //Owner comes from the logged-in session
        businessOwner: req.session.userId,
        
        businessName,
        businessCategory,
        description,
        contactPhone,
        contactEmail,
        website,

        address: {
            street,
            city,
            state,
            zipCode
        },
        
        serviceArea,
        businessHours,

        fulfillmentOptions: {
            pickup: pickup === "on",
            delivery: delivery === "on",
            appointment: appointment === "on",
            mobileService: mobileService ==="on",
        }
    });

    await newListing.save();
    
    return res.redirect("/city-center/business");
    } catch (error) {
      console.error("Business listing creation error:", error);
      return res.status(500).send("Unable to create business listing.");
    }
};