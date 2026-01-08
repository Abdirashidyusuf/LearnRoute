const UserSkillEnrollment = require('../models/UserSkillEnrollment');

// Create a new User Skill Enrollment
const createUserSkillEnrollment = async (req, res) => {
  try {
    const { userId, skillPathId } = req.body;

    // Check if the enrollment already exists
    const existingEnrollment = await UserSkillEnrollment.findOne({ userId, skillPathId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'User is already enrolled in this skill path.' });
    }

    const enrollment = new UserSkillEnrollment({
      userId,
      skillPathId,
      progressPercent: 0, // Default progress
      status: 'active',
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all enrollments for a user
const getUserSkillEnrollments = async (req, res) => {
  try {
    const { userId } = req.params;

    const enrollments = await UserSkillEnrollment.find({ userId }).populate('skillPathId');
    if (!enrollments) {
      return res.status(404).json({ message: 'No enrollments found for this user.' });
    }

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update enrollment progress and status
const updateUserSkillEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progressPercent, status } = req.body;

    // Validate status and progress percent
    if (!['active', 'completed', 'abandoned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (progressPercent < 0 || progressPercent > 100) {
      return res.status(400).json({ message: 'Progress percent must be between 0 and 100.' });
    }

    const enrollment = await UserSkillEnrollment.findByIdAndUpdate(
      enrollmentId,
      { progressPercent, status, completedAt: status === 'completed' ? new Date() : null },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete enrollment (if needed)
const deleteUserSkillEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await UserSkillEnrollment.findByIdAndDelete(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    res.status(200).json({ message: 'Enrollment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createUserSkillEnrollment,
  getUserSkillEnrollments,
  updateUserSkillEnrollment,
  deleteUserSkillEnrollment
};
