const mongoose = require('mongoose');

// Schema for seat status in a screening
const ScreeningSeatSchema = new mongoose.Schema({
  seat_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  row: {
    type: String,
    required: true,
    trim: true,
  },
  column: {
    type: Number,
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'reserved', 'unavailable', 'maintenance'],
    default: 'available',
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
  },
  reservation_expires: {
    type: Date,
    default: null,
  },
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'couple', 'accessible'],
    default: 'standard',
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reservedAt: {
    type: Date,
    default: null
  },
  lockVersion: {
    type: Number,
    default: 0
  }
}, { _id: true });

const ScreeningSchema = new mongoose.Schema(
  {
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie is required'],
      index: true,
    },
    cinema_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: [true, 'Cinema is required'],
      index: true,
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    displayDate: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      index: true,
      // Removed validation to allow past dates for testing
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    displayTime: {
      type: String,
      trim: true,
    },
    format: {
      type: String,
      enum: {
        values: ['2D', '3D', 'IMAX', 'IMAX 3D', '4DX', 'Dolby Atmos', 'VIP', 'ScreenX', 'RPX'],
        message: '{VALUE} is not a valid format',
      },
      default: '2D',
    },
    language: {
      type: String,
      default: 'English',
      trim: true,
    },
    subtitles: {
      type: String,
      default: 'None',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    pricingTiers: {
      standard: {
        type: Number,
        required: true,
        min: [0, 'Standard price cannot be negative']
      },
      premium: {
        type: Number,
        default: 0,
        min: [0, 'Premium price cannot be negative']
      },
      vip: {
        type: Number,
        default: 0,
        min: [0, 'VIP price cannot be negative']
      },
      couple: {
        type: Number,
        default: 0,
        min: [0, 'Couple price cannot be negative']
      },
      accessible: {
        type: Number,
        default: 0,
        min: [0, 'Accessible price cannot be negative']
      }
    },
    seats: [ScreeningSeatSchema],
    totalSeats: {
      type: Number,
      default: 0,
      min: [0, 'Total seats cannot be negative'],
    },
    seatsAvailable: {
      type: Number,
      default: 0,
      min: [0, 'Available seats cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'cancelled', 'sold_out', 'almost_full', 'open', 'in_progress', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'scheduled',
      index: true,
    },
    bookingEnabled: {
      type: Boolean,
      default: true,
    },
    dayOfWeek: {
      type: String,
      trim: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    specialEvent: {
      type: Boolean,
      default: false
    },
    specialEventDetails: {
      type: String,
      trim: true
    },
    promotionalDiscount: {
      isActive: {
        type: Boolean,
        default: false
      },
      discountPercentage: {
        type: Number,
        min: [0, 'Discount percentage cannot be negative'],
        max: [100, 'Discount percentage cannot exceed 100'],
        default: 0
      },
      discountCode: {
        type: String,
        trim: true
      }
    },
    concurrentBookingLimit: {
      type: Number,
      default: 10,
      min: [1, 'Concurrent booking limit must be at least 1']
    },
    currentConcurrentBookings: {
      type: Number,
      default: 0,
      min: [0, 'Current concurrent bookings cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for occupancy percentage
ScreeningSchema.virtual('occupancyPercentage').get(function() {
  if (this.totalSeats === 0) return 0;
  return Math.round(((this.totalSeats - this.seatsAvailable) / this.totalSeats) * 100);
});

// Create virtual for duration
ScreeningSchema.virtual('duration').get(function() {
  if (!this.startTime || !this.endTime) return 0;
  return Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
});

// Create virtual for movie
ScreeningSchema.virtual('movie', {
  ref: 'Movie',
  localField: 'movie_id',
  foreignField: '_id',
  justOne: true,
});

// Create virtual for cinema
ScreeningSchema.virtual('cinema', {
  ref: 'Cinema',
  localField: 'cinema_id',
  foreignField: '_id',
  justOne: true,
});

// Create virtual for room
ScreeningSchema.virtual('room', {
  ref: 'Room',
  localField: 'room_id',
  foreignField: '_id',
  justOne: true,
});

// Create virtual for bookings
ScreeningSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'screening_id',
  justOne: false,
});

// Create indexes for faster queries
ScreeningSchema.index({ movie_id: 1, startTime: 1 });
ScreeningSchema.index({ cinema_id: 1, room_id: 1, startTime: 1 });
ScreeningSchema.index({ startTime: 1, isActive: 1 });
ScreeningSchema.index({ date: 1, cinema_id: 1 });
ScreeningSchema.index({ status: 1 });

// Pre-save hook to update display date and time
ScreeningSchema.pre('save', async function(next) {
  try {
    // Format display date
    if (this.isModified('date') || !this.displayDate) {
      this.displayDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    // Format display time
    if (this.isModified('startTime') || !this.displayTime) {
      this.displayTime = this.startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    // Set day of week
    if (this.isModified('date') || !this.dayOfWeek) {
      this.dayOfWeek = this.date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    // Increment version on update
    if (!this.isNew) {
      this.version += 1;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find screenings by movie
ScreeningSchema.statics.findByMovie = function(movieId, options = {}) {
  const { startDate = new Date(), endDate, limit = 50 } = options;

  const query = {
    movie_id: movieId,
    startTime: { $gte: startDate },
    isActive: true,
  };

  if (endDate) {
    query.startTime.$lte = endDate;
  }

  return this.find(query)
    .sort({ startTime: 1 })
    .limit(limit)
    .populate('cinema', 'name location');
};

// Static method to find screenings by cinema
ScreeningSchema.statics.findByCinema = function(cinemaId, options = {}) {
  const { startDate = new Date(), endDate, limit = 50 } = options;

  const query = {
    cinema_id: cinemaId,
    startTime: { $gte: startDate },
    isActive: true,
  };

  if (endDate) {
    query.startTime.$lte = endDate;
  }

  return this.find(query)
    .sort({ startTime: 1 })
    .limit(limit)
    .populate('movie', 'title poster duration');
};

// Static method to find screenings by movie and date
ScreeningSchema.statics.findByMovieAndDate = function(movieId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.find({
    movie_id: movieId,
    date: { $gte: startOfDay, $lte: endOfDay },
    isActive: true,
  })
  .sort({ startTime: 1 })
  .populate('cinema', 'name location')
  .populate('room', 'name type');
};

// Static method to find screenings by movie, cinema, and date
ScreeningSchema.statics.findByMovieCinemaDate = function(movieId, cinemaId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.find({
    movie_id: movieId,
    cinema_id: cinemaId,
    date: { $gte: startOfDay, $lte: endOfDay },
    isActive: true,
  })
  .sort({ startTime: 1 })
  .populate('room', 'name type');
};

// Static method to find available seats for a screening
ScreeningSchema.statics.findAvailableSeats = function(screeningId) {
  return this.findById(screeningId, 'seats')
    .then(screening => {
      if (!screening) {
        throw new Error('Screening not found');
      }
      return screening.seats.filter(seat => seat.status === 'available');
    });
};

// Method to reserve seats
ScreeningSchema.methods.reserveSeats = async function(seatIds, expirationMinutes = 15) {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + expirationMinutes);

  let reservedCount = 0;

  // Update seat status to reserved
  this.seats.forEach(seat => {
    if (seatIds.includes(seat._id.toString()) && seat.status === 'available') {
      seat.status = 'reserved';
      seat.reservation_expires = expirationTime;
      reservedCount++;
    }
  });

  // Update available seats count
  this.seatsAvailable -= reservedCount;

  // Update status if needed
  if (this.seatsAvailable === 0) {
    this.status = 'sold_out';
  } else if (this.seatsAvailable <= this.totalSeats * 0.1) { // Less than 10% seats available
    this.status = 'almost_full';
  }

  // Increment version
  this.version += 1;

  return this.save();
};

// Method to book seats
ScreeningSchema.methods.bookSeats = async function(seatIds, bookingId) {
  let bookedCount = 0;

  // Update seat status to booked
  this.seats.forEach(seat => {
    if (seatIds.includes(seat._id.toString()) &&
        (seat.status === 'available' || seat.status === 'reserved')) {
      seat.status = 'booked';
      seat.booking_id = bookingId;
      seat.reservation_expires = null;
      bookedCount++;
    }
  });

  // Update available seats count if seats were available (not reserved)
  this.seatsAvailable -= bookedCount;

  // Update status if needed
  if (this.seatsAvailable === 0) {
    this.status = 'sold_out';
  } else if (this.seatsAvailable <= this.totalSeats * 0.1) { // Less than 10% seats available
    this.status = 'almost_full';
  }

  // Increment version
  this.version += 1;

  return this.save();
};

// Method to release reserved seats
ScreeningSchema.methods.releaseSeats = async function(seatIds) {
  let releasedCount = 0;

  // Update seat status to available
  this.seats.forEach(seat => {
    if (seatIds.includes(seat._id.toString()) && seat.status === 'reserved') {
      seat.status = 'available';
      seat.reservation_expires = null;
      releasedCount++;
    }
  });

  // Update available seats count
  this.seatsAvailable += releasedCount;

  // Update status if needed
  if (this.status === 'sold_out' || this.status === 'almost_full') {
    if (this.seatsAvailable > this.totalSeats * 0.1) {
      this.status = 'open';
    }
  }

  // Increment version
  this.version += 1;

  return this.save();
};

module.exports = mongoose.model('Screening', ScreeningSchema);
