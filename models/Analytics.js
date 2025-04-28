const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['pageView', 'event', 'conversion', 'error', 'performance'],
      required: true,
    },
    page: {
      type: String,
    },
    event: {
      type: String,
    },
    category: {
      type: String,
    },
    action: {
      type: String,
    },
    label: {
      type: String,
    },
    value: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: {
      type: String,
    },
    device: {
      type: {
        type: String,
        enum: ['desktop', 'tablet', 'mobile'],
      },
      browser: String,
      os: String,
    },
    location: {
      country: String,
      region: String,
      city: String,
    },
    referrer: {
      type: String,
    },
    duration: {
      type: Number,
    },
    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
AnalyticsSchema.index({ type: 1, createdAt: -1 });
AnalyticsSchema.index({ page: 1, createdAt: -1 });
AnalyticsSchema.index({ user: 1, createdAt: -1 });
AnalyticsSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
