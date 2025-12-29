const { validationErrorResponse } = require('../utils/apiResponse');

/**
 * Validate menu creation data
 * Checks required fields and basic validation rules
 */
const validateCreateMenu = (req, res, next) => {
  const { title, path, icon, parentId, displayOrder, isActive } = req.body;
  const errors = {};

  // Validate title
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.title = 'Title is required and must be a non-empty string';
  }

  // Validate path
  if (!path || typeof path !== 'string' || path.trim().length === 0) {
    errors.path = 'Path is required and must be a non-empty string';
  } else if (!path.startsWith('/')) {
    errors.path = 'Path must start with "/"';
  }

  // Validate icon (optional)
  if (icon !== undefined && (typeof icon !== 'string' || icon.trim().length === 0)) {
    errors.icon = 'Icon must be a non-empty string if provided';
  }

  // Validate parentId (optional, but must be valid ObjectId if provided)
  if (parentId !== undefined && parentId !== null) {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      errors.parentId = 'Parent ID must be a valid MongoDB ObjectId';
    }
  }

  // Validate displayOrder (optional)
  if (displayOrder !== undefined) {
    if (typeof displayOrder !== 'number' || displayOrder < 0) {
      errors.displayOrder = 'Display order must be a non-negative number';
    }
  }

  // Validate isActive (optional)
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    errors.isActive = 'isActive must be a boolean';
  }

  if (Object.keys(errors).length > 0) {
    return validationErrorResponse(res, errors, 'Validation failed');
  }

  // Trim string fields
  if (title) req.body.title = title.trim();
  if (path) req.body.path = path.trim();
  if (icon) req.body.icon = icon.trim();

  next();
};

/**
 * Validate menu update data
 * Only validates fields that are being updated
 */
const validateUpdateMenu = (req, res, next) => {
  const { title, path, icon, parentId, displayOrder, isActive } = req.body;
  const errors = {};

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.title = 'Title must be a non-empty string';
    } else {
      req.body.title = title.trim();
    }
  }

  // Validate path if provided
  if (path !== undefined) {
    if (typeof path !== 'string' || path.trim().length === 0) {
      errors.path = 'Path must be a non-empty string';
    } else if (!path.startsWith('/')) {
      errors.path = 'Path must start with "/"';
    } else {
      req.body.path = path.trim();
    }
  }

  // Validate icon if provided
  if (icon !== undefined) {
    if (icon !== null && (typeof icon !== 'string' || icon.trim().length === 0)) {
      errors.icon = 'Icon must be a non-empty string or null';
    } else if (icon) {
      req.body.icon = icon.trim();
    }
  }

  // Validate parentId if provided
  if (parentId !== undefined) {
    if (parentId !== null) {
      const mongoose = require('mongoose');
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        errors.parentId = 'Parent ID must be a valid MongoDB ObjectId or null';
      }
    }
  }

  // Validate displayOrder if provided
  if (displayOrder !== undefined) {
    if (typeof displayOrder !== 'number' || displayOrder < 0) {
      errors.displayOrder = 'Display order must be a non-negative number';
    }
  }

  // Validate isActive if provided
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    errors.isActive = 'isActive must be a boolean';
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
      message: 'Invalid menu ID format',
    });
  }

  next();
};

module.exports = {
  validateCreateMenu,
  validateUpdateMenu,
  validateObjectId,
};

