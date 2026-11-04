const mongoose = require("mongoose");
const businessListingSchema = new mongoose.Schema(
    {
        businessOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
            unique: true
        },

        businessName: {
            type: String,
            required: true,
            trim: true
        },

        businessCategory: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        contactPhone: {
            type: String,
            required: true,
            trim: true
        },

        contactEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        website: {
            type: String,
            trim: true
        },

        address: {
            street: {
                type: String,
                required: true,
                trim: true
        },
        
        city: {
            type: String,
            required: true,
            trim: true
        },
        
        state: {
            type: String,
            required: true,
            trim: true
        },
        
        zipCode: {
            type: String,
            required: true,
            trim: true
            }
        },

        serviceArea: {
            type: String,
            trim: true
        },

        businessHours: {
            type: String,
            required: true,
            trim: true
        },

        fulfillmentOptions: {
            pickup: {
                type: Boolean,
                default: false
            },

            delivery: {
                type: Boolean,
                default: false
            },

            appointment: {
                type: Boolean,
                default: false
            },

            mobileService: {
                type: Boolean,
                default: false
            }
        },

        photos: [
            {
                type: String
            }
        ],

        items: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true
                },
        itemType: {
            type: String,
            enum: ["product", "service"],
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            min: 0
        },
        imageUrl: {
            type: String,
            trim: true
          },
          category: {
            type: String,
            trim: true
          },
          isAvailable: {
            type: Boolean,
            default: true
          },
          moderationStatus: {
            type: String,
            enum: ["pending", "approved", "flagged", "rejected"],
            default: "pending"
          },
          moderationReason: {
            type: String,
            trim: true,
            default: ""
          },
          moderatedAt: {
            type: Date,
            default: null
          },
          moderatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null
          }
         }
        ],

        isActive: {
            type: Boolean,
            default: true
        },

        isApproved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "BusinessListing",
     businessListingSchema
);