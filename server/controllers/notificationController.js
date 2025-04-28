const Notification = require('../models/Notification');
const User = require('../models/User');
const notificationService = require('../utils/notificationService');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread notifications count for a user
// @route   GET /api/notifications/unread/count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if notification belongs to user
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if notification belongs to user
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await notification.remove();

    res.json({ message: 'Notification removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete all notifications for a user
// @route   DELETE /api/notifications
// @access  Private
const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    res.json({ message: 'All notifications removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a promotion notification to all users
// @route   POST /api/notifications/promotion
// @access  Private/Admin
const sendPromotionNotification = async (req, res) => {
  try {
    const { title, message, link, userIds } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    let users;
    if (userIds && userIds.length > 0) {
      // Send to specific users
      users = userIds;
    } else {
      // Send to all users with email subscription enabled
      const allUsers = await User.find({
        'preferences.emailSubscription': true,
        isActive: true,
      }).select('_id');
      
      users = allUsers.map(user => user._id);
    }

    const notifications = await notificationService.createPromotionNotification(
      users,
      title,
      message,
      link
    );

    res.status(201).json({
      message: `Promotion notification sent to ${users.length} users`,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a system notification to a user
// @route   POST /api/notifications/system
// @access  Private/Admin
const sendSystemNotification = async (req, res) => {
  try {
    const { userId, title, message, link } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ message: 'User ID, title, and message are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = await notificationService.createNotification(
      userId,
      title,
      message,
      'system',
      { link }
    );

    // Send email notification
    if (user.preferences && user.preferences.emailSubscription) {
      const html = `
        <h1>${title}</h1>
        <p>Dear ${user.name},</p>
        <p>${message}</p>
      `;

      await notificationService.sendEmailNotification(userId, title, html);
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  sendPromotionNotification,
  sendSystemNotification,
};
