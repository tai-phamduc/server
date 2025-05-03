const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Function to update booking history for a user
const updateBookingHistory = async (userId) => {
  try {
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return;
    }

    // Find all bookings for this user
    const bookings = await Booking.find({ user: userId });
    if (bookings.length === 0) {
      console.log(`No bookings found for user ${user.name} (${userId})`);
      return;
    }

    // Update user's booking history
    user.bookingHistory = bookings.map(booking => booking._id);
    await user.save();

    console.log(`Updated booking history for ${user.name} (${userId}) with ${bookings.length} bookings`);
    console.log('Booking IDs:', user.bookingHistory);
  } catch (error) {
    console.error('Error updating booking history:', error);
  }
};

// Function to create sample bookings for a user if none exist
const createSampleBookings = async (userId) => {
  try {
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return;
    }

    // Check if user already has bookings
    const existingBookings = await Booking.find({ user: userId });
    if (existingBookings.length > 0) {
      console.log(`User ${user.name} already has ${existingBookings.length} bookings`);
      return;
    }

    // Get movie IDs directly from the database
    const movieIds = await mongoose.connection.db.collection('movies').find({}, { projection: { _id: 1, title: 1, poster: 1 } }).limit(5).toArray();
    if (movieIds.length === 0) {
      console.error('No movies found in the database');
      return;
    }

    // Get cinema IDs directly from the database
    const cinemaIds = await mongoose.connection.db.collection('cinemas').find({}, { projection: { _id: 1, name: 1 } }).limit(3).toArray();
    if (cinemaIds.length === 0) {
      console.error('No cinemas found in the database');
      return;
    }

    console.log(`Found ${movieIds.length} movies and ${cinemaIds.length} cinemas`);

    // Create sample bookings
    const sampleBookings = [];

    // Past booking (completed)
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 1);

    const pastBooking = new Booking({
      user: userId,
      movie: movieIds[0]._id,
      movieTitle: movieIds[0].title || 'Inception',
      moviePoster: movieIds[0].poster || 'https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
      theater: cinemaIds[0]._id,
      cinema: cinemaIds[0]._id,
      theaterName: cinemaIds[0].name || 'Cinema City Multiplex',
      hall: 'Hall 1',
      seats: ['A1', 'A2'],
      seatsDisplay: 'A1, A2',
      totalPrice: 29.98,
      totalPriceFormatted: '$29.98',
      paymentMethod: 'credit_card',
      paymentStatus: 'completed',
      paymentDate: pastDate,
      bookingStatus: 'completed',
      bookingNumber: `BK-${pastDate.getFullYear()}${(pastDate.getMonth() + 1).toString().padStart(2, '0')}${pastDate.getDate().toString().padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingDate: pastDate,
      bookingDateFormatted: pastDate.toLocaleString(),
      ticketPrice: 14.99,
      ticketPriceFormatted: '$14.99',
      customerName: user.name,
      customerEmail: user.email,
      isCheckedIn: true,
      showtimeDate: pastDate,
      showtimeDisplay: '7:30 PM'
    });

    // Current booking (confirmed)
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);

    const currentBooking = new Booking({
      user: userId,
      movie: movieIds.length > 1 ? movieIds[1]._id : movieIds[0]._id,
      movieTitle: movieIds.length > 1 ? (movieIds[1].title || 'Dune: Part Two') : (movieIds[0].title || 'Dune: Part Two'),
      moviePoster: movieIds.length > 1 ? (movieIds[1].poster || 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg') : (movieIds[0].poster || 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'),
      theater: cinemaIds[0]._id,
      cinema: cinemaIds[0]._id,
      theaterName: cinemaIds[0].name || 'Cinema City Multiplex',
      hall: 'Hall 2',
      seats: ['B5', 'B6'],
      seatsDisplay: 'B5, B6',
      totalPrice: 32.98,
      totalPriceFormatted: '$32.98',
      paymentMethod: 'credit_card',
      paymentStatus: 'completed',
      paymentDate: new Date(),
      bookingStatus: 'confirmed',
      bookingNumber: `BK-${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingDate: new Date(),
      bookingDateFormatted: new Date().toLocaleString(),
      ticketPrice: 16.49,
      ticketPriceFormatted: '$16.49',
      customerName: user.name,
      customerEmail: user.email,
      isCheckedIn: false,
      showtimeDate: currentDate,
      showtimeDisplay: '8:00 PM'
    });

    // Cancelled booking
    const cancelledDate = new Date();
    cancelledDate.setDate(cancelledDate.getDate() - 7);

    const cancelledBooking = new Booking({
      user: userId,
      movie: movieIds.length > 2 ? movieIds[2]._id : movieIds[0]._id,
      movieTitle: movieIds.length > 2 ? (movieIds[2].title || 'Godzilla x Kong: The New Empire') : (movieIds[0].title || 'Godzilla x Kong: The New Empire'),
      moviePoster: movieIds.length > 2 ? (movieIds[2].poster || 'https://image.tmdb.org/t/p/original/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg') : (movieIds[0].poster || 'https://image.tmdb.org/t/p/original/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg'),
      theater: cinemaIds.length > 1 ? cinemaIds[1]._id : cinemaIds[0]._id,
      cinema: cinemaIds.length > 1 ? cinemaIds[1]._id : cinemaIds[0]._id,
      theaterName: cinemaIds.length > 1 ? (cinemaIds[1].name || 'Starlight Cinema') : (cinemaIds[0].name || 'Starlight Cinema'),
      hall: 'Hall 3',
      seats: ['C8', 'C9'],
      seatsDisplay: 'C8, C9',
      totalPrice: 27.98,
      totalPriceFormatted: '$27.98',
      paymentMethod: 'credit_card',
      paymentStatus: 'refunded',
      paymentDate: cancelledDate,
      bookingStatus: 'cancelled',
      bookingNumber: `BK-${cancelledDate.getFullYear()}${(cancelledDate.getMonth() + 1).toString().padStart(2, '0')}${cancelledDate.getDate().toString().padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingDate: cancelledDate,
      bookingDateFormatted: cancelledDate.toLocaleString(),
      ticketPrice: 13.99,
      ticketPriceFormatted: '$13.99',
      customerName: user.name,
      customerEmail: user.email,
      isCheckedIn: false,
      showtimeDate: cancelledDate,
      showtimeDisplay: '6:15 PM'
    });

    sampleBookings.push(pastBooking, currentBooking, cancelledBooking);

    // Save the bookings
    const savedBookings = await Booking.insertMany(sampleBookings);
    console.log(`Created ${savedBookings.length} sample bookings for ${user.name}`);

    // Update user's booking history
    user.bookingHistory = savedBookings.map(booking => booking._id);
    await user.save();

    console.log(`Updated booking history for ${user.name} with ${savedBookings.length} bookings`);
  } catch (error) {
    console.error('Error creating sample bookings:', error);
  }
};

// Main function
const main = async () => {
  try {
    // Get admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      console.error('Admin user not found');
      process.exit(1);
    }

    // Create sample bookings if needed
    await createSampleBookings(adminUser._id);

    // Update booking history
    await updateBookingHistory(adminUser._id);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
};

// Run the main function
main();
