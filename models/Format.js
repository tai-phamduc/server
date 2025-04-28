const mongoose = require('mongoose');

const FormatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Format name is required'],
      trim: true,
      maxlength: [50, 'Format name cannot be more than 50 characters'],
      unique: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    icon: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#000000',
    },
    priceMultiplier: {
      type: Number,
      default: 1,
      min: [0.1, 'Price multiplier must be at least 0.1'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
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

// Create virtual for showtimes count
FormatSchema.virtual('showtimesCount', {
  ref: 'Showtime',
  localField: 'name',
  foreignField: 'format',
  count: true,
});

// Create indexes for faster queries
FormatSchema.index({ name: 1 });
FormatSchema.index({ isActive: 1, order: 1 });
FormatSchema.index({ isFeatured: 1 });

// Pre-save hook to generate slug from name
FormatSchema.pre('save', function(next) {
  try {
    // Always generate slug from name if name exists
    if (this.name) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    // Ensure slug is never null or empty
    if (!this.slug && this._id) {
      this.slug = this._id.toString();
    } else if (!this.slug) {
      // If we don't have an ID yet (new document), use a timestamp
      this.slug = 'format-' + Date.now().toString();
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find active formats
FormatSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 });
};

// Static method to find featured formats
FormatSchema.statics.findFeatured = function() {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ order: 1, name: 1 });
};

// Static method to find format by slug
FormatSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), isActive: true });
};

// Static method to find formats with showtimes count
FormatSchema.statics.findWithShowtimesCount = function() {
  return this.find({ isActive: true })
    .populate('showtimesCount')
    .sort({ order: 1, name: 1 });
};

module.exports = mongoose.model('Format', FormatSchema);
