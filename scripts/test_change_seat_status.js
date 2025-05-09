const axios = require('axios');

// Function to test the changeSeatStatus endpoint
async function testChangeSeatStatus() {
  try {
    // Replace with your actual values
    const screeningId = '681d97a07c8c575a1a1e1d39';
    const seatNumber = 'A1';
    const status = 'booked'; // or 'available', 'reserved', etc.
    
    // Create a request payload
    const requestData = {
      screeningId,
      seatNumber,
      status
    };
    
    console.log('Sending request to change seat status:');
    console.log(JSON.stringify(requestData, null, 2));
    
    // Make a request to the endpoint
    const response = await axios.put(
      'https://movie-ticket-booking-api.vercel.app/api/seats/status',
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
    console.error('Error testing changeSeatStatus endpoint:');
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
console.log('=== CHANGE SEAT STATUS TEST SCRIPT ===');
console.log('Before running this script:');
console.log('1. Replace the screeningId with a valid screening ID from your database');
console.log('2. Replace the seatNumber with a valid seat number from the screening');
console.log('3. Set the status to the desired value (available, booked, reserved, etc.)');
console.log('\nTo run the test, execute: node scripts/test_change_seat_status.js');
console.log('=======================================\n');

// Uncomment the line below to run the test
// testChangeSeatStatus();
