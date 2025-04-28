const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie is required'],
      index: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: [true, 'Theater is required'],
      index: true,
    },
    hall: {
      type: String,
      required: [true, 'Hall is required'],
      trim: true,
    },
    hallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater.halls',
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
      validate: {
        validator: function(v) {
          return v > new Date();
        },
        message: 'Start time must be in the future',
      },
    },
    displayTime: {
      type: String,
      trim: true,
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
      validate: {
        validator: function(v) {
          return v > this.startTime;
        },
        message: 'End time must be after start time',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    priceFormatted: {
      type: String,
      trim: true,
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    discountPriceFormatted: {
      type: String,
      trim: true,
    },
    hasDiscount: {
      type: Boolean,
      default: false,
    },
    seatsAvailable: {
      type: Number,
      required: [true, 'Available seats is required'],
      min: [0, 'Available seats cannot be negative'],
      validate: {
        validator: function(v) {
          return v <= this.totalSeats;
        },
        message: 'Available seats cannot exceed total seats',
      },
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1'],
    },
    seatMap: {
      type: Map,
      of: {
        type: String,
        enum: {
          values: ['available', 'booked', 'reserved', 'unavailable', 'accessible', 'premium', 'couple', 'vip'],
          message: '{VALUE} is not a valid seat status',
        },
      },
      required: [true, 'Seat map is required'],
    },
    seatCategories: {
      standard: {
        price: {
          type: Number,
          default: 0,
        },
        available: {
          type: Number,
          default: 0,
        },
      },
      premium: {
        price: {
          type: Number,
          default: 0,
        },
        available: {
          type: Number,
          default: 0,
        },
      },
      vip: {
        price: {
          type: Number,
          default: 0,
        },
        available: {
          type: Number,
          default: 0,
        },
      },
    },
    bookedSeats: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          // Check if all booked seats are in the seat map
          if (!this.seatMap) return true;
          return v.every(seat => this.seatMap.has(seat));
        },
        message: 'All booked seats must exist in the seat map',
      },
    },
    reservedSeats: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          // Check if all reserved seats are in the seat map
          if (!this.seatMap) return true;
          return v.every(seat => this.seatMap.has(seat));
        },
        message: 'All reserved seats must exist in the seat map',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      enum: {
        values: ['2D', '3D', 'IMAX', 'IMAX 3D', 'Dolby Atmos', '4DX', 'ScreenX', 'VIP'],
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
    specialEvent: {
      type: Boolean,
      default: false,
    },
    eventDetails: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'cancelled', 'sold_out', 'almost_full', 'open'],
        message: '{VALUE} is not a valid status',
      },
      default: 'scheduled',
    },
    bookingUrl: {
      type: String,
      default: '',
    },
    bookingEnabled: {
      type: Boolean,
      default: true,
    },
    dayOfWeek: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for occupancy percentage
ShowtimeSchema.virtual('occupancyPercentage').get(function() {
  if (this.totalSeats === 0) return 0;
  return Math.round(((this.totalSeats - this.seatsAvailable) / this.totalSeats) * 100);
});

// Create virtual for duration
ShowtimeSchema.virtual('duration').get(function() {
  if (!this.startTime || !this.endTime) return 0;
  return Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
});

// Create virtual for bookings
ShowtimeSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'showtime',
  justOne: false,
});

// Create indexes for faster queries
ShowtimeSchema.index({ movie: 1, startTime: 1 });
ShowtimeSchema.index({ theater: 1, hall: 1, startTime: 1 });
ShowtimeSchema.index({ startTime: 1, isActive: 1 });
ShowtimeSchema.index({ status: 1 });

