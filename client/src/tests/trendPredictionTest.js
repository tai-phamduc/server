// Test file for trend prediction services
import trendPredictionService from '../services/trendPredictionService';

// Sample movie IDs for testing
const sampleMovieIds = [
  '1', // Inception
  '2', // The Shawshank Redemption
  '3', // The Dark Knight
  '4', // Pulp Fiction
  '5'  // The Matrix
];

// Test movie popularity prediction
async function testMoviePopularityPrediction() {
  console.log('=== Testing Movie Popularity Prediction ===');
  
  const results = [];
  
  for (const movieId of sampleMovieIds) {
    try {
      const prediction = await trendPredictionService.predictMoviePopularity(movieId);
      console.log(`Movie ${movieId} popularity:`, prediction.popularityScore, 'Trend:', prediction.trendDirection);
      results.push(prediction);
    } catch (error) {
      console.error(`Error predicting popularity for movie ${movieId}:`, error);
    }
  }
  
  return results;
}

// Test box office prediction
async function testBoxOfficePrediction() {
  console.log('\n=== Testing Box Office Prediction ===');
  
  const results = [];
  
  for (const movieId of sampleMovieIds) {
    try {
      const prediction = await trendPredictionService.predictBoxOffice(movieId);
      console.log(`Movie ${movieId} box office:`, prediction.formattedRevenue, 'Range:', prediction.range.formatted);
      results.push(prediction);
    } catch (error) {
      console.error(`Error predicting box office for movie ${movieId}:`, error);
    }
  }
  
  return results;
}

// Test audience demographics prediction
async function testAudienceDemographics() {
  console.log('\n=== Testing Audience Demographics Prediction ===');
  
  const results = [];
  
  for (const movieId of sampleMovieIds.slice(0, 2)) { // Test only first 2 movies
    try {
      const prediction = await trendPredictionService.predictAudienceDemographics(movieId);
      console.log(`Movie ${movieId} demographics:`, 
        'Male:', prediction.demographics.gender.male + '%',
        'Female:', prediction.demographics.gender.female + '%');
      console.log('Age groups:', prediction.demographics.age);
      results.push(prediction);
    } catch (error) {
      console.error(`Error predicting demographics for movie ${movieId}:`, error);
    }
  }
  
  return results;
}

// Test trending movies
async function testTrendingMovies() {
  console.log('\n=== Testing Trending Movies ===');
  
  try {
    const trending = await trendPredictionService.getTrendingMovies(3);
    console.log('Top trending movies:', trending.map(movie => ({
      title: movie.title,
      score: movie.trendingScore,
      trend: movie.trendDirection
    })));
    return trending;
  } catch (error) {
    console.error('Error getting trending movies:', error);
    return [];
  }
}

// Test sentiment prediction
async function testSentimentPrediction() {
  console.log('\n=== Testing Sentiment Prediction ===');
  
  const results = [];
  
  for (const movieId of sampleMovieIds.slice(0, 2)) { // Test only first 2 movies
    try {
      const prediction = await trendPredictionService.predictSentiment(movieId);
      console.log(`Movie ${movieId} sentiment:`, prediction.sentiment, 
        'Positive:', prediction.distribution.positive + '%',
        'Negative:', prediction.distribution.negative + '%');
      results.push(prediction);
    } catch (error) {
      console.error(`Error predicting sentiment for movie ${movieId}:`, error);
    }
  }
  
  return results;
}

// Run all tests
async function runAllTests() {
  try {
    const popularityResults = await testMoviePopularityPrediction();
    const boxOfficeResults = await testBoxOfficePrediction();
    const demographicsResults = await testAudienceDemographics();
    const trendingResults = await testTrendingMovies();
    const sentimentResults = await testSentimentPrediction();
    
    console.log('\n=== Test Summary ===');
    console.log('Popularity predictions:', popularityResults.length);
    console.log('Box office predictions:', boxOfficeResults.length);
    console.log('Demographics predictions:', demographicsResults.length);
    console.log('Trending movies:', trendingResults.length);
    console.log('Sentiment predictions:', sentimentResults.length);
    
    return {
      success: true,
      popularityResults,
      boxOfficeResults,
      demographicsResults,
      trendingResults,
      sentimentResults
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
window.trendTest = {
  runAllTests,
  testMoviePopularityPrediction,
  testBoxOfficePrediction,
  testAudienceDemographics,
  testTrendingMovies,
  testSentimentPrediction,
  sampleMovieIds
};

console.log('Trend prediction test module loaded. Run tests using window.trendTest.runAllTests()');
