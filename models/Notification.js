const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [500, 'Message cannot be more than 500 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['info', 'success', 'warning', 'error', 'booking', 'payment', 'movie', 'event', 'system', 'promotion', 'reminder'],
        message: '{VALUE} is not a valid notification type',
      },
      default: 'info',
      index: true,
    },
    icon: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    isActionable: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
      trim: true,
    },
    actionText: {
      type: String,
      trim: true,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'referenceModel',
    },
    referenceModel: {
      type: String,
      enum: {
        values: ['Booking', 'Payment', 'Movie', 'Event', 'News', 'User'],
        message: '{VALUE} is not a valid reference model',
      },
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['Booking', 'Payment', 'Movie', 'Event'],
    },
    link: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
    },
    isExpired: {
      type: Boolean,
      default: false,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
NotificationSchema.index({ user: 1, isRead: 1, isExpired: 1, isDeleted: 1 });
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 });

// Pre-save hook to check if notification is expired
NotificationSchema.pre('save', function(next) {
  try {
    if (this.expiresAt && this.expiresAt < new Date()) {
      this.isExpired = true;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find unread notifications for a user
NotificationSchema.statics.findUnread = function(userId) {
  return this.find({
    user: userId,
    isRead: false,
    isExpired: false,
    isDeleted: false,
  })
    .sort({ createdAt: -1 });
};

// Static method to find all notifications for a user
NotificationSchema.statics.findForUser = function(userId, options = {}) {
  const { limit = 20, skip = 0, includeRead = true, includeExpired = false, includeDeleted = false } = options;

  const query = { user: userId };

  if (!includeRead) {
    query.isRead = false;
  }

  if (!includeExpired) {
    query.isExpired = false;
  }

  if (!includeDeleted) {
    query.isDeleted = false;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to count unread notifications for a user
NotificationSchema.statics.countUnread = function(userId) {
  return this.countDocuments({
    user: userId,
    isRead: false,
    isExpired: false,
    isDeleted: false,
  });
};

// Static method to mark all notifications as read for a user
NotificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    {
      user: userId,
      isRead: false,
      isExpired: false,
      isDeleted: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

// Static method to delete expired notifications
NotificationSchema.statics.deleteExpired = function() {
  return this.updateMany(
    {
      expiresAt: { $lt: new Date() },
      isExpired: false,
    },
    {
      isExpired: true,
    }
  );
};

// Method to mark as read
NotificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Method to delete
NotificationSchema.methods.delete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', NotificationSchema);
