const express = require('express');
const router = express.Router();
const { 
  subscribeNewsletter,
  verifyNewsletter,
  unsubscribeNewsletter,
  updatePreferences,
  getAllSubscriptions,
  deleteSubscription,
  exportSubscribers
} = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.get('/verify/:token', verifyNewsletter);
router.get('/unsubscribe/:token', unsubscribeNewsletter);

// Protected routes
router.put('/preferences', protect, updatePreferences);

// Admin routes
router.get('/admin', protect, admin, getAllSubscriptions);
router.get('/export', protect, admin, exportSubscribers);
router.delete('/:id', protect, admin, deleteSubscription);

module.exports = router;
