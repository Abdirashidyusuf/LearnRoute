const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    skillPathId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillPath',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    displayOrder: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

moduleSchema.index({ skillPathId: 1, displayOrder: 1 });

module.exports = mongoose.model('Module', moduleSchema);
