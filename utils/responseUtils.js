/**
 * Utility functions for API responses
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {*} data - Response data
 * @param {string} message - Success message
 */
const sendSuccess = (res, statusCode = 200, data = null, message = '') => {
  const response = {
    success: true
  };
  
  if (message) {
    response.message = message;
  }
  
  if (data !== null) {
    response.data = data;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} errors - Error details
 */
const sendError = (res, statusCode = 500, message = 'Server Error', errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors !== null) {
    response.errors = errors;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Data array
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @param {Object} options - Additional options
 */
const sendPaginated = (res, data, page, limit, total, options = {}) => {
  const { 
    message = '',
    additionalData = {}
  } = options;
  
  const response = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    ...additionalData
  };
  
  if (message) {
    response.message = message;
  }
  
  res.status(200).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Object} errors - Validation errors
 * @param {string} message - Error message
 */
const sendValidationError = (res, errors, message = 'Validation Error') => {
  sendError(res, 400, message, errors);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendNotFound = (res, message = 'Resource not found') => {
  sendError(res, 404, message);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendUnauthorized = (res, message = 'Unauthorized') => {
  sendError(res, 401, message);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendForbidden = (res, message = 'Forbidden') => {
  sendError(res, 403, message);
};

/**
 * Send bad request response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendBadRequest = (res, message = 'Bad Request') => {
  sendError(res, 400, message);
};

/**
 * Send conflict response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendConflict = (res, message = 'Conflict') => {
  sendError(res, 409, message);
};

/**
 * Send too many requests response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendTooManyRequests = (res, message = 'Too Many Requests') => {
  sendError(res, 429, message);
};

/**
 * Send server error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendServerError = (res, message = 'Internal Server Error') => {
  sendError(res, 500, message);
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendBadRequest,
  sendConflict,
  sendTooManyRequests,
  sendServerError
};
