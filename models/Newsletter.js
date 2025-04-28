const mongoose = require('mongoose');
const validator = require('validator');

const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
    unsubscribeToken: {
      type: String,
    },
    unsubscribedAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    preferences: {
      movies: {
        type: Boolean,
        default: true,
      },
      events: {
        type: Boolean,
        default: true,
      },
      news: {
        type: Boolean,
        default: true,
      },
      promotions: {
        type: Boolean,
        default: true,
      },
    },
    lastEmailSent: {
      type: Date,
    },
    emailsSent: {
      type: Number,
      default: 0,
      min: [0, 'Emails sent cannot be negative'],
    },
    emailsOpened: {
      type: Number,
      default: 0,
      min: [0, 'Emails opened cannot be negative'],
    },
    emailsClicked: {
      type: Number,
      default: 0,
      min: [0, 'Emails clicked cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
NewsletterSchema.index({ isActive: 1, isVerified: 1 });
NewsletterSchema.index({ createdAt: -1 });

// Generate verification token before saving
NewsletterSchema.pre('save', function(next) {
  try {
    if (this.isNew || this.isModified('email')) {
      // Generate verification token
      const token = require('crypto').randomBytes(32).toString('hex');
      this.verificationToken = token;
      this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      // Generate unsubscribe token
      const unsubToken = require('crypto').randomBytes(32).toString('hex');
      this.unsubscribeToken = unsubToken;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find active subscribers
NewsletterSchema.statics.findActive = function() {
  return this.find({ isActive: true, isVerified: true })
    .sort({ createdAt: -1 });
};

// Static method to find subscribers by preference
NewsletterSchema.statics.findByPreference = function(preference) {
  const query = { 
    isActive: true, 
    isVerified: true,
  };
  
  query[`preferences.${preference}`] = true;
  
  return this.find(query)
    .sort({ createdAt: -1 });
};

// Static method to find unverified subscribers
NewsletterSchema.statics.findUnverified = function() {
  return this.find({ 
    isActive: true, 
    isVerified: false,
    verificationTokenExpires: { $gt: new Date() }
  })
    .sort({ createdAt: -1 });
};

// Method to verify subscription
NewsletterSchema.methods.verify = async function() {
  this.isVerified = true;
  this.verifiedAt = new Date();
  this.verificationToken = undefined;
  this.verificationTokenExpires = undefined;
  return this.save();
};

// Method to unsubscribe
NewsletterSchema.methods.unsubscribe = async function() {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  return this.save();
};

// Method to track email open
NewsletterSchema.methods.trackOpen = async function() {
  this.emailsOpened += 1;
  return this.save();
};

// Method to track email click
NewsletterSchema.methods.trackClick = async function() {
  this.emailsClicked += 1;
  return this.save();
};

// Method to track email sent
NewsletterSchema.methods.trackSent = async function() {
  this.emailsSent += 1;
  this.lastEmailSent = new Date();
  return this.save();
};

module.exports = mongoose.model('Newsletter', NewsletterSchema);
