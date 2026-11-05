
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

// Sky City Administrator Management
// Handles administrator and delegated staff accounts.

// Staff account creation and supervisor
// validation will be implemented here.

const STAFF_ROLE_MAP = Object.freeze({
ceo: {
staffRole: "ceo_staff",
division: "executive"
},
consumer_gm: {
staffRole: "consumer_staff",
division: "consumer"
},
business_gm: {
staffRole: "business_staff",
division: "business"
}
});

const MAX_STAFF_PER_MANAGER = 20;

const createStaffAccount = async (req, res) => {
    let reservedManagerId = null;
try {
// Verify the authenticated administrator
const managerId = req.session?.admin?.id;

if (!managerId) {
return res.status(401).json({
message: "Administrator login required."
});
}

const manager = await Admin.findById(managerId);

if (!manager || !manager.isActive) {
return res.status(403).json({
message: "Administrator access denied."
});
}

const roleConfig = STAFF_ROLE_MAP[manager.role];

if ( 
!roleConfig ||
manager.division !== roleConfig.division
) {
return res.status(403).json({
message: "Not authorized to create staff accounts."
});
}

// Additional validation will be added next.

const { email, password } = req.body;

if (
typeof email !== "string" ||
!email.trim() ||
typeof password !== "string" ||
password.length < 12
) {
return res.status(400).json({
message: "A valid email and password of at least 12 characters are required."
});
}

const normalizedEmail = email.trim().toLowerCase();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(normalizedEmail)) {
return res.status(400).json({
message: "Please provide a valid email address."
});
}
const existingAccount = await Admin.findOne({
email: normalizedEmail
});

if (existingAccount) {
return res.status(409).json({
message: "An administrator account already exists with this email."
});
}
// Reserve a staff position only after validation
const reservedManager = await Admin.findOneAndUpdate(
{
_id: manager._id,
role: manager.role,
division: roleConfig.division,
isActive: true,
$expr: {
  $lt: [
    { $ifNull: ["$staffCount", 0] },
    { $ifNull: ["$staffLimit", 20] }
  ]
}
},
{
$inc: { staffCount: 1 }
},
{
new: true
}
);

if (!reservedManager) {
return res.status(403).json({
message: "This manager has reached their authorized staffing capacity."
});
}
 reservedManagerId = reservedManager._id;
const hashedPassword = await bcrypt.hash(password, 12);
const staffAccount = new Admin({
email: normalizedEmail,
password: hashedPassword,
role: roleConfig.staffRole,
division: roleConfig.division,
managerId: manager._id,
createdBy: manager._id,
permissions: [
"view_pending",
"edit_pending",
"submit_review_notes"
],
isActive: false
});
await staffAccount.save();
reservedManagerId = null;

return res.status(201).json({
message: "Staff account created successfully. Awaiting activation.",
staffId: staffAccount._id,
role: staffAccount.role,
division: staffAccount.division,
isActive: staffAccount.isActive
});
} catch (error) {
console.error("Staff creation error:", error);

if (reservedManagerId) {
try {
await Admin.updateOne(
{
_id: reservedManagerId,
staffCount: { $gt: 0 }
},
{
$inc: { staffCount: -1 }
}
);
} catch (rollbackError) {
console.error("Staff count rollback failed:", rollbackError);
}
}

return res.status(error.code === 11000 ? 409 : 500).json({
message:
error.code === 11000
? "An administrator account already exists with this email."
: "Unable to create staff account."
});
}
};
const createExecutiveManager = async (req, res) => {
try {
const ceoId = req.session?.admin?.id;

if (!ceoId) {
return res.status(401).json({
message: "Administrator login required."
});
}

const ceo = await Admin.findById(ceoId);

if (
!ceo ||
!ceo.isActive ||
ceo.role !== "ceo" ||
ceo.division !== "executive"
) {
return res.status(403).json({
message: "CEO authorization required."
});
}
const { email, password, managedDepartments } = req.body;

if (
typeof email !== "string" ||
typeof password !== "string" ||
!Array.isArray(managedDepartments)
) {
return res.status(400).json({
message: "Email, password, and managed departments are required."
});
}

const allowedDepartments = [
"accounting",
"payment_processing",
"payroll",
"marketing_sales",
"corporate_administration",
"human_resources",
"technology",
"cybersecurity"
];

const invalidDepartment = managedDepartments.some(
department => !allowedDepartments.includes(department)
);

if (managedDepartments.length === 0 || invalidDepartment) {
return res.status(400).json({
message: "A valid executive department assignment is required."
});
}

const normalizedEmail = email.trim().toLowerCase();

if (!normalizedEmail.includes("@")) {
return res.status(400).json({
message: "A valid email address is required."
});
}
if (password.length < 12) {
return res.status(400).json({
message: "Password must be at least 12 characters."
});
}
const existingAdmin = await Admin.findOne({
email: normalizedEmail
});

if (existingAdmin) {
return res.status(409).json({
message: "An administrator account with this email already exists."
});
}
const hashedPassword = await bcrypt.hash(password, 12);

const executiveManager = new Admin({
email: normalizedEmail,
password: hashedPassword,
role: "executive_manager",
division: "executive",
department: null,
managedDepartments,
managerId: ceo._id,
createdBy: ceo._id,
permissions: [
"view_department_dashboard",
"manage_department_staff",
"manage_department_operations"
],
isActive: false
});

await executiveManager.save();

return res.status(201).json({
message: "Executive manager account created successfully. Awaiting activation.",
managerId: executiveManager._id,
role: executiveManager.role,
division: executiveManager.division,
managedDepartments: executiveManager.managedDepartments,
isActive: executiveManager.isActive
});
} catch (error) {
console.error("Create executive manager error:", error);

if (error.code === 11000) {
return res.status(409).json({
message: "An administrator account with this email already exists."
});
}

return res.status(500).json({
message: "Unable to create executive manager."
});
}
};

const activateExecutiveManager = async (req, res) => {
try {
const ceoId = req.session?.admin?.id;
const { managerId } = req.params;

if (!ceoId) {
return res.status(401).json({
message: "Administrator login required."
});
}

const ceo = await Admin.findById(ceoId);

if (
!ceo ||
!ceo.isActive ||
ceo.role !== "ceo" ||
ceo.division !== "executive"
) {
return res.status(403).json({
message: "CEO authorization required."
});
}
if (!mongoose.isValidObjectId(managerId)) {
  return res.status(400).json({
    message: "Invalid executive manager ID."
  });
}
const executiveManager = await Admin.findOne({
_id: managerId,
role: "executive_manager",
division: "executive"
});

if (!executiveManager) {
return res.status(404).json({
message: "Executive manager account not found."
});
}

if (executiveManager.isActive) {
  return res.status(409).json({
    message: "Executive manager is already active."
  });
}

executiveManager.isActive = true;
await executiveManager.save();

return res.status(200).json({
message: "Executive manager activated successfully.",
managerId: executiveManager._id,
isActive: executiveManager.isActive
});
} catch (error) {
console.error("Activate executive manager error:", error);

return res.status(500).json({
message: "Unable to activate executive manager."
});
}
};

module.exports = {
    createStaffAccount,
    createExecutiveManager,
    activateExecutiveManager
};
