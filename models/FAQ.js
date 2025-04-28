const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [500, 'Question cannot be more than 500 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
      maxlength: [2000, 'Answer cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'General',
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      min: [0, 'Order cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
FAQSchema.index({ category: 1, order: 1 });
FAQSchema.index({ isActive: 1, category: 1, order: 1 });

// Static method to find FAQs by category
FAQSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true })
    .sort({ order: 1 });
};

// Static method to find all active FAQs
FAQSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ category: 1, order: 1 });
};

// Static method to find all categories
FAQSchema.statics.findCategories = function() {
  return this.distinct('category', { isActive: true });
};

module.exports = mongoose.model('FAQ', FAQSchema);
