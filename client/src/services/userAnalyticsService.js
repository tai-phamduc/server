import * as tf from '@tensorflow/tfjs';
import { authService, movieService, searchService } from './api';

// User Analytics Service
const userAnalyticsService = {
  // Track user interactions
  trackInteraction: async (interactionData) => {
    try {
      // In a real implementation, this would send data to a backend API
      // For now, we'll store it in localStorage for demo purposes
      
      const { userId, type, itemId, data } = interactionData;
      
      // Get current user
      const user = authService.getCurrentUser();
      if (!user) return false;
      
      // Create interaction object
      const interaction = {
        userId: userId || user.id,
        type, // view, click, search, book, rate, etc.
        itemId, // movie ID, event ID, etc.
        timestamp: new Date().toISOString(),
        data // additional data
      };
      
      // Get existing interactions from localStorage
      const existingInteractions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
      
      // Add new interaction
      existingInteractions.push(interaction);
      
      // Store updated interactions
      localStorage.setItem('userInteractions', JSON.stringify(existingInteractions));
      
      return true;
    } catch (error) {
      console.error('Error tracking interaction:', error);
      return false;
    }
  },
  
  // Get user viewing history
  getViewingHistory: async (userId) => {
    try {
      // In a real implementation, this would call a backend API
      // For now, we'll use localStorage for demo purposes
      
      // Get current user
      const user = authService.getCurrentUser();
      if (!user) return [];
      
      // Get interactions from localStorage
      const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
      
      // Filter view interactions for the user
      const viewInteractions = interactions.filter(
        interaction => interaction.userId === (userId || user.id) && interaction.type === 'view'
      );
      
      // Get unique movie IDs
      const movieIds = [...new Set(viewInteractions.map(interaction => interaction.itemId))];
      
      // Get movie details
      const movies = await Promise.all(
        movieIds.map(async (id) => {
          try {
            return await movieService.getMovieById(id);
          } catch (error) {
            console.error(`Error fetching movie ${id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out null values and sort by most recent view
      return movies
        .filter(movie => movie !== null)
        .sort((a, b) => {
          const aLastView = viewInteractions
            .filter(interaction => interaction.itemId === a._id)
            .sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp))[0];
          
          const bLastView = viewInteractions
            .filter(interaction => interaction.itemId === b._id)
            .sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp))[0];
          
          return new Date(bLastView.timestamp) - new Date(aLastView.timestamp);
        });
    } catch (error) {
      console.error('Error getting viewing history:', error);
      return [];
    }
  },
  
  // Get user search history
  getSearchHistory: async (userId) => {
    try {
      // Get current user
      const user = authService.getCurrentUser();
      if (!user) return [];
      
      // Get interactions from localStorage
      const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
      
      // Filter search interactions for the user
      const searchInteractions = interactions.filter(
        interaction => interaction.userId === (userId || user.id) && interaction.type === 'search'
      );
      
      // Sort by most recent search and get unique queries
      const uniqueSearches = [];
      const seenQueries = new Set();
      
      searchInteractions
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .forEach(interaction => {
          const query = interaction.data.query;
          if (!seenQueries.has(query)) {
            seenQueries.add(query);
            uniqueSearches.push({
              query,
              timestamp: interaction.timestamp
            });
          }
        });
      
      return uniqueSearches.slice(0, 10); // Return top 10 most recent unique searches
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  },
  
  // Get user genre preferences
  getGenrePreferences: async (userId) => {
    try {
      // Get current user
      const user = authService.getCurrentUser();
      if (!user) return {};
      
      // Get interactions from localStorage
      const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
      
      // Filter view and rate interactions for the user
      const relevantInteractions = interactions.filter(
        interaction => interaction.userId === (userId || user.id) && 
        (interaction.type === 'view' || interaction.type === 'rate' || interaction.type === 'book')
      );
      
      // Get unique movie IDs
      const movieIds = [...new Set(relevantInteractions.map(interaction => interaction.itemId))];
      
      // Get movie details
      const movies = await Promise.all(
        movieIds.map(async (id) => {
          try {
            return await movieService.getMovieById(id);
          } catch (error) {
            console.error(`Error fetching movie ${id}:`, error);
            return null;
          }
        })
      );
      
      // Count genre occurrences with weights
      const genreCounts = {};
      
      movies.filter(movie => movie !== null).forEach(movie => {
        if (!movie.genres || !Array.isArray(movie.genres)) return;
        
        // Get interactions for this movie
        const movieInteractions = relevantInteractions.filter(
          interaction => interaction.itemId === movie._id
        );
        
        // Calculate weight based on interaction types
        let weight = 0;
        movieInteractions.forEach(interaction => {
          switch (interaction.type) {
            case 'view':
              weight += 1;
              break;
            case 'rate':
              weight += interaction.data.rating || 3;
              break;
            case 'book':
              weight += 5;
              break;
            default:
              weight += 0.5;
          }
        });
        
        // Add weighted counts to genres
        movie.genres.forEach(genre => {
          const genreName = typeof genre === 'string' ? genre : (genre.name || '');
          if (genreName) {
            genreCounts[genreName] = (genreCounts[genreName] || 0) + weight;
          }
        });
      });
      
      // Calculate percentages
      const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
      const genrePercentages = {};
      
      Object.entries(genreCounts).forEach(([genre, count]) => {
        genrePercentages[genre] = total > 0 ? (count / total) * 100 : 0;
      });
      
      // Sort genres by percentage
      const sortedGenres = Object.entries(genrePercentages)
        .sort((a, b) => b[1] - a[1])
        .map(([genre, percentage]) => ({
          name: genre,
          percentage: Math.round(percentage)
        }));
      
      return {
        genres: sortedGenres,
        topGenre: sortedGenres.length > 0 ? sortedGenres[0].name : null,
        diversityScore: calculateDiversityScore(genrePercentages)
      };
    } catch (error) {
      console.error('Error getting genre preferences:', error);
      return {
        genres: [],
        topGenre: null,
        diversityScore: 0
      };
    }
  },
  
  // Get user activity summary
  getActivitySummary: async (userId) => {
    try {
      // Get current user
      const user = authService.getCurrentUser();
      if (!user) return null;
      
      // Get interactions from localStorage
      const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
      
      // Filter interactions for the user
      const userInteractions = interactions.filter(
        interaction => interaction.userId === (userId || user.id)
      );
      
      // Count interaction types
      const counts = {
        views: userInteractions.filter(i => i.type === 'view').length,
        searches: userInteractions.filter(i => i.type === 'search').length,
        bookings: userInteractions.filter(i => i.type === 'book').length,
        ratings: userInteractions.filter(i => i.type === 'rate').length,
        total: userInteractions.length
      };
      
      // Get unique movie IDs
      const movieIds = [...new Set(
        userInteractions
          .filter(i => i.type === 'view' || i.type === 'book' || i.type === 'rate')
          .map(i => i.itemId)
      )];
      
      // Calculate activity score (simple weighted sum)
      const activityScore = counts.views + 
                           counts.searches * 2 + 
                           counts.bookings * 5 + 
                           counts.ratings * 3;
      
      // Get most active day of week
      const dayCount = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, ..., Sat
      
      userInteractions.forEach(interaction => {
        const date = new Date(interaction.timestamp);
        const day = date.getDay();
        dayCount[day]++;
      });
      
      const mostActiveDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
        dayCount.indexOf(Math.max(...dayCount))
      ];
      
      // Get most recent activity
      const mostRecent = userInteractions.length > 0 
        ? new Date(Math.max(...userInteractions.map(i => new Date(i.timestamp))))
        : null;
      
      return {
        counts,
        uniqueMovies: movieIds.length,
        activityScore,
        mostActiveDay,
        mostRecent: mostRecent ? mostRecent.toISOString() : null,
        lastActive: mostRecent ? formatTimeAgo(mostRecent) : 'Never'
      };
    } catch (error) {
      console.error('Error getting activity summary:', error);
      return null;
    }
  },
  
  // Get user engagement score
  getEngagementScore: async (userId) => {
    try {
      // Get activity summary
      const activitySummary = await userAnalyticsService.getActivitySummary(userId);
      if (!activitySummary) return 0;
      
      // Calculate engagement score (0-100)
      // This is a simplified model - in a real app, this would be more sophisticated
      
      // Base score from activity
      let score = Math.min(activitySummary.activityScore / 10, 40);
      
      // Bonus for diversity of actions
      const actionTypes = Object.entries(activitySummary.counts)
        .filter(([key, count]) => key !== 'total' && count > 0)
        .length;
      
      score += actionTypes * 10;
      
      // Bonus for recency
      if (activitySummary.mostRecent) {
        const daysSinceLastActivity = (new Date() - new Date(activitySummary.mostRecent)) / (1000 * 60 * 60 * 24);
        if (daysSinceLastActivity < 1) {
          score += 20;
        } else if (daysSinceLastActivity < 7) {
          score += 10;
        } else if (daysSinceLastActivity < 30) {
          score += 5;
        }
      }
      
      // Cap at 100
      return Math.min(Math.round(score), 100);
    } catch (error) {
      console.error('Error calculating engagement score:', error);
      return 0;
    }
  },
  
  // Get personalized insights
  getPersonalizedInsights: async (userId) => {
    try {
      // Get current user
      const user = authService.getCurrentUser();
      if (!user) return [];
      
      // Get genre preferences
      const genrePreferences = await userAnalyticsService.getGenrePreferences(userId || user.id);
      
      // Get activity summary
      const activitySummary = await userAnalyticsService.getActivitySummary(userId || user.id);
      
      // Generate insights
      const insights = [];
      
      // Genre preference insights
      if (genrePreferences.genres.length > 0) {
        insights.push({
          type: 'genre_preference',
          title: `You love ${genrePreferences.topGenre} movies!`,
          description: `${genrePreferences.topGenre} makes up ${genrePreferences.genres[0].percentage}% of your viewing history.`,
          actionable: true,
          action: 'Explore more in this genre',
          actionLink: `/movies?genre=${genrePreferences.topGenre}`
        });
        
        // Diversity insight
        if (genrePreferences.diversityScore < 0.5) {
          insights.push({
            type: 'diversity',
            title: 'Expand your horizons',
            description: 'You tend to watch similar genres. Try exploring different types of movies to discover new favorites!',
            actionable: true,
            action: 'Discover new genres',
            actionLink: '/movies'
          });
        } else {
          insights.push({
            type: 'diversity',
            title: 'Diverse taste in movies',
            description: 'You enjoy a wide variety of movie genres. That\'s great for discovering new favorites!',
            actionable: false
          });
        }
      }
      
      // Activity insights
      if (activitySummary) {
        if (activitySummary.counts.bookings === 0) {
          insights.push({
            type: 'booking',
            title: 'Ready to book your first ticket?',
            description: 'You\'ve browsed movies but haven\'t booked a ticket yet. Check out what\'s playing now!',
            actionable: true,
            action: 'See Now Playing',
            actionLink: '/movies?status=Now Playing'
          });
        } else {
          insights.push({
            type: 'booking',
            title: 'Movie night enthusiast',
            description: `You've booked tickets ${activitySummary.counts.bookings} times. Keep enjoying the big screen experience!`,
            actionable: false
          });
        }
        
        if (activitySummary.counts.ratings === 0 && activitySummary.counts.views > 0) {
          insights.push({
            type: 'rating',
            title: 'Share your opinion',
            description: 'You\'ve viewed movie details but haven\'t rated any movies yet. Ratings help us recommend better movies for you!',
            actionable: true,
            action: 'Rate movies you\'ve watched',
            actionLink: '/movies'
          });
        }
      }
      
      return insights;
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      return [];
    }
  }
};

// Helper function to calculate diversity score (0-1)
// Higher score means more diverse genre preferences
const calculateDiversityScore = (genrePercentages) => {
  const values = Object.values(genrePercentages);
  if (values.length <= 1) return 0;
  
  // Calculate Shannon entropy and normalize
  const sum = values.reduce((acc, val) => acc + val, 0);
  let entropy = 0;
  
  values.forEach(value => {
    if (value > 0) {
      const p = value / sum;
      entropy -= p * Math.log2(p);
    }
  });
  
  // Normalize to 0-1 range (max entropy is log2(n) where n is number of genres)
  const maxEntropy = Math.log2(values.length);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }
  
  return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
};

export default userAnalyticsService;
