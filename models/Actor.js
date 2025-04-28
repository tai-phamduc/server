const mongoose = require('mongoose');

const ActorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Actor name is required'],
      trim: true,
      maxlength: [100, 'Actor name cannot be more than 100 characters'],
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
    height: {
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
ActorSchema.virtual('movies', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'cast.actor',
  justOne: false,
});

// Create virtual for movies count
ActorSchema.virtual('moviesCount', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'cast.actor',
  count: true,
});

// Create indexes for faster queries
ActorSchema.index({ name: 1 });
ActorSchema.index({ isActive: 1, isFeatured: 1 });

// Pre-save hook to generate slug from name
ActorSchema.pre('save', function(next) {
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

// Static method to find active actors
ActorSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ name: 1 });
};

// Static method to find featured actors
ActorSchema.statics.findFeatured = function() {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ name: 1 });
};

// Static method to find actor by slug
ActorSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), isActive: true });
};

// Static method to find actors with movies count
ActorSchema.statics.findWithMoviesCount = function() {
  return this.find({ isActive: true })
    .populate('moviesCount')
    .sort({ name: 1 });
};

// Static method to find top actors by movies count
ActorSchema.statics.findTopActors = function(limit = 10) {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'movies',
        let: { actorId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$$actorId', '$cast.actor'],
              },
            },
          },
        ],
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

module.exports = mongoose.model('Actor', ActorSchema);
