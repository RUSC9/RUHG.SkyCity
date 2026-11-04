const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Department = require("../models/Department");
const AdminAuditLog = require("../models/AdminAuditLog");

// Sky City Executive Department Management
// CEO-authorized department capacity management.
// Capacity changes must be recorded in the audit trail.
const updateDepartmentCapacity = async (req, res) => {
  const ceoId = req.session?.admin?.id;
  const { code } = req.params;
  const { staffLimit, reason } = req.body || {};

  if (!ceoId) {
    return res.status(401).json({
      message: "Administrator login required."
    });
  }


  try {
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
 if (
    !Number.isSafeInteger(staffLimit) ||
    staffLimit < 0 ||
    typeof reason !== "string" ||
    !reason.trim()
  ) {
    return res.status(400).json({
      message: "A nonnegative integer capacity and a reason are required."
    });
  }

    let updatedDepartment;

    await mongoose.connection.transaction(async (session) => {
      const department = await Department.findOne({
        code,
        isActive: true
      }).session(session);

      if (!department) {
        const error = new Error("Active department not found.");
        error.status = 404;
        throw error;
      }

      const currentStaff = await Admin.countDocuments({
        role: "executive_staff",
        division: "executive",
        department: code
      }).session(session);

      if (staffLimit < currentStaff) {
        const error = new Error(
          "Capacity cannot be lower than the number of existing staff accounts."
        );
        error.status = 409;
        throw error;
      }

      const previousLimit = department.staffLimit;

      if (previousLimit === staffLimit) {
        const error = new Error("Department capacity is already set to this value.");
        error.status = 409;
        throw error;
      }

      department.staffLimit = staffLimit;
      department.updatedBy = ceo._id;

      await department.save({ session });

      await AdminAuditLog.create(
        [{
          actorId: ceo._id,
          action: "department.staff_limit.updated",
          targetType: "Department",
          targetId: department._id,
          previousValue: { staffLimit: previousLimit },
          newValue: { staffLimit },
          reason: reason.trim()
        }],
        { session }
      );

      updatedDepartment = {
        code: department.code,
        previousLimit,
        staffLimit: department.staffLimit
      };
    });

    return res.status(200).json({
      message: "Department staffing capacity updated successfully.",
      department: updatedDepartment
    });
  } catch (error) {
    console.error("Department capacity update error:", error);

    return res.status(error.status || 500).json({
      message: error.status
        ? error.message
        : "Unable to update department staffing capacity."
    });
  }
};

module.exports = {
  updateDepartmentCapacity
};
// Controller functions will be added after
// authorization and transaction validation.
