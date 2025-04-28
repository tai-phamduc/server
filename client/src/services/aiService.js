import * as tf from '@tensorflow/tfjs';
import { authService, movieService } from './api';

// AI Service for movie recommendations and other AI features
export const aiService = {
  // Get personalized movie recommendations
  getRecommendations: async (userId, limit = 5) => {
    try {
      // In a real implementation, this would call a backend API
      // that runs a more sophisticated recommendation model
      
      // For now, we'll implement a simple content-based filtering approach
      // 1. Get user's watch history and ratings
      // 2. Get user's genre preferences
      // 3. Find similar movies based on genres and ratings
      
      // Get current user's data
      const user = authService.getCurrentUser();
      if (!user) return [];
      
      // Get user's watch history (in a real app, this would come from the backend)
      const watchHistory = await fetchUserWatchHistory(userId || user.id);
      
      // Get user's ratings (in a real app, this would come from the backend)
      const userRatings = await fetchUserRatings(userId || user.id);
      
      // Extract user's genre preferences
      const genrePreferences = extractGenrePreferences(watchHistory, userRatings);
      
      // Get all movies
      const allMovies = await movieService.getMovies();
      
      // Filter out movies the user has already watched
      const unwatchedMovies = allMovies.filter(movie => 
        !watchHistory.some(watched => watched.movieId === movie._id)
      );
      
      // Score each movie based on genre preferences
      const scoredMovies = scoreMoviesByGenrePreference(unwatchedMovies, genrePreferences);
      
      // Sort by score and return top recommendations
      return scoredMovies
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.movie);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },
  
  // Get similar movies to a given movie
  getSimilarMovies: async (movieId, limit = 5) => {
    try {
      // Get the target movie
      const targetMovie = await movieService.getMovieById(movieId);
      if (!targetMovie) return [];
      
      // Get all movies
      const allMovies = await movieService.getMovies();
      
      // Filter out the target movie
      const otherMovies = allMovies.filter(movie => movie._id !== movieId);
      
      // Calculate similarity scores
      const scoredMovies = calculateMovieSimilarity(targetMovie, otherMovies);
      
      // Sort by similarity score and return top similar movies
      return scoredMovies
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.movie);
    } catch (error) {
      console.error('Error getting similar movies:', error);
      return [];
    }
  },
  
  // Predict user rating for a movie
  predictUserRating: async (userId, movieId) => {
    try {
      // Get current user's data
      const user = authService.getCurrentUser();
      if (!user) return 0;
      
      // Get user's ratings
      const userRatings = await fetchUserRatings(userId || user.id);
      
      // Get the movie
      const movie = await movieService.getMovieById(movieId);
      if (!movie) return 0;
      
      // Get similar movies that the user has rated
      const similarMoviesRated = await getSimilarMoviesRated(movie, userRatings);
      
      // If no similar movies rated, return average rating
      if (similarMoviesRated.length === 0) return 3.5;
      
      // Calculate weighted average rating
      let weightedSum = 0;
      let weightSum = 0;
      
      similarMoviesRated.forEach(item => {
        weightedSum += item.rating * item.similarity;
        weightSum += item.similarity;
      });
      
      return weightSum > 0 ? weightedSum / weightSum : 3.5;
    } catch (error) {
      console.error('Error predicting user rating:', error);
      return 3.5; // Default to average rating
    }
  },
  
  // Generate personalized content
  generatePersonalizedContent: async (userId) => {
    try {
      // Get current user's data
      const user = authService.getCurrentUser();
      if (!user) return null;
      
      // Get user's watch history
      const watchHistory = await fetchUserWatchHistory(userId || user.id);
      
      // Get user's ratings
      const userRatings = await fetchUserRatings(userId || user.id);
      
      // Extract user's genre preferences
      const genrePreferences = extractGenrePreferences(watchHistory, userRatings);
      
      // Get top genres
      const topGenres = Object.entries(genrePreferences)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      // Generate personalized content
      return {
        favoriteGenres: topGenres,
        recommendedGenres: topGenres,
        watchTime: calculateTotalWatchTime(watchHistory),
        favoriteActors: extractFavoriteActors(watchHistory, userRatings),
        watchStats: generateWatchStats(watchHistory)
      };
    } catch (error) {
      console.error('Error generating personalized content:', error);
      return null;
    }
  }
};

