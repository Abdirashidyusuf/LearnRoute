const express = require('express');
const router = express.Router();
const {
  createUserResourceStatus,
  getUserResourceStatuses,
  updateUserResourceStatus,
  deleteUserResourceStatus
} = require('../controllers/userResourceStatusController');

// Create a new user resource status
router.post('/', createUserResourceStatus);

// Get all statuses for a specific user
router.get('/user/:userId', getUserResourceStatuses);

// Update a specific user resource status
router.put('/:statusId', updateUserResourceStatus);

// Delete a specific user resource status
router.delete('/:statusId', deleteUserResourceStatus);

module.exports = router;
