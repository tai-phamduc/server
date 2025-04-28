const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Promotion name is required'],
      trim: true,
      maxlength: [100, 'Promotion name cannot be more than 100 characters'],
      index: true,
    },
    code: {
      type: String,
      required: [true, 'Promotion code is required'],
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['percentage', 'fixed_amount', 'free_ticket', 'buy_one_get_one'],
        message: '{VALUE} is not a valid promotion type',
      },
      required: [true, 'Promotion type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Promotion value is required'],
      min: [0, 'Promotion value cannot be negative'],
    },
    maxDiscount: {
      type: Number,
      min: [0, 'Maximum discount cannot be negative'],
    },
    minPurchase: {
      type: Number,
      min: [0, 'Minimum purchase cannot be negative'],
      default: 0,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      index: true,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(v) {
          return v > this.startDate;
        },
        message: 'End date must be after start date',
      },
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    usageLimit: {
      type: Number,
      min: [0, 'Usage limit cannot be negative'],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, 'Usage count cannot be negative'],
    },
    userLimit: {
      type: Number,
      min: [0, 'User limit cannot be negative'],
      default: 1,
    },
    applicableMovies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    }],
    applicableTheaters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
    }],
    applicableShowtimes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
    }],
    excludedMovies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    }],
    excludedTheaters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
    }],
    excludedShowtimes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
    }],
    applicableDays: {
      type: [String],
      enum: {
        values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        message: '{VALUE} is not a valid day',
      },
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    image: {
      type: String,
      default: '',
    },
    termsAndConditions: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for formatted value
PromotionSchema.virtual('formattedValue').get(function() {
  if (this.type === 'percentage') {
    return `${this.value}%`;
  } else if (this.type === 'fixed_amount') {
    return `$${this.value.toFixed(2)}`;
  } else if (this.type === 'free_ticket') {
    return 'Free Ticket';
  } else if (this.type === 'buy_one_get_one') {
    return 'Buy One Get One Free';
  }
  return this.value.toString();
});

// Create virtual for status
PromotionSchema.virtual('status').get(function() {
  const now = new Date();
  
  if (!this.isActive) {
    return 'inactive';
  } else if (now < this.startDate) {
    return 'upcoming';
  } else if (now > this.endDate) {
    return 'expired';
  } else if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return 'exhausted';
  } else {
    return 'active';
  }
});

// Create virtual for remaining uses
PromotionSchema.virtual('remainingUses').get(function() {
  if (!this.usageLimit) return null;
  return Math.max(0, this.usageLimit - this.usageCount);
});

// Create virtual for usage percentage
PromotionSchema.virtual('usagePercentage').get(function() {
  if (!this.usageLimit) return 0;
  return Math.min(100, Math.round((this.usageCount / this.usageLimit) * 100));
});

// Create virtual for days remaining
PromotionSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  if (now > this.endDate) return 0;
  
  const diffTime = this.endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Create indexes for faster queries
PromotionSchema.index({ code: 1 });
PromotionSchema.index({ startDate: 1, endDate: 1 });
PromotionSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

// Pre-save hook to validate dates and ensure code is uppercase
PromotionSchema.pre('save', function(next) {
  try {
    // Ensure code is uppercase
    if (this.isModified('code')) {
      this.code = this.code.toUpperCase();
    }
    
    // Validate dates
    const now = new Date();
    if (this.endDate <= this.startDate) {
      return next(new Error('End date must be after start date'));
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find active promotions
PromotionSchema.statics.findActive = function() {
  const now = new Date();
  
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $or: [
      { usageLimit: { $exists: false } },
      { usageCount: { $lt: '$usageLimit' } }
    ]
  });
};

// Static method to find promotions by code
PromotionSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() });
};

// Static method to find applicable promotions for a booking
PromotionSchema.statics.findApplicable = function(movieId, theaterId, showtimeId, amount) {
  const now = new Date();
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    minPurchase: { $lte: amount },
    applicableDays: dayOfWeek,
    $or: [
      { usageLimit: { $exists: false } },
      { usageCount: { $lt: '$usageLimit' } },
      {
        $and: [
          { 
            $or: [
              { applicableMovies: { $size: 0 } },
              { applicableMovies: movieId }
            ]
          },
          {
            $or: [
              { applicableTheaters: { $size: 0 } },
              { applicableTheaters: theaterId }
            ]
          },
          {
            $or: [
              { applicableShowtimes: { $size: 0 } },
              { applicableShowtimes: showtimeId }
            ]
          },
          { excludedMovies: { $ne: movieId } },
          { excludedTheaters: { $ne: theaterId } },
          { excludedShowtimes: { $ne: showtimeId } }
        ]
      }
    ]
  });
};

// Method to validate if promotion is applicable
PromotionSchema.methods.isApplicable = function(movieId, theaterId, showtimeId, amount, userId) {
  const now = new Date();
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  
  // Check if promotion is active
  if (!this.isActive) return false;
  
  // Check dates
  if (now < this.startDate || now > this.endDate) return false;
  
  // Check usage limit
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false;
  
  // Check minimum purchase
  if (amount < this.minPurchase) return false;
  
  // Check applicable days
  if (!this.applicableDays.includes(dayOfWeek)) return false;
  
  // Check applicable movies
  if (this.applicableMovies.length > 0 && !this.applicableMovies.includes(movieId)) return false;
  
  // Check applicable theaters
  if (this.applicableTheaters.length > 0 && !this.applicableTheaters.includes(theaterId)) return false;
  
  // Check applicable showtimes
  if (this.applicableShowtimes.length > 0 && !this.applicableShowtimes.includes(showtimeId)) return false;
  
  // Check excluded movies
  if (this.excludedMovies.includes(movieId)) return false;
  
  // Check excluded theaters
  if (this.excludedTheaters.includes(theaterId)) return false;
  
  // Check excluded showtimes
  if (this.excludedShowtimes.includes(showtimeId)) return false;
  
  return true;
};

// Method to calculate discount amount
PromotionSchema.methods.calculateDiscount = function(amount) {
  let discount = 0;
  
  if (this.type === 'percentage') {
    discount = (amount * this.value) / 100;
    
    // Apply maximum discount if set
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else if (this.type === 'fixed_amount') {
    discount = this.value;
    
    // Discount cannot be more than the amount
    if (discount > amount) {
      discount = amount;
    }
  }
  
  return discount;
};

// Method to apply promotion
PromotionSchema.methods.apply = async function(userId) {
  // Increment usage count
  this.usageCount += 1;
  
  // Add user to usage history (if tracking per-user usage)
  // This would require adding a usageHistory array to the schema
  
  return this.save();
};

module.exports = mongoose.model('Promotion', PromotionSchema);
