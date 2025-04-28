const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  sendPromotionNotification,
  sendSystemNotification,
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.route('/')
  .get(protect, getUserNotifications)
  .delete(protect, deleteAllNotifications);

router.route('/unread/count')
  .get(protect, getUnreadCount);

router.route('/read-all')
  .put(protect, markAllAsRead);

router.route('/:id/read')
  .put(protect, markAsRead);

router.route('/:id')
  .delete(protect, deleteNotification);

// Admin routes
router.route('/promotion')
  .post(protect, admin, sendPromotionNotification);

router.route('/system')
  .post(protect, admin, sendSystemNotification);

module.exports = router;
