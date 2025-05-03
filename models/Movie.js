const mongoose = require('mongoose');
const validator = require('validator');

// Schema for movie awards
const MovieAwardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  winner: {
    type: Boolean,
    default: false,
  },
  nominee: {
    type: String,
    trim: true,
  },
}, { _id: true });

// Schema for movie crew members - optimized for better querying
const MovieCrewSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'crew.personModel',
    index: true
  },
  personModel: {
    type: String,
    enum: ['Director', 'Actor', 'Writer'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    enum: ['directing', 'writing', 'production', 'cinematography', 'editing', 'sound', 'art', 'costume', 'makeup', 'visual_effects', 'other'],
    default: 'other',
    index: true
  },
  photo: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    trim: true,
  },
  imdbId: {
    type: String,
    trim: true,
  }
}, { _id: true });

// Schema for movie keywords - optimized for search
const MovieKeywordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true // Store lowercase for case-insensitive matching
  },
  relevance: {
    type: Number,
    min: [0, 'Relevance cannot be less than 0'],
    max: [1, 'Relevance cannot be more than 1'],
    default: 0.5,
  },
  source: {
    type: String,
    enum: ['manual', 'imdb', 'tmdb', 'ai'],
    default: 'manual'
  },
  count: {
    type: Number,
    default: 1,
    min: [1, 'Count must be at least 1']
  }
}, { _id: true }); // Changed to true to allow direct referencing

