const { validationErrorResponse } = require('../utils/apiResponse');

/**
 * Validate user creation data
 * Checks required fields and basic validation rules
 */
const validateCreateUser = (req, res, next) => {
  const { fullName, email, passwordHash, role } = req.body;
  const errors = {};

  // Validate fullName
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    errors.fullName = 'Full name is required and must be a non-empty string';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters long';
  }

  // Validate email
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.email = 'Email is required and must be a non-empty string';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.email = 'Email must be a valid email address';
    }
  }

  // Validate passwordHash
  if (!passwordHash || typeof passwordHash !== 'string' || passwordHash.length === 0) {
    errors.passwordHash = 'Password is required';
  } else if (passwordHash.length < 6) {
    errors.passwordHash = 'Password must be at least 6 characters long';
  }

  // Validate role (optional, but if provided must be valid)
  if (role && !['student', 'admin'].includes(role)) {
    errors.role = 'Role must be either "student" or "admin"';
  }

  if (Object.keys(errors).length > 0) {
    return validationErrorResponse(res, errors, 'Validation failed');
  }

  // Trim string fields
  req.body.fullName = fullName.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Validate user update data
 * Only validates fields that are being updated
 */
const validateUpdateUser = (req, res, next) => {
  const { fullName, email, role } = req.body;
  const errors = {};

  // Validate fullName if provided
  if (fullName !== undefined) {
    if (typeof fullName !== 'string' || fullName.trim().length === 0) {
      errors.fullName = 'Full name must be a non-empty string';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long';
    } else {
      req.body.fullName = fullName.trim();
    }
  }

  // Validate email if provided
  if (email !== undefined) {
    if (typeof email !== 'string' || email.trim().length === 0) {
      errors.email = 'Email must be a non-empty string';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Email must be a valid email address';
      } else {
        req.body.email = email.trim().toLowerCase();
      }
    }
  }

  // Validate role if provided
  if (role !== undefined && !['student', 'admin'].includes(role)) {
    errors.role = 'Role must be either "student" or "admin"';
  }

  // Don't allow passwordHash updates through this middleware
  if (req.body.passwordHash) {
    errors.passwordHash = 'Password cannot be updated through this endpoint';
  }

  if (Object.keys(errors).length > 0) {
    return validationErrorResponse(res, errors, 'Validation failed');
  }

  next();
};

/**
 * Validate MongoDB ObjectId format
 * Checks if the ID parameter is a valid MongoDB ObjectId
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  const ObjectId = require('mongoose').Types.ObjectId;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format',
    });
  }

  next();
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateObjectId,
};

