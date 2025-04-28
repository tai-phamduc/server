const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie is required'],
      index: true,
    },
    movieTitle: {
      type: String,
      trim: true,
    },
    moviePoster: {
      type: String,
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: [true, 'Showtime is required'],
      index: true,
    },
    showtimeDate: {
      type: Date,
    },
    showtimeDisplay: {
      type: String,
      trim: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: [true, 'Theater is required'],
    },
    theaterName: {
      type: String,
      trim: true,
    },
    hall: {
      type: String,
      required: [true, 'Hall is required'],
      trim: true,
    },
    seats: {
      type: [String],
      required: [true, 'At least one seat is required'],
      validate: {
        validator: function(v) {
          return v.length > 0 && v.length <= 10; // At least 1 seat, max 10 seats
        },
        message: 'Please select between 1 and 10 seats',
      },
    },
    seatsDisplay: {
      type: String,
      trim: true,
    },
    seatCategories: {
      standard: {
        count: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
      premium: {
        count: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
      vip: {
        count: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
    totalPriceFormatted: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['credit_card', 'paypal', 'cash', 'stripe', 'apple_pay', 'google_pay'],
        message: '{VALUE} is not a valid payment method',
      },
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
      index: true,
    },
    paymentDate: {
      type: Date,
    },
    paymentId: {
      type: String,
      trim: true,
    },
    bookingStatus: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled', 'completed', 'expired'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'pending',
      index: true,
    },
    cancellationDate: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative'],
    },
    refundPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Refund percentage cannot be negative'],
      max: [100, 'Refund percentage cannot exceed 100'],
    },
    refundStatus: {
      type: String,
      enum: {
        values: ['not_applicable', 'pending', 'completed', 'failed', 'manual_required'],
        message: '{VALUE} is not a valid refund status',
      },
      default: 'not_applicable',
    },
    refundTransactionId: {
      type: String,
      trim: true,
    },
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    bookingDateFormatted: {
      type: String,
      trim: true,
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative'],
    },
    ticketPriceFormatted: {
      type: String,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    discountFormatted: {
      type: String,
      trim: true,
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    taxFormatted: {
      type: String,
      trim: true,
    },
    serviceFee: {
      type: Number,
      default: 0,
      min: [0, 'Service fee cannot be negative'],
    },
    serviceFeeFormatted: {
      type: String,
      trim: true,
    },
    qrCode: {
      type: String,
      default: '',
    },
    barcodeUrl: {
      type: String,
      default: '',
    },
    isCheckedIn: {
      type: Boolean,
      default: false,
    },
    checkedInAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    customerName: {
      type: String,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      trim: true,
    },
    format: {
      type: String,
      default: '2D',
      trim: true,
    },
    expireAt: {
      type: Date,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderSentAt: {
      type: Date,
    },
    cancellationDate: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative'],
    },
    refundPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Refund percentage cannot be negative'],
      max: [100, 'Refund percentage cannot exceed 100'],
    },
    refundStatus: {
      type: String,
      enum: {
        values: ['not_applicable', 'pending', 'completed', 'failed', 'manual_required'],
        message: '{VALUE} is not a valid refund status',
      },
      default: 'not_applicable',
    },
    refundTransactionId: {
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

// Create virtual for payment
BookingSchema.virtual('payment', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'booking',
  justOne: true,
});

// Create virtual for net amount
BookingSchema.virtual('netAmount').get(function() {
  return this.totalPrice - this.discount;
});

// Create virtual for seat count
BookingSchema.virtual('seatCount').get(function() {
  return this.seats.length;
});

// Create indexes for faster queries
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ movie: 1, showtime: 1 });
BookingSchema.index({ bookingDate: -1 });
BookingSchema.index({ bookingStatus: 1, paymentStatus: 1 });

