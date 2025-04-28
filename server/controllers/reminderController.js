const Booking = require('../models/Booking');
const User = require('../models/User');
const reminderService = require('../services/reminderService');
const { sendBookingReminderEmail } = require('../utils/emailSender');

// @desc    Send reminder for a booking
// @route   POST /api/reminders/send/:id
// @access  Private
const sendReminderForBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user or if the user is an admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if booking is confirmed
    if (booking.bookingStatus !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot send reminder for non-confirmed booking' });
    }

    // Check if showtime has passed
    const now = new Date();
    const showtimeDate = new Date(booking.showtimeDate);

    if (showtimeDate < now) {
      return res.status(400).json({ message: 'Cannot send reminder for past showtimes' });
    }

    // Send reminder
    const success = await reminderService.sendReminderForBooking(booking._id);

    if (success) {
      res.json({ message: 'Reminder sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send reminder' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reminder preferences
// @route   PUT /api/reminders/preferences
// @access  Private
const updateReminderPreferences = async (req, res) => {
  try {
    const { enableReminders, reminderTime, enableSmsReminders, phoneNumber } = req.body;

    // Update user preferences
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize preferences if they don't exist
    if (!user.preferences) {
      user.preferences = {};
    }

    // Update reminder preferences
    user.preferences.enableReminders = enableReminders !== undefined ? enableReminders : user.preferences.enableReminders;

    if (reminderTime !== undefined) {
      // Validate reminderTime (should be a number between 1 and 48)
      if (reminderTime < 1 || reminderTime > 48) {
        return res.status(400).json({ message: 'Reminder time must be between 1 and 48 hours' });
      }

      user.preferences.reminderTime = reminderTime;
    }

    // Update SMS preferences
    if (enableSmsReminders !== undefined) {
      user.preferences.enableSmsReminders = enableSmsReminders;
    }

    if (phoneNumber !== undefined && phoneNumber.trim() !== '') {
      // Basic validation for international phone numbers
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format. Please use international format (e.g., +1234567890)' });
      }

      user.preferences.phoneNumber = phoneNumber;
    } else if (enableSmsReminders && (!user.preferences.phoneNumber || user.preferences.phoneNumber.trim() === '')) {
      return res.status(400).json({ message: 'Phone number is required for SMS reminders' });
    }

    await user.save();

    res.json({
      message: 'Reminder preferences updated successfully',
      preferences: {
        enableReminders: user.preferences.enableReminders,
        reminderTime: user.preferences.reminderTime,
        enableSmsReminders: user.preferences.enableSmsReminders,
        phoneNumber: user.preferences.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reminder preferences
// @route   GET /api/reminders/preferences
// @access  Private
const getReminderPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return default preferences if not set
    const preferences = {
      enableReminders: user.preferences?.enableReminders !== undefined ? user.preferences.enableReminders : true,
      reminderTime: user.preferences?.reminderTime || 24, // Default: 24 hours before showtime
      enableSmsReminders: user.preferences?.enableSmsReminders || false,
      phoneNumber: user.preferences?.phoneNumber || ''
    };

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendReminderForBooking,
  updateReminderPreferences,
  getReminderPreferences
};
