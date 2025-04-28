// Test runner for AI features
import './sentimentTest';
import './trendPredictionTest';
import './userAnalyticsTest';
import './scheduleOptimizationTest';

// Run all tests
async function runAllTests() {
  console.log('=== RUNNING ALL AI FEATURE TESTS ===\n');
  
  try {
    console.log('1. SENTIMENT ANALYSIS TESTS');
    const sentimentResults = await window.sentimentTest.runAllTests();
    
    console.log('\n2. TREND PREDICTION TESTS');
    const trendResults = await window.trendTest.runAllTests();
    
    console.log('\n3. USER ANALYTICS TESTS');
    const userResults = await window.userAnalyticsTest.runAllTests();
    
    console.log('\n4. SCHEDULE OPTIMIZATION TESTS');
    const scheduleResults = await window.scheduleTest.runAllTests();
    
    console.log('\n=== ALL TESTS COMPLETED ===');
    console.log('Sentiment Analysis:', sentimentResults.success ? 'PASSED' : 'FAILED');
    console.log('Trend Prediction:', trendResults.success ? 'PASSED' : 'FAILED');
    console.log('User Analytics:', userResults.success ? 'PASSED' : 'FAILED');
    console.log('Schedule Optimization:', scheduleResults.success ? 'PASSED' : 'FAILED');
    
    return {
      success: sentimentResults.success && trendResults.success && userResults.success && scheduleResults.success,
      results: {
        sentiment: sentimentResults,
        trend: trendResults,
        user: userResults,
        schedule: scheduleResults
      }
    };
  } catch (error) {
    console.error('Test runner failed:', error);
    return {
      success: false,
      error
    };
  }
}

// Export test runner
window.aiTestRunner = {
  runAllTests,
  sentimentTest: window.sentimentTest,
  trendTest: window.trendTest,
  userAnalyticsTest: window.userAnalyticsTest,
  scheduleTest: window.scheduleTest
};

console.log('AI test runner loaded. Run all tests using window.aiTestRunner.runAllTests()');
