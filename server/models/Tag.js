const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
      maxlength: [50, 'Tag name cannot be more than 50 characters'],
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
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['blog', 'movie', 'event', 'general'],
        message: '{VALUE} is not a valid tag type',
      },
      default: 'general',
      index: true,
    },
    color: {
      type: String,
      default: '#000000',
    },
    icon: {
      type: String,
      default: '',
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
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
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

// Create virtual for blog posts count
TagSchema.virtual('blogPostsCount', {
  ref: 'News',
  localField: '_id',
  foreignField: 'tags',
  count: true,
});

// Create virtual for movies count
TagSchema.virtual('moviesCount', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'tags',
  count: true,
});

// Create virtual for events count
TagSchema.virtual('eventsCount', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'tags',
  count: true,
});

// Create indexes for faster queries
TagSchema.index({ name: 1 });
TagSchema.index({ type: 1, isActive: 1 });
TagSchema.index({ isFeatured: 1, type: 1 });

// Pre-save hook to generate slug from name
TagSchema.pre('save', function(next) {
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

// Static method to find active tags
TagSchema.statics.findActive = function(type = null) {
  const query = { isActive: true };

  if (type) {
    query.type = type;
  }

  return this.find(query)
    .sort({ order: 1, name: 1 });
};

// Static method to find featured tags
TagSchema.statics.findFeatured = function(type = null) {
  const query = { isActive: true, isFeatured: true };

  if (type) {
    query.type = type;
  }

  return this.find(query)
    .sort({ order: 1, name: 1 });
};

// Static method to find tag by slug
TagSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), isActive: true });
};

// Static method to find tags with counts
TagSchema.statics.findWithCounts = function(type = null) {
  const query = { isActive: true };

  if (type) {
    query.type = type;
  }

  let virtuals = [];

  if (!type || type === 'blog') {
    virtuals.push('blogPostsCount');
  }

  if (!type || type === 'movie') {
    virtuals.push('moviesCount');
  }

  if (!type || type === 'event') {
    virtuals.push('eventsCount');
  }

  return this.find(query)
    .populate(virtuals)
    .sort({ order: 1, name: 1 });
};

module.exports = mongoose.model('Tag', TagSchema);
