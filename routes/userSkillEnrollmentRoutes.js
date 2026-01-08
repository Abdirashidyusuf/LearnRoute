const express = require('express');
const router = express.Router();
const {
  createUserSkillEnrollment,
  getUserSkillEnrollments,
  updateUserSkillEnrollment,
  deleteUserSkillEnrollment
} = require('../controllers/userSkillEnrollmentController');

// Create a new enrollment
router.post('/', createUserSkillEnrollment);

// Get all enrollments for a specific user
router.get('/user/:userId', getUserSkillEnrollments);

// Update an existing enrollment
router.put('/:enrollmentId', updateUserSkillEnrollment);

// Delete an enrollment
router.delete('/:enrollmentId', deleteUserSkillEnrollment);

module.exports = router;
