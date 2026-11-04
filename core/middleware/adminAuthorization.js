const Admin = require("../../auth/models/Admin");

const requireAdmin = async (req, res, next) => {
try {
const adminId = req.session?.admin?.id;

if (!adminId) {
  return res.status(401).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sky City | Administrator Login Required</title>
    </head>

    <body style="
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 80px 20px;
      background: linear-gradient(135deg, #87CEFA, #E6F7FF);
      color: #102b66;
    ">

      <h1>Sky City Administration</h1>

      <h2>Administrator Login Required</h2>

      <p>
        Your administrator session may have expired.
        Please sign in to continue.
      </p>

      <a href="/admin/login" style="
        display: inline-block;
        margin-top: 20px;
        padding: 14px 28px;
        background: #102b66;
        color: white;
        text-decoration: none;
        border-radius: 10px;
        font-weight: bold;
      ">
        Sign In to Sky City Administration
      </a>

    </body>
    </html>
  `);
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
