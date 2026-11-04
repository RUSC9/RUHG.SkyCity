const mongoose = require("mongoose");

const adminAuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      immutable: true
    },

    action: {
      type: String,
      required: true,
      immutable: true
    },

    targetType: {
      type: String,
      required: true,
      immutable: true
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true
    },

    previousValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      immutable: true
    },

    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      immutable: true
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      immutable: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "AdminAuditLog",
  adminAuditLogSchema
);