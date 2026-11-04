const Admin = require("../../auth/models/Admin");

const requireAdmin = async (req, res, next) => {
try {
const adminId = req.session?.admin?.id;

if (!adminId) {
return res.status(401).json({
message: "Administrator login required."
});
}

const admin = await Admin.findById(adminId);

if (!admin || !admin.isActive) {
return res.status(403).json({
message: "Administrator access denied."
});
}

req.currentAdmin = admin;
next();
} catch (error) {
next(error);
}
};

const requireDepartment = (department) => {
return (req, res, next) => {
const admin = req.currentAdmin;

if (!admin) {
return res.status(401).json({
message: "Administrator authentication required."
});
}

if (admin.role === "ceo") {
return next();
}

if (
!Array.isArray(admin.managedDepartments) ||
!admin.managedDepartments.includes(department)
) {
return res.status(403).json({
message: "Department access denied."
});
}

next();
};
};

module.exports = {
requireAdmin,
requireDepartment
};
