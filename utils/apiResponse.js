/**
 * Standard API response helpers
 * Provides consistent response format across the application
 */

/**
 * Success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {Object} errors - Additional error details
 */
const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Validation error response
 * @param {Object} res - Express response object
 * @param {Object} errors - Validation errors
 * @param {String} message - Error message
 */
const validationErrorResponse = (res, errors, message = 'Validation Error') => {
  return res.status(400).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Not found response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
const notFoundResponse = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message,
  });
};

/**
 * Unauthorized response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return res.status(401).json({
    success: false,
    message,
  });
};

/**
 * Forbidden response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return res.status(403).json({
    success: false,
    message,
  });
};

/**
 * Paginated response
 * @param {Object} res - Express response object
 * @param {Array} documents - Array of documents
 * @param {Object} pagination - Pagination info
 * @param {String} message - Success message
 */
const paginatedResponse = (res, documents, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data: documents,
    pagination,
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  paginatedResponse,
};

