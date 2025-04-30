const mongoose = require('mongoose');

// Schema for recommended movie
const RecommendedMovieSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  poster: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  reason: {
    type: String,
    trim: true,
  },
}, { _id: false });

const RecommendationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ['personalized', 'similar_movies', 'popular', 'trending', 'new_releases', 'genre_based'],
        message: '{VALUE} is not a valid recommendation type',
      },
      required: true,
      index: true,
    },
    source_movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      index: true,
    },
    source_genre: {
      type: String,
      trim: true,
      index: true,
    },
    recommended_movies: [RecommendedMovieSchema],
    created_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expires_at: {
      type: Date,
      index: true,
    },
    is_viewed: {
      type: Boolean,
      default: false,
    },
    view_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    click_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    algorithm_version: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
RecommendationSchema.index({ user_id: 1, type: 1, created_at: -1 });
RecommendationSchema.index({ user_id: 1, source_movie_id: 1, type: 1 });
RecommendationSchema.index({ user_id: 1, source_genre: 1, type: 1 });
RecommendationSchema.index({ expires_at: 1 });

// Static method to find recommendations by user
RecommendationSchema.statics.findByUser = function(userId, options = {}) {
  const { type, limit = 10, skip = 0 } = options;
  
  const query = {
    user_id: userId,
    expires_at: { $gt: new Date() },
  };
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to find similar movie recommendations
RecommendationSchema.statics.findSimilarMovies = function(userId, movieId) {
  return this.findOne({
    user_id: userId,
    source_movie_id: movieId,
    type: 'similar_movies',
    expires_at: { $gt: new Date() },
  })
  .sort({ created_at: -1 });
};

// Static method to find genre-based recommendations
RecommendationSchema.statics.findByGenre = function(userId, genre) {
  return this.findOne({
    user_id: userId,
    source_genre: genre,
    type: 'genre_based',
    expires_at: { $gt: new Date() },
  })
  .sort({ created_at: -1 });
};

// Static method to create personalized recommendations
RecommendationSchema.statics.createPersonalized = async function(userId, movies, options = {}) {
  const { expirationDays = 7, algorithmVersion = '1.0' } = options;
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expirationDays);
  
  // Format recommended movies
  const recommendedMovies = movies.map(movie => ({
    movie_id: movie._id,
    title: movie.title,
    poster: movie.poster,
    score: movie.score || 0.5,
    reason: movie.reason || 'Based on your viewing history',
  }));
  
  // Create recommendation
  return this.create({
    user_id: userId,
    type: 'personalized',
    recommended_movies: recommendedMovies,
    expires_at: expiresAt,
    algorithm_version: algorithmVersion,
  });
};

// Method to mark as viewed
RecommendationSchema.methods.markViewed = async function() {
  this.is_viewed = true;
  this.view_count += 1;
  return this.save();
};

// Method to increment click count
RecommendationSchema.methods.incrementClicks = async function() {
  this.click_count += 1;
  return this.save();
};

module.exports = mongoose.model('Recommendation', RecommendationSchema);
