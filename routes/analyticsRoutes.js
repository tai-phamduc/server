const express = require('express');
const router = express.Router();
const {
  trackPageView,
  trackEvent,
  trackConversion,
  trackError,
  trackPerformance,
  getPageViewStats,
  getEventStats,
  getConversionStats,
  getErrorStats,
  getPerformanceStats,
  getDashboardStats,
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Tracking routes (public)
router.post('/pageview', trackPageView);
router.post('/event', trackEvent);
router.post('/error', trackError);
router.post('/performance', trackPerformance);

// Tracking routes (private)
router.post('/conversion', protect, trackConversion);

// Stats routes (admin only)
router.get('/pageviews', protect, admin, getPageViewStats);
router.get('/events', protect, admin, getEventStats);
router.get('/conversions', protect, admin, getConversionStats);
router.get('/errors', protect, admin, getErrorStats);
router.get('/performance', protect, admin, getPerformanceStats);
router.get('/dashboard', protect, admin, getDashboardStats);

module.exports = router;
