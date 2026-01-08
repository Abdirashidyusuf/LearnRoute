const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    eventType: { type: String, required: true }, // "login", "resource_completed", ...
    details: { type: Object }                   // flexible JSON
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ eventType: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);