// Helper functions

// Fetch user's watch history (mock implementation)
async function fetchUserWatchHistory(userId) {
  // In a real app, this would be an API call
  // For now, return mock data
  return [
    { movieId: '1', watchDate: '2023-10-15', duration: 148 },
    { movieId: '3', watchDate: '2023-10-20', duration: 152 },
    { movieId: '7', watchDate: '2023-11-05', duration: 175 }
  ];
}

// Fetch user's ratings (mock implementation)
async function fetchUserRatings(userId) {
  // In a real app, this would be an API call
  // For now, return mock data
  return [
    { movieId: '1', rating: 4.5 },
    { movieId: '3', rating: 5.0 },
    { movieId: '7', rating: 4.0 }
  ];
}

// Extract genre preferences from watch history and ratings
function extractGenrePreferences(watchHistory, userRatings) {
  // In a real app, this would be more sophisticated
  // For now, return mock data
  return {
    'Action': 0.8,
    'Sci-Fi': 0.7,
    'Drama': 0.6,
    'Crime': 0.5,
    'Thriller': 0.4
  };
}

// Score movies based on genre preferences
function scoreMoviesByGenrePreference(movies, genrePreferences) {
  return movies.map(movie => {
    let score = 0;
    
    // Calculate score based on genre match
    if (movie.genres && movie.genres.length > 0) {
      movie.genres.forEach(genre => {
        if (genrePreferences[genre]) {
          score += genrePreferences[genre];
        }
      });
      
      // Normalize score by number of genres
      score = score / movie.genres.length;
    }
    
    return { movie, score };
  });
}

// Calculate similarity between two movies
function calculateMovieSimilarity(targetMovie, otherMovies) {
  return otherMovies.map(movie => {
    let score = 0;
    
    // Genre similarity
    if (targetMovie.genres && movie.genres) {
      const targetGenres = new Set(targetMovie.genres);
      const movieGenres = new Set(movie.genres);
      
      // Calculate Jaccard similarity for genres
      const intersection = new Set([...targetGenres].filter(x => movieGenres.has(x)));
      const union = new Set([...targetGenres, ...movieGenres]);
      
      score += intersection.size / union.size;
    }
    
    // Director similarity
    if (targetMovie.director === movie.director) {
      score += 0.3;
    }
    
    // Cast similarity
    if (targetMovie.cast && movie.cast) {
      const targetCast = new Set(targetMovie.cast);
      const movieCast = new Set(movie.cast);
      
      const commonCast = new Set([...targetCast].filter(x => movieCast.has(x)));
      score += commonCast.size * 0.1;
    }
    
    return { movie, score };
  });
}

// Get similar movies that the user has rated
async function getSimilarMoviesRated(targetMovie, userRatings) {
  // Get all movies
  const allMovies = await movieService.getMovies();
  
  // Filter movies that the user has rated
  const ratedMovies = allMovies.filter(movie => 
    userRatings.some(rating => rating.movieId === movie._id)
  );
  
  // Calculate similarity scores
  const similarityScores = calculateMovieSimilarity(targetMovie, ratedMovies);
  
  // Combine with user ratings
  return similarityScores.map(item => {
    const rating = userRatings.find(r => r.movieId === item.movie._id)?.rating || 0;
    return {
      movie: item.movie,
      similarity: item.score,
      rating
    };
  });
}

// Calculate total watch time
function calculateTotalWatchTime(watchHistory) {
  return watchHistory.reduce((total, item) => total + (item.duration || 0), 0);
}

// Extract favorite actors
function extractFavoriteActors(watchHistory, userRatings) {
  // In a real app, this would be more sophisticated
  // For now, return mock data
  return ['Leonardo DiCaprio', 'Tom Hanks', 'Christian Bale'];
}

// Generate watch statistics
function generateWatchStats(watchHistory) {
  // In a real app, this would be more sophisticated
  // For now, return mock data
  return {
    totalMovies: watchHistory.length,
    averageDuration: watchHistory.reduce((total, item) => total + (item.duration || 0), 0) / watchHistory.length,
    mostWatchedDay: 'Friday'
  };
}

export default aiService;
