/**
 * Advanced Recommendation Service
 * 
 * Provides sophisticated movie recommendations using hybrid filtering techniques:
 * - Collaborative filtering: Based on user behavior and preferences
 * - Content-based filtering: Based on movie attributes
 * - Contextual filtering: Based on time, location, and other contextual factors
 */

import { movieService, authService } from './api';

// Cache for storing computed recommendations
const recommendationCache = {
  collaborative: new Map(),
  contentBased: new Map(),
  hybrid: new Map(),
  trending: null,
  lastUpdated: null
};

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

/**
 * Get user interaction history from localStorage
 */
const getUserInteractions = () => {
  try {
    const interactions = localStorage.getItem('userInteractions');
    return interactions ? JSON.parse(interactions) : [];
  } catch (error) {
    console.error('Error getting user interactions:', error);
    return [];
  }
};

/**
 * Track user interaction with a movie
 * @param {string} movieId - Movie ID
 * @param {string} interactionType - Type of interaction (view, like, rate, bookmark)
 * @param {object} data - Additional data about the interaction
 */
const trackMovieInteraction = (movieId, interactionType, data = {}) => {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    const userId = currentUser.id;
    const interactions = getUserInteractions();
    
    // Add new interaction
    interactions.push({
      userId,
      movieId,
      type: interactionType,
      timestamp: new Date().toISOString(),
      data
    });
    
    // Store in localStorage (limit to last 100 interactions)
    localStorage.setItem('userInteractions', JSON.stringify(
      interactions.slice(-100)
    ));
    
    // Clear cache to ensure fresh recommendations
    clearRecommendationCache(userId);
  } catch (error) {
    console.error('Error tracking movie interaction:', error);
  }
};

/**
 * Clear recommendation cache for a specific user
 * @param {string} userId - User ID
 */
const clearRecommendationCache = (userId) => {
  recommendationCache.collaborative.delete(userId);
  recommendationCache.hybrid.delete(userId);
};

/**
 * Get user genre preferences based on interactions
 * @param {string} userId - User ID
 * @returns {Object} - Genre preferences with weights
 */
const getUserGenrePreferences = async (userId) => {
  const interactions = getUserInteractions().filter(i => i.userId === userId);
  const genreWeights = {};
  
  // Process each interaction
  for (const interaction of interactions) {
    try {
      const movie = await movieService.getMovieById(interaction.movieId);
      
      if (movie && movie.genres) {
        // Calculate weight based on interaction type and recency
        let weight = 1;
        
        // Adjust weight based on interaction type
        switch (interaction.type) {
          case 'view':
            weight = 1;
            break;
          case 'like':
            weight = 3;
            break;
          case 'rate':
            // Weight based on rating (1-5)
            weight = interaction.data.rating || 1;
            break;
          case 'bookmark':
            weight = 4;
            break;
          default:
            weight = 1;
        }
        
        // Adjust weight based on recency (more recent = higher weight)
        const interactionDate = new Date(interaction.timestamp);
        const daysSinceInteraction = (Date.now() - interactionDate.getTime()) / (1000 * 60 * 60 * 24);
        const recencyFactor = Math.max(0.5, 1 - (daysSinceInteraction / 30)); // Decay over 30 days
        
        weight *= recencyFactor;
        
        // Add weight to each genre
        movie.genres.forEach(genre => {
          const genreId = typeof genre === 'object' ? genre._id : genre;
          genreWeights[genreId] = (genreWeights[genreId] || 0) + weight;
        });
      }
    } catch (error) {
      console.error(`Error processing movie ${interaction.movieId}:`, error);
    }
  }
  
  return genreWeights;
};

/**
 * Get collaborative filtering recommendations based on similar users
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} - Recommended movies
 */
