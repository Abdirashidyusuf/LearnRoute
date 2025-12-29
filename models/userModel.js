const mongoose = require('mongoose');

// User schema: describes how a user is stored in MongoDB
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    fullName: { type: String, required: true, trim: true },

    // Email must be unique and is stored in lowercase
    email: { type: String, required: true, unique: true, lowercase: true },

    // Hashed password (never store plain text passwords)
    passwordHash: { type: String, required: true },

    // Role decides the level of access inside the app
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    }
  },
  // Automatically adds createdAt and updatedAt timestamps
  { timestamps: true }
);

// Export the model so we can use it in services/controllers
module.exports = mongoose.model('User', userSchema);

