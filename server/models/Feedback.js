const mongoose = require('mongoose');
const validator = require('validator');

const FeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
    },
    photo: {
      type: String, // URL to image
      default: '',
    },
    role: {
      type: String,
      default: 'Customer',
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide feedback content'],
      trim: true,
      maxlength: [1000, 'Feedback cannot be more than 1000 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    isDisplayed: {
      type: Boolean,
      default: false,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
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
FeedbackSchema.index({ isApproved: 1, isDisplayed: 1 });
FeedbackSchema.index({ rating: -1 });
FeedbackSchema.index({ displayOrder: 1 });

// Static method to find approved feedback
FeedbackSchema.statics.findApproved = function() {
  return this.find({ isApproved: true })
    .sort({ createdAt: -1 });
};

// Static method to find displayed feedback
FeedbackSchema.statics.findDisplayed = function() {
  return this.find({ isApproved: true, isDisplayed: true })
    .sort({ displayOrder: 1, createdAt: -1 });
};

// Static method to find top rated feedback
FeedbackSchema.statics.findTopRated = function(limit = 5) {
  return this.find({ isApproved: true })
    .sort({ rating: -1, createdAt: -1 })
    .limit(limit);
};

// Method to approve feedback
FeedbackSchema.methods.approve = async function() {
  this.isApproved = true;
  return this.save();
};

// Method to display feedback
FeedbackSchema.methods.display = async function(order = 0) {
  this.isDisplayed = true;
  this.displayOrder = order;
  return this.save();
};

// Method to hide feedback
FeedbackSchema.methods.hide = async function() {
  this.isDisplayed = false;
  return this.save();
};

module.exports = mongoose.model('Feedback', FeedbackSchema);
