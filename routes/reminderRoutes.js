const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendReminderForBooking,
  updateReminderPreferences,
  getReminderPreferences
} = require('../controllers/reminderController');

// Routes for reminders
router.post('/send/:id', protect, sendReminderForBooking);
router.put('/preferences', protect, updateReminderPreferences);
router.get('/preferences', protect, getReminderPreferences);

module.exports = router;
