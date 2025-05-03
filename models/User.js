const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Schema for viewing history - optimized to store only essential data
const ViewingHistorySchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
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
  viewDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
  },
  hasReviewed: {
    type: Boolean,
    default: false,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  cinema: {
    type: String,
    trim: true,
  },
  format: {
    type: String,
    trim: true,
  },
}, { _id: true, timestamps: true });

// Schema for notification preferences
const NotificationPreferencesSchema = new mongoose.Schema({
  email: {
    bookingConfirmation: {
      type: Boolean,
      default: true,
    },
    bookingReminder: {
      type: Boolean,
      default: true,
    },
    specialOffers: {
      type: Boolean,
      default: true,
    },
    newsletter: {
      type: Boolean,
      default: true,
    },
    newReleases: {
      type: Boolean,
      default: true,
    },
    accountUpdates: {
      type: Boolean,
      default: true,
    },
  },
  sms: {
    bookingConfirmation: {
      type: Boolean,
      default: false,
    },
    bookingReminder: {
      type: Boolean,
      default: false,
    },
    specialOffers: {
      type: Boolean,
      default: false,
    },
  },
  push: {
    bookingConfirmation: {
      type: Boolean,
      default: true,
    },
    bookingReminder: {
      type: Boolean,
      default: true,
    },
    specialOffers: {
      type: Boolean,
      default: false,
    },
    newReleases: {
      type: Boolean,
      default: false,
    },
  },
  reminderTime: {
    type: Number,
    default: 24, // Default: 24 hours before showtime
    min: [1, 'Reminder time must be at least 1 hour'],
    max: [48, 'Reminder time cannot be more than 48 hours'],
  },
}, { _id: false });

// Schema for payment methods - optimized for security and performance
const PaymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: {
      values: ['credit_card', 'paypal', 'apple_pay', 'google_pay', 'venmo'],
      message: '{VALUE} is not a valid payment method type',
    },
    required: true,
    index: true
  },
  isDefault: {
    type: Boolean,
    default: false,
    index: true
  },
  cardType: {
    type: String,
    trim: true,
  },
  lastFourDigits: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^\d{4}$/.test(v);
      },
      message: 'Last four digits must be exactly 4 digits'
    }
  },
  expiryDate: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^(0[1-9]|1[0-2])\/\d{2}$/.test(v);
      },
      message: 'Expiry date must be in MM/YY format'
    }
  },
  cardholderName: {
    type: String,
    trim: true,
  },
  billingAddress: {
    street: {
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
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'USA'
    },
  },
  paymentToken: {
    type: String,
    trim: true,
    select: false, // Don't return token by default in queries
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true, timestamps: true });

const UserSchema = new mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin', 'editor', 'moderator'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
      index: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    phone: {
      type: String,
      default: '',
      validate: {
        validator: function(v) {
          // Allow empty string or valid phone number
          return v === '' || validator.isMobilePhone(v);
        },
        message: 'Please provide a valid phone number',
      },
    },
    // User address information
    address: {
      street: {
        type: String,
        default: '',
        trim: true,
      },
      city: {
        type: String,
        default: '',
        trim: true,
      },
      state: {
        type: String,
        default: '',
        trim: true,
      },
      zipCode: {
        type: String,
        default: '',
        trim: true,
      },
      country: {
        type: String,
        default: 'USA',
        trim: true,
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
        }
      },
    },
    preferences: {
      favoriteGenres: {
        type: [String],
        default: [],
        validate: {
          validator: function(v) {
            return v.length <= 10; // Limit to 10 favorite genres
          },
          message: 'You can only have up to 10 favorite genres',
        },
      },
      favoriteActors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
      }],
      favoriteDirectors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director',
      }],
      favoriteCinemas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cinema',
      }],
      preferredSeatingArea: {
        type: String,
        enum: {
          values: ['front', 'middle', 'back', 'no_preference'],
          default: 'no_preference',
        },
      },
      preferredShowtimePeriod: {
        type: String,
        enum: {
          values: ['morning', 'afternoon', 'evening', 'night', 'no_preference'],
          default: 'no_preference',
        },
      },
      preferredFormat: {
        type: String,
        enum: {
          values: ['2D', '3D', 'IMAX', 'no_preference'],
          default: 'no_preference',
        },
      },
      language: {
        type: String,
        default: 'en',
      },
      theme: {
        type: String,
        enum: {
          values: ['light', 'dark', 'system'],
          message: '{VALUE} is not a valid theme',
        },
        default: 'system',
      },
      concessionPreferences: {
        type: [String],
        default: [],
      },
    },
    notificationPreferences: NotificationPreferencesSchema,
    socialMedia: {
      facebook: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
      instagram: {
        type: String,
        default: '',
      },
      pinterest: {
        type: String,
        default: '',
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    loginHistory: [{
      date: {
        type: Date,
        default: Date.now,
      },
      ipAddress: {
        type: String,
        trim: true,
      },
      device: {
        type: String,
        trim: true,
      },
      browser: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
    }],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    memberSince: {
      type: Date,
      default: Date.now,
    },
    watchlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    }],
    favoriteMovies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    }],
    viewingHistory: [ViewingHistorySchema],
    bookingHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    }],
    orderHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    }],
    paymentMethods: [PaymentMethodSchema],
    recommendations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recommendation',
    }],
    reviewCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    loyaltyPoints: {
      balance: {
        type: Number,
        default: 0,
        min: [0, 'Loyalty points balance cannot be negative'],
      },
      lifetimePoints: {
        type: Number,
        default: 0,
        min: [0, 'Lifetime points cannot be negative'],
      },
      tier: {
        type: String,
        enum: {
          values: ['bronze', 'silver', 'gold', 'platinum'],
          default: 'bronze',
        },
      },
      pointsHistory: [{
        amount: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          enum: {
            values: ['earned', 'redeemed', 'expired', 'adjusted'],
            required: true,
          },
        },
        description: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        reference: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'loyaltyPoints.pointsHistory.referenceModel',
        },
        referenceModel: {
          type: String,
          enum: ['Booking', 'Order', 'Promotion', null],
          default: null,
        },
      }],
      nextTierProgress: {
        type: Number,
        default: 0,
        min: [0, 'Next tier progress cannot be negative'],
        max: [100, 'Next tier progress cannot exceed 100'],
      },
      expiryDate: {
        type: Date,
      },
    },
    twoFactorAuth: {
      isEnabled: {
        type: Boolean,
        default: false,
      },
      secret: {
        type: String,
        select: false, // Don't return secret by default in queries
      },
      tempSecret: {
        type: String,
        select: false, // Don't return tempSecret by default in queries
      },
      backupCodes: {
        type: [String],
        select: false, // Don't return backupCodes by default in queries
      },
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for full address
UserSchema.virtual('fullAddress').get(function() {
  const { street, city, state, zipCode, country } = this.address;
  const parts = [street, city, state, zipCode, country].filter(part => part && part.trim() !== '');
  return parts.join(', ');
});

// Create virtual for bookings
UserSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'user_id',
  justOne: false,
});

