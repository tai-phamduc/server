const logger = require('../utils/logger');

/**
 * Not found middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFound = (req, res, next) => {
  // If this is an API request, return a 404 error
  if (req.originalUrl.startsWith('/api')) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);

    // Log the 404 error
    logger.warn('Resource not found', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user ? req.user._id : 'anonymous',
    });

    return next(error);
  }

  // For client routes in development, redirect to the client dev server
  if (process.env.NODE_ENV !== 'production') {
    return res.redirect(`http://localhost:3000${req.originalUrl}`);
  }

  // In production, let the client handle 404s
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Store error in res.locals for logging middleware
  res.locals.error = {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
  };

  // Log error with appropriate level
  const logLevel = statusCode >= 500 ? 'error' : 'warn';
  logger[logLevel](`${err.name || 'Error'}: ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    ip: req.ip,
    userId: req.user ? req.user._id : 'anonymous',
    errorStack: err.stack,
    errorCode: err.code,
  });

  // Send response
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
