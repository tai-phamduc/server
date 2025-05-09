const axios = require('axios');

// Function to test the bookSeatsByIds endpoint
async function testBookSeatsByIds() {
  try {
    // Replace with your actual screening ID
    const screeningId = '681d97a07c8c575a1a1e1d39';

    // First, get the seats for this screening to find their IDs
    console.log('Fetching seats for screening...');
    const seatsResponse = await axios.get(
      `https://movie-ticket-booking-api.vercel.app/api/screenings/${screeningId}/all-seats`
    );

    // Get the first 3 available seats
    const availableSeats = [];
    const seatsByRow = seatsResponse.data.seats;

    // Iterate through rows to find available seats
    for (const row in seatsByRow) {
      for (const seat of seatsByRow[row]) {
        if (seat.status === 'available') {
          availableSeats.push({
            id: seat._id,
            seatNumber: seat.seatNumber
          });

          if (availableSeats.length >= 3) {
            break;
          }
        }
      }

      if (availableSeats.length >= 3) {
        break;
      }
    }

    if (availableSeats.length === 0) {
      console.log('No available seats found in this screening.');
      return;
    }

    console.log(`Found ${availableSeats.length} available seats:`);
    availableSeats.forEach(seat => {
      console.log(`- Seat ${seat.seatNumber} (ID: ${seat.id})`);
    });

    // Create a booking request payload
    const requestData = {
      screeningId,
      seatIdList: availableSeats.map(seat => seat.id)
    };

    console.log('\nSending request to book seats by ID:');
    console.log(JSON.stringify(requestData, null, 2));

    // Make a request to the endpoint
    const response = await axios.put(
      'https://movie-ticket-booking-api.vercel.app/api/seats/book-by-id',
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
    console.error('Error testing bookSeatsByIds endpoint:');
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
console.log('=== BOOK SEATS BY ID TEST SCRIPT ===');
console.log('Before running this script:');
console.log('1. Replace the screeningId with a valid screening ID from your database');
console.log('\nTo run the test, execute: node scripts/test_book_seats_by_id.js');
console.log('=======================================\n');

// Uncomment the line below to run the test
// testBookSeatsByIds();