const getCollaborativeRecommendations = async (userId, limit = 10) => {
  // Check cache first
  if (recommendationCache.collaborative.has(userId) && 
      Date.now() - recommendationCache.lastUpdated < CACHE_EXPIRATION) {
    return recommendationCache.collaborative.get(userId).slice(0, limit);
  }
  
  try {
    // In a real implementation, this would call an API endpoint
    // For now, we'll simulate collaborative filtering
    
    // 1. Get current user's genre preferences
    const userGenrePreferences = await getUserGenrePreferences(userId);
    
    // 2. Get all movies
    const allMovies = await movieService.getMovies();
    
    // 3. Score each movie based on genre match
    const scoredMovies = allMovies.map(movie => {
      let score = 0;
      
      if (movie.genres) {
        movie.genres.forEach(genre => {
          const genreId = typeof genre === 'object' ? genre._id : genre;
          if (userGenrePreferences[genreId]) {
            score += userGenrePreferences[genreId];
          }
        });
      }
      
      // Adjust score based on movie rating
      if (movie.rating) {
        score *= (movie.rating / 5); // Normalize rating to 0-2 range
      }
      
      return { movie, score };
    });
    
    // 4. Sort by score and filter out movies the user has already interacted with
    const userInteractions = getUserInteractions()
      .filter(i => i.userId === userId)
      .map(i => i.movieId);
    
    const recommendations = scoredMovies
      .filter(item => !userInteractions.includes(item.movie._id))
      .sort((a, b) => b.score - a.score)
      .map(item => item.movie);
    
    // Store in cache
    recommendationCache.collaborative.set(userId, recommendations);
    recommendationCache.lastUpdated = Date.now();
    
    return recommendations.slice(0, limit);
  } catch (error) {
    console.error('Error getting collaborative recommendations:', error);
    return [];
  }
};

/**
 * Get content-based recommendations based on a specific movie
 * @param {string} movieId - Movie ID to base recommendations on
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} - Similar movies
 */
const getContentBasedRecommendations = async (movieId, limit = 10) => {
  // Check cache first
  if (recommendationCache.contentBased.has(movieId) && 
      Date.now() - recommendationCache.lastUpdated < CACHE_EXPIRATION) {
    return recommendationCache.contentBased.get(movieId).slice(0, limit);
  }
  
  try {
    // Get the reference movie
    const referenceMovie = await movieService.getMovieById(movieId);
    
    if (!referenceMovie) {
      throw new Error(`Movie with ID ${movieId} not found`);
    }
    
    // Get all movies
    const allMovies = await movieService.getMovies();
    
    // Score each movie based on similarity
    const scoredMovies = allMovies
      .filter(movie => movie._id !== movieId) // Exclude the reference movie
      .map(movie => {
        let similarityScore = 0;
        
        // Genre similarity (weighted heavily)
        if (referenceMovie.genres && movie.genres) {
          const referenceGenres = referenceMovie.genres.map(g => 
            typeof g === 'object' ? g._id : g
          );
          
          const movieGenres = movie.genres.map(g => 
            typeof g === 'object' ? g._id : g
          );
          
          const commonGenres = referenceGenres.filter(g => movieGenres.includes(g));
          similarityScore += (commonGenres.length / Math.max(referenceGenres.length, 1)) * 3;
        }
        
        // Director similarity
        if (referenceMovie.director && movie.director && 
            referenceMovie.director === movie.director) {
          similarityScore += 2;
        }
        
        // Cast similarity
        if (referenceMovie.cast && movie.cast) {
          const referenceCast = referenceMovie.cast.map(c => 
            typeof c === 'object' ? c._id : c
          );
          
          const movieCast = movie.cast.map(c => 
            typeof c === 'object' ? c._id : c
          );
          
          const commonCast = referenceCast.filter(c => movieCast.includes(c));
          similarityScore += (commonCast.length / Math.max(referenceCast.length, 1)) * 2;
        }
        
        // Rating similarity
        if (referenceMovie.rating && movie.rating) {
          const ratingDiff = Math.abs(referenceMovie.rating - movie.rating);
          similarityScore += (1 - (ratingDiff / 10)) * 1; // Max difference is 10
        }
        
        // Release date proximity (favor movies from similar time periods)
        if (referenceMovie.releaseDate && movie.releaseDate) {
          const referenceYear = new Date(referenceMovie.releaseDate).getFullYear();
          const movieYear = new Date(movie.releaseDate).getFullYear();
          const yearDiff = Math.abs(referenceYear - movieYear);
          
          // Movies within 5 years get a bonus
          if (yearDiff <= 5) {
            similarityScore += (1 - (yearDiff / 5)) * 0.5;
          }
        }
        
        return { movie, similarityScore };
      });
    
    // Sort by similarity score
    const recommendations = scoredMovies
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .map(item => item.movie);
    
    // Store in cache
    recommendationCache.contentBased.set(movieId, recommendations);
    recommendationCache.lastUpdated = Date.now();
    
    return recommendations.slice(0, limit);
  } catch (error) {
    console.error(`Error getting content-based recommendations for movie ${movieId}:`, error);
    return [];
  }
};

