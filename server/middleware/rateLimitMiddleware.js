const rateLimit = require('express-rate-limit');
const { getMetrics } = require('./performanceMiddleware');

/**
 * Create a custom handler for rate limit exceeded
 * @param {Object} options - Options for the handler
 * @returns {Function} Handler function
 */
const createRateLimitHandler = (options = {}) => {
  const {
    statusCode = 429,
    message = 'Too many requests, please try again later',
    retryAfterHeader = true
  } = options;

  return (req, res, next, info) => {
    // Set retry-after header if enabled
    if (retryAfterHeader) {
      res.set('Retry-After', Math.ceil(info.resetTime / 1000 - Date.now() / 1000));
    }

    // Return error response
    res.status(statusCode).json({
      message,
      retryAfter: Math.ceil(info.resetTime / 1000 - Date.now() / 1000),
      limit: info.limit,
      current: info.current
    });
  };
};

// General API rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: createRateLimitHandler({
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }),
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === 'admin';
  }
});

// Login/Register rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 login/register requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler({
    message: 'Too many login attempts from this IP, please try again after an hour'
  })
});

// Search rate limiting middleware
const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // limit each IP to 30 search requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler({
    message: 'Too many search requests from this IP, please try again after 5 minutes'
  }),
  skip: (req) => {
    // Skip rate limiting for authenticated users
    return !!req.user;
  }
});

// User actions rate limiting middleware
const userActionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // limit each IP to 50 user actions per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler({
    message: 'Too many actions from this IP, please try again after 10 minutes'
  })
});

// Content creation rate limiting middleware
const contentCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 content creation requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler({
    message: 'Too many content creation requests from this IP, please try again after an hour'
  }),
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === 'admin';
  }
});

// Get rate limiting metrics
const getRateLimitMetrics = () => {
  const metrics = getMetrics();

  return {
    rateLimit: {
      total: metrics.requests.total,
      limited: metrics.errors.byStatus[429] || 0,
      limitRate: metrics.requests.total > 0
        ? (metrics.errors.byStatus[429] || 0) / metrics.requests.total
        : 0
    }
  };
};

module.exports = {
  apiLimiter,
  authLimiter,
  searchLimiter,
  userActionLimiter,
  contentCreationLimiter,
  getRateLimitMetrics
};
