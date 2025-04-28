const mongoose = require('mongoose');

// Get current date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

// Create analytics data
const analytics = [
  // Page views
  {
    type: 'pageView',
    page: '/',
    sessionId: 'session_123456',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco'
    },
    referrer: 'https://www.google.com',
    duration: 120,
    metadata: {
      loadTime: 1.2,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    user: '680d29841ad99532cd239b01'
  },
  {
    type: 'pageView',
    page: '/movies',
    sessionId: 'session_123456',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco'
    },
    referrer: '/',
    duration: 180,
    metadata: {
      loadTime: 1.5,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    user: '680d29841ad99532cd239b01'
  },
  {
    type: 'pageView',
    page: '/movies/the-dark-knight',
    sessionId: 'session_123456',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco'
    },
    referrer: '/movies',
    duration: 240,
    metadata: {
      loadTime: 1.3,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    user: '680d29841ad99532cd239b01'
  },
  
  // Events
  {
    type: 'event',
    event: 'click',
    category: 'button',
    action: 'book_ticket',
    label: 'The Dark Knight',
    value: 1,
    sessionId: 'session_123456',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco'
    },
    metadata: {
      movieId: '680d29841ad99532cd239bb6',
      showtime: '19:30',
      date: '2023-07-15'
    },
    user: '680d29841ad99532cd239b01'
  },
  {
    type: 'event',
    event: 'click',
    category: 'button',
    action: 'play_trailer',
    label: 'The Dark Knight',
    value: 1,
    sessionId: 'session_123456',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco'
    },
    metadata: {
      movieId: '680d29841ad99532cd239bb6',
      trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY'
    },
    user: '680d29841ad99532cd239b01'
  },
  {
    type: 'event',
    event: 'click',
    category: 'link',
    action: 'view_actor',
    label: 'Christian Bale',
    value: 1,
    sessionId: 'session_123456',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco'
    },
    metadata: {
      actorId: '680d29841ad99532cd239c01',
      movieId: '680d29841ad99532cd239bb6'
    },
    user: '680d29841ad99532cd239b01'
  },
  
  // Conversions
  {
    type: 'conversion',
    event: 'purchase',
    category: 'ticket',
    action: 'complete_purchase',
    label: 'The Dark Knight',
    value: 18.99,
    sessionId: 'session_123456',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco'
    },
    metadata: {
      bookingId: '680d29841ad99532cd239d01',
      movieId: '680d29841ad99532cd239bb6',
      seats: ['A1', 'A2'],
      paymentMethod: 'credit_card'
    },
    user: '680d29841ad99532cd239b01'
  },
  {
    type: 'conversion',
    event: 'signup',
    category: 'user',
    action: 'create_account',
    label: 'New User',
    value: 1,
    sessionId: 'session_789012',
    device: {
      type: 'mobile',
      browser: 'Safari',
      os: 'iOS'
    },
    location: {
      country: 'United States',
      region: 'New York',
      city: 'New York'
    },
    metadata: {
      userId: '680d29841ad99532cd239b02',
      referralSource: 'organic'
    },
    user: '680d29841ad99532cd239b02'
  },
  {
    type: 'conversion',
    event: 'subscription',
    category: 'newsletter',
    action: 'subscribe',
    label: 'Footer Form',
    value: 1,
    sessionId: 'session_345678',
    device: {
      type: 'tablet',
      browser: 'Chrome',
      os: 'Android'
    },
    location: {
      country: 'United States',
      region: 'Texas',
      city: 'Austin'
    },
    metadata: {
      email: 'user@example.com',
      subscriptionType: 'weekly'
    },
    user: '680d29841ad99532cd239b03'
  },
  
  // Errors
  {
    type: 'error',
    event: 'api_error',
    category: 'api',
    action: 'fetch_movies',
    label: 'API Timeout',
    value: 1,
    sessionId: 'session_123456',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco'
    },
    metadata: {
      errorCode: 504,
      errorMessage: 'Gateway Timeout',
      endpoint: '/api/movies'
    },
    user: '680d29841ad99532cd239b01'
  },
  {
    type: 'error',
    event: 'js_error',
    category: 'javascript',
    action: 'runtime_error',
    label: 'Uncaught TypeError',
    value: 1,
    sessionId: 'session_789012',
    device: {
      type: 'mobile',
      browser: 'Safari',
      os: 'iOS'
    },
    location: {
      country: 'United States',
      region: 'New York',
      city: 'New York'
    },
    metadata: {
      errorMessage: "Cannot read property 'length' of undefined",
      stackTrace: "TypeError: Cannot read property 'length' of undefined\n    at MovieList.render (MovieList.js:42)\n    at ReactDOM.render (react-dom.js:55)",
      url: '/movies'
    },
    user: '680d29841ad99532cd239b02'
  },
  {
    type: 'error',
    event: 'payment_error',
    category: 'payment',
    action: 'process_payment',
    label: 'Card Declined',
    value: 1,
    sessionId: 'session_345678',
    device: {
      type: 'tablet',
      browser: 'Chrome',
      os: 'Android'
    },
    location: {
      country: 'United States',
      region: 'Texas',
      city: 'Austin'
    },
    metadata: {
      errorCode: 'card_declined',
      errorMessage: 'Your card was declined.',
      paymentMethod: 'credit_card',
      amount: 37.98
    },
    user: '680d29841ad99532cd239b03'
  },
  
  // Performance
  {
    type: 'performance',
    event: 'page_load',
    category: 'performance',
    action: 'load_time',
    label: 'Homepage',
    value: 1.5,
    sessionId: 'session_123456',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco'
    },
    metadata: {
      url: '/',
      domContentLoaded: 0.8,
      firstPaint: 0.6,
      firstContentfulPaint: 0.7,
      largestContentfulPaint: 1.2,
      firstInputDelay: 0.05,
      cumulativeLayoutShift: 0.1
    },
    user: '680d29841ad99532cd239b01'
  },
  {
    type: 'performance',
    event: 'api_call',
    category: 'performance',
    action: 'response_time',
    label: 'Get Movies',
    value: 0.3,
    sessionId: 'session_789012',
    device: {
      type: 'mobile',
      browser: 'Safari',
      os: 'iOS'
    },
    location: {
      country: 'United States',
      region: 'New York',
      city: 'New York'
    },
    metadata: {
      endpoint: '/api/movies',
      method: 'GET',
      statusCode: 200,
      responseSize: 45678
    },
    user: '680d29841ad99532cd239b02'
  },
  {
    type: 'performance',
    event: 'resource_load',
    category: 'performance',
    action: 'load_time',
    label: 'Main JavaScript Bundle',
    value: 0.8,
    sessionId: 'session_345678',
    device: {
      type: 'tablet',
      browser: 'Chrome',
      os: 'Android'
    },
    location: {
      country: 'United States',
      region: 'Texas',
      city: 'Austin'
    },
    metadata: {
      url: '/static/js/main.bundle.js',
      size: 256789,
      type: 'script',
      compression: 'gzip'
    },
    user: '680d29841ad99532cd239b03'
  }
];

module.exports = analytics;
