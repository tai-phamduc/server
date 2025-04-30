const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    session_id: {
      type: String,
      index: true,
    },
    activity_type: {
      type: String,
      enum: {
        values: [
          'page_view', 
          'search', 
          'movie_view', 
          'movie_rating', 
          'movie_bookmark', 
          'booking', 
          'payment', 
          'product_view', 
          'order', 
          'login', 
          'logout', 
          'registration', 
          'profile_update',
          'comment',
          'review'
        ],
        message: '{VALUE} is not a valid activity type',
      },
      required: [true, 'Activity type is required'],
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ip_address: {
      type: String,
      trim: true,
    },
    user_agent: {
      type: String,
      trim: true,
    },
    device: {
      type: {
        type: String,
        enum: ['desktop', 'tablet', 'mobile', 'unknown'],
        default: 'unknown',
      },
      browser: {
        type: String,
        trim: true,
      },
      os: {
        type: String,
        trim: true,
      },
    },
    location: {
      country: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      region: {
        type: String,
        trim: true,
      },
    },
    page: {
      url: {
        type: String,
        trim: true,
      },
      title: {
        type: String,
        trim: true,
      },
      referrer: {
        type: String,
        trim: true,
      },
    },
    search: {
      query: {
        type: String,
        trim: true,
      },
      filters: {
        type: Object,
      },
      results_count: {
        type: Number,
        min: 0,
      },
    },
    movie: {
      movie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
      title: {
        type: String,
        trim: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    booking: {
      booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
      movie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
      cinema_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cinema',
      },
      amount: {
        type: Number,
        min: 0,
      },
    },
    order: {
      order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      products: [{
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          min: 1,
        },
      }],
      amount: {
        type: Number,
        min: 0,
      },
    },
    duration: {
      type: Number,
      min: 0,
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
UserActivitySchema.index({ user_id: 1, activity_type: 1, timestamp: -1 });
UserActivitySchema.index({ session_id: 1, timestamp: -1 });
UserActivitySchema.index({ 'movie.movie_id': 1, activity_type: 1 });
UserActivitySchema.index({ 'booking.booking_id': 1 });
UserActivitySchema.index({ 'order.order_id': 1 });
UserActivitySchema.index({ timestamp: -1 });

// Static method to log activity
UserActivitySchema.statics.logActivity = async function(activityData) {
  return this.create(activityData);
};

// Static method to find user activities
UserActivitySchema.statics.findByUser = function(userId, options = {}) {
  const { activityType, limit = 100, skip = 0, startDate, endDate } = options;
  
  const query = { user_id: userId };
  
  if (activityType) {
    query.activity_type = activityType;
  }
  
  if (startDate || endDate) {
    query.timestamp = {};
    
    if (startDate) {
      query.timestamp.$gte = startDate;
    }
    
    if (endDate) {
      query.timestamp.$lte = endDate;
    }
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to find movie activities
UserActivitySchema.statics.findByMovie = function(movieId, options = {}) {
  const { activityType, limit = 100, skip = 0 } = options;
  
  const query = { 'movie.movie_id': movieId };
  
  if (activityType) {
    query.activity_type = activityType;
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to find recent activities
UserActivitySchema.statics.findRecent = function(limit = 100) {
  return this.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('user_id', 'name email');
};

// Static method to get user activity stats
UserActivitySchema.statics.getUserStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$activity_type',
        count: { $sum: 1 },
        lastActivity: { $max: '$timestamp' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('UserActivity', UserActivitySchema);
