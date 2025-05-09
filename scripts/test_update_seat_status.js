const axios = require('axios');

// Function to test the updateSeatStatus endpoint
async function testUpdateSeatStatus() {
  try {
    // Replace with your actual screening ID
    const screeningId = '681d97a07c8c575a1a1e1d39';
    
    // Create a request payload
    const requestData = {
      screeningId,
      seats: ['A1', 'A2', 'A3'],
      status: 'Booked'
    };
    
    console.log('Sending request to update seat status:');
    console.log(JSON.stringify(requestData, null, 2));
    
    // Make a request to the endpoint
    const response = await axios.patch(
      'https://movie-ticket-booking-api.vercel.app/api/seats/update',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Log the response
    console.log('\nResponse status:', response.status);
    console.log('Response data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing updateSeatStatus endpoint:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Instructions for using this test script
console.log('=== UPDATE SEAT STATUS TEST SCRIPT ===');
console.log('Before running this script:');
console.log('1. Replace the screeningId with a valid screening ID from your database');
console.log('2. Modify the seat numbers and status as needed for your test');
console.log('\nTo run the test, execute: node scripts/test_update_seat_status.js');
console.log('=======================================\n');

// Uncomment the line below to run the test
// testUpdateSeatStatus();
