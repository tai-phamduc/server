const mongoose = require('mongoose');
const validator = require('validator');

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a news title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
      index: true,
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
      required: [true, 'Please provide news content'],
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide an author'],
    },
    authorName: {
      type: String,
      trim: true,
    },
    authorImage: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: String, // URL to image
      required: [true, 'Please provide a featured image URL'],
      validate: {
        validator: function(v) {
          return validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true });
        },
        message: 'Please provide a valid URL for the featured image',
      },
    },
    gallery: {
      type: [String], // URLs to images
      default: [],
    },
    categories: {
      type: [String],
      default: [],
      index: true,
    },
    blogCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogCategory',
      index: true,
    }],
    category: {
      type: String,
      default: 'News',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    blogTags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
      index: true,
    }],
    publishDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    displayDate: {
      type: String,
      trim: true,
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
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    relatedMovies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    }],
    relatedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug from title before saving
NewsSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Generate display date if not provided
  if (this.isModified('publishDate') || !this.displayDate) {
    const date = this.publishDate || new Date();
    this.displayDate = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  next();
});

// Create virtual for comments
NewsSchema.virtual('commentsList', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'news',
  justOne: false,
});

// Create indexes for faster queries
NewsSchema.index({ title: 'text', content: 'text' });
NewsSchema.index({ publishDate: -1, status: 1 });
NewsSchema.index({ categories: 1, status: 1 });
NewsSchema.index({ tags: 1, status: 1 });

// Static method to find published news
NewsSchema.statics.findPublished = function() {
  return this.find({ status: 'published' })
    .sort({ publishDate: -1 });
};

// Static method to find featured news
NewsSchema.statics.findFeatured = function() {
  return this.find({ featured: true, status: 'published' })
    .sort({ publishDate: -1 });
};

// Static method to find news by category
NewsSchema.statics.findByCategory = function(category) {
  return this.find({
    $or: [
      { categories: category },
      { category: category }
    ],
    status: 'published'
  })
  .sort({ publishDate: -1 });
};

// Static method to find news by blog category
NewsSchema.statics.findByBlogCategory = function(categoryId) {
  return this.find({
    blogCategories: categoryId,
    status: 'published'
  })
  .sort({ publishDate: -1 });
};

// Static method to find news by tag
NewsSchema.statics.findByTag = function(tag) {
  return this.find({ tags: tag, status: 'published' })
    .sort({ publishDate: -1 });
};

// Static method to find news by blog tag
NewsSchema.statics.findByBlogTag = function(tagId) {
  return this.find({ blogTags: tagId, status: 'published' })
    .sort({ publishDate: -1 });
};

// Static method to find popular news
NewsSchema.statics.findPopular = function(limit = 5) {
  return this.find({ status: 'published' })
    .sort({ views: -1, likes: -1 })
    .limit(limit);
};

// Static method to find related news
NewsSchema.statics.findRelated = function(newsId, categories, tags, limit = 3) {
  return this.find({
    _id: { $ne: newsId },
    status: 'published',
    $or: [
      { categories: { $in: categories } },
      { category: { $in: categories } },
      { tags: { $in: tags } },
    ],
  })
    .sort({ publishDate: -1 })
    .limit(limit);
};

// Method to increment views
NewsSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Method to like news
NewsSchema.methods.like = async function() {
  this.likes += 1;
  return this.save();
};

module.exports = mongoose.model('News', NewsSchema);
