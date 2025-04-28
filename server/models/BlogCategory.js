const mongoose = require('mongoose');

const BlogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot be more than 100 characters'],
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
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogCategory',
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
    featuredInHome: {
      type: Boolean,
      default: false,
    },
    featuredInMenu: {
      type: Boolean,
      default: false,
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

// Create virtual for posts count
BlogCategorySchema.virtual('postsCount', {
  ref: 'News',
  localField: '_id',
  foreignField: 'categories',
  count: true,
});

// Create virtual for children categories
BlogCategorySchema.virtual('children', {
  ref: 'BlogCategory',
  localField: '_id',
  foreignField: 'parent',
  justOne: false,
});

// Create indexes for faster queries
BlogCategorySchema.index({ name: 1 });
BlogCategorySchema.index({ parent: 1, order: 1 });
BlogCategorySchema.index({ isActive: 1, featuredInHome: 1 });
BlogCategorySchema.index({ isActive: 1, featuredInMenu: 1 });

// Pre-save hook to generate slug from name
BlogCategorySchema.pre('save', function(next) {
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

// Static method to find active categories
BlogCategorySchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 });
};

// Static method to find featured categories
BlogCategorySchema.statics.findFeatured = function(location = 'home') {
  const query = { isActive: true };

  if (location === 'home') {
    query.featuredInHome = true;
  } else if (location === 'menu') {
    query.featuredInMenu = true;
  }

  return this.find(query)
    .sort({ order: 1, name: 1 });
};

// Static method to find parent categories
BlogCategorySchema.statics.findParents = function() {
  return this.find({ isActive: true, parent: null })
    .sort({ order: 1, name: 1 });
};

// Static method to find category by slug
BlogCategorySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), isActive: true });
};

// Static method to find categories with posts count
BlogCategorySchema.statics.findWithPostsCount = function() {
  return this.find({ isActive: true })
    .populate('postsCount')
    .sort({ order: 1, name: 1 });
};

module.exports = mongoose.model('BlogCategory', BlogCategorySchema);
