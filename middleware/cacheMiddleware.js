const NodeCache = require('node-cache');
const crypto = require('crypto');

// Fallback functions in case performanceMiddleware is not available
const recordCacheHit = () => {};
const recordCacheMiss = () => {};

// Try to import from performanceMiddleware, but use fallbacks if it fails
let performanceMiddleware;
try {
  performanceMiddleware = require('./performanceMiddleware');
} catch (error) {
  console.warn('Performance middleware not available, using fallback cache metrics');
}

// Create a new cache instance with default settings
// stdTTL: standard time-to-live in seconds for every generated cache element (default: 0 = unlimited)
// checkperiod: time in seconds to check for expired keys (default: 600)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

/**
 * Generate an ETag for a response body
 * @param {*} body - Response body
 * @returns {string} ETag hash
 */
const generateETag = (body) => {
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  return crypto.createHash('md5').update(bodyString).digest('hex');
};

/**
 * Cache control options
 * @typedef {Object} CacheOptions
 * @property {number} duration - Cache duration in seconds
 * @property {boolean} private - Whether the cache is private (for authenticated users)
 * @property {boolean} etag - Whether to use ETag for validation
 * @property {boolean} mustRevalidate - Whether the client must revalidate stale cache
 * @property {string[]} varyOn - Headers to vary the cache on
 */

/**
 * Middleware to cache API responses with advanced options
 * @param {CacheOptions|number} options - Cache options or duration in seconds
 * @returns {function} Express middleware function
 */
const cacheMiddleware = (options = {}) => {
  // Handle case where options is just a number (duration)
  if (typeof options === 'number') {
    options = { duration: options };
  }

  // Default options
  const {
    duration = 300,
    private = false,
    etag = true,
    mustRevalidate = true,
    varyOn = []
  } = options;

  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching for authenticated requests if not private
    if (!private && req.user) {
      return next();
    }

    // Create a cache key based on the URL, query parameters, and vary headers
    let cacheKey = `${req.originalUrl || req.url}`;

    // Add user ID to cache key if private
    if (private && req.user) {
      cacheKey += `_user_${req.user._id}`;
    }

    // Add vary headers to cache key
    if (varyOn.length > 0) {
      const varyValues = varyOn.map(header => req.get(header) || '').join('_');
      cacheKey += `_vary_${varyValues}`;
    }

    // Check if client has a valid ETag
    const ifNoneMatch = req.get('If-None-Match');

    // Check if we have a cache hit
    const cachedItem = cache.get(cacheKey);

    if (cachedItem) {
      const { body, etag: cachedETag } = cachedItem;

      // Record cache hit for metrics
      if (performanceMiddleware && performanceMiddleware.recordCacheHit) {
        performanceMiddleware.recordCacheHit();
      }

      // Set cache control headers
      res.set('Cache-Control', `${private ? 'private' : 'public'}, max-age=${duration}${mustRevalidate ? ', must-revalidate' : ''}`);

      // Set X-Cache header
      res.set('X-Cache', 'HIT');

      // Set ETag if enabled
      if (etag) {
        res.set('ETag', cachedETag);
      }

      // Set Vary header if needed
      if (varyOn.length > 0) {
        res.set('Vary', varyOn.join(', '));
      }

      // If client has matching ETag, return 304 Not Modified
      if (etag && ifNoneMatch === cachedETag) {
        return res.status(304).end();
      }

      // Return cached response
      return res.json(body);
    }

    // Record cache miss for metrics
    if (performanceMiddleware && performanceMiddleware.recordCacheMiss) {
      performanceMiddleware.recordCacheMiss();
    }

    // Set X-Cache header
    res.set('X-Cache', 'MISS');

    // Store the original res.json method
    const originalJson = res.json;

    // Override res.json method to cache the response
    res.json = function(body) {
      // Generate ETag
      const responseETag = etag ? generateETag(body) : null;

      // Set cache control headers
      res.set('Cache-Control', `${private ? 'private' : 'public'}, max-age=${duration}${mustRevalidate ? ', must-revalidate' : ''}`);

      // Set ETag if enabled
      if (etag && responseETag) {
        res.set('ETag', responseETag);
      }

      // Set Vary header if needed
      if (varyOn.length > 0) {
        res.set('Vary', varyOn.join(', '));
      }

      // Cache the response with ETag
      cache.set(cacheKey, { body, etag: responseETag }, duration);

      // If client has matching ETag, return 304 Not Modified
      if (etag && ifNoneMatch === responseETag) {
        return res.status(304).end();
      }

      // Call the original res.json method
      return originalJson.call(this, body);
    };

    next();
  };
};

/**
 * Clear the entire cache
 */
const clearCache = () => {
  cache.flushAll();
};

/**
 * Clear a specific cache key
 * @param {string} key - Cache key to clear
 */
const clearCacheKey = (key) => {
  cache.del(key);
};

/**
 * Clear cache keys that match a pattern
 * @param {string} pattern - Pattern to match cache keys
 */
const clearCachePattern = (pattern) => {
  const keys = cache.keys();
  const regex = new RegExp(pattern);

  keys.forEach(key => {
    if (regex.test(key)) {
      cache.del(key);
    }
  });
};

/**
 * Clear cache for a specific model
 * @param {string} model - Model name (e.g., 'movies', 'genres', 'actors')
 */
const clearModelCache = (model) => {
  clearCachePattern(`^\/api\/${model}`);
};

/**
 * Clear cache for related models
 * @param {string} model - Primary model name
 */
const clearRelatedCache = (model) => {
  // Define related models for each model type
  const relatedModels = {
    movies: ['movies', 'genres', 'directors', 'actors', 'reviews', 'tags'],
    genres: ['genres', 'movies'],
    directors: ['directors', 'movies'],
    actors: ['actors', 'movies'],
    news: ['news', 'blog-categories', 'tags'],
    events: ['events', 'tags'],
    'blog-categories': ['blog-categories', 'news'],
    tags: ['tags', 'movies', 'news', 'events'],
    comments: ['comments', 'movies', 'news', 'events'],
    reviews: ['reviews', 'movies'],
    pages: ['pages'],
    settings: ['settings'],
    faqs: ['faqs'],
    feedback: ['feedback'],
    contact: ['contact'],
    newsletter: ['newsletter']
  };

  // Get related models for the given model
  const modelsToInvalidate = relatedModels[model] || [model];

  // Clear cache for each related model
  modelsToInvalidate.forEach(relatedModel => {
    clearModelCache(relatedModel);
  });
};

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    ksize: cache.getStats().ksize,
    vsize: cache.getStats().vsize
  };
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearCacheKey,
  clearCachePattern,
  clearModelCache,
  clearRelatedCache,
  getCacheStats
};
