const mongoose = require('mongoose');

// Schema for daily statistics
const DailyStatisticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  totalBookings: {
    type: Number,
    default: 0,
    min: [0, 'Total bookings cannot be negative'],
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Total revenue cannot be negative'],
  },
  ticketsSold: {
    type: Number,
    default: 0,
    min: [0, 'Tickets sold cannot be negative'],
  },
  ticketRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Ticket revenue cannot be negative'],
  },
  concessionsSold: {
    type: Number,
    default: 0,
    min: [0, 'Concessions sold cannot be negative'],
  },
  concessionsRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Concessions revenue cannot be negative'],
  },
  newUsers: {
    type: Number,
    default: 0,
    min: [0, 'New users cannot be negative'],
  },
  activeUsers: {
    type: Number,
    default: 0,
    min: [0, 'Active users cannot be negative'],
  },
  websiteVisits: {
    type: Number,
    default: 0,
    min: [0, 'Website visits cannot be negative'],
  },
  mobileAppVisits: {
    type: Number,
    default: 0,
    min: [0, 'Mobile app visits cannot be negative'],
  },
  searchCount: {
    type: Number,
    default: 0,
    min: [0, 'Search count cannot be negative'],
  },
  bookingConversionRate: {
    type: Number,
    default: 0,
    min: [0, 'Booking conversion rate cannot be negative'],
    max: [100, 'Booking conversion rate cannot exceed 100'],
  },
  averageTicketPrice: {
    type: Number,
    default: 0,
    min: [0, 'Average ticket price cannot be negative'],
  },
  averageOrderValue: {
    type: Number,
    default: 0,
    min: [0, 'Average order value cannot be negative'],
  },
}, { _id: true });

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
    min: [0, 'Bookings cannot be negative'],
  },
  revenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative'],
  },
  tickets: {
    type: Number,
    default: 0,
    min: [0, 'Tickets cannot be negative'],
  },
  occupancy_rate: {
    type: Number,
    default: 0,
    min: [0, 'Occupancy rate cannot be negative'],
    max: [100, 'Occupancy rate cannot exceed 100'],
  },
  genres: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [10, 'Rating cannot be more than 10'],
  },
}, { _id: true });

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
    min: [0, 'Orders cannot be negative'],
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative'],
  },
  revenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative'],
  },
  category: {
    type: String,
    trim: true,
  },
}, { _id: true });

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
    region: {
      type: String,
      trim: true,
    },
  },
  bookings: {
    type: Number,
    default: 0,
    min: [0, 'Bookings cannot be negative'],
  },
  revenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative'],
  },
  tickets: {
    type: Number,
    default: 0,
    min: [0, 'Tickets cannot be negative'],
  },
  occupancy_rate: {
    type: Number,
    default: 0,
    min: [0, 'Occupancy rate cannot be negative'],
    max: [100, 'Occupancy rate cannot exceed 100'],
  },
  concessions_revenue: {
    type: Number,
    default: 0,
    min: [0, 'Concessions revenue cannot be negative'],
  },
}, { _id: true });

// Schema for payment method breakdown
const PaymentMethodSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    trim: true,
  },
  count: {
    type: Number,
    default: 0,
    min: [0, 'Count cannot be negative'],
  },
  amount: {
    type: Number,
    default: 0,
    min: [0, 'Amount cannot be negative'],
  },
  percentage: {
    type: Number,
    default: 0,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100'],
  },
}, { _id: false });

// Schema for device type breakdown
const DeviceTypeSchema = new mongoose.Schema({
  device: {
    type: String,
    required: true,
    trim: true,
  },
  count: {
    type: Number,
    default: 0,
    min: [0, 'Count cannot be negative'],
  },
  percentage: {
    type: Number,
    default: 0,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100'],
  },
}, { _id: false });

// Schema for genre breakdown
const GenreBreakdownSchema = new mongoose.Schema({
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  tickets: {
    type: Number,
    default: 0,
    min: [0, 'Tickets cannot be negative'],
  },
  revenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative'],
  },
  percentage: {
    type: Number,
    default: 0,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100'],
  },
}, { _id: false });

// Schema for hourly breakdown
const HourlyBreakdownSchema = new mongoose.Schema({
  hour: {
    type: Number,
    required: true,
    min: [0, 'Hour cannot be less than 0'],
    max: [23, 'Hour cannot be more than 23'],
  },
  bookings: {
    type: Number,
    default: 0,
    min: [0, 'Bookings cannot be negative'],
  },
  revenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative'],
  },
}, { _id: false });

