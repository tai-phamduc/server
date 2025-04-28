const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['published', 'draft', 'archived'],
        message: '{VALUE} is not a valid status',
      },
      default: 'published',
      index: true,
    },
    template: {
      type: String,
      default: 'default',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isInMenu: {
      type: Boolean,
      default: false,
      index: true,
    },
    isInFooter: {
      type: Boolean,
      default: false,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
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
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for children pages
PageSchema.virtual('children', {
  ref: 'Page',
  localField: '_id',
  foreignField: 'parent',
  justOne: false,
});

// Create indexes for faster queries
PageSchema.index({ status: 1 });
PageSchema.index({ parent: 1, order: 1 });
PageSchema.index({ isInMenu: 1, order: 1 });
PageSchema.index({ isInFooter: 1, order: 1 });

// Pre-save hook to generate slug from title
PageSchema.pre('save', function(next) {
  try {
    // Always generate slug from title if title exists
    if (this.title) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    // Ensure slug is never null or empty
    if (!this.slug && this._id) {
      this.slug = this._id.toString();
    }

    // Set meta title if not provided
    if (this.isModified('title') && !this.metaTitle) {
      this.metaTitle = this.title;
    }

    // Set excerpt if not provided
    if (this.isModified('content') && !this.excerpt) {
      // Extract first 200 characters from content, removing HTML tags
      const plainText = this.content.replace(/<[^>]*>/g, '');
      this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find published pages
PageSchema.statics.findPublished = function() {
  return this.find({ status: 'published' })
    .sort({ order: 1, title: 1 });
};

// Static method to find menu pages
PageSchema.statics.findMenuPages = function() {
  return this.find({ status: 'published', isInMenu: true })
    .sort({ order: 1, title: 1 });
};

// Static method to find footer pages
PageSchema.statics.findFooterPages = function() {
  return this.find({ status: 'published', isInFooter: true })
    .sort({ order: 1, title: 1 });
};

// Static method to find page by slug
PageSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), status: 'published' });
};

// Static method to find parent pages
PageSchema.statics.findParents = function() {
  return this.find({ status: 'published', parent: null })
    .sort({ order: 1, title: 1 });
};

module.exports = mongoose.model('Page', PageSchema);
