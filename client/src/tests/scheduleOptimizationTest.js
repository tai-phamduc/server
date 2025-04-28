// Test file for schedule optimization services
import scheduleOptimizationService from '../services/scheduleOptimizationService';

// Sample theater and date for testing
const sampleTheaterId = '1';
const sampleDate = new Date().toISOString().split('T')[0]; // Today
const futureDates = [
  new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]  // Next week
];

// Sample hall and time slot for testing
const sampleHalls = ['hall1', 'hall2', 'hall3', 'hall4'];
const sampleTimeSlots = ['morning', 'afternoon', 'evening', 'night'];

// Test schedule optimization
async function testScheduleOptimization() {
  console.log('=== Testing Schedule Optimization ===');
  
  const results = [];
  
  for (const date of [sampleDate, ...futureDates.slice(0, 1)]) { // Test today and tomorrow
    try {
      console.log(`\nOptimizing schedule for date: ${date}`);
      const optimizedSchedule = await scheduleOptimizationService.optimizeSchedule(sampleTheaterId, date);
      
      console.log('Schedule metrics:');
      console.log('- Total attendance:', optimizedSchedule.metrics.totalAttendance);
      console.log('- Total revenue:', optimizedSchedule.metrics.revenueFormatted);
      console.log('- Overall attendance percentage:', optimizedSchedule.metrics.overallAttendancePercentage + '%');
      
      console.log('Recommendations count:', optimizedSchedule.recommendations.length);
      console.log('Schedule items count:', optimizedSchedule.schedule.length);
      
      results.push(optimizedSchedule);
    } catch (error) {
      console.error(`Error optimizing schedule for date ${date}:`, error);
    }
  }
  
  return results;
}

// Test attendance prediction
async function testAttendancePrediction() {
  console.log('\n=== Testing Attendance Prediction ===');
  
  const results = [];
  
  // Test a few combinations of movie, hall, time slot
  const testCases = [
    { movieId: '1', hallId: 'hall1', timeSlot: 'evening' },
    { movieId: '2', hallId: 'hall2', timeSlot: 'afternoon' },
    { movieId: '3', hallId: 'hall1', timeSlot: 'night' }
  ];
  
  for (const testCase of testCases) {
    try {
      const prediction = await scheduleOptimizationService.predictAttendance(
        null, testCase.movieId, testCase.hallId, testCase.timeSlot, sampleDate
      );
      
      console.log(`\nAttendance prediction for movie ${testCase.movieId} in ${testCase.hallId} at ${testCase.timeSlot}:`);
      console.log('- Expected attendance:', prediction.expectedAttendance);
      console.log('- Attendance percentage:', prediction.attendancePercentage + '%');
      console.log('- Expected revenue:', prediction.expectedRevenue);
      
      results.push(prediction);
    } catch (error) {
      console.error(`Error predicting attendance for movie ${testCase.movieId}:`, error);
    }
  }
  
  return results;
}

// Test optimal movie selection
async function testOptimalMovie() {
  console.log('\n=== Testing Optimal Movie Selection ===');
  
  const results = [];
  
  // Test a few combinations of hall and time slot
  const testCases = [
    { hallId: 'hall1', timeSlot: 'evening' },
    { hallId: 'hall2', timeSlot: 'afternoon' },
    { hallId: 'hall3', timeSlot: 'night' }
  ];
  
  for (const testCase of testCases) {
    try {
      const optimalMovie = await scheduleOptimizationService.getOptimalMovie(
        testCase.hallId, testCase.timeSlot, sampleDate
      );
      
      console.log(`\nOptimal movie for ${testCase.hallId} at ${testCase.timeSlot}:`);
      console.log('- Movie:', optimalMovie.title);
      console.log('- Expected attendance:', optimalMovie.attendance.expectedAttendance);
      console.log('- Expected revenue:', optimalMovie.attendance.expectedRevenue);
      
      results.push(optimalMovie);
    } catch (error) {
      console.error(`Error finding optimal movie for ${testCase.hallId} at ${testCase.timeSlot}:`, error);
    }
  }
  
  return results;
}

// Test schedule recommendations
async function testScheduleRecommendations() {
  console.log('\n=== Testing Schedule Recommendations ===');
  
  try {
    const recommendations = await scheduleOptimizationService.generateRecommendations(sampleTheaterId, sampleDate);
    
    console.log('Schedule recommendations:');
    recommendations.forEach((recommendation, index) => {
      console.log(`\nRecommendation ${index + 1} (${recommendation.type}):`);
      console.log(recommendation.message);
    });
    
    return recommendations;
  } catch (error) {
    console.error('Error generating schedule recommendations:', error);
    return [];
  }
}

// Run all tests
async function runAllTests() {
  try {
    const scheduleResults = await testScheduleOptimization();
    const attendanceResults = await testAttendancePrediction();
    const optimalMovieResults = await testOptimalMovie();
    const recommendationResults = await testScheduleRecommendations();
    
    console.log('\n=== Test Summary ===');
    console.log('Schedule optimizations:', scheduleResults.length);
    console.log('Attendance predictions:', attendanceResults.length);
    console.log('Optimal movie selections:', optimalMovieResults.length);
    console.log('Schedule recommendations:', recommendationResults.length);
    
    return {
      success: true,
      scheduleResults,
      attendanceResults,
      optimalMovieResults,
      recommendationResults
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
window.scheduleTest = {
  runAllTests,
  testScheduleOptimization,
  testAttendancePrediction,
  testOptimalMovie,
  testScheduleRecommendations,
  sampleTheaterId,
  sampleDate,
  futureDates
};

console.log('Schedule optimization test module loaded. Run tests using window.scheduleTest.runAllTests()');
