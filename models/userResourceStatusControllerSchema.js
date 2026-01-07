const mongoose = require('mongoose');

const userResourceStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'completed' // when you create it on "Done"
    },
    completedAt: { type: Date },
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

userResourceStatusSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model('UserResourceStatus', userResourceStatusSchema);