// Pre-save hook to update seatsAvailable and format display fields
ShowtimeSchema.pre('save', function(next) {
  try {
    // Update seats available
    if (this.isModified('bookedSeats') || this.isModified('reservedSeats') || this.isModified('totalSeats')) {
      this.seatsAvailable = this.totalSeats - this.bookedSeats.length - this.reservedSeats.length;

      // Update status based on availability
      if (this.seatsAvailable === 0) {
        this.status = 'sold_out';
      } else if (this.seatsAvailable <= this.totalSeats * 0.1) { // Less than 10% seats available
        this.status = 'almost_full';
      } else {
        this.status = 'open';
      }
    }

    // Format price
    if (this.isModified('price') || !this.priceFormatted) {
      this.priceFormatted = `$${this.price.toFixed(2)}`;
    }

    // Format discount price
    if (this.isModified('discountPrice') || (this.discountPrice && !this.discountPriceFormatted)) {
      this.discountPriceFormatted = this.discountPrice ? `$${this.discountPrice.toFixed(2)}` : '';
      this.hasDiscount = !!this.discountPrice && this.discountPrice < this.price;
    }

    // Format display date
    if (this.isModified('date') || !this.displayDate) {
      this.displayDate = this.date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      this.dayOfWeek = this.date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    // Format display time
    if (this.isModified('startTime') || !this.displayTime) {
      this.displayTime = this.startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find showtimes by movie
ShowtimeSchema.statics.findByMovie = function(movieId, options = {}) {
  const { startDate = new Date(), endDate, limit = 50 } = options;

  const query = {
    movie: movieId,
    startTime: { $gte: startDate },
    isActive: true,
  };

  if (endDate) {
    query.startTime.$lte = endDate;
  }

  return this.find(query)
    .sort({ startTime: 1 })
    .limit(limit)
    .populate('theater', 'name location');
};

// Static method to find showtimes by theater
ShowtimeSchema.statics.findByTheater = function(theaterId, options = {}) {
  const { startDate = new Date(), endDate, limit = 50 } = options;

  const query = {
    theater: theaterId,
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

// Static method to find showtimes by date range
ShowtimeSchema.statics.findByDateRange = function(startDate, endDate, options = {}) {
  const { limit = 100 } = options;

  return this.find({
    startTime: { $gte: startDate, $lte: endDate },
    isActive: true,
  })
    .sort({ startTime: 1 })
    .limit(limit)
    .populate('movie', 'title poster')
    .populate('theater', 'name location');
};

// Static method to find upcoming showtimes
ShowtimeSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({
    startTime: { $gte: new Date() },
    isActive: true,
  })
    .sort({ startTime: 1 })
    .limit(limit)
    .populate('movie', 'title poster')
    .populate('theater', 'name location');
};

// Method to book seats
ShowtimeSchema.methods.bookSeats = async function(seats) {
  // Check if all seats are available
  const unavailableSeats = seats.filter(seat =>
    this.bookedSeats.includes(seat) ||
    this.reservedSeats.includes(seat) ||
    !this.seatMap.has(seat) ||
    this.seatMap.get(seat) !== 'available'
  );

  if (unavailableSeats.length > 0) {
    throw new Error(`The following seats are not available: ${unavailableSeats.join(', ')}`);
  }

  // Add seats to bookedSeats
  this.bookedSeats.push(...seats);

  // Update seat map
  seats.forEach(seat => {
    this.seatMap.set(seat, 'booked');
  });

  return this.save();
};

// Method to reserve seats (temporary hold)
ShowtimeSchema.methods.reserveSeats = async function(seats, expiryMinutes = 15) {
  // Check if all seats are available
  const unavailableSeats = seats.filter(seat =>
    this.bookedSeats.includes(seat) ||
    this.reservedSeats.includes(seat) ||
    !this.seatMap.has(seat) ||
    this.seatMap.get(seat) !== 'available'
  );

  if (unavailableSeats.length > 0) {
    throw new Error(`The following seats are not available: ${unavailableSeats.join(', ')}`);
  }

  // Add seats to reservedSeats
  this.reservedSeats.push(...seats);

  // Update seat map
  seats.forEach(seat => {
    this.seatMap.set(seat, 'reserved');
  });

  await this.save();

  // Set timeout to release seats after expiry
  setTimeout(async () => {
    try {
      const showtime = await this.constructor.findById(this._id);
      if (showtime) {
        // Remove seats from reservedSeats
        showtime.reservedSeats = showtime.reservedSeats.filter(seat => !seats.includes(seat));

        // Update seat map
        seats.forEach(seat => {
          if (showtime.seatMap.get(seat) === 'reserved') {
            showtime.seatMap.set(seat, 'available');
          }
        });

        await showtime.save();
      }
    } catch (error) {
      console.error('Error releasing reserved seats:', error);
    }
  }, expiryMinutes * 60 * 1000);

  return this;
};

// Method to cancel showtime
ShowtimeSchema.methods.cancel = async function(reason) {
  this.isActive = false;
  this.status = 'cancelled';
  this.eventDetails = reason || this.eventDetails;
  return this.save();
};

module.exports = mongoose.model('Showtime', ShowtimeSchema);