// Schema for daily breakdown
const DailyBreakdownSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  bookings: {
    type: Number,
    default: 0,
    min: [0, 'Bookings cannot be negative'],
  },
  revenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative'],
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
        min: [0, 'Total revenue cannot be negative'],
      },
      tickets: {
        type: Number,
        default: 0,
        min: [0, 'Ticket revenue cannot be negative'],
      },
      concessions: {
        type: Number,
        default: 0,
        min: [0, 'Concession revenue cannot be negative'],
      },
      other: {
        type: Number,
        default: 0,
        min: [0, 'Other revenue cannot be negative'],
      },
    },
    bookings: {
      total: {
        type: Number,
        default: 0,
        min: [0, 'Total bookings cannot be negative'],
      },
      completed: {
        type: Number,
        default: 0,
        min: [0, 'Completed bookings cannot be negative'],
      },
      cancelled: {
        type: Number,
        default: 0,
        min: [0, 'Cancelled bookings cannot be negative'],
      },
      refunded: {
        type: Number,
        default: 0,
        min: [0, 'Refunded bookings cannot be negative'],
      },
    },
    tickets: {
      total: {
        type: Number,
        default: 0,
        min: [0, 'Total tickets cannot be negative'],
      },
      standard: {
        type: Number,
        default: 0,
        min: [0, 'Standard tickets cannot be negative'],
      },
      premium: {
        type: Number,
        default: 0,
        min: [0, 'Premium tickets cannot be negative'],
      },
      vip: {
        type: Number,
        default: 0,
        min: [0, 'VIP tickets cannot be negative'],
      },
      couple: {
        type: Number,
        default: 0,
        min: [0, 'Couple tickets cannot be negative'],
      },
      accessible: {
        type: Number,
        default: 0,
        min: [0, 'Accessible tickets cannot be negative'],
      },
    },
    orders: {
      total: {
        type: Number,
        default: 0,
        min: [0, 'Total orders cannot be negative'],
      },
      completed: {
        type: Number,
        default: 0,
        min: [0, 'Completed orders cannot be negative'],
      },
      cancelled: {
        type: Number,
        default: 0,
        min: [0, 'Cancelled orders cannot be negative'],
      },
      average_value: {
        type: Number,
        default: 0,
        min: [0, 'Average order value cannot be negative'],
      },
    },
    occupancy_rate: {
      type: Number,
      default: 0,
      min: [0, 'Occupancy rate cannot be negative'],
      max: [100, 'Occupancy rate cannot exceed 100'],
    },
    daily_stats: [DailyStatisticsSchema],
    top_movies: [TopMovieSchema],
    top_products: [TopProductSchema],
    top_cinemas: [TopCinemaSchema],
    user_stats: {
      total_users: {
        type: Number,
        default: 0,
        min: [0, 'Total users cannot be negative'],
      },
      new_users: {
        type: Number,
        default: 0,
        min: [0, 'New users cannot be negative'],
      },
      active_users: {
        type: Number,
        default: 0,
        min: [0, 'Active users cannot be negative'],
      },
      returning_users: {
        type: Number,
        default: 0,
        min: [0, 'Returning users cannot be negative'],
      },
      conversion_rate: {
        type: Number,
        default: 0,
        min: [0, 'Conversion rate cannot be negative'],
        max: [100, 'Conversion rate cannot exceed 100'],
      },
    },
    payment_methods: [PaymentMethodSchema],
    device_types: [DeviceTypeSchema],
    genre_breakdown: [GenreBreakdownSchema],
    hourly_breakdown: [HourlyBreakdownSchema],
    daily_breakdown: [DailyBreakdownSchema],
    refunds: {
      count: {
        type: Number,
        default: 0,
        min: [0, 'Refund count cannot be negative'],
      },
      amount: {
        type: Number,
        default: 0,
        min: [0, 'Refund amount cannot be negative'],
      },
      rate: {
        type: Number,
        default: 0,
        min: [0, 'Refund rate cannot be negative'],
        max: [100, 'Refund rate cannot exceed 100'],
      },
    },
    promotions: [{
      promotion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
      },
      code: {
        type: String,
        trim: true,
      },
      usage_count: {
        type: Number,
        default: 0,
        min: [0, 'Usage count cannot be negative'],
      },
      discount_amount: {
        type: Number,
        default: 0,
        min: [0, 'Discount amount cannot be negative'],
      },
    }],
    ai_insights: {
      trends: [{
        name: {
          type: String,
          trim: true,
        },
        value: {
          type: Number,
        },
        change: {
          type: Number,
        },
        insight: {
          type: String,
          trim: true,
        },
      }],
      recommendations: [{
        title: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        priority: {
          type: String,
          enum: ['low', 'medium', 'high'],
          default: 'medium',
        },
      }],
      anomalies: [{
        metric: {
          type: String,
          trim: true,
        },
        expected: {
          type: Number,
        },
        actual: {
          type: Number,
        },
        deviation: {
          type: Number,
        },
        description: {
          type: String,
          trim: true,
        },
      }],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create indexes for faster queries
StatisticsSchema.index({ date: -1, period: 1 });
StatisticsSchema.index({ cinema_id: 1, date: -1, period: 1 });
StatisticsSchema.index({ start_date: 1, end_date: 1 });
StatisticsSchema.index({ 'top_movies.movie_id': 1 });
StatisticsSchema.index({ 'top_products.product_id': 1 });
StatisticsSchema.index({ 'top_cinemas.cinema_id': 1 });
StatisticsSchema.index({ 'daily_stats.date': 1 });

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

// Static method to find statistics by movie
StatisticsSchema.statics.findByMovie = function(movieId, period = 'daily', limit = 30) {
  return this.find({
    'top_movies.movie_id': movieId,
    period
  })
  .sort({ date: -1 })
  .limit(limit);
};

// Static method to find statistics by product
StatisticsSchema.statics.findByProduct = function(productId, period = 'daily', limit = 30) {
  return this.find({
    'top_products.product_id': productId,
    period
  })
  .sort({ date: -1 })
  .limit(limit);
};

// Static method to find latest statistics
StatisticsSchema.statics.findLatest = function(period = 'daily') {
  return this.findOne({ period })
    .sort({ date: -1 });
};

// Static method to generate daily statistics
StatisticsSchema.statics.generateDailyStats = async function(date = new Date(), cinemaId = null) {
  // This would be implemented to calculate statistics for a specific day
  // It would query bookings, orders, etc. for the specified date and cinema

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

// Static method to generate weekly statistics
StatisticsSchema.statics.generateWeeklyStats = async function(date = new Date(), cinemaId = null) {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday

  const startOfWeek = new Date(date);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const stats = {
    date: endOfWeek,
    period: 'weekly',
    start_date: startOfWeek,
    end_date: endOfWeek,
  };

  if (cinemaId) {
    stats.cinema_id = cinemaId;
  }

  // In a real implementation, you would calculate all the statistics here
  // by querying the database for bookings, orders, etc.

  return this.create(stats);
};

// Static method to generate monthly statistics
StatisticsSchema.statics.generateMonthlyStats = async function(date = new Date(), cinemaId = null) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const stats = {
    date: endOfMonth,
    period: 'monthly',
    start_date: startOfMonth,
    end_date: endOfMonth,
  };

  if (cinemaId) {
    stats.cinema_id = cinemaId;
  }

  // In a real implementation, you would calculate all the statistics here
  // by querying the database for bookings, orders, etc.

  return this.create(stats);
};

// Static method to generate yearly statistics
StatisticsSchema.statics.generateYearlyStats = async function(date = new Date(), cinemaId = null) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);

  const endOfYear = new Date(date.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);

  const stats = {
    date: endOfYear,
    period: 'yearly',
    start_date: startOfYear,
    end_date: endOfYear,
  };

  if (cinemaId) {
    stats.cinema_id = cinemaId;
  }

  // In a real implementation, you would calculate all the statistics here
  // by querying the database for bookings, orders, etc.

  return this.create(stats);
};

// Method to add daily statistics
StatisticsSchema.methods.addDailyStats = function(dailyStats) {
  this.daily_stats.push(dailyStats);
  return this.save();
};

// Method to add top movie
StatisticsSchema.methods.addTopMovie = function(movieStats) {
  this.top_movies.push(movieStats);
  return this.save();
};

// Method to add top product
StatisticsSchema.methods.addTopProduct = function(productStats) {
  this.top_products.push(productStats);
  return this.save();
};

// Method to add top cinema
StatisticsSchema.methods.addTopCinema = function(cinemaStats) {
  this.top_cinemas.push(cinemaStats);
  return this.save();
};

module.exports = mongoose.model('Statistics', StatisticsSchema);
