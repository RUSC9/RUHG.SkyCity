const mongoose = require("mongoose");

const DEPARTMENTS = [
  "accounting",
  "payment_processing",
  "payroll",
  "marketing_sales",
  "corporate_administration",
  "human_resources",
  "technology",
  "cybersecurity"
];

const departmentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      enum: DEPARTMENTS,
      required: true,
      unique: true,
      immutable: true
    },

    staffLimit: {
      type: Number,
      default: 20,
      min: 0,
      validate: Number.isInteger
    },

    isActive: {
      type: Boolean,
      default: true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Department",
  departmentSchema
);