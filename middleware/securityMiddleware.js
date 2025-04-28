const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Security middleware
const securityMiddleware = (app) => {
  // Set security headers
  app.use(helmet());

  // Prevent XSS attacks
  app.use(xss());

  // Sanitize data
  app.use(mongoSanitize());

  // Prevent HTTP param pollution
  app.use(hpp());
};

module.exports = securityMiddleware;
