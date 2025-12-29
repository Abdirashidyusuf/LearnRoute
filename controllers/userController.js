const { create, getAll, getById, updateById, deleteById } = require('../utils/crudOperations');
const { successResponse, errorResponse, paginatedResponse, notFoundResponse } = require('../utils/apiResponse');
const User = require('../models/userModel');

/**
 * Create a new user
 * POST /api/users
 */
const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await create(User, userData);
    
    // Remove passwordHash from response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    
    return successResponse(res, userResponse, 'User created successfully', 201);
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return errorResponse(res, 'Email already exists', 400);
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    return errorResponse(res, error.message || 'Failed to create user', 500);
  }
};

/**
 * Get all users with pagination
 * GET /api/users
 */
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', search } = req.query;
    
    // Build filter for search (optional)
    const filter = {};
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    const result = await getAll(User, {
      filter,
      sort: sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 },
      page: parseInt(page),
      limit: parseInt(limit),
    });
    
    // Remove passwordHash from all users
    const usersWithoutPassword = result.documents.map(user => {
      const userObj = user.toObject();
      delete userObj.passwordHash;
      return userObj;
    });
    
    return paginatedResponse(res, usersWithoutPassword, result.pagination, 'Users retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to retrieve users', 500);
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getById(User, id);
    
    // Remove passwordHash from response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    
    return successResponse(res, userResponse, 'User retrieved successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'User not found');
    }
    return errorResponse(res, error.message || 'Failed to retrieve user', 500);
  }
};

/**
 * Update user by ID
 * PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Prevent updating passwordHash directly through this endpoint
    if (updateData.passwordHash) {
      delete updateData.passwordHash;
    }
    
    const user = await updateById(User, id, updateData);
    
    // Remove passwordHash from response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    
    return successResponse(res, userResponse, 'User updated successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'User not found');
    }
    // Handle duplicate email error
    if (error.code === 11000) {
      return errorResponse(res, 'Email already exists', 400);
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    return errorResponse(res, error.message || 'Failed to update user', 500);
  }
};

/**
 * Delete user by ID
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteById(User, id);
    
    return successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'User not found');
    }
    return errorResponse(res, error.message || 'Failed to delete user', 500);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

