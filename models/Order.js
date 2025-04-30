const mongoose = require('mongoose');

// Schema for ordered products
const OrderedProductSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative'],
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, 'Notes cannot be more than 200 characters'],
  },
}, { _id: true });

const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    cinema_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: [true, 'Cinema is required'],
      index: true,
    },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      index: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    products: [OrderedProductSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
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
    serviceFee: {
      type: Number,
      default: 0,
      min: [0, 'Service fee cannot be negative'],
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, 'Grand total cannot be negative'],
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'completed', 'failed', 'refunded'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['credit_card', 'paypal', 'stripe', 'cash', 'apple_pay', 'google_pay'],
        message: '{VALUE} is not a valid payment method',
      },
      required: [true, 'Payment method is required'],
    },
    paymentId: {
      type: String,
      trim: true,
    },
    paymentDate: {
      type: Date,
    },
    pickupTime: {
      type: Date,
    },
    pickupLocation: {
      type: String,
      trim: true,
      default: 'Concession Stand',
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
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative'],
    },
    refundReason: {
      type: String,
      trim: true,
    },
    refundDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for user
OrderSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

// Create virtual for cinema
OrderSchema.virtual('cinema', {
  ref: 'Cinema',
  localField: 'cinema_id',
  foreignField: '_id',
  justOne: true,
});

// Create virtual for booking
OrderSchema.virtual('booking', {
  ref: 'Booking',
  localField: 'booking_id',
  foreignField: '_id',
  justOne: true,
});

// Create virtual for product count
OrderSchema.virtual('productCount').get(function() {
  return this.products.reduce((total, product) => total + product.quantity, 0);
});

// Create indexes for faster queries
OrderSchema.index({ user_id: 1, orderDate: -1 });
OrderSchema.index({ cinema_id: 1, orderDate: -1 });
OrderSchema.index({ booking_id: 1 });
OrderSchema.index({ orderStatus: 1, paymentStatus: 1 });
OrderSchema.index({ orderDate: -1 });

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  try {
    // Generate order number if it doesn't exist
    if (!this.orderNumber) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      this.orderNumber = `ORD${dateStr}${randomStr}`;
    }

    // Calculate grand total
    if (this.isModified('products') || this.isModified('discount') || this.isModified('tax') || this.isModified('serviceFee')) {
      // Calculate total amount from products
      this.totalAmount = this.products.reduce((total, product) => total + product.subtotal, 0);
      
      // Calculate grand total
      this.grandTotal = this.totalAmount + this.tax + this.serviceFee - this.discount;
    }

    // Set customer info from user if not provided
    if (this.isModified('user_id') && (!this.customerName || !this.customerEmail)) {
      const User = mongoose.model('User');
      const user = await User.findById(this.user_id);
      
      if (user) {
        this.customerName = this.customerName || user.name;
        this.customerEmail = this.customerEmail || user.email;
        this.customerPhone = this.customerPhone || user.phone;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find orders by user
OrderSchema.statics.findByUser = function(userId) {
  return this.find({ user_id: userId })
    .sort({ orderDate: -1 })
    .populate('cinema', 'name location');
};

// Static method to find orders by cinema
OrderSchema.statics.findByCinema = function(cinemaId) {
  return this.find({ cinema_id: cinemaId })
    .sort({ orderDate: -1 });
};

// Static method to find orders by booking
OrderSchema.statics.findByBooking = function(bookingId) {
  return this.find({ booking_id: bookingId })
    .sort({ orderDate: -1 });
};

// Static method to find orders by status
OrderSchema.statics.findByStatus = function(status) {
  return this.find({ orderStatus: status })
    .sort({ orderDate: -1 });
};

// Static method to find recent orders
OrderSchema.statics.findRecent = function(limit = 10) {
  return this.find()
    .sort({ orderDate: -1 })
    .limit(limit)
    .populate('user', 'name email')
    .populate('cinema', 'name');
};

// Method to cancel order
OrderSchema.methods.cancel = async function(reason) {
  if (this.orderStatus === 'cancelled') {
    throw new Error('Order is already cancelled');
  }
  
  if (this.orderStatus === 'delivered') {
    throw new Error('Cannot cancel a delivered order');
  }
  
  this.orderStatus = 'cancelled';
  this.notes = reason || this.notes;
  
  if (this.paymentStatus === 'completed') {
    this.refundAmount = this.grandTotal;
    this.refundReason = reason || 'Order cancelled';
    this.refundDate = new Date();
    this.paymentStatus = 'refunded';
  }
  
  return this.save();
};

// Method to update status
OrderSchema.methods.updateStatus = async function(status) {
  if (this.orderStatus === 'cancelled') {
    throw new Error('Cannot update a cancelled order');
  }
  
  this.orderStatus = status;
  
  if (status === 'confirmed' && this.paymentStatus === 'pending') {
    this.paymentStatus = 'completed';
    this.paymentDate = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model('Order', OrderSchema);
