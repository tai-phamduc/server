const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Genre name is required'],
      trim: true,
      maxlength: [50, 'Genre name cannot be more than 50 characters'],
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
    image: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#000000',
    },
    order: {
      type: Number,
      default: 0,
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
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: [String],
      default: [],
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

// Create virtual for movies count
GenreSchema.virtual('moviesCount', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'genres',
  count: true,
});

// Create indexes for faster queries
GenreSchema.index({ name: 1 });
GenreSchema.index({ order: 1 });
GenreSchema.index({ isActive: 1, isFeatured: 1 });

// Pre-save hook to generate slug from name
GenreSchema.pre('save', function(next) {
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
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find active genres
GenreSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 });
};

// Static method to find featured genres
GenreSchema.statics.findFeatured = function() {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ order: 1, name: 1 });
};

// Static method to find genre by slug
GenreSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), isActive: true });
};

// Static method to find genres with movies count
GenreSchema.statics.findWithMoviesCount = function() {
  return this.find({ isActive: true })
    .populate('moviesCount')
    .sort({ order: 1, name: 1 });
};

module.exports = mongoose.model('Genre', GenreSchema);