// Create virtual for orders
UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user_id',
  justOne: false,
});

// Create virtual for reviews
UserSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// Create virtuals for related collections
// This allows for more efficient queries when populating related data
UserSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
  options: { sort: { createdAt: -1 } }
});

UserSchema.virtual('news', {
  ref: 'News',
  localField: '_id',
  foreignField: 'author',
  justOne: false,
  options: { sort: { publishDate: -1 } }
});

UserSchema.virtual('activities', {
  ref: 'UserActivity',
  localField: '_id',
  foreignField: 'user_id',
  justOne: false,
  options: { sort: { createdAt: -1 } }
});

UserSchema.virtual('userRecommendations', {
  ref: 'Recommendation',
  localField: '_id',
  foreignField: 'user_id',
  justOne: false,
  options: { sort: { createdAt: -1 } }
});

// Create compound indexes for common query patterns
UserSchema.index({ email: 1, role: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ isActive: 1, role: 1 });
UserSchema.index({ 'loyaltyPoints.tier': 1, isActive: 1 });
UserSchema.index({ 'viewingHistory.movie': 1 });
UserSchema.index({ 'bookingHistory': 1 });

// Hash password before saving - optimized for performance
UserSchema.pre('save', async function (next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Use a higher salt factor for better security
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Update lastPasswordChange field
    this.lastPasswordChange = new Date();

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords with better error handling
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) {
    return false;
  }

  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    throw new Error('Password comparison failed');
  }
};

// Method to check if account is locked - optimized
UserSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Method to increment login attempts with progressive lockout
UserSchema.methods.incrementLoginAttempts = async function() {
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME = {
    1: 15 * 60 * 1000,      // 15 minutes for first lockout
    2: 60 * 60 * 1000,      // 1 hour for second lockout
    3: 24 * 60 * 60 * 1000  // 24 hours for third and subsequent lockouts
  };

  // If previous lock has expired, restart at 1 but increment lockout count
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
      $inc: { lockoutCount: 1 }
    });
  }

  // Otherwise increment login attempts
  const updates = { $inc: { loginAttempts: 1 } };

  // Lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
    // Determine lock duration based on lockout count (default to level 3 if higher)
    const lockoutLevel = Math.min(this.lockoutCount || 0, 3);
    const lockDuration = LOCK_TIME[lockoutLevel] || LOCK_TIME[3];

    updates.$set = {
      lockUntil: Date.now() + lockDuration,
      lastLockTime: Date.now()
    };

    // Record this lockout event
    if (!this.lockoutHistory) this.lockoutHistory = [];
    this.lockoutHistory.push({
      date: new Date(),
      duration: lockDuration,
      reason: 'Too many failed login attempts'
    });
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Static method to find by email with password - optimized for authentication
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({
    email: email.toLowerCase().trim(),
    isActive: true
  }).select('+password +loginAttempts +lockUntil +twoFactorAuth.isEnabled +twoFactorAuth.secret');
};

// Static method to find active users with pagination
UserSchema.statics.findActive = function(page = 1, limit = 20, sortField = 'createdAt', sortOrder = -1) {
  const skip = (page - 1) * limit;
  const sort = {};
  sort[sortField] = sortOrder;

  return this.find({ isActive: true })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Static method to find users by role with pagination
UserSchema.statics.findByRole = function(role, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  return this.find({ role, isActive: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to find users with 2FA enabled
UserSchema.statics.findWith2FA = function() {
  return this.find({
    'twoFactorAuth.isEnabled': true,
    isActive: true
  });
};

// Static method to find users by loyalty tier
UserSchema.statics.findByLoyaltyTier = function(tier) {
  return this.find({
    'loyaltyPoints.tier': tier,
    isActive: true
  });
};

// Static method to find users with recent activity
UserSchema.statics.findRecentlyActive = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return this.find({
    lastLogin: { $gte: cutoffDate },
    isActive: true
  }).sort({ lastLogin: -1 });
};

module.exports = mongoose.model('User', UserSchema);
