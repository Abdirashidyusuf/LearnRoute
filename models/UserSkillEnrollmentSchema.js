const mongoose = require('mongoose');

const userSkillEnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    skillPathId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillPath',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active'
    },
    progressPercent: { type: Number, default: 0 }, // 0–100
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

userSkillEnrollmentSchema.index(
  { userId: 1, skillPathId: 1 },
  { unique: true }
);

module.exports = mongoose.model('UserSkillEnrollment', userSkillEnrollmentSchema);