// Generate a unique booking number and format display fields before saving
BookingSchema.pre('save', async function (next) {
  try {
    // Generate booking number if not set
    if (!this.bookingNumber) {
      // Generate a random booking number with format: BK-YYYYMMDD-XXXXX
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
      this.bookingNumber = `BK-${dateStr}-${randomNum}`;
    }

    // Set booking date if not set
    if (!this.bookingDate) {
      this.bookingDate = Date.now();
    }

    // Format booking date
    if (this.isModified('bookingDate') || !this.bookingDateFormatted) {
      this.bookingDateFormatted = new Date(this.bookingDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Format price fields
    if (this.isModified('totalPrice') || !this.totalPriceFormatted) {
      this.totalPriceFormatted = `$${this.totalPrice.toFixed(2)}`;
    }

    if (this.isModified('ticketPrice') || !this.ticketPriceFormatted) {
      this.ticketPriceFormatted = `$${this.ticketPrice.toFixed(2)}`;
    }

    if (this.isModified('discount') || !this.discountFormatted) {
      this.discountFormatted = `$${this.discount.toFixed(2)}`;
    }

    if (this.isModified('tax') || !this.taxFormatted) {
      this.taxFormatted = `$${this.tax.toFixed(2)}`;
    }

    if (this.isModified('serviceFee') || !this.serviceFeeFormatted) {
      this.serviceFeeFormatted = `$${this.serviceFee.toFixed(2)}`;
    }

    // Format seats display
    if (this.isModified('seats') || !this.seatsDisplay) {
      this.seatsDisplay = this.seats.join(', ');
    }

    // Set expiration date if not set (for tickets)
    if (this.isModified('showtime') && !this.expireAt && this.showtime) {
      // Get the showtime document to set expiration
      const Showtime = mongoose.model('Showtime');
      const showtimeDoc = await Showtime.findById(this.showtime);

      if (showtimeDoc) {
        // Set expiration to 2 hours after showtime ends
        this.expireAt = new Date(showtimeDoc.endTime.getTime() + 2 * 60 * 60 * 1000);

        // Set showtime date and display
        this.showtimeDate = showtimeDoc.startTime;
        this.showtimeDisplay = showtimeDoc.displayTime ||
          showtimeDoc.startTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
      }
    }

    // Set customer info from user if not provided
    if (this.isModified('user') && (!this.customerName || !this.customerEmail)) {
      const User = mongoose.model('User');
      const userDoc = await User.findById(this.user);

      if (userDoc) {
        this.customerName = this.customerName || userDoc.name;
        this.customerEmail = this.customerEmail || userDoc.email;
        this.customerPhone = this.customerPhone || userDoc.phone;
      }
    }

    // Set movie and theater info if not provided
    if (this.isModified('movie') && !this.movieTitle) {
      const Movie = mongoose.model('Movie');
      const movieDoc = await Movie.findById(this.movie);

      if (movieDoc) {
        this.movieTitle = movieDoc.title;
        this.moviePoster = movieDoc.poster;
      }
    }

    if (this.isModified('theater') && !this.theaterName) {
      const Theater = mongoose.model('Theater');
      const theaterDoc = await Theater.findById(this.theater);

      if (theaterDoc) {
        this.theaterName = theaterDoc.name;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Update movie and showtime when booking is confirmed
BookingSchema.post('save', async function() {
  try {
    if (this.bookingStatus === 'confirmed' && this.paymentStatus === 'completed') {
      // You could update movie statistics, showtime seat availability, etc.
      // This would be implemented based on your specific requirements
    }
  } catch (error) {
    console.error('Error in booking post-save hook:', error);
  }
});

// Static method to find bookings by user
BookingSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('movie', 'title poster')
    .populate('showtime')
    .populate('theater', 'name location');
};

// Static method to find bookings by movie
BookingSchema.statics.findByMovie = function(movieId) {
  return this.find({ movie: movieId })
    .sort({ createdAt: -1 });
};

// Static method to find bookings by status
BookingSchema.statics.findByStatus = function(status) {
  return this.find({ bookingStatus: status })
    .sort({ createdAt: -1 });
};

// Static method to find bookings by payment status
BookingSchema.statics.findByPaymentStatus = function(status) {
  return this.find({ paymentStatus: status })
    .sort({ createdAt: -1 });
};

// Static method to find recent bookings
BookingSchema.statics.findRecent = function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email')
    .populate('movie', 'title')
    .populate('showtime')
    .populate('theater', 'name');
};

// Method to cancel booking
BookingSchema.methods.cancelBooking = async function(reason, refundAmount, refundPercentage) {
  this.bookingStatus = 'cancelled';
  this.cancellationDate = new Date();
  this.notes = reason || this.notes;

  if (refundAmount > 0) {
    this.refundAmount = refundAmount;
    this.refundPercentage = refundPercentage;
    this.refundStatus = 'pending';

    if (this.paymentStatus === 'completed') {
      this.paymentStatus = 'refunded';
    }
  }

  return this.save();
};

// Method to complete booking (check-in)
BookingSchema.methods.checkIn = async function() {
  this.isCheckedIn = true;
  this.checkedInAt = Date.now();
  this.bookingStatus = 'completed';
  return this.save();
};

// Method to generate QR code
BookingSchema.methods.generateQRCode = async function() {
  // This would typically use a QR code generation library
  // For now, we'll just set a placeholder
  this.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${this.bookingNumber}`;
  return this.save();
};

module.exports = mongoose.model('Booking', BookingSchema);
