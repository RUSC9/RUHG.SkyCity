const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const loginAdmin = async (req, res) => {
try {
const { email, password } = req.body;

if (
typeof email !== "string" ||
typeof password !== "string" ||
!email.trim() ||
!password
) {
return res.status(400).json({
message: "Email and password are required."
});
}

const admin = await Admin.findOne({
email: email.trim().toLowerCase()
});

if (!admin) {
return res.status(401).json({
message: "Invalid email or password."
});
}

const passwordMatch = await bcrypt.compare(
password,
admin.password
);

if (!passwordMatch) {
return res.status(401).json({
message: "Invalid email or password."
});
}

if (!admin.isActive) {
return res.status(403).json({
message: "Administrator account is inactive."
});
}
req.session.regenerate((sessionError) => {
if (sessionError) {
return res.status(500).json({
message: "Unable to establish administrator session."
});
}

req.session.admin = {
id: admin._id.toString(),
role: admin.role,
division: admin.division,
managerId: admin.managerId
? admin.managerId.toString()
: null,
managedDepartments: admin.managedDepartments ||[]
};

req.session.save((saveError) => {
if (saveError) {
return res.status(500).json({
message: "Unable to save administrator session."
});
}

return res.status(200).json({
message: "Administrator login successful.",
role: admin.role,
division: admin.division
});
});
});

} catch (error) {
console.error("Admin login error:", error);

return res.status(500).json({
message: "Unable to complete administrator login."
});
}
};

module.exports = {
    loginAdmin
};  