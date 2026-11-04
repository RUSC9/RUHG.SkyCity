const express = require("express");
const router = express.Router();

const adminManagementController = require(
"../controller/adminManagement.Controller"
);
const { requireAdmin } = require("../../core/middleware/adminAuthorization");
const requireAdminLogin = requireAdmin;
const {loginAdmin} = require("../controller/adminAuthController");
const Consumer = require("../models/Consumer");
const Business = require("../models/Business");
//Administrator login
//Display administrator login page
router.get("/login", (req, res) =>{
    res.render("admin/login",{
        layout: false
    });
});
router.post("/login", loginAdmin);
// Protected administrator dashboard
router.get("/dashboard", requireAdminLogin, async (req, res) => {
  try {
    const admin = req.session.admin;

    // Retrieve actual account totals from MongoDB
    const [totalConsumers, totalBusinesses] = await Promise.all([
      Consumer.countDocuments(),
      Business.countDocuments()
    ]);

    return res.render("admin/dashboard", {
      layout: false,
      role: admin.role,
      division: admin.division,
      totalConsumers,
      totalBusinesses,
      totalSubscribers: totalConsumers + totalBusinesses
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).send("Unable to load administrator dashboard.");
  }
});

// CEO Subscriber Management
router.get("/subscribers", requireAdminLogin, async (req, res) => {
  try {
    const admin = req.session.admin;

    // Restrict subscriber management to the CEO
    if (!admin || admin.role !== "ceo") {
      return res.status(403).send("Access denied.");
    }

    // Retrieve account totals and individual account records
const [
  totalConsumers,
  totalBusinesses,
  consumers,
  businesses
] = await Promise.all([
  Consumer.countDocuments(),
  Business.countDocuments(),

  Consumer.find()
    .select("firstName lastName email isActive createdAt")
    .sort({ createdAt: -1 })
    .lean(),


  Business.find()
    .select("businessName email isActive createdAt")
    .sort({ createdAt: -1 })
    .lean()
]);

    return res.render("admin/subscribers", {
      layout: false,
      totalConsumers,
      totalBusinesses,
      totalSubscribers: totalConsumers + totalBusinesses,
      consumers,
      businesses
    });

  } catch (error) {
    console.error("Subscriber management error:", error);
    return res.status(500).send("Unable to load subscriber management.");
  }
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