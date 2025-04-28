/**
 * Performance monitoring middleware for Express
 */

// Store metrics in memory
const metrics = {
  requests: {
    total: 0,
    byMethod: {},
    byRoute: {},
    byStatus: {}
  },
  responseTime: {
    total: 0,
    count: 0,
    min: Number.MAX_SAFE_INTEGER,
    max: 0,
    byRoute: {}
  },
  errors: {
    total: 0,
    byStatus: {},
    byRoute: {}
  },
  cache: {
    hits: 0,
    misses: 0,
    hitRatio: 0
  },
  startTime: Date.now()
};

/**
 * Record a cache hit
 */
const recordCacheHit = () => {
  metrics.cache.hits++;
  updateCacheHitRatio();
};

/**
 * Record a cache miss
 */
const recordCacheMiss = () => {
  metrics.cache.misses++;
  updateCacheHitRatio();
};

/**
 * Update cache hit ratio
 */
const updateCacheHitRatio = () => {
  const total = metrics.cache.hits + metrics.cache.misses;
  metrics.cache.hitRatio = total > 0 ? metrics.cache.hits / total : 0;
};

/**
 * Reset metrics
 */
const resetMetrics = () => {
  metrics.requests = {
    total: 0,
    byMethod: {},
    byRoute: {},
    byStatus: {}
  };
  metrics.responseTime = {
    total: 0,
    count: 0,
    min: Number.MAX_SAFE_INTEGER,
    max: 0,
    byRoute: {}
  };
  metrics.errors = {
    total: 0,
    byStatus: {},
    byRoute: {}
  };
  metrics.cache = {
    hits: 0,
    misses: 0,
    hitRatio: 0
  };
  metrics.startTime = Date.now();
};

/**
 * Get metrics
 * @returns {Object} Current metrics
 */
const getMetrics = () => {
  const avgResponseTime = metrics.responseTime.count > 0
    ? metrics.responseTime.total / metrics.responseTime.count
    : 0;
  
  return {
    ...metrics,
    responseTime: {
      ...metrics.responseTime,
      avg: avgResponseTime
    },
    uptime: Math.floor((Date.now() - metrics.startTime) / 1000)
  };
};

/**
 * Performance monitoring middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const performanceMiddleware = (req, res, next) => {
  // Skip for metrics endpoint to avoid infinite loop
  if (req.path === '/api/admin/metrics') {
    return next();
  }
  
  // Record start time
  const start = Date.now();
  
  // Track request
  metrics.requests.total++;
  
  // Track by method
  const method = req.method;
  metrics.requests.byMethod[method] = (metrics.requests.byMethod[method] || 0) + 1;
  
  // Get route pattern (replace params with :param)
  let route = req.route ? req.baseUrl + req.route.path : req.path;
  
  // Initialize route metrics if needed
  if (!metrics.requests.byRoute[route]) {
    metrics.requests.byRoute[route] = 0;
  }
  if (!metrics.responseTime.byRoute[route]) {
    metrics.responseTime.byRoute[route] = {
      total: 0,
      count: 0,
      min: Number.MAX_SAFE_INTEGER,
      max: 0
    };
  }
  
  // Track by route
  metrics.requests.byRoute[route]++;
  
  // Track response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    // Calculate response time
    const responseTime = Date.now() - start;
    
    // Track response time
    metrics.responseTime.total += responseTime;
    metrics.responseTime.count++;
    metrics.responseTime.min = Math.min(metrics.responseTime.min, responseTime);
    metrics.responseTime.max = Math.max(metrics.responseTime.max, responseTime);
    
    // Track response time by route
    metrics.responseTime.byRoute[route].total += responseTime;
    metrics.responseTime.byRoute[route].count++;
    metrics.responseTime.byRoute[route].min = Math.min(
      metrics.responseTime.byRoute[route].min,
      responseTime
    );
    metrics.responseTime.byRoute[route].max = Math.max(
      metrics.responseTime.byRoute[route].max,
      responseTime
    );
    
    // Track by status
    const status = res.statusCode;
    metrics.requests.byStatus[status] = (metrics.requests.byStatus[status] || 0) + 1;
    
    // Track errors
    if (status >= 400) {
      metrics.errors.total++;
      metrics.errors.byStatus[status] = (metrics.errors.byStatus[status] || 0) + 1;
      metrics.errors.byRoute[route] = (metrics.errors.byRoute[route] || 0) + 1;
    }
    
    // Add response time header
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = {
  performanceMiddleware,
  recordCacheHit,
  recordCacheMiss,
  resetMetrics,
  getMetrics
};
