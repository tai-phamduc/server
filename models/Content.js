const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['page', 'section', 'block', 'faq', 'testimonial', 'promotion'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
    },
    metadata: {
      seoTitle: String,
      seoDescription: String,
      seoKeywords: String,
      customCss: String,
      customJs: String,
    },
    settings: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
ContentSchema.index({ type: 1, status: 1 });
ContentSchema.index({ slug: 1 }, { unique: true });
ContentSchema.index({ parent: 1, order: 1 });

module.exports = mongoose.model('Content', ContentSchema);