const MovieSchema = new mongoose.Schema(
  {
    // Basic movie information
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
      index: true,
    },
    originalTitle: {
      type: String,
      trim: true,
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
      required: [true, 'Please provide a movie description'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'Short description cannot be more than 200 characters'],
    },
    storyLine: {
      type: String,
      trim: true,
      maxlength: [5000, 'Story line cannot be more than 5000 characters'],
    },

    // Release information
    releaseDate: {
      type: Date,
      required: [true, 'Please provide a release date'],
      index: true,
    },
    releaseDateUS: {
      type: Date,
    },
    releaseMonth: {
      type: String,
      trim: true,
    },
    releaseYear: {
      type: Number,
      index: true,
    },

    // Movie details
    duration: {
      type: Number, // in minutes
      required: [true, 'Please provide the movie duration'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [600, 'Duration cannot exceed 600 minutes (10 hours)'],
    },
    durationString: {
      type: String,
      trim: true,
    },
    // Genre information - optimized for filtering
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
      index: true
    }],
    primaryGenre: {
      type: String,
      trim: true,
      index: true
    },

    // Director and writer information
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Director',
      index: true
    },
    directors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Director',
      index: true
    }],
    directorName: {
      type: String,
      trim: true,
    },
    writer: {
      type: String,
      trim: true,
    },
    writers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Writer',
    }],
    // Crew and cast information - optimized for performance
    crew: [MovieCrewSchema],
    cast: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Actor',
          index: true
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
          index: true // Index for sorting
        },
        isMainCast: {
          type: Boolean,
          default: true,
          index: true // Index for filtering
        },
        characterDescription: {
          type: String,
          trim: true,
        },
        imdbId: {
          type: String,
          trim: true,
        }
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
    posterThumbnail: {
      type: String,
      default: '',
    },
    backdrop: {
      type: String,
      default: '',
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
    videos: [{
      title: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
      type: {
        type: String,
        enum: ['trailer', 'teaser', 'clip', 'featurette', 'behind_the_scenes', 'bloopers'],
        default: 'clip',
      },
      thumbnail: {
        type: String,
        default: '',
      },
    }],
    status: {
      type: String,
      enum: {
        values: ['Now Playing', 'Coming Soon', 'Featured', 'Archived'],
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
    imdbRating: {
      type: Number,
      min: [0, 'IMDB rating cannot be less than 0'],
      max: [10, 'IMDB rating cannot be more than 10'],
    },
    imdbId: {
      type: String,
      trim: true,
    },
    rottenTomatoesRating: {
      type: Number,
      min: [0, 'Rotten Tomatoes rating cannot be less than 0'],
      max: [100, 'Rotten Tomatoes rating cannot be more than 100'],
    },
    metacriticRating: {
      type: Number,
      min: [0, 'Metacritic rating cannot be less than 0'],
      max: [100, 'Metacritic rating cannot be more than 100'],
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
    spokenLanguages: [{
      type: String,
      trim: true,
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
    productionCountries: [{
      type: String,
      trim: true,
    }],
    productionCompanies: [{
      type: String,
      trim: true,
    }],
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    keywords: [MovieKeywordSchema],
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
      index: true,
    },
    isRecommended: {
      type: Boolean,
      default: false,
      index: true,
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
          return v.length <= 20; // Max 20 additional images
        },
        message: 'You can only have up to 20 additional images',
      },
    },
    gallery: [{
      url: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['poster', 'backdrop', 'still', 'behind_the_scenes', 'production', 'other'],
        default: 'still',
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      caption: {
        type: String,
        trim: true,
      },
    }],
    ticketUrl: {
      type: String,
      default: '',
    },
    movieInfo: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
    },
    revenue: {
      type: Number,
      min: [0, 'Revenue cannot be negative'],
    },
    awards: [MovieAwardSchema],
    popularity: {
      type: Number,
      default: 0,
      min: [0, 'Popularity cannot be negative'],
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

    viewCount: {
      type: Number,
      default: 0,
      min: [0, 'View count cannot be negative'],
    },
    bookingCount: {
      type: Number,
      default: 0,
      min: [0, 'Booking count cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for average rating - optimized for display
MovieSchema.virtual('averageRating').get(function() {
  if (this.reviewCount === 0) return 0;
  return parseFloat((this.totalRating / this.reviewCount).toFixed(1));
});

// Create virtual for formatted duration
MovieSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return '';
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

// Create virtual for reviews with sorting options
MovieSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'movie',
  justOne: false,
  options: { sort: { createdAt: -1 } }
});

// Create virtual for showtimes with filtering
MovieSchema.virtual('showtimes', {
  ref: 'Showtime',
  localField: '_id',
  foreignField: 'movie',
  justOne: false,
  options: { sort: { date: 1, startTime: 1 } }
});

// Create virtual for comments with sorting
MovieSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'movie',
  justOne: false,
  options: { sort: { createdAt: -1 } }
});

// Create virtual for upcoming showtimes
MovieSchema.virtual('upcomingShowtimes', {
  ref: 'Showtime',
  localField: '_id',
  foreignField: 'movie',
  justOne: false,
  match: { date: { $gte: new Date() } },
  options: { sort: { date: 1, startTime: 1 }, limit: 10 }
});

// Create indexes for faster queries - optimized for common access patterns
MovieSchema.index({ title: 'text', description: 'text', originalTitle: 'text' });
MovieSchema.index({ releaseDate: -1, status: 1 });
MovieSchema.index({ genre: 1, status: 1 });
MovieSchema.index({ rating: -1, reviewCount: -1 });
MovieSchema.index({ 'cast.actor': 1 });
MovieSchema.index({ releaseYear: -1, title: 1 });
MovieSchema.index({ status: 1, isFeatured: 1, releaseDate: -1 });

// Static method to find now playing movies with pagination
MovieSchema.statics.findNowPlaying = function(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ status: 'Now Playing', isActive: true })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .select('title poster slug releaseDate duration genre rating'); // Select only needed fields
};

// Static method to find coming soon movies with pagination
MovieSchema.statics.findComingSoon = function(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ status: 'Coming Soon', isActive: true })
    .sort({ releaseDate: 1 })
    .skip(skip)
    .limit(limit)
    .select('title poster slug releaseDate duration genre'); // Select only needed fields
};

// Static method to find featured movies with pagination
MovieSchema.statics.findFeatured = function(limit = 5) {
  return this.find({ status: 'Featured', isActive: true })
    .sort({ releaseDate: -1 })
    .limit(limit)
    .select('title poster slug releaseDate duration genre rating backdrop trailer'); // Select only needed fields
};

