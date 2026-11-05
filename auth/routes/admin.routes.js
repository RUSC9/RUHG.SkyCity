const express = require("express");
const router = express.Router();

const adminManagementController = require(
"../controller/adminManagement.Controller"
);
const {
  updateDepartmentCapacity
} = require("../controller/departmentManagementController");
const { requireAdmin } = require("../../core/middleware/adminAuthorization");
const requireAdminLogin = requireAdmin;
const {loginAdmin} = require("../controller/adminAuthController");
const Consumer = require("../models/Consumer");
const Business = require("../models/Business");
const Department = require("../models/Department");
const {
  ensureCsrfToken,
  requireAdminCsrf
} = require("../../core/middleware/adminCsrf");
//Administrator login
//Display administrator login page
router.get("/login", (req, res) =>{
    res.render("admin/login",{
        layout: false
    });
});
router.post("/login", loginAdmin);
// CEO - Update Executive Department Staffing Capacity
router.patch(
  "/departments/:code/capacity",
  requireAdminLogin,
  requireAdminCsrf,
  updateDepartmentCapacity
);
// Administrator logout
router.post("/logout", requireAdminLogin, requireAdminCsrf, (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Administrator logout error:", error);
      return res.status(500).send("Unable to log out.");
    }

    res.clearCookie("connect.sid");
    return res.redirect("/admin/login");
  });
});
//CEO-only Department Management
// CEO-only Department Management
router.get("/departments", requireAdminLogin, async (req, res) => {
  try {
    if (req.session?.admin?.role !== "ceo") {
      return res.status(403).send("CEO access required.");
    }

    const departments = await Department.find({
      isActive: true
    })
      .sort({ code: 1 })
      .lean();

    return res.render("admin/departments", {
      layout: false,
      departments
    });

  } catch (error) {
    console.error("Department Management error:", error);

    return res.status(500).send(
      "Unable to load executive departments."
    );
  }
});
// Protected administrator dashboard
router.get("/dashboard", requireAdminLogin, ensureCsrfToken, async (req, res) => {
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
// CEO - Individual Consumer Account Details
router.get("/subscribers/consumer/:id", requireAdminLogin, async (req, res) => {
  try {
    const admin = req.session.admin;

    // Only the CEO can access individual account details
    if (!admin || admin.role !== "ceo") {
      return res.status(403).send("Access denied.");
    }

    // Validate the consumer account ID
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid consumer account ID.");
    }

    // Retrieve consumer information without sensitive credentials
    const consumer = await Consumer.findById(req.params.id)
      .select("firstName lastName email isActive createdAt")
      .lean();

    if (!consumer) {
      return res.status(404).send("Consumer account not found.");
    }

    // Display the individual consumer account
    return res.render("admin/consumerDetails", {
      layout: false,
      consumer
    });

  } catch (error) {
    console.error("Consumer account details error:", error);

    return res.status(500).send(
      "Unable to load consumer account details."
    );
  }
});
// CEO - Individual Business Account Details
router.get("/subscribers/business/:id", requireAdminLogin, async (req, res) => {
  try {
    const admin = req.session.admin;

    // Only the CEO can access individual business account details
    if (!admin || admin.role !== "ceo") {
      return res.status(403).send("Access denied.");
    }

    // Validate the business account ID
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid business account ID.");
    }

    // Retrieve business information without sensitive credentials
    const business = await Business.findById(req.params.id)
      .select("businessName email contactPhone isActive createdAt")
      .lean();

    if (!business) {
      return res.status(404).send("Business account not found.");
    }

    // Display the individual business account
    return res.render("admin/businessDetails", {
      layout: false,
      business
    });

  } catch (error) {
    console.error("Business account details error:", error);

    return res.status(500).send(
      "Unable to load business account details."
    );
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