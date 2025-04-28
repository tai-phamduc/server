// Test file for user analytics services
import userAnalyticsService from '../services/userAnalyticsService';

// Sample user interactions for testing
const sampleInteractions = [
  {
    userId: 'user1',
    type: 'view',
    itemId: '1', // Inception
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    data: { duration: 5 }
  },
  {
    userId: 'user1',
    type: 'view',
    itemId: '3', // The Dark Knight
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    data: { duration: 8 }
  },
  {
    userId: 'user1',
    type: 'rate',
    itemId: '1', // Inception
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    data: { rating: 4.5 }
  },
  {
    userId: 'user1',
    type: 'search',
    itemId: null,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    data: { query: 'action movies' }
  },
  {
    userId: 'user1',
    type: 'search',
    itemId: null,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    data: { query: 'sci-fi movies' }
  },
  {
    userId: 'user1',
    type: 'book',
    itemId: '3', // The Dark Knight
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    data: { seats: ['A1', 'A2'], amount: 25 }
  }
];

// Setup test data
function setupTestData() {
  console.log('=== Setting up test data ===');
  
  // Clear existing interactions
  localStorage.removeItem('userInteractions');
  
  // Add sample interactions
  for (const interaction of sampleInteractions) {
    userAnalyticsService.trackInteraction(interaction);
  }
  
  console.log('Test data setup complete');
}

// Test viewing history
async function testViewingHistory() {
  console.log('\n=== Testing Viewing History ===');
  
  try {
    const history = await userAnalyticsService.getViewingHistory('user1');
    console.log('Viewing history:', history.map(movie => movie.title));
    return history;
  } catch (error) {
    console.error('Error getting viewing history:', error);
    return [];
  }
}

// Test search history
async function testSearchHistory() {
  console.log('\n=== Testing Search History ===');
  
  try {
    const history = await userAnalyticsService.getSearchHistory('user1');
    console.log('Search history:', history.map(item => item.query));
    return history;
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
}

// Test genre preferences
async function testGenrePreferences() {
  console.log('\n=== Testing Genre Preferences ===');
  
  try {
    const preferences = await userAnalyticsService.getGenrePreferences('user1');
    console.log('Genre preferences:', preferences.genres);
    console.log('Top genre:', preferences.topGenre);
    console.log('Diversity score:', preferences.diversityScore);
    return preferences;
  } catch (error) {
    console.error('Error getting genre preferences:', error);
    return null;
  }
}

// Test activity summary
async function testActivitySummary() {
  console.log('\n=== Testing Activity Summary ===');
  
  try {
    const summary = await userAnalyticsService.getActivitySummary('user1');
    console.log('Activity counts:', summary.counts);
    console.log('Unique movies:', summary.uniqueMovies);
    console.log('Activity score:', summary.activityScore);
    console.log('Most active day:', summary.mostActiveDay);
    console.log('Last active:', summary.lastActive);
    return summary;
  } catch (error) {
    console.error('Error getting activity summary:', error);
    return null;
  }
}

// Test engagement score
async function testEngagementScore() {
  console.log('\n=== Testing Engagement Score ===');
  
  try {
    const score = await userAnalyticsService.getEngagementScore('user1');
    console.log('Engagement score:', score);
    return score;
  } catch (error) {
    console.error('Error getting engagement score:', error);
    return 0;
  }
}

// Test personalized insights
async function testPersonalizedInsights() {
  console.log('\n=== Testing Personalized Insights ===');
  
  try {
    const insights = await userAnalyticsService.getPersonalizedInsights('user1');
    console.log('Personalized insights:', insights);
    return insights;
  } catch (error) {
    console.error('Error getting personalized insights:', error);
    return [];
  }
}

// Run all tests
async function runAllTests() {
  try {
    setupTestData();
    
    const viewingHistory = await testViewingHistory();
    const searchHistory = await testSearchHistory();
    const genrePreferences = await testGenrePreferences();
    const activitySummary = await testActivitySummary();
    const engagementScore = await testEngagementScore();
    const personalizedInsights = await testPersonalizedInsights();
    
    console.log('\n=== Test Summary ===');
    console.log('Viewing history items:', viewingHistory.length);
    console.log('Search history items:', searchHistory.length);
    console.log('Genre preferences:', genrePreferences ? genrePreferences.genres.length : 0);
    console.log('Activity types:', activitySummary ? Object.keys(activitySummary.counts).length : 0);
    console.log('Engagement score:', engagementScore);
    console.log('Personalized insights:', personalizedInsights.length);
    
    return {
      success: true,
      viewingHistory,
      searchHistory,
      genrePreferences,
      activitySummary,
      engagementScore,
      personalizedInsights
    };
  } catch (error) {
    console.error('Test failed:', error);
    return {
      success: false,
      error
    };
  }
}

// Export functions for use in browser console
window.userAnalyticsTest = {
  runAllTests,
  setupTestData,
  testViewingHistory,
  testSearchHistory,
  testGenrePreferences,
  testActivitySummary,
  testEngagementScore,
  testPersonalizedInsights,
  sampleInteractions
};

console.log('User analytics test module loaded. Run tests using window.userAnalyticsTest.runAllTests()');
