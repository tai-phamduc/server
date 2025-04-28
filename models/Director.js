const mongoose = require('mongoose');

const DirectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Director name is required'],
      trim: true,
      maxlength: [100, 'Director name cannot be more than 100 characters'],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    photo: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    birthPlace: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
    awards: {
      type: [String],
      default: [],
    },
    socialMedia: {
      imdb: {
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
      facebook: {
        type: String,
        default: '',
      },
      website: {
        type: String,
        default: '',
      },
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

// Create virtual for movies
DirectorSchema.virtual('movies', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'director',
  justOne: false,
});

// Create virtual for movies count
DirectorSchema.virtual('moviesCount', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'director',
  count: true,
});

// Create indexes for faster queries
DirectorSchema.index({ name: 1 });
DirectorSchema.index({ isActive: 1, isFeatured: 1 });

// Pre-save hook to generate slug from name
DirectorSchema.pre('save', function(next) {
  try {
    if (this.isModified('name') && !this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find active directors
DirectorSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ name: 1 });
};

// Static method to find featured directors
DirectorSchema.statics.findFeatured = function() {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ name: 1 });
};

// Static method to find director by slug
DirectorSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), isActive: true });
};

// Static method to find directors with movies count
DirectorSchema.statics.findWithMoviesCount = function() {
  return this.find({ isActive: true })
    .populate('moviesCount')
    .sort({ name: 1 });
};

// Static method to find top directors by movies count
DirectorSchema.statics.findTopDirectors = function(limit = 10) {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director',
        as: 'movies',
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
        photo: 1,
        moviesCount: { $size: '$movies' },
      },
    },
    { $sort: { moviesCount: -1, name: 1 } },
    { $limit: limit },
  ]);
};

module.exports = mongoose.model('Director', DirectorSchema);