/**
 * Get hybrid recommendations combining collaborative and content-based filtering
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} - Recommended movies
 */
const getHybridRecommendations = async (userId, limit = 10) => {
  // Check cache first
  if (recommendationCache.hybrid.has(userId) && 
      Date.now() - recommendationCache.lastUpdated < CACHE_EXPIRATION) {
    return recommendationCache.hybrid.get(userId).slice(0, limit);
  }
  
  try {
    // Get collaborative recommendations
    const collaborativeRecs = await getCollaborativeRecommendations(userId, limit * 2);
    
    // Get content-based recommendations based on user's recent interactions
    const userInteractions = getUserInteractions()
      .filter(i => i.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let contentBasedRecs = [];
    
    // Use the most recent interaction for content-based recommendations
    if (userInteractions.length > 0) {
      const recentMovieId = userInteractions[0].movieId;
      contentBasedRecs = await getContentBasedRecommendations(recentMovieId, limit * 2);
    }
    
    // Combine recommendations with weighting
    const allRecommendations = new Map();
    
    // Add collaborative recommendations with weight
    collaborativeRecs.forEach((movie, index) => {
      const weight = 1 - (index / (collaborativeRecs.length * 2)); // Higher position = higher weight
      allRecommendations.set(movie._id, {
        movie,
        score: (allRecommendations.get(movie._id)?.score || 0) + weight
      });
    });
    
    // Add content-based recommendations with weight
    contentBasedRecs.forEach((movie, index) => {
      const weight = 1 - (index / (contentBasedRecs.length * 2)); // Higher position = higher weight
      allRecommendations.set(movie._id, {
        movie,
        score: (allRecommendations.get(movie._id)?.score || 0) + weight * 1.2 // Slightly favor content-based
      });
    });
    
    // Add contextual factors
    
    // Time of day factor (recommend different movies based on time)
    const hour = new Date().getHours();
    const allMovies = Array.from(allRecommendations.values());
    
    allMovies.forEach(item => {
      const movie = item.movie;
      
      // Evening/night (6PM-6AM): Favor horror, thriller, action
      if ((hour >= 18 || hour < 6) && movie.genres) {
        const eveningGenres = ['Horror', 'Thriller', 'Action'];
        const hasEveningGenre = movie.genres.some(g => 
          eveningGenres.includes(typeof g === 'object' ? g.name : g)
        );
        
        if (hasEveningGenre) {
          item.score += 0.2;
        }
      }
      
      // Morning/afternoon (6AM-6PM): Favor family, comedy, documentary
      if (hour >= 6 && hour < 18 && movie.genres) {
        const dayGenres = ['Family', 'Comedy', 'Documentary', 'Animation'];
        const hasDayGenre = movie.genres.some(g => 
          dayGenres.includes(typeof g === 'object' ? g.name : g)
        );
        
        if (hasDayGenre) {
          item.score += 0.2;
        }
      }
      
      // Weekend factor
      const isWeekend = [0, 6].includes(new Date().getDay());
      if (isWeekend && movie.duration > 120) { // Longer movies on weekends
        item.score += 0.1;
      }
    });
    
    // Sort by final score
    const recommendations = allMovies
      .sort((a, b) => b.score - a.score)
      .map(item => item.movie);
    
    // Store in cache
    recommendationCache.hybrid.set(userId, recommendations);
    recommendationCache.lastUpdated = Date.now();
    
    return recommendations.slice(0, limit);
  } catch (error) {
    console.error('Error getting hybrid recommendations:', error);
    return [];
  }
};

/**
 * Get trending movies based on recent popularity
 * @param {number} limit - Maximum number of trending movies
 * @returns {Promise<Array>} - Trending movies
 */
const getTrendingMovies = async (limit = 10) => {
  // Check cache first
  if (recommendationCache.trending && 
      Date.now() - recommendationCache.lastUpdated < CACHE_EXPIRATION) {
    return recommendationCache.trending.slice(0, limit);
  }
  
  try {
    // Get all movies
    const allMovies = await movieService.getMovies();
    
    // Get all user interactions
    const allInteractions = getUserInteractions();
    
    // Consider only recent interactions (last 7 days)
    const recentCutoff = new Date();
    recentCutoff.setDate(recentCutoff.getDate() - 7);
    
    const recentInteractions = allInteractions.filter(interaction => 
      new Date(interaction.timestamp) >= recentCutoff
    );
    
    // Count interactions per movie
    const movieInteractionCounts = {};
    
    recentInteractions.forEach(interaction => {
      const { movieId, type } = interaction;
      
      if (!movieInteractionCounts[movieId]) {
        movieInteractionCounts[movieId] = { total: 0, views: 0, likes: 0, rates: 0 };
      }
      
      movieInteractionCounts[movieId].total += 1;
      
      // Count by type
      switch (type) {
        case 'view':
          movieInteractionCounts[movieId].views += 1;
          break;
        case 'like':
          movieInteractionCounts[movieId].likes += 1;
          break;
        case 'rate':
          movieInteractionCounts[movieId].rates += 1;
          break;
      }
    });
    
    // Score each movie based on interaction counts
    const scoredMovies = allMovies.map(movie => {
      const interactions = movieInteractionCounts[movie._id] || { total: 0, views: 0, likes: 0, rates: 0 };
      
      // Calculate trend score (weighted by interaction type)
      const trendScore = 
        (interactions.views * 1) + 
        (interactions.likes * 3) + 
        (interactions.rates * 2);
      
      // Adjust by movie rating
      const adjustedScore = movie.rating ? trendScore * (movie.rating / 5) : trendScore;
      
      return { movie, trendScore: adjustedScore };
    });
    
    // Sort by trend score
    const trending = scoredMovies
      .sort((a, b) => b.trendScore - a.trendScore)
      .map(item => ({
        ...item.movie,
        trendScore: item.trendScore,
        trendDirection: getTrendDirection(item.movie._id)
      }));
    
    // Store in cache
    recommendationCache.trending = trending;
    recommendationCache.lastUpdated = Date.now();
    
    return trending.slice(0, limit);
  } catch (error) {
    console.error('Error getting trending movies:', error);
    return [];
  }
};

/**
 * Determine trend direction for a movie
 * @param {string} movieId - Movie ID
 * @returns {string} - Trend direction ('rising', 'falling', or 'stable')
 */
const getTrendDirection = (movieId) => {
  try {
    const allInteractions = getUserInteractions();
    
    // Get interactions for this movie
    const movieInteractions = allInteractions.filter(i => i.movieId === movieId);
    
    if (movieInteractions.length < 3) {
      return 'stable'; // Not enough data
    }
    
    // Compare recent vs older interactions
    const now = new Date();
    const threeDaysAgo = new Date(now.setDate(now.getDate() - 3));
    const sixDaysAgo = new Date(now.setDate(now.getDate() - 3)); // 6 days ago from today
    
    const recentInteractions = movieInteractions.filter(i => 
      new Date(i.timestamp) >= threeDaysAgo
    );
    
    const olderInteractions = movieInteractions.filter(i => 
      new Date(i.timestamp) < threeDaysAgo && new Date(i.timestamp) >= sixDaysAgo
    );
    
    if (recentInteractions.length > olderInteractions.length * 1.2) {
      return 'rising';
    } else if (recentInteractions.length < olderInteractions.length * 0.8) {
      return 'falling';
    } else {
      return 'stable';
    }
  } catch (error) {
    console.error(`Error determining trend direction for movie ${movieId}:`, error);
    return 'stable';
  }
};

/**
 * Get personalized recommendations for a user
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} - Personalized movie recommendations
 */
const getPersonalizedRecommendations = async (userId, limit = 10) => {
  try {
    if (!userId) {
      // For anonymous users, return trending movies
      return getTrendingMovies(limit);
    }
    
    // For logged-in users, use hybrid recommendations
    return getHybridRecommendations(userId, limit);
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
};

/**
 * Get recommendations for "Because you watched" section
 * @param {string} movieId - Movie ID that was watched
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} - Similar movies
 */
const getBecauseYouWatchedRecommendations = async (movieId, limit = 5) => {
  try {
    return getContentBasedRecommendations(movieId, limit);
  } catch (error) {
    console.error(`Error getting "Because you watched" recommendations for movie ${movieId}:`, error);
    return [];
  }
};

/**
 * Get diverse recommendations covering different genres
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} - Diverse movie recommendations
 */
const getDiverseRecommendations = async (userId, limit = 10) => {
  try {
    // Get user's genre preferences
    const genrePreferences = await getUserGenrePreferences(userId);
    
    // Get all movies
    const allMovies = await movieService.getMovies();
    
    // Group movies by genre
    const moviesByGenre = {};
    
    allMovies.forEach(movie => {
      if (movie.genres) {
        movie.genres.forEach(genre => {
          const genreId = typeof genre === 'object' ? genre._id : genre;
          const genreName = typeof genre === 'object' ? genre.name : genre;
          
          if (!moviesByGenre[genreId]) {
            moviesByGenre[genreId] = {
              name: genreName,
              movies: []
            };
          }
          
          moviesByGenre[genreId].movies.push(movie);
        });
      }
    });
    
    // Sort genres by user preference
    const sortedGenres = Object.entries(moviesByGenre)
      .map(([genreId, data]) => ({
        genreId,
        name: data.name,
        weight: genrePreferences[genreId] || 0,
        movies: data.movies
      }))
      .sort((a, b) => b.weight - a.weight);
    
    // Select top genres
    const topGenres = sortedGenres.slice(0, Math.min(5, sortedGenres.length));
    
    // Select movies from each genre
    const recommendations = [];
    const moviesPerGenre = Math.ceil(limit / topGenres.length);
    
    topGenres.forEach(genre => {
      // Sort movies within genre by rating
      const sortedMovies = [...genre.movies].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
      // Add top movies from this genre
      recommendations.push(...sortedMovies.slice(0, moviesPerGenre));
    });
    
    // Deduplicate and limit
    const uniqueMovies = [];
    const seenIds = new Set();
    
    for (const movie of recommendations) {
      if (!seenIds.has(movie._id)) {
        uniqueMovies.push(movie);
        seenIds.add(movie._id);
        
        if (uniqueMovies.length >= limit) {
          break;
        }
      }
    }
    
    return uniqueMovies;
  } catch (error) {
    console.error('Error getting diverse recommendations:', error);
    return [];
  }
};

// Export the service
const advancedRecommendationService = {
  trackMovieInteraction,
  getPersonalizedRecommendations,
  getContentBasedRecommendations,
  getCollaborativeRecommendations,
  getHybridRecommendations,
  getTrendingMovies,
  getBecauseYouWatchedRecommendations,
  getDiverseRecommendations
};

export default advancedRecommendationService;