// Static method to find top rated movies with minimum review threshold
MovieSchema.statics.findTopRated = function(limit = 10, minReviews = 5) {
  return this.find({
    isActive: true,
    reviewCount: { $gte: minReviews }
  })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(limit)
    .select('title poster slug releaseDate duration genre rating reviewCount'); // Select only needed fields
};

// Static method to find movies by genre with pagination and sorting options
MovieSchema.statics.findByGenre = function(genre, page = 1, limit = 10, sortBy = 'releaseDate', sortOrder = -1) {
  const skip = (page - 1) * limit;
  const sort = {};
  sort[sortBy] = sortOrder;

  return this.find({ genre: genre, isActive: true })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('title poster slug releaseDate duration genre rating'); // Select only needed fields
};

// Static method to find movies by genre ID with pagination
MovieSchema.statics.findByGenreId = function(genreId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ genres: genreId, isActive: true })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .select('title poster slug releaseDate duration genre rating'); // Select only needed fields
};

// Static method to find movies by director ID with pagination
MovieSchema.statics.findByDirector = function(directorId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({
    $or: [
      { director: directorId },
      { directors: directorId },
      { 'crew.person': directorId, 'crew.department': 'directing' }
    ],
    isActive: true
  })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .select('title poster slug releaseDate duration genre rating'); // Select only needed fields
};

// Static method to find movies by actor ID with pagination
MovieSchema.statics.findByActor = function(actorId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({
    $or: [
      { 'cast.actor': actorId },
      { 'crew.person': actorId, 'crew.personModel': 'Actor' }
    ],
    isActive: true
  })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .select('title poster slug releaseDate duration genre rating'); // Select only needed fields
};

// Static method to find movies by tag ID with pagination
MovieSchema.statics.findByTag = function(tagId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ tags: tagId, isActive: true })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .select('title poster slug releaseDate duration genre rating'); // Select only needed fields
};

// Static method to find similar movies
MovieSchema.statics.findSimilar = function(movieId, limit = 6) {
  return this.findById(movieId)
    .then(movie => {
      if (!movie) return [];

      return this.find({
        _id: { $ne: movieId },
        isActive: true,
        $or: [
          { genre: { $in: movie.genre } },
          { director: movie.director },
          { 'cast.actor': { $in: movie.cast.map(c => c.actor) } }
        ]
      })
        .sort({ rating: -1 })
        .limit(limit)
        .select('title poster slug releaseDate genre rating');
    });
};

// Method to update rating - optimized with validation
MovieSchema.methods.updateRating = async function(newRating, oldRating = null) {
  // Validate the new rating
  if (newRating < 0 || newRating > 10) {
    throw new Error('Rating must be between 0 and 10');
  }

  // If updating an existing rating
  if (oldRating !== null) {
    this.totalRating = this.totalRating - oldRating + newRating;
  } else {
    // Adding a new rating
    this.totalRating += newRating;
    this.reviewCount += 1;
  }

  // Calculate the new average rating
  this.rating = this.totalRating / this.reviewCount;

  // Update popularity based on rating and review count
  this.popularity = (this.rating * 0.6) + (Math.min(this.reviewCount, 100) * 0.4);

  return this.save();
};

// Method to remove a rating
MovieSchema.methods.removeRating = async function(oldRating) {
  if (this.reviewCount <= 0) {
    throw new Error('No reviews to remove');
  }

  this.totalRating -= oldRating;
  this.reviewCount -= 1;

  // Recalculate average rating
  this.rating = this.reviewCount > 0 ? this.totalRating / this.reviewCount : 0;

  // Update popularity
  this.popularity = this.reviewCount > 0 ?
    (this.rating * 0.6) + (Math.min(this.reviewCount, 100) * 0.4) : 0;

  return this.save();
};

module.exports = mongoose.model('Movie', MovieSchema);
