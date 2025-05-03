const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => {
    console.log('MongoDB Connected');
    // Run the main function after connection is established
    addBookingHistory();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Main function to add booking history
const addBookingHistory = async () => {
  try {
    // Get the admin user
    const adminUser = await mongoose.connection.db.collection('users').findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      console.error('Admin user not found');
      process.exit(1);
    }

    console.log(`Found admin user: ${adminUser.name} (${adminUser._id})`);

    // Get a movie for the booking
    const movies = await mongoose.connection.db.collection('movies').find({}).limit(3).toArray();
    if (movies.length === 0) {
      console.error('No movies found in the database');
      process.exit(1);
    }

    // Get a cinema for the booking
    const cinemas = await mongoose.connection.db.collection('cinemas').find({}).limit(1).toArray();
    if (cinemas.length === 0) {
      console.error('No cinemas found in the database');
      process.exit(1);
    }

    console.log(`Found ${movies.length} movies and ${cinemas.length} cinemas`);

    // Create sample booking data
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 1);

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);

    const cancelledDate = new Date();
    cancelledDate.setDate(cancelledDate.getDate() - 7);

    // Create sample bookings directly in the database
    const sampleBookings = [
      {
        user: adminUser._id,
        movie: movies[0]._id,
        movieTitle: movies[0].title || 'Inception',
        moviePoster: movies[0].poster || 'https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        cinema: cinemas[0]._id,
        theater: cinemas[0]._id,
        theaterName: cinemas[0].name || 'Cinema City Multiplex',
        hall: 'Hall 1',
        roomName: 'Room 1',
        room: cinemas[0].rooms ? cinemas[0].rooms[0]._id : new mongoose.Types.ObjectId(),
        screening: new mongoose.Types.ObjectId(),
        screeningDate: pastDate,
        screeningTime: '7:30 PM',
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
        customerName: adminUser.name,
        customerEmail: adminUser.email,
        isCheckedIn: true,
        showtimeDate: pastDate,
        showtimeDisplay: '7:30 PM',
        createdAt: pastDate,
        updatedAt: pastDate
      },
      {
        user: adminUser._id,
        movie: movies.length > 1 ? movies[1]._id : movies[0]._id,
        movieTitle: movies.length > 1 ? (movies[1].title || 'Dune: Part Two') : (movies[0].title || 'Dune: Part Two'),
        moviePoster: movies.length > 1 ? (movies[1].poster || 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg') : (movies[0].poster || 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'),
        cinema: cinemas[0]._id,
        theater: cinemas[0]._id,
        theaterName: cinemas[0].name || 'Cinema City Multiplex',
        hall: 'Hall 2',
        roomName: 'Room 2',
        room: cinemas[0].rooms && cinemas[0].rooms.length > 1 ? cinemas[0].rooms[1]._id : new mongoose.Types.ObjectId(),
        screening: new mongoose.Types.ObjectId(),
        screeningDate: currentDate,
        screeningTime: '8:00 PM',
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
        customerName: adminUser.name,
        customerEmail: adminUser.email,
        isCheckedIn: false,
        showtimeDate: currentDate,
        showtimeDisplay: '8:00 PM',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user: adminUser._id,
        movie: movies.length > 2 ? movies[2]._id : movies[0]._id,
        movieTitle: movies.length > 2 ? (movies[2].title || 'Godzilla x Kong: The New Empire') : (movies[0].title || 'Godzilla x Kong: The New Empire'),
        moviePoster: movies.length > 2 ? (movies[2].poster || 'https://image.tmdb.org/t/p/original/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg') : (movies[0].poster || 'https://image.tmdb.org/t/p/original/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg'),
        cinema: cinemas[0]._id,
        theater: cinemas[0]._id,
        theaterName: cinemas[0].name || 'Cinema City Multiplex',
        hall: 'Hall 3',
        roomName: 'Room 3',
        room: cinemas[0].rooms && cinemas[0].rooms.length > 2 ? cinemas[0].rooms[2]._id : new mongoose.Types.ObjectId(),
        screening: new mongoose.Types.ObjectId(),
        screeningDate: cancelledDate,
        screeningTime: '6:15 PM',
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
        customerName: adminUser.name,
        customerEmail: adminUser.email,
        isCheckedIn: false,
        showtimeDate: cancelledDate,
        showtimeDisplay: '6:15 PM',
        createdAt: cancelledDate,
        updatedAt: cancelledDate
      }
    ];

    // Insert bookings into the database
    const result = await mongoose.connection.db.collection('bookings').insertMany(sampleBookings);
    console.log(`Inserted ${result.insertedCount} bookings`);

    // Get the inserted booking IDs
    const bookingIds = Object.values(result.insertedIds);
    console.log('Booking IDs:', bookingIds);

    // Update the user's booking history
    const updateResult = await mongoose.connection.db.collection('users').updateOne(
      { _id: adminUser._id },
      { $set: { bookingHistory: bookingIds } }
    );

    console.log(`Updated user's booking history: ${updateResult.modifiedCount} document modified`);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};
