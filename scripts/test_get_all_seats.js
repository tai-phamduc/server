const axios = require('axios');

// Function to test the getAllSeats endpoint
async function testGetAllSeats() {
  try {
    // Get one of the screening IDs we created earlier
    const screeningId = '681d97a07c8c575a1a1e1d39'; // Replace with one of your screening IDs if needed
    
    // Make a request to the endpoint
    const response = await axios.get(`http://localhost:5010/api/screenings/${screeningId}/all-seats`);
    
    // Log the response
    console.log('Response status:', response.status);
    console.log('Screening details:');
    console.log('- ID:', response.data.screening._id);
    console.log('- Format:', response.data.screening.format);
    console.log('- Start time:', response.data.screening.startTime);
    console.log('- Display time:', response.data.screening.displayTime);
    
    console.log('\nSeat information:');
    console.log('- Total seats:', response.data.totalSeats);
    console.log('- Available seats:', response.data.seatsAvailable);
    
    // Log the number of rows and a sample of seats
    const rows = Object.keys(response.data.seats).sort();
    console.log('\nRows:', rows);
    
    // Show a sample of seats from the first row
    if (rows.length > 0) {
      const firstRow = rows[0];
      console.log(`\nSample seats from row ${firstRow}:`);
      response.data.seats[firstRow].slice(0, 3).forEach(seat => {
        console.log(`- Seat ${seat.seatNumber}: ${seat.status}, Type: ${seat.type}, Price: $${seat.price}`);
      });
    }
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing getAllSeats endpoint:');
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

// Run the test
testGetAllSeats();
