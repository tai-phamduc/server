const mongoose = require('mongoose');

// Schema for booked seats - optimized for better querying and validation
const BookedSeatSchema = new mongoose.Schema({
  seat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  row: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // Standardize row letters to uppercase
  },
  column: {
    type: Number,
    required: true,
    min: [1, 'Column number must be positive']
  },
  seatNumber: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: {
      values: ['standard', 'premium', 'vip', 'couple', 'accessible'],
      message: '{VALUE} is not a valid seat type'
    },
    default: 'standard',
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  isAccessible: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    enum: ['front', 'middle', 'back', 'left', 'right', 'center'],
    default: 'middle'
  }
}, { _id: true }); // Changed to true to allow direct referencing

// Schema for concession items - optimized for better tracking and customization
const ConcessionItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [20, 'Maximum quantity per item is 20']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  },
  options: [{
    name: {
      type: String,
      trim: true
    },
    value: {
      type: String,
      trim: true
    },
    priceAdjustment: {
      type: Number,
      default: 0
    }
  }],
  category: {
    type: String,
    trim: true,
    enum: ['food', 'beverage', 'combo', 'merchandise', 'other'],
    default: 'food'
  },
  isCombo: {
    type: Boolean,
    default: false
  }
}, { _id: true }); // Changed to true to allow direct referencing

// Schema for refund details - optimized for better tracking and reporting
const RefundDetailsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: [0, 'Refund amount cannot be negative'],
  },
  percentage: {
    type: Number,
    required: true,
    min: [0, 'Refund percentage cannot be negative'],
    max: [100, 'Refund percentage cannot exceed 100'],
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    enum: {
      values: [
        'customer_request',
        'screening_cancelled',
        'technical_issues',
        'double_booking',
        'schedule_change',
        'service_issue',
        'payment_error',
        'medical_emergency',
        'weather_conditions',
        'other'
      ],
      message: '{VALUE} is not a valid refund reason',
    },
    index: true
  },
  reasonDetails: {
    type: String,
    trim: true,
    maxlength: [500, 'Reason details cannot be more than 500 characters']
  },
  requestDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  processedDate: {
    type: Date,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'completed', 'failed', 'cancelled'],
      message: '{VALUE} is not a valid refund status',
    },
    default: 'pending',
    index: true
  },
  transactionId: {
    type: String,
    trim: true,
    index: true
  },
  paymentMethod: {
    type: String,
    // enum: {
    //   values: ['original_payment', 'credit', 'bank_transfer', 'store_credit', 'gift_card', 'other'],
    //   message: '{VALUE} is not a valid refund payment method',
    // },
    default: 'original_payment'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  refundedItems: {
    tickets: {
      count: {
        type: Number,
        default: 0,
        min: [0, 'Ticket count cannot be negative']
      },
      amount: {
        type: Number,
        default: 0,
        min: [0, 'Ticket amount cannot be negative']
      }
    },
    concessions: {
      count: {
        type: Number,
        default: 0,
        min: [0, 'Concession count cannot be negative']
      },
      amount: {
        type: Number,
        default: 0,
        min: [0, 'Concession amount cannot be negative']
      }
    },
    fees: {
      amount: {
        type: Number,
        default: 0,
        min: [0, 'Fee amount cannot be negative']
      }
    }
  },
  isPartial: {
    type: Boolean,
    default: false
  },
  customerNotified: {
    type: Boolean,
    default: false
  },
  customerNotifiedAt: {
    type: Date
  }
}, { _id: true, timestamps: true });

