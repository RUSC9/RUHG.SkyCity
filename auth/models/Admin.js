const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
{
email: {
type: String,
required: true,
unique: true,
lowercase: true,
trim: true
},

password: {
type: String,
required: true
},

role: {
type: String,
enum: [
"ceo",
"consumer_gm",
"business_gm",
"ceo_staff",
"consumer_staff",
"business_staff"
],
required: true,
immutable: true
},
managerId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Admin",
default: null
},
staffCount: {
type: Number,
default: 0,
min: 0,
max: 20
},
createdBy: {
type: mongoose.Schema.Types.ObjectId,
ref: "Admin",
default: null
},
permissions: {
type: [String],
enum: [
"view_pending",
"edit_pending",
"submit_review_notes"
],
default: []
},
division: {
type: String,
enum: ["executive", "consumer", "business"],
required: true,
immutable: true
},
isActive: {
type: Boolean,
default: true
}
},
{
timestamps: true
}
);

module.exports = mongoose.model("Admin", adminSchema);