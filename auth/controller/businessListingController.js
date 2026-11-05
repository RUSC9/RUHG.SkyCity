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


// Show edit business listing page
exports.getEditBusinessListing = async (req, res) => {
    try {
        //Verify business login
        if(
            !req.session ||
            req.session.role !== "business" ||
            !req.session.userId
        ) {
            return res.status(401).send(`
                <h2>Business Login Required</h2>
                <p>Please log into your Sky City business account to continue.</p>
                <a href="/auth/login/business">Go to Business Login</a>
            `);
        }
        //Find listing belonging to logged-in owner
        const listing = await BusinessListing.findOne({
            _id: req.params.id,
            businessOwner: req.session.userId
        });

        if (!listing) {
            return res.status(404).send("Business listing not found.");
        }

        //Display edit page
        return res.render("districts/business/editBusinessListing", {
            listing,
            layout: false
        });

        } catch (error) {
            console.error("Error loading edit business listing:", error);

            return res.status(500).send("Unable to load edit page.");

        }
    };
 //Update an existing business listing
exports.updateBusinessListing = async (req, res) => {
    try {
        if(
            !req.session ||
            req.session.role !== "business" ||
            !req.session.userId
        ) {
            return res.status(401).send(`
                <h2>Business Login Required</h2>
                <p>Please log into your Sky City business account to continue.</p>
                <a href="/auth/login/business">Go to Business Login</a>
            `);
        }

        const listing = await BusinessListing.findOne({
            _id: req.params.id,
            businessOwner: req.session.userId
        });

        if (!listing) {
            return res.status(404).send("Business listing not found.");
        }

        const fields = [
            "businessName",
            "businessCategory",
            "description",
            "contactPhone",
            "contactEmail",
            "website",
            "serviceArea",
            "businessHours"
        ];

        for (const field of fields) {
            if (req.body[field] !== undefined) {
                listing[field] = req.body[field];
            }
        }

        listing.address = {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode
        };

        listing.fulfillmentOptions = {
            pickup: req.body.pickup === "on",
            delivery: req.body.delivery === "on",
            appointment: req.body.appointment === "on",
            mobileService: req.body.mobileService === "on"
        };

        await listing.save();

        return res.redirect(`/business/${listing._id}`);
    }   catch (error){
        console.error("Error updating business listing:", error);
        return res.status(500).send("Unable to update business listing.");   
    }
  };

    // Display Add Product or Service form
    exports.getAddBusinessItemForm = async (req, res) => {
        try{
            // Verify business authentication
            if(
                !req.session ||
                req.session.role !== "business" ||
                !req.session.userId
            ) {
                return res.status(401).send("Business login required.");
            }
    //Verify ownership of the listing
            const listing = await BusinessListing.findOne({
                _id: req.params.id,
                businessOwner: req.session.userId
            });

            if (!listing) {
                return res.status(404).send("Business listing not found or access denied.");
            }

            //Display the form
            return res.render("districts/business/addBusinessItem", {
                layout: false,
                title: "Add Product or Service",
                business: listing
            });

        } catch (error){
            console.error("Error loading item form:", error)
            return res.status(500).send("Unable to load item form.");
        }
    };

 // Display Quick Add Multiple Items form
exports.getQuickAddBusinessItemsForm = async (req, res) => {
  try {
    // Verify business authentication
    if (
      !req.session ||
      req.session.role !== "business" ||
      !req.session.userId
    ) {
      return res.status(401).send("Business login required.");
    }

    // Verify ownership of the business listing
    const listing = await BusinessListing.findOne({
      _id: req.params.id,
      businessOwner: req.session.userId
    });

    if (!listing) {
      return res.status(404).send(
        "Business listing not found or access denied."
      );
    }

    // Display Quick Add form
    return res.render("districts/business/quickAddBusinessItems", {
      layout: false,
      title: "Quick Add Products & Services",
      business: listing
    });

  } catch (error) {
    console.error("Error loading Quick Add form:", error);
    return res.status(500).send(
      "Unable to load Quick Add form."
    );
  }
};

    //Add a product or service to a business listing
    exports.addBusinessItem = async (req, res) => {
        try{
            // Verify business login
            if(
                !req.session || 
                req.session.role !== "business" ||
                !req.session.userId
            ) {
                return res.status(401).send("Business login required.");
            }
            // Find the listing owned by this business
            const listing = await BusinessListing.findOne({
                _id: req.params.id,
                businessOwner: req.session.userId
            });

            if (!listing) {
                return res.status(404).send("Business listing not found.");
            }

            // Get the product or service information
            const{
                name,
                itemType,
                description,
                price,
                imageUrl,
                category
            } = req.body;

            if (
                !name ||
                !name.trim() ||
                !["product", "service"].includes(itemType)
            ) {
                return res.status(400).send("Valid item name and type required.");
            }
            
            // Add the item to the listing
            listing.items.push({
                name: name.trim(),
                itemType,
                description,
                price: price === "" || price == null ? undefined : price,
                imageUrl,
                category,
                isAvailable: true,
                moderationStatus: "pending"
            });
            // Save to MongoDB
            await listing.save();
            
            return res.redirect(`/business/${listing._id}`);

        } catch (error) {
            console.error("Error adding business item:", error);
            return res.status(500) .send("Unable to add business item.")
        }
    };

   // Update an existing product or service
   
 // Add multiple products or services to a business listing