const BookingSchema = new mongoose.Schema(
  {
    // User and session information - optimized field names for consistency
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
    screening: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screening',
      required: [true, 'Screening is required'],
      index: true,
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: [true, 'Cinema is required'],
      index: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required'],
      index: true,
    },
    roomName: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    screeningDate: {
      type: Date,
      required: [true, 'Screening date is required'],
      index: true,
    },
    screeningTime: {
      type: String,
      required: [true, 'Screening time is required'],
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
    bookedSeats: [BookedSeatSchema],
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
      couple: {
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
      accessible: {
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
    concessionItems: [ConcessionItemSchema],
    concessionTotal: {
      type: Number,
      default: 0,
      min: [0, 'Concession total cannot be negative'],
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
        values: ['credit_card', 'paypal', 'cash', 'stripe', 'apple_pay', 'google_pay', 'venmo'],
        message: '{VALUE} is not a valid payment method',
      },
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
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
    paymentDetails: {
      cardType: {
        type: String,
        trim: true,
      },
      lastFourDigits: {
        type: String,
        trim: true,
      },
      expiryDate: {
        type: String,
        trim: true,
      },
      billingAddress: {
        type: String,
        trim: true,
      },
    },
    bookingStatus: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled', 'completed', 'expired', 'refunded'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'pending',
      index: true,
    },
    cancellationDate: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    refunds: [RefundDetailsSchema],
    refundEligibility: {
      isEligible: {
        type: Boolean,
        default: true,
      },
      eligibleUntil: {
        type: Date,
      },
      maxRefundPercentage: {
        type: Number,
        default: 100,
        min: [0, 'Max refund percentage cannot be negative'],
        max: [100, 'Max refund percentage cannot exceed 100'],
      },
      reason: {
        type: String,
        trim: true,
      },
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
    discountCode: {
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
    version: {
      type: Number,
      default: 1,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    bookingSource: {
      type: String,
      enum: {
        values: ['web', 'mobile_app', 'kiosk', 'box_office', 'third_party'],
        message: '{VALUE} is not a valid booking source',
      },
      default: 'web',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for payment with options
BookingSchema.virtual('payment', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'booking',
  justOne: true,
  options: { sort: { createdAt: -1 } }
});

// Create virtual for net amount
BookingSchema.virtual('netAmount').get(function() {
  return this.totalPrice - this.discount;
});

// Create virtual for seat count
BookingSchema.virtual('seatCount').get(function() {
  return this.seats.length;
});

// Create virtual for refund status
BookingSchema.virtual('refundStatus').get(function() {
  if (!this.refunds || this.refunds.length === 0) {
    return 'none';
  }

  const latestRefund = this.refunds.sort((a, b) =>
    b.requestDate.getTime() - a.requestDate.getTime()
  )[0];

  return latestRefund.status;
});

// Create virtual for total refunded amount
BookingSchema.virtual('totalRefundedAmount').get(function() {
  if (!this.refunds || this.refunds.length === 0) {
    return 0;
  }

  return this.refunds
    .filter(refund => refund.status === 'completed')
    .reduce((total, refund) => total + refund.amount, 0);
});

// Create virtual for remaining balance
BookingSchema.virtual('remainingBalance').get(function() {
  const refundedAmount = this.totalRefundedAmount || 0;
  return Math.max(0, this.totalPrice - refundedAmount);
});

// Create indexes for faster queries - optimized for common access patterns
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ movie: 1, screening: 1 });
BookingSchema.index({ bookingDate: -1 });
BookingSchema.index({ bookingStatus: 1, paymentStatus: 1 });
BookingSchema.index({ bookingNumber: 1 }, { unique: true });
BookingSchema.index({ 'refunds.status': 1, bookingStatus: 1 });
BookingSchema.index({ screeningDate: 1, cinema: 1 });
BookingSchema.index({ isCheckedIn: 1, screeningDate: 1 });

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
    if (this.isModified('screening') && !this.expireAt && this.screening) {
      // Get the screening document to set expiration
      const Screening = mongoose.model('Screening');
      const screeningDoc = await Screening.findById(this.screening);

      if (screeningDoc) {
        // Set expiration to 2 hours after screening ends
        const endTime = new Date(screeningDoc.end_time ||
          (new Date(screeningDoc.start_time).getTime() + 2 * 60 * 60 * 1000)); // Default 2 hours after start
        this.expireAt = new Date(endTime.getTime() + 2 * 60 * 60 * 1000);

        // Set screening date and display
        this.screeningDate = screeningDoc.start_time;
        this.screeningTime = new Date(screeningDoc.start_time).toLocaleTimeString('en-US', {
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

    // Set movie and cinema info if not provided
    if (this.isModified('movie') && !this.movieTitle) {
      const Movie = mongoose.model('Movie');
      const movieDoc = await Movie.findById(this.movie);

      if (movieDoc) {
        this.movieTitle = movieDoc.title;
        this.moviePoster = movieDoc.poster;
      }
    }

    if (this.isModified('cinema') && !this.cinemaName) {
      const Cinema = mongoose.model('Cinema');
      const cinemaDoc = await Cinema.findById(this.cinema);

      if (cinemaDoc) {
        this.cinemaName = cinemaDoc.name;
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

// Static method to find bookings by user with pagination
BookingSchema.statics.findByUser = function(userId, page = 1, limit = 10, status = null) {
  const skip = (page - 1) * limit;
  const query = { user: userId };

  // Add status filter if provided
  if (status) {
    query.bookingStatus = status;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('movie', 'title poster slug')
    .populate('screening', 'date startTime endTime')
    .populate('cinema', 'name location')
    .select('-notes -ipAddress -userAgent'); // Exclude unnecessary fields
};

// Static method to find bookings by movie with pagination
BookingSchema.statics.findByMovie = function(movieId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({
    movie: movieId,
    bookingStatus: { $in: ['confirmed', 'completed'] } // Only include valid bookings
  })
    .sort({ screeningDate: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('bookingNumber screeningDate screeningTime seats totalPrice bookingStatus');
};

// Static method to find bookings by status with pagination
BookingSchema.statics.findByStatus = function(status, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ bookingStatus: status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate('movie', 'title poster')
    .populate('cinema', 'name');
};

// Static method to find bookings by payment status with pagination
BookingSchema.statics.findByPaymentStatus = function(status, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ paymentStatus: status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate('movie', 'title')
    .select('bookingNumber totalPrice paymentMethod bookingDate');
};

// Static method to find recent bookings with better population
BookingSchema.statics.findRecent = function(limit = 10) {
  return this.find({
    bookingStatus: { $in: ['confirmed', 'completed'] }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email profilePicture')
    .populate('movie', 'title poster slug')
    .populate('cinema', 'name location')
    .select('bookingNumber screeningDate screeningTime seats totalPrice bookingStatus');
};

// Static method to find bookings by date range
BookingSchema.statics.findByDateRange = function(startDate, endDate, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  return this.find({
    bookingDate: { $gte: startDate, $lte: endDate }
  })
    .sort({ bookingDate: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to find bookings by cinema
BookingSchema.statics.findByCinema = function(cinemaId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ cinema: cinemaId })
    .sort({ screeningDate: 1, screeningTime: 1 })
    .skip(skip)
    .limit(limit)
    .populate('movie', 'title poster')
    .populate('user', 'name');
};

// Static method to find bookings with refunds
BookingSchema.statics.findWithRefunds = function(status = null, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const query = { 'refunds.0': { $exists: true } };

  if (status) {
    query['refunds.status'] = status;
  }

  return this.find(query)
    .sort({ 'refunds.requestDate': -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate('movie', 'title');
};

// Method to cancel booking - optimized with better refund handling
BookingSchema.methods.cancelBooking = async function(reason, refundAmount, refundPercentage, processedBy = null) {
  // Update booking status
  this.bookingStatus = 'cancelled';
  this.cancellationDate = new Date();
  this.notes = reason || this.notes;

  // Create a refund record if amount is specified
  if (refundAmount > 0) {
    // Validate refund amount doesn't exceed total price
    if (refundAmount > this.totalPrice) {
      throw new Error('Refund amount cannot exceed total booking price');
    }

    // Create new refund record
    const refund = {
      amount: refundAmount,
      percentage: refundPercentage || Math.round((refundAmount / this.totalPrice) * 100),
      reason: 'customer_request',
      reasonDetails: reason,
      requestDate: new Date(),
      status: 'pending'
    };

    // Add processor information if available
    if (processedBy) {
      refund.processedBy = processedBy;
      refund.processedDate = new Date();
      refund.status = 'approved';
    }

    // Add refund to the refunds array
    if (!this.refunds) this.refunds = [];
    this.refunds.push(refund);

    // Update payment status if payment was completed
    if (this.paymentStatus === 'completed') {
      this.paymentStatus = 'refund_pending';
    }
  }

  // Release the seats back to inventory
  // This would typically involve updating the Screening model
  // We'll implement this in a post-save hook or separate method

  return this.save();
};

// Method to process refund
BookingSchema.methods.processRefund = async function(refundId, status, processedBy, transactionId = null) {
  // Find the refund by ID
  if (!this.refunds || this.refunds.length === 0) {
    throw new Error('No refunds found for this booking');
  }

  const refundIndex = this.refunds.findIndex(r => r._id.toString() === refundId);

  if (refundIndex === -1) {
    throw new Error('Refund not found');
  }

  // Update the refund
  this.refunds[refundIndex].status = status;
  this.refunds[refundIndex].processedBy = processedBy;
  this.refunds[refundIndex].processedDate = new Date();

  if (transactionId) {
    this.refunds[refundIndex].transactionId = transactionId;
  }

  // Update payment status based on refund status
  if (status === 'completed') {
    this.paymentStatus = 'refunded';
  } else if (status === 'rejected') {
    this.paymentStatus = 'completed';
  }

  return this.save();
};

// Method to complete booking (check-in)
BookingSchema.methods.checkIn = async function(checkedInBy = null) {
  if (this.isCheckedIn) {
    throw new Error('Booking already checked in');
  }

  // Validate that the screening hasn't passed
  const now = new Date();
  if (this.screeningDate < now) {
    // Allow check-in up to 30 minutes after screening start
    const screeningTime = new Date(this.screeningDate);
    const thirtyMinutesAfterStart = new Date(screeningTime.getTime() + 30 * 60000);

    if (now > thirtyMinutesAfterStart) {
      throw new Error('Cannot check in after screening has ended');
    }
  }

  this.isCheckedIn = true;
  this.checkedInAt = now;
  this.bookingStatus = 'completed';

  if (checkedInBy) {
    this.checkedInBy = checkedInBy;
  }

  return this.save();
};

// Method to generate QR code
BookingSchema.methods.generateQRCode = async function() {
  // Create a data string with booking details for the QR code
  const qrData = JSON.stringify({
    id: this._id.toString(),
    number: this.bookingNumber,
    seats: this.seats,
    movie: this.movieTitle,
    date: this.screeningDate,
    cinema: this.cinemaName,
    room: this.room
  });

  // Generate QR code URL (in a real implementation, you might use a QR code library)
  this.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

  // Generate barcode URL as well
  this.barcodeUrl = `https://barcodeapi.org/api/128/${this.bookingNumber}`;

  return this.save();
};

module.exports = mongoose.model('Booking', BookingSchema);
