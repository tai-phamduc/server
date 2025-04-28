const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return v === '' || validator.isMobilePhone(v);
        },
        message: 'Please provide a valid phone number',
      },
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot be more than 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot be more than 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'read', 'replied', 'spam', 'archived'],
        message: '{VALUE} is not a valid status',
      },
      default: 'new',
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    readAt: {
      type: Date,
    },
    repliedAt: {
      type: Date,
    },
    replyMessage: {
      type: String,
      trim: true,
    },
    replySubject: {
      type: String,
      trim: true,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1, createdAt: -1 });

// Static method to find new contacts
ContactSchema.statics.findNew = function() {
  return this.find({ status: 'new' })
    .sort({ createdAt: -1 });
};

// Static method to find contacts by status
ContactSchema.statics.findByStatus = function(status) {
  return this.find({ status })
    .sort({ createdAt: -1 });
};

// Static method to find contacts by email
ContactSchema.statics.findByEmail = function(email) {
  return this.find({ email: email.toLowerCase() })
    .sort({ createdAt: -1 });
};

// Method to mark as read
ContactSchema.methods.markAsRead = async function(userId) {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Method to mark as replied
ContactSchema.methods.markAsReplied = async function(userId, subject, message) {
  this.status = 'replied';
  this.repliedAt = new Date();
  this.repliedBy = userId;
  this.replySubject = subject;
  this.replyMessage = message;
  return this.save();
};

// Method to mark as spam
ContactSchema.methods.markAsSpam = async function() {
  this.status = 'spam';
  return this.save();
};

// Method to archive
ContactSchema.methods.archive = async function() {
  this.status = 'archived';
  return this.save();
};

module.exports = mongoose.model('Contact', ContactSchema);