exports.quickAddBusinessItems = async (req, res) => {
  try {
    // Verify business login
    if (
      !req.session ||
      req.session.role !== "business" ||
      !req.session.userId
    ) {
      return res.status(401).send("Business login required.");
    }

    // Verify listing ownership
    const listing = await BusinessListing.findOne({
      _id: req.params.id,
      businessOwner: req.session.userId
    });

    if (!listing) {
      return res.status(404).send("Business listing not found.");
    }

    const rawItems = req.body.items;

    const submittedItems = Array.isArray(rawItems)
  ? rawItems.filter(Boolean)
  : rawItems && typeof rawItems === "object"
    ? Object.values(rawItems)
    : [];

    // Validate batch size
    if (
      !Array.isArray(submittedItems) ||
      submittedItems.length < 1 ||
      submittedItems.length > 50
    ) {
      return res.status(400).send(
        "Submit between 1 and 50 items."
      );
    }

    const newItems = [];

    // Validate all items before saving any
    for (const item of submittedItems) {
      if (
        !item ||
        typeof item.name !== "string" ||
        !item.name.trim() ||
        item.name.trim().length > 150 ||
        !["product", "service"].includes(item.itemType)
      ) {
        return res.status(400).send(
          "Each item requires a valid name and type."
        );
      }

      const price =
        item.price === "" || item.price == null
          ? undefined
          : Number(item.price);

      if (
        price !== undefined &&
        (!Number.isFinite(price) || price < 0)
      ) {
        return res.status(400).send(
          "Each price must be a valid non-negative number."
        );
      }

      newItems.push({
        name: item.name.trim(),
        itemType: item.itemType,
        category: item.category || "",
        description: item.description || "",
        price,
        imageUrl: item.imageUrl || "",
        isAvailable: true,
        moderationStatus: "pending"
      });
    }

    // Save all validated items together
    listing.items.push(...newItems);
    await listing.save();

    return res.redirect(`/business/${listing._id}`);
  } catch (error) {
    console.error("Error adding multiple business items:", error);
    return res.status(500).send(
      "Unable to add multiple business items."
    );
  }
};
// Existing single-item function
exports.updateBusinessItem = async (req, res) => {
try {
// Verify business login
if (
!req.session ||
req.session.role !== "business" ||
!req.session.userId
) {
return res.status(401).send("Business login required.");
}

// Verify listing ownership
const listing = await BusinessListing.findOne({
_id: req.params.id,
businessOwner: req.session.userId
});

if (!listing) {
return res.status(404).send("Business listing not found.");
}

// Find the product or service
const item = listing.items.id(req.params.itemId);

if (!item) {
return res.status(404).send("Product or service not found.");
}

const allowedFields = [
"name",
"itemType",
"description",
"price",
"imageUrl",
"category"
];

// Validate submitted values
if (
req.body.name !== undefined &&
(typeof req.body.name !== "string" ||
!req.body.name.trim())
) {
return res.status(400).send("Valid item name required.");
}

if (
req.body.itemType !== undefined &&
!["product", "service"].includes(req.body.itemType)
) {
return res.status(400).send("Invalid item type.");
}

// Update only permitted fields
let changed = false;

for (const field of allowedFields) {
if (req.body[field] !== undefined) {
const value = req.body[field];

if (field === "name") {
item[field] = value.trim();
} else if (field === "price" && value === "") {
item[field] = undefined;
} else {
item[field] = value;
}

changed = true;
}
}

// Changed items must be moderated again
if (changed) {
item.moderationStatus = "pending";
}

await listing.save();

return res.redirect(`/business/${listing._id}`);

} catch (error) {
console.error("Error updating business item:", error);
return res.status(500).send("Unable to update business item.");
}
};
