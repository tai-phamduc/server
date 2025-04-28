/**
 * Enhanced error handling middleware for the server
 */

// Helper function to get detailed error information
const getErrorDetails = (err) => {
  return {
    name: err.name || 'Error',
    message: err.message || 'An unexpected error occurred',
    code: err.code,
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    errors: err.errors, // For validation errors
    keyPattern: err.keyPattern, // For duplicate key errors
    keyValue: err.keyValue, // For duplicate key errors
  };
};

// Helper function to format error response
const formatErrorResponse = (err, statusCode) => {
  const response = {
    success: false,
    status: statusCode,
    message: err.message || 'An unexpected error occurred',
    error: err.name || 'Error',
  };

  // Add error code if available
  if (err.code) {
    response.code = err.code;
  }

  // Add validation errors if available
  if (err.errors) {
    response.validationErrors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  // Add duplicate key information if available
  if (err.keyValue) {
    response.duplicateKey = err.keyValue;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  return response;
};

/**
 * Not found middleware - handles 404 errors
 */
const notFound = (req, res, next) => {
  // If this is an API request, return a 404 error
  if (req.originalUrl.startsWith('/api')) {
    const error = new Error(`Resource not found - ${req.originalUrl}`);
    error.name = 'NotFoundError';
    error.statusCode = 404;
    return next(error);
  }

  // For client routes in development, redirect to the client dev server
  if (process.env.NODE_ENV !== 'production') {
    const clientPort = process.env.CLIENT_PORT || 3002;
    return res.redirect(`http://localhost:${clientPort}${req.originalUrl}`);
  }

  // In production, let the client handle 404s
  next();
};

/**
 * MongoDB error handler - handles specific MongoDB errors
 */
const mongooseErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.name = 'ValidationError';
    
    // Format validation error message
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.statusCode = 400;
    error.name = 'DuplicateKeyError';
    
    // Get the duplicate field
    const field = Object.keys(err.keyValue)[0];
    error.message = `Duplicate value for ${field}: ${err.keyValue[field]}. Please use another value.`;
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.name = 'InvalidIDError';
    error.message = `Invalid ${err.path}: ${err.value}`;
  }

  // Pass the modified error to the next middleware
  next(error);
};

/**
 * JWT error handler - handles JWT authentication errors
 */
const jwtErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.name = 'TokenExpiredError';
    error.message = 'Your session has expired. Please log in again.';
  }

  // JWT invalid signature
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.name = 'InvalidTokenError';
    error.message = 'Invalid authentication token. Please log in again.';
  }

  // Pass the modified error to the next middleware
  next(error);
};

/**
 * Main error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Get error details
  const error = getErrorDetails(err);
  
  // Set status code (default to 500 if not set or if 200)
  const statusCode = error.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Log error details
  console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`.red);
  if (error.stack && process.env.NODE_ENV !== 'production') {
    console.error(error.stack.gray);
  }

  // Format and send error response
  const response = formatErrorResponse(error, statusCode);
  res.json(response);
};

module.exports = { 
  notFound, 
  mongooseErrorHandler, 
  jwtErrorHandler, 
  errorHandler 
};
