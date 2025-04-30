const mongoose = require('mongoose');

// Schema for detailed ratings
const DetailedRatingSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: {
      values: ['acting', 'directing', 'story', 'visuals', 'sound', 'overall', 'experience', 'comfort', 'service', 'cleanliness', 'value', 'location', 'amenities', 'food', 'technology'],
      message: '{VALUE} is not a valid rating category',
    },
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: [0, 'Score cannot be less than 0'],
    max: [5, 'Score cannot be more than 5'],
  },
  comment: {
    type: String,
    trim: true,
  },
}, { _id: false });

// Schema for review replies
const ReviewReplySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    trim: true,
  },
  userImage: {
    type: String,
    default: '',
  },
  userRole: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator', 'owner'],
      default: 'user',
    },
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Reply cannot be more than 500 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative'],
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isReported: {
    type: Boolean,
    default: false,
  },
  reportCount: {
    type: Number,
    default: 0,
    min: [0, 'Report count cannot be negative'],
  },
}, { _id: true, timestamps: true });

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    userImage: {
      type: String,
      default: '',
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      index: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      index: true,
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      index: true,
    },
    reviewType: {
      type: String,
      enum: {
        values: ['movie', 'theater', 'cinema'],
        message: '{VALUE} is not a valid review type',
      },
      required: [true, 'Review type is required'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    detailedRatings: [DetailedRatingSchema],
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot be more than 2000 characters'],
    },
    pros: {
      type: [String],
      default: [],
    },
    cons: {
      type: [String],
      default: [],
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationMethod: {
      type: String,
      enum: {
        values: ['booking', 'purchase', 'admin', 'none'],
        default: 'none',
      },
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    displayDate: {
      type: String,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes cannot be negative'],
    },
    dislikes: {
      type: Number,
      default: 0,
      min: [0, 'Dislikes cannot be negative'],
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    dislikedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
    lastEditDate: {
      type: Date,
    },
    editHistory: [{
      content: {
        type: String,
        trim: true,
      },
      rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
      },
      editDate: {
        type: Date,
        default: Date.now,
      },
    }],
    isReported: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
      min: [0, 'Report count cannot be negative'],
    },
    reportedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    reportReasons: [{
      type: String,
      enum: {
        values: ['spam', 'inappropriate', 'offensive', 'spoiler', 'other'],
        message: '{VALUE} is not a valid report reason',
      },
    }],
    moderationStatus: {
      type: String,
      enum: {
        values: ['approved', 'pending', 'rejected', 'flagged'],
        default: 'approved',
      },
      index: true,
    },
    moderationNotes: {
      type: String,
      trim: true,
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    moderatedAt: {
      type: Date,
    },
    spoiler: {
      type: Boolean,
      default: false,
    },
    watchedInTheater: {
      type: Boolean,
      default: true,
    },
    watchDate: {
      type: Date,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return v.length <= 5; // Max 5 images
        },
        message: 'You can only upload up to 5 images',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    replyCount: {
      type: Number,
      default: 0,
      min: [0, 'Reply count cannot be negative'],
    },
    replies: [ReviewReplySchema],
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: [0, 'Helpful count cannot be negative'],
    },
    markedHelpfulBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    adminResponse: {
      content: {
        type: String,
        trim: true,
      },
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: {
        type: Date,
      },
    },
    sentiment: {
      type: String,
      enum: {
        values: ['positive', 'negative', 'neutral', 'mixed'],
        default: 'neutral',
      },
    },
    sentimentScore: {
      type: Number,
      min: [-1, 'Sentiment score cannot be less than -1'],
      max: [1, 'Sentiment score cannot be more than 1'],
    },
    aiSummary: {
      type: String,
      trim: true,
    },
    aiTags: {
      type: [String],
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
      min: [0, 'View count cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for net likes
ReviewSchema.virtual('netLikes').get(function() {
  return this.likes - this.dislikes;
});

// Create virtual for user info
ReviewSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name profilePicture' },
});

// Create virtual for replies
ReviewSchema.virtual('replies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'review',
  justOne: false,
});

// Prevent user from submitting more than one review per movie or theater
ReviewSchema.index({ user: 1, movie: 1, reviewType: 1 }, { unique: true, sparse: true });
ReviewSchema.index({ user: 1, theater: 1, reviewType: 1 }, { unique: true, sparse: true });

// Create indexes for faster queries
ReviewSchema.index({ movie: 1, isPublished: 1, createdAt: -1 });
ReviewSchema.index({ theater: 1, isPublished: 1, createdAt: -1 });
ReviewSchema.index({ reviewType: 1, rating: -1 });
ReviewSchema.index({ isApproved: 1, isPublished: 1 });
ReviewSchema.index({ isReported: 1, reportCount: -1 });
ReviewSchema.index({ featured: 1, reviewType: 1 });

// Pre-save hook to ensure data consistency and format display fields
ReviewSchema.pre('save', function(next) {
  try {
    // Ensure either movie or theater is provided based on reviewType
    if (this.isModified('reviewType') || this.isNew) {
      if (this.reviewType === 'movie' && !this.movie) {
        return next(new Error('Movie ID is required for movie reviews'));
      } else if (this.reviewType === 'theater' && !this.theater) {
        return next(new Error('Theater ID is required for theater reviews'));
      }
    }

    // Update counts from arrays
    if (this.isModified('likedBy')) {
      this.likes = this.likedBy.length;
    }

    if (this.isModified('dislikedBy')) {
      this.dislikes = this.dislikedBy.length;
    }

    if (this.isModified('reportedBy')) {
      this.reportCount = this.reportedBy.length;
      this.isReported = this.reportCount > 0;
    }

    // Format display date
    if (this.isModified('publishDate') || !this.displayDate) {
      this.displayDate = new Date(this.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Set last edit date if content is modified
    if ((this.isModified('title') || this.isModified('comment') || this.isModified('rating')) && !this.isNew) {
      this.isEdited = true;
      this.lastEditDate = new Date();
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Post-save hook to update movie or theater rating
ReviewSchema.post('save', async function() {
  try {
    // Only update ratings for published and approved reviews
    if (!this.isPublished || !this.isApproved) return;

    if (this.reviewType === 'movie' && this.movie) {
      const Movie = mongoose.model('Movie');
      const movie = await Movie.findById(this.movie);

      if (movie && typeof movie.updateRating === 'function') {
        await movie.updateRating(this.rating);
      }
    } else if (this.reviewType === 'theater' && this.theater) {
      const Theater = mongoose.model('Theater');
      const theater = await Theater.findById(this.theater);

      if (theater && typeof theater.updateRating === 'function') {
        await theater.updateRating(this.rating);
      }
    }

    // Update user review count
    if (this.user) {
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(this.user, { $inc: { reviewCount: 1 } });
    }

    // Set user info for display
    if (!this.userName || !this.userImage) {
      const User = mongoose.model('User');
      const user = await User.findById(this.user);

      if (user) {
        if (!this.userName) {
          await this.constructor.findByIdAndUpdate(this._id, {
            userName: user.name
          });
        }

        if (!this.userImage && user.profilePicture) {
          await this.constructor.findByIdAndUpdate(this._id, {
            userImage: user.profilePicture
          });
        }
      }
    }
  } catch (error) {
    console.error('Error in review post-save hook:', error);
  }
});

// Static method to find reviews by movie
ReviewSchema.statics.findByMovie = function(movieId, options = {}) {
  const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;

  return this.find({
    movie: movieId,
    reviewType: 'movie',
    isApproved: true,
    isPublished: true
  })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Static method to find reviews by theater
ReviewSchema.statics.findByTheater = function(theaterId, options = {}) {
  const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;

  return this.find({
    theater: theaterId,
    reviewType: 'theater',
    isApproved: true,
    isPublished: true
  })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Static method to find reviews by user
ReviewSchema.statics.findByUser = function(userId, options = {}) {
  const { sort = { createdAt: -1 }, limit = 10, skip = 0, type = null } = options;

  const query = { user: userId };

  if (type) {
    query.reviewType = type;
  }

  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'movie',
      select: 'title poster',
    })
    .populate({
      path: 'theater',
      select: 'name location',
    });
};

// Static method to find top rated reviews
ReviewSchema.statics.findTopRated = function(options = {}) {
  const { limit = 10, type = null } = options;

  const query = {
    isApproved: true,
    isPublished: true
  };

  if (type) {
    query.reviewType = type;
  }

  return this.find(query)
    .sort({ likes: -1, rating: -1, createdAt: -1 })
    .limit(limit)
    .populate({
      path: 'movie',
      select: 'title poster',
    })
    .populate({
      path: 'theater',
      select: 'name location',
    });
};

// Static method to find featured reviews
ReviewSchema.statics.findFeatured = function(options = {}) {
  const { limit = 5, type = null } = options;

  const query = {
    featured: true,
    isApproved: true,
    isPublished: true
  };

  if (type) {
    query.reviewType = type;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: 'movie',
      select: 'title poster',
    })
    .populate({
      path: 'theater',
      select: 'name location',
    });
};

// Static method to find reported reviews
ReviewSchema.statics.findReported = function(options = {}) {
  const { type = null } = options;

  const query = { isReported: true };

  if (type) {
    query.reviewType = type;
  }

  return this.find(query)
    .sort({ reportCount: -1, createdAt: -1 })
    .populate({
      path: 'movie',
      select: 'title poster',
    })
    .populate({
      path: 'theater',
      select: 'name location',
    });
};

// Method to like a review
ReviewSchema.methods.like = async function(userId) {
  // Remove from dislikedBy if present
  if (this.dislikedBy.includes(userId)) {
    this.dislikedBy = this.dislikedBy.filter(id => id.toString() !== userId.toString());
  }

  // Add to likedBy if not already present
  if (!this.likedBy.includes(userId)) {
    this.likedBy.push(userId);
  }

  return this.save();
};

// Method to dislike a review
ReviewSchema.methods.dislike = async function(userId) {
  // Remove from likedBy if present
  if (this.likedBy.includes(userId)) {
    this.likedBy = this.likedBy.filter(id => id.toString() !== userId.toString());
  }

  // Add to dislikedBy if not already present
  if (!this.dislikedBy.includes(userId)) {
    this.dislikedBy.push(userId);
  }

  return this.save();
};

// Method to report a review
ReviewSchema.methods.report = async function(userId, reason) {
  // Add to reportedBy if not already present
  if (!this.reportedBy.includes(userId)) {
    this.reportedBy.push(userId);
    this.reportReasons.push(reason);
  }

  return this.save();
};

// Method to approve a review
ReviewSchema.methods.approve = async function() {
  this.isApproved = true;
  return this.save();
};

// Method to reject a review
ReviewSchema.methods.reject = async function() {
  this.isApproved = false;
  return this.save();
};

module.exports = mongoose.model('Review', ReviewSchema);
