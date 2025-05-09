const axios = require('axios');

// Function to test the createSimpleBooking endpoint
async function testCreateSimpleBooking() {
  try {
    // Replace with your actual authentication token
    const token = 'YOUR_AUTH_TOKEN';
    
    // Replace with one of your screening IDs
    const screeningId = '681d97a07c8c575a1a1e1d39';
    
    // Create a booking request payload
    const bookingData = {
      product: 'The Witcher Season 2',
      quantity: 2,
      date: '2025-05-10T10:00:00.000Z',
      room: 'IMAX',
      seat: ['A1', 'A2'],
      service: 'Standard',
      address: 'New York, NY',
      subtotal: 30.00,
      ticketFees: 2.50,
      screeningId,
      paymentMethod: 'credit_card',
      total: 32.50
    };
    
    // Make a request to the endpoint
    const response = await axios.post(
      'https://movie-ticket-booking-api.vercel.app/api/bookings/create-simple',
      bookingData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    // Log the response
    console.log('Response status:', response.status);
    console.log('\nBooking created successfully:');
    console.log('- Booking ID:', response.data._id);
    console.log('- Booking Number:', response.data.bookingNumber);
    console.log('- Movie:', response.data.movieTitle);
    console.log('- Seats:', response.data.seats.join(', '));
    console.log('- Date:', new Date(response.data.screeningDate).toLocaleDateString());
    console.log('- Time:', response.data.screeningTime);
    console.log('- Total Price:', response.data.totalPrice);
    console.log('- Payment Method:', response.data.paymentMethod);
    console.log('- Booking Status:', response.data.bookingStatus);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing createSimpleBooking endpoint:');
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
console.log('=== CREATE SIMPLE BOOKING TEST SCRIPT ===');
console.log('Before running this script:');
console.log('1. Replace YOUR_AUTH_TOKEN with a valid authentication token');
console.log('2. Replace the screeningId with a valid screening ID from your database');
console.log('3. Modify the booking data as needed for your test');
console.log('\nTo run the test, execute: node scripts/test_create_simple_booking.js');
console.log('=======================================\n');

// Uncomment the line below to run the test
// testCreateSimpleBooking();
