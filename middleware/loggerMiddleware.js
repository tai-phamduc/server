const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream (append mode)
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Create a custom token for request body
morgan.token('body', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    // Mask sensitive data
    const body = { ...req.body };
    if (body.password) body.password = '********';
    if (body.email) body.email = body.email.replace(/(.{2})(.*)(@.*)/, '$1****$3');
    if (body.creditCard) body.creditCard = '****-****-****-' + body.creditCard.slice(-4);

    return JSON.stringify(body);
  }
  return '';
});

// Create a custom token for response time in a human-readable format
morgan.token('response-time-human', (req, res) => {
  const time = morgan['response-time'](req, res);
  return time ? `${time}ms` : '';
});

// Create a custom format
const morganFormat = ':method :url :status :response-time-human - :remote-addr - :user-agent :body';

// Logger middleware
const loggerMiddleware = (app) => {
  // Log to console in development mode
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Log all requests to file
  app.use(
    morgan(morganFormat, {
      stream: accessLogStream,
    })
  );

  // Log all requests to Winston
  app.use(
    morgan(morganFormat, {
      stream: logger.stream,
    })
  );

  // Add request logging middleware
  app.use((req, res, next) => {
    // Log request details
    logger.debug('Request received', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user ? req.user._id : 'anonymous',
    });

    // Log response details
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      // Call the original end method
      originalEnd.call(this, chunk, encoding);

      // Log response details
      logger.debug('Response sent', {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: res.get('X-Response-Time'),
        userId: req.user ? req.user._id : 'anonymous',
      });

      // Log errors
      if (res.statusCode >= 400) {
        const logLevel = res.statusCode >= 500 ? 'error' : 'warn';
        logger[logLevel]('Request error', {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          userId: req.user ? req.user._id : 'anonymous',
          error: res.locals.error || 'Unknown error',
        });
      }
    };

    next();
  });
};

module.exports = loggerMiddleware;
