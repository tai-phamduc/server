const mongoose = require('mongoose');

// Schema for top movies
const TopMovieSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  poster: {
    type: String,
    default: '',
  },
  bookings: {
    type: Number,
    default: 0,
    min: 0,
  },
  revenue: {
    type: Number,
    default: 0,
    min: 0,
  },
  tickets: {
    type: Number,
    default: 0,
    min: 0,
  },
  occupancy_rate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
}, { _id: false });

// Schema for top products
const TopProductSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  orders: {
    type: Number,
    default: 0,
    min: 0,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  revenue: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { _id: false });

// Schema for top cinemas
const TopCinemaSchema = new mongoose.Schema({
  cinema_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
  },
  bookings: {
    type: Number,
    default: 0,
    min: 0,
  },
  revenue: {
    type: Number,
    default: 0,
    min: 0,
  },
  tickets: {
    type: Number,
    default: 0,
    min: 0,
  },
  occupancy_rate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
}, { _id: false });

const StatisticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: {
        values: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
        message: '{VALUE} is not a valid period',
      },
      required: true,
      index: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    cinema_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      index: true,
    },
    revenue: {
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
      tickets: {
        type: Number,
        default: 0,
        min: 0,
      },
      concessions: {
        type: Number,
        default: 0,
        min: 0,
      },
      other: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    bookings: {
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
      completed: {
        type: Number,
        default: 0,
        min: 0,
      },
      cancelled: {
        type: Number,
        default: 0,
        min: 0,
      },
      refunded: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    tickets: {
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
      standard: {
        type: Number,
        default: 0,
        min: 0,
      },
      premium: {
        type: Number,
        default: 0,
        min: 0,
      },
      vip: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    orders: {
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
      completed: {
        type: Number,
        default: 0,
        min: 0,
      },
      cancelled: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    occupancy_rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    top_movies: [TopMovieSchema],
    top_products: [TopProductSchema],
    top_cinemas: [TopCinemaSchema],
    user_stats: {
      total_users: {
        type: Number,
        default: 0,
        min: 0,
      },
      new_users: {
        type: Number,
        default: 0,
        min: 0,
      },
      active_users: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    payment_methods: {
      credit_card: {
        count: {
          type: Number,
          default: 0,
          min: 0,
        },
        amount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
      paypal: {
        count: {
          type: Number,
          default: 0,
          min: 0,
        },
        amount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
      stripe: {
        count: {
          type: Number,
          default: 0,
          min: 0,
        },
        amount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
      cash: {
        count: {
          type: Number,
          default: 0,
          min: 0,
        },
        amount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
      apple_pay: {
        count: {
          type: Number,
          default: 0,
          min: 0,
        },
        amount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
      google_pay: {
        count: {
          type: Number,
          default: 0,
          min: 0,
        },
        amount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
StatisticsSchema.index({ date: -1, period: 1 });
StatisticsSchema.index({ cinema_id: 1, date: -1, period: 1 });
StatisticsSchema.index({ start_date: 1, end_date: 1 });

// Static method to find statistics by period
StatisticsSchema.statics.findByPeriod = function(period, date = new Date()) {
  return this.find({ period, date: { $lte: date } })
    .sort({ date: -1 })
    .limit(1);
};

// Static method to find statistics by cinema
StatisticsSchema.statics.findByCinema = function(cinemaId, period = 'daily', limit = 30) {
  return this.find({ cinema_id: cinemaId, period })
    .sort({ date: -1 })
    .limit(limit);
};

// Static method to find statistics by date range
StatisticsSchema.statics.findByDateRange = function(startDate, endDate, period = 'daily', cinemaId = null) {
  const query = {
    date: { $gte: startDate, $lte: endDate },
    period,
  };
  
  if (cinemaId) {
    query.cinema_id = cinemaId;
  }
  
  return this.find(query)
    .sort({ date: 1 });
};

// Static method to generate daily statistics
StatisticsSchema.statics.generateDailyStats = async function(date = new Date(), cinemaId = null) {
  // This would be implemented to calculate statistics for a specific day
  // It would query bookings, orders, etc. for the specified date and cinema
  // For now, we'll just return a placeholder
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const stats = {
    date: endOfDay,
    period: 'daily',
    start_date: startOfDay,
    end_date: endOfDay,
  };
  
  if (cinemaId) {
    stats.cinema_id = cinemaId;
  }
  
  // In a real implementation, you would calculate all the statistics here
  // by querying the database for bookings, orders, etc.
  
  return this.create(stats);
};

module.exports = mongoose.model('Statistics', StatisticsSchema);
