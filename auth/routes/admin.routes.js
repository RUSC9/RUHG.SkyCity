const express = require("express");
const router = express.Router();

const adminManagementController = require(
"../controller/adminManagement.Controller"
);
const { requireAdmin } = require("../../core/middleware/adminAuthorization");
const requireAdminLogin = requireAdmin;
const {loginAdmin} = require("../controller/adminAuthController");
//Administrator login
//Display administrator login page
router.get("/login", (req, res) =>{
    res.render("admin/login",{
        layout: false
    });
});
router.post("/login", loginAdmin);
// Protected administrator dashboard
router.get("/dashboard", requireAdminLogin, (req, res) => {
const admin = req.session.admin;

return res.render("admin/dashboard", {
layout: false,
role: admin.role,
division: admin.division
});
});

// Require an authenticated administrator.
// The controller also verifies the manager's role and division.
// Administrator staff account creation
router.post(
"/staff/create",
requireAdminLogin,
adminManagementController.createStaffAccount
);
router.post(
"/executive-manager/create",
requireAdminLogin,
adminManagementController.createExecutiveManager
);
router.patch(
"/executive-manager/:managerId/activate",
requireAdminLogin,
adminManagementController.activateExecutiveManager
);

module.exports = router;