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
"executive_manager",
"executive_staff",
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
  min: 0
},
staffLimit: {
  type: Number,
  default: 20,
  min: 0
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
"submit_review_notes",
"view_department_dashboard",
"manage_department_staff",
"manage_department_operations"
],
default: []
},
division: {
type: String,
enum: ["executive", "consumer", "business"],
required: true,
immutable: true
},
department: {
type: String,
enum: [
"accounting",
"payment_processing",
"payroll",
"marketing_sales",
"corporate_administration",
"human_resources",
"technology",
"cybersecurity"
],
default: null
},
managedDepartments: {
type: [String],
enum: [
"accounting",
"payment_processing",
"payroll",
"marketing_sales",
"corporate_administration",
"human_resources",
"technology",
"cybersecurity"
],
default: []
},
isActive: {
type: Boolean,
default: false
}
},
{
timestamps: true
}
);

module.exports = mongoose.model("Admin", adminSchema);