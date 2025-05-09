const axios = require('axios');

// Function to test the getScreeningDetails endpoint
async function testScreeningDetails() {
  try {
    // Get one of the screening IDs we created earlier
    const screeningId = '681d97a07c8c575a1a1e1d39'; // Replace with one of your screening IDs if needed

    // Make a request to the endpoint
    const response = await axios.get(`https://movie-ticket-booking-api.vercel.app/api/screenings/${screeningId}/details`);

    // Log the response
    console.log('Response status:', response.status);
    console.log('\nScreening Details:');
    console.log('- Screening ID:', response.data.screeningId);
    console.log('- Movie Name:', response.data.movieName);
    console.log('- Room Type:', response.data.roomType);
    console.log('- Start Time:', response.data.startTime);
    console.log('- Format:', response.data.format);
    console.log('- Total Seats:', response.data.totalSeats);
    console.log('- Available Seats:', response.data.seatsAvailable);

    // Log a sample of seats
    console.log('\nSample Seats (first 3):');
    if (response.data.seats && response.data.seats.length > 0) {
      response.data.seats.slice(0, 3).forEach(seat => {
        console.log(`- Seat ${seat.seatNumber}: ${seat.status}, Type: ${seat.type}, Price: $${seat.price}`);
      });
    } else {
      console.log('No seats found in the response');
    }

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing getScreeningDetails endpoint:');
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
testScreeningDetails();
