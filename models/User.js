const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
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
        default: '',
        trim: true,
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
      favoriteTheaters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
      }],
      notificationEnabled: {
        type: Boolean,
        default: true,
      },
      emailSubscription: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
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
      enableReminders: {
        type: Boolean,
        default: true,
      },
      reminderTime: {
        type: Number,
        default: 24, // Default: 24 hours before showtime
        min: [1, 'Reminder time must be at least 1 hour'],
        max: [48, 'Reminder time cannot be more than 48 hours'],
      },
      enableSmsReminders: {
        type: Boolean,
        default: false,
      },
      phoneNumber: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            // Basic validation for international phone numbers
            return /^\+?[1-9]\d{1,14}$/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
      },
    },
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
    bookingHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    }],
    reviewCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
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
  foreignField: 'user',
  justOne: false,
});

// Create virtual for reviews
UserSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// Create virtual for comments
UserSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// Create virtual for news
UserSchema.virtual('news', {
  ref: 'News',
  localField: '_id',
  foreignField: 'author',
  justOne: false,
});

// Create index for email and role
UserSchema.index({ email: 1, role: 1 });
UserSchema.index({ createdAt: -1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to check if account is locked
UserSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Method to increment login attempts
UserSchema.methods.incrementLoginAttempts = async function() {
  // If previous lock has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  // Otherwise increment login attempts
  const updates = { $inc: { loginAttempts: 1 } };

  // Lock the account if we've reached max attempts (5) and it's not locked already
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 1 * 60 * 60 * 1000 }; // 1 hour lock
  }

  return this.updateOne(updates);
};

// Static method to find by email with password
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('+password');
};

// Static method to find active users
UserSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to find users by role
UserSchema.statics.findByRole = function(role) {
  return this.find({ role });
};

// Static method to find users with 2FA enabled
UserSchema.statics.findWith2FA = function() {
  return this.find({ 'twoFactorAuth.isEnabled': true });
};

module.exports = mongoose.model('User', UserSchema);
