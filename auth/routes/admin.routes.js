const express = require("express");
const router = express.Router();

const adminManagementController = require(
"../controller/adminManagement.Controller"
);

// Require an authenticated administrator.
// The controller also verifies the manager's role and division.
function requireAdminLogin(req, res, next) {
if (!req.session?.adminId) {
return res.status(401).json({
message: "Administrator login required."
});
}

next();
}

// Administrator staff account creation
router.post(
"/staff/create",
requireAdminLogin,
adminManagementController.createStaffAccount
);

module.exports = router;