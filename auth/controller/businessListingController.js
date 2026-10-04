//connect controller to business Listing model
const BusinessListing = require("../models/businessListing");

//Show the create business listing page
exports.getCreateBusinessListing = async (req, res) => {
    try{
    // Only logged-in business accounts can access this page
    if (
        !req.session ||
        req.session.role !== "business" ||
        !req.session.userId
    ) {
        return res.status(401).send("Business login required.");
    }

    //Check whether this business already has a listing
    const existingListing = await BusinessListing.findOne({
            businessOwner: req.session.userId
        });
    
    //If a listing already exists, send the owner to it
        if(existingListing) {
            return res.redirect(`/business/${existingListing._id}`);
        }
    
    //Otherwise show the create listing form
        res.render("business/createBusinessListing", {
            layout: false
        });
     } catch (error) {
      console.error("Error loading business listing page:", error);
      
            return res
                .status(500)
                .send("Unable to load business listing page.");
      }
    };


    //Create and save a new business listing
exports.createBusinessListing = async (req, res) => {
    try{
        //Make sure a business user is logged in 
        if (
           !req.session ||
           req.session.role !== "business" ||
           !req.session.userId
        ) {
            return res.status(401).send("Business login required.");
        }

        //Prevent the same business account from creating another listing
        const existingListing = await BusinessListing.findOne({
            businessOwner: req.session.userId
        });

        if (existingListing) {
            return res.redirect(`/business/${existingListing._id}`);
        }

        //Get listing information from the form
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
        return res
        .status(400)
        .send("Please complete all required fields.");
    }

    //Create the new business listing
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

        //Save listing to MongoDB
        await newListing.save();

        //Send the business owner directly to their business page
        return res.redirect(`/business/${newListing._id}`);
} catch (error) {
    console.error("Business listing creation error:", error);

        return res
            .status(500)
            .send("Unable to create business listing.");
    }
};
