const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },        // Dashboard, Skills, Users
    path: { type: String, required: true },         // /dashboard, /skills
    icon: { type: String },                          // optional (UI icon name)
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      default: null                                  // for sub-menus
    },
    displayOrder: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

menuSchema.index({ parentId: 1, displayOrder: 1 });

module.exports = mongoose.model('Menu', menuSchema);
