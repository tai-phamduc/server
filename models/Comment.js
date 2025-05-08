const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    news: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News',
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
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
        values: ['spam', 'inappropriate', 'offensive', 'other'],
        message: '{VALUE} is not a valid report reason',
      },
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for net likes
CommentSchema.virtual('netLikes').get(function() {
  return this.likes - this.dislikes;
});

// Create virtual for user info
CommentSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name profilePicture' },
});

// Create virtual for replies
CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
  justOne: false,
});

// Validate that at least one of news, movie, or event is provided
CommentSchema.pre('validate', function(next) {
  if (!this.news && !this.movie && !this.event) {
    this.invalidate('news', 'At least one of news, movie, or event must be provided');
  }
  next();
});

// Pre-save hook to ensure likedBy and dislikedBy arrays are in sync with likes and dislikes counts
CommentSchema.pre('save', function(next) {
  try {
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

    next();
  } catch (error) {
    next(error);
  }
});

// Create indexes for faster queries
CommentSchema.index({ news: 1, createdAt: -1 });
CommentSchema.index({ movie: 1, createdAt: -1 });
CommentSchema.index({ event: 1, createdAt: -1 });
CommentSchema.index({ parent: 1, createdAt: 1 });
CommentSchema.index({ isApproved: 1 });
CommentSchema.index({ isReported: 1, reportCount: -1 });

// Static method to find comments by news
CommentSchema.statics.findByNews = function(newsId, options = {}) {
  const { sort = { createdAt: 1 }, limit = 10, skip = 0 } = options;

  return this.find({ news: newsId, parent: null, isApproved: true })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('userInfo')
    .populate({
      path: 'replies',
      populate: {
        path: 'userInfo',
      },
    });
};

// Static method to find comments by movie
CommentSchema.statics.findByMovie = function(movieId, options = {}) {
  const { sort = { createdAt: 1 }, limit = 10, skip = 0 } = options;

  return this.find({ movie: movieId, parent: null, isApproved: true })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('userInfo')
    .populate({
      path: 'replies',
      populate: {
        path: 'userInfo',
      },
    });
};

// Static method to find comments by event
CommentSchema.statics.findByEvent = function(eventId, options = {}) {
  const { sort = { createdAt: 1 }, limit = 10, skip = 0 } = options;

  return this.find({ event: eventId, parent: null, isApproved: true })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('userInfo')
    .populate({
      path: 'replies',
      populate: {
        path: 'userInfo',
      },
    });
};

// Static method to find replies to a comment
CommentSchema.statics.findReplies = function(commentId, options = {}) {
  const { sort = { createdAt: 1 }, limit = 10, skip = 0 } = options;

  return this.find({ parent: commentId, isApproved: true })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('userInfo');
};

// Static method to find reported comments
CommentSchema.statics.findReported = function() {
  return this.find({ isReported: true })
    .sort({ reportCount: -1, createdAt: -1 })
    .populate('userInfo')
    .populate('news', 'title')
    .populate('movie', 'title')
    .populate('event', 'title');
};

// Static method to find most liked comments for a movie
CommentSchema.statics.findMostLikedByMovie = function(movieId, limit = 3) {
  return this.find({ movie: movieId, parent: null, isApproved: true })
    .sort({ likes: -1, dislikes: 1 }) // Sort by most likes, then least dislikes
    .limit(limit)
    .populate('userInfo');
};

// Method to like a comment
CommentSchema.methods.like = async function(userId) {
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

// Method to dislike a comment
CommentSchema.methods.dislike = async function(userId) {
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

// Method to report a comment
CommentSchema.methods.report = async function(userId, reason) {
  // Add to reportedBy if not already present
  if (!this.reportedBy.includes(userId)) {
    this.reportedBy.push(userId);
    this.reportReasons.push(reason);
  }

  return this.save();
};

// Method to approve a comment
CommentSchema.methods.approve = async function() {
  this.isApproved = true;
  return this.save();
};

// Method to reject a comment
CommentSchema.methods.reject = async function() {
  this.isApproved = false;
  return this.save();
};

module.exports = mongoose.model('Comment', CommentSchema);
