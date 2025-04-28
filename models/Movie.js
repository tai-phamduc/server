const mongoose = require('mongoose');
const validator = require('validator');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a movie description'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    storyLine: {
      type: String,
      trim: true,
      maxlength: [5000, 'Story line cannot be more than 5000 characters'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please provide a release date'],
      index: true,
    },
    releaseMonth: {
      type: String,
      trim: true,
    },
    releaseYear: {
      type: Number,
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Please provide the movie duration'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [600, 'Duration cannot exceed 600 minutes (10 hours)'],
    },
    genre: {
      type: [String],
      required: [true, 'Please provide at least one genre'],
      validate: {
        validator: function(v) {
          return v.length > 0 && v.length <= 5; // At least 1 genre, max 5 genres
        },
        message: 'Please provide between 1 and 5 genres',
      },
      index: true,
    },
    genres: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
    }],
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Director',
    },
    directorName: {
      type: String,
      trim: true,
    },
    writer: {
      type: String,
      trim: true,
    },
    writers: [{
      type: String,
      trim: true,
    }],
    cast: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Actor',
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        character: {
          type: String,
          trim: true,
        },
        photo: {
          type: String, // URL to image
          default: '',
        },
        order: {
          type: Number,
          default: 0,
        },
      }
    ],
    poster: {
      type: String, // URL to image
      required: [true, 'Please provide a poster URL'],
      validate: {
        validator: function(v) {
          return validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true });
        },
        message: 'Please provide a valid URL for the poster',
      },
    },
    trailer: {
      type: String, // URL to video
      required: [true, 'Please provide a trailer URL'],
      validate: {
        validator: function(v) {
          return validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true });
        },
        message: 'Please provide a valid URL for the trailer',
      },
    },
    trailerThumbnail: {
      type: String, // URL to trailer thumbnail image
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Now Playing', 'Coming Soon', 'Featured'],
        message: '{VALUE} is not a valid status',
      },
      required: [true, 'Please provide the movie status'],
      index: true,
    },
    displayStatus: {
      type: String,
      default: 'In theater',
      trim: true,
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [10, 'Rating cannot be more than 10'],
      default: 0,
    },
    language: {
      type: String,
      trim: true,
      default: 'English',
    },
    languages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Language',
    }],
    country: {
      type: String,
      trim: true,
      default: 'USA',
    },
    countries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    }],
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    ageRating: {
      type: String,
      enum: {
        values: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated'],
        message: '{VALUE} is not a valid age rating',
      },
      default: 'Not Rated',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return v.length <= 10; // Max 10 additional images
        },
        message: 'You can only have up to 10 additional images',
      },
    },
    gallery: {
      type: [String],
      default: [],
    },
    ticketUrl: {
      type: String,
      default: '',
    },
    movieInfo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for average rating
MovieSchema.virtual('averageRating').get(function() {
  if (this.reviewCount === 0) return 0;
  return (this.totalRating / this.reviewCount).toFixed(1);
});

// Create virtual for reviews
MovieSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'movie',
  justOne: false,
});

// Create virtual for showtimes
MovieSchema.virtual('showtimes', {
  ref: 'Showtime',
  localField: '_id',
  foreignField: 'movie',
  justOne: false,
});

// Create virtual for comments
MovieSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'movie',
  justOne: false,
});

// Create indexes for faster queries
MovieSchema.index({ title: 'text', description: 'text' });
MovieSchema.index({ releaseDate: -1, status: 1 });
MovieSchema.index({ genre: 1, status: 1 });
MovieSchema.index({ rating: -1 });

// Static method to find now playing movies
MovieSchema.statics.findNowPlaying = function() {
  return this.find({ status: 'Now Playing', isActive: true })
    .sort({ releaseDate: -1 });
};

// Static method to find coming soon movies
MovieSchema.statics.findComingSoon = function() {
  return this.find({ status: 'Coming Soon', isActive: true })
    .sort({ releaseDate: 1 });
};

// Static method to find featured movies
MovieSchema.statics.findFeatured = function() {
  return this.find({ status: 'Featured', isActive: true });
};

// Static method to find top rated movies
MovieSchema.statics.findTopRated = function(limit = 10) {
  return this.find({ isActive: true, reviewCount: { $gt: 0 } })
    .sort({ rating: -1 })
    .limit(limit);
};

// Static method to find movies by genre
MovieSchema.statics.findByGenre = function(genre) {
  return this.find({ genre: genre, isActive: true })
    .sort({ releaseDate: -1 });
};

// Static method to find movies by genre ID
MovieSchema.statics.findByGenreId = function(genreId) {
  return this.find({ genres: genreId, isActive: true })
    .sort({ releaseDate: -1 });
};

// Static method to find movies by director ID
MovieSchema.statics.findByDirector = function(directorId) {
  return this.find({ director: directorId, isActive: true })
    .sort({ releaseDate: -1 });
};

// Static method to find movies by actor ID
MovieSchema.statics.findByActor = function(actorId) {
  return this.find({ 'cast.actor': actorId, isActive: true })
    .sort({ releaseDate: -1 });
};

// Static method to find movies by tag ID
MovieSchema.statics.findByTag = function(tagId) {
  return this.find({ tags: tagId, isActive: true })
    .sort({ releaseDate: -1 });
};

// Method to update rating
MovieSchema.methods.updateRating = async function(newRating) {
  this.totalRating += newRating;
  this.reviewCount += 1;
  this.rating = this.totalRating / this.reviewCount;
  return this.save();
};

module.exports = mongoose.model('Movie', MovieSchema);
