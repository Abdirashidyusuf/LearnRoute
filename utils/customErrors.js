/**
 * Custom error classes for better error handling
 */

/**
 * Base custom error class
 */
class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found Error (404)
 */
class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Validation Error (400)
 */
class ValidationError extends CustomError {
  constructor(message = 'Validation failed', errors = {}) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * Unauthorized Error (401)
 */
class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * Forbidden Error (403)
 */
class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * Conflict Error (409)
 */
class ConflictError extends CustomError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

/**
 * Bad Request Error (400)
 */
class BadRequestError extends CustomError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  BadRequestError,
};

