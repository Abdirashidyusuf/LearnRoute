const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const {
  validateCreateUser,
  validateUpdateUser,
  validateObjectId,
} = require('../middlewares/userMiddleware');

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public (can be changed to private later)
 */
router.post('/', validateCreateUser, createUser);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Public (can be changed to private later)
 */
router.get('/', getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public (can be changed to private later)
 */
router.get('/:id', validateObjectId, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user by ID
 * @access  Public (can be changed to private later)
 */
router.put('/:id', validateObjectId, validateUpdateUser, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by ID
 * @access  Public (can be changed to private later)
 */
router.delete('/:id', validateObjectId, deleteUser);

module.exports = router;

