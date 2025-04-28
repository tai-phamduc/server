const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    amountFormatted: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    currencySymbol: {
      type: String,
      default: '$',
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['credit_card', 'paypal', 'stripe', 'cash', 'apple_pay', 'google_pay'],
        message: '{VALUE} is not a valid payment method',
      },
      required: true,
    },
    paymentMethodDisplay: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
      index: true,
    },
    paymentStatusDisplay: {
      type: String,
      trim: true,
    },
    paymentIntentId: {
      type: String,
      trim: true,
      index: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paymentDateFormatted: {
      type: String,
      trim: true,
    },
    transactionId: {
      type: String,
      trim: true,
      index: true,
    },
    transactionFee: {
      type: Number,
      default: 0,
      min: [0, 'Transaction fee cannot be negative'],
    },
    transactionFeeFormatted: {
      type: String,
      trim: true,
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative'],
    },
    refundAmountFormatted: {
      type: String,
      trim: true,
    },
    refundDate: {
      type: Date,
    },
    refundDateFormatted: {
      type: String,
      trim: true,
    },
    refundReason: {
      type: String,
      trim: true,
    },
    refundTransactionId: {
      type: String,
      trim: true,
    },
    billingDetails: {
      name: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        line1: {
          type: String,
          trim: true,
        },
        line2: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        postalCode: {
          type: String,
          trim: true,
        },
        country: {
          type: String,
          trim: true,
          default: 'USA',
        },
      },
    },
    cardDetails: {
      brand: {
        type: String,
        trim: true,
      },
      last4: {
        type: String,
        trim: true,
      },
      expiryMonth: {
        type: String,
        trim: true,
      },
      expiryYear: {
        type: String,
        trim: true,
      },
      cardholderName: {
        type: String,
        trim: true,
      },
    },
    receiptUrl: {
      type: String,
      trim: true,
    },
    receiptNumber: {
      type: String,
      trim: true,
    },
    invoiceUrl: {
      type: String,
      trim: true,
    },
    invoiceNumber: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Object,
    },
    notes: {
      type: String,
      trim: true,
    },
    isTest: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create indexes for faster queries
PaymentSchema.index({ booking: 1, paymentStatus: 1 });
PaymentSchema.index({ user: 1, paymentDate: -1 });
PaymentSchema.index({ paymentDate: -1 });
PaymentSchema.index({ paymentStatus: 1, paymentDate: -1 });

// Pre-save hook to format display fields
PaymentSchema.pre('save', function(next) {
  try {
    // Format amount
    if (this.isModified('amount') || !this.amountFormatted) {
      this.amountFormatted = `${this.currencySymbol}${this.amount.toFixed(2)}`;
    }

    // Format transaction fee
    if (this.isModified('transactionFee') || !this.transactionFeeFormatted) {
      this.transactionFeeFormatted = `${this.currencySymbol}${this.transactionFee.toFixed(2)}`;
    }

    // Format refund amount
    if (this.isModified('refundAmount') || !this.refundAmountFormatted) {
      this.refundAmountFormatted = `${this.currencySymbol}${this.refundAmount.toFixed(2)}`;
    }

    // Format payment date
    if (this.isModified('paymentDate') || !this.paymentDateFormatted) {
      this.paymentDateFormatted = new Date(this.paymentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Format refund date
    if (this.refundDate && (this.isModified('refundDate') || !this.refundDateFormatted)) {
      this.refundDateFormatted = new Date(this.refundDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Format payment method display
    if (this.isModified('paymentMethod') || !this.paymentMethodDisplay) {
      const methodMap = {
        'credit_card': 'Credit Card',
        'paypal': 'PayPal',
        'stripe': 'Stripe',
        'cash': 'Cash',
        'apple_pay': 'Apple Pay',
        'google_pay': 'Google Pay'
      };

      this.paymentMethodDisplay = methodMap[this.paymentMethod] || this.paymentMethod;
    }

    // Format payment status display
    if (this.isModified('paymentStatus') || !this.paymentStatusDisplay) {
      const statusMap = {
        'pending': 'Pending',
        'processing': 'Processing',
        'completed': 'Completed',
        'failed': 'Failed',
        'refunded': 'Refunded',
        'partially_refunded': 'Partially Refunded',
        'cancelled': 'Cancelled'
      };

      this.paymentStatusDisplay = statusMap[this.paymentStatus] || this.paymentStatus;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Post-save hook to update booking payment status
PaymentSchema.post('save', async function() {
  try {
    if (this.booking) {
      const Booking = mongoose.model('Booking');
      const booking = await Booking.findById(this.booking);

      if (booking && booking.paymentStatus !== this.paymentStatus) {
        booking.paymentStatus = this.paymentStatus;
        booking.paymentDate = this.paymentDate;
        booking.paymentId = this.paymentIntentId || this.transactionId;

        // Update booking status based on payment status
        if (this.paymentStatus === 'completed') {
          booking.bookingStatus = 'confirmed';
        } else if (this.paymentStatus === 'refunded') {
          booking.bookingStatus = 'cancelled';
        }

        await booking.save();
      }
    }
  } catch (error) {
    console.error('Error updating booking payment status:', error);
  }
});

// Static method to find payments by user
PaymentSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId })
    .sort({ paymentDate: -1 })
    .populate('booking');
};

// Static method to find payments by booking
PaymentSchema.statics.findByBooking = function(bookingId) {
  return this.find({ booking: bookingId })
    .sort({ paymentDate: -1 });
};

// Static method to find payments by status
PaymentSchema.statics.findByStatus = function(status) {
  return this.find({ paymentStatus: status })
    .sort({ paymentDate: -1 });
};

// Static method to find recent payments
PaymentSchema.statics.findRecent = function(limit = 10) {
  return this.find()
    .sort({ paymentDate: -1 })
    .limit(limit)
    .populate('user', 'name email')
    .populate('booking');
};

// Method to process refund
PaymentSchema.methods.processRefund = async function(amount, reason) {
  // Validate refund amount
  if (amount > this.amount) {
    throw new Error('Refund amount cannot exceed payment amount');
  }

  // Set refund details
  this.refundAmount = amount;
  this.refundDate = new Date();
  this.refundReason = reason;

  // Update payment status
  if (amount === this.amount) {
    this.paymentStatus = 'refunded';
  } else if (amount > 0) {
    this.paymentStatus = 'partially_refunded';
  }

  return this.save();
};

module.exports = mongoose.model('Payment', PaymentSchema);
