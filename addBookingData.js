const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/movie-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Define schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  bookingHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
});

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  movieTitle: String,
  moviePoster: String,
  showtimeDate: Date,
  showtimeDisplay: String,
  theaterName: String,
  hall: String,
  seats: [String],
  totalPrice: Number,
  bookingStatus: String,
  bookingDate: Date,
  paymentStatus: String,
  paymentMethod: String
});

// Create models
const User = mongoose.model('User', UserSchema);
const Booking = mongoose.model('Booking', BookingSchema);

const addBookingData = async () => {
  try {
    // Find admin user
    let admin = await User.findOne({ email: 'admin@example.com' });
    
    if (!admin) {
      console.log('Admin user not found, creating one...');
      
      // Create admin user
      admin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'admin'
      });
      
      await admin.save();
      console.log(`Created admin user: ${admin._id}`);
    } else {
      console.log(`Found admin user: ${admin._id}`);
    }
    
    // Create sample bookings
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    
    const bookings = [
      {
        user: admin._id,
        movieTitle: 'Inception',
        moviePoster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        showtimeDate: tomorrow,
        showtimeDisplay: '4:00 PM',
        theaterName: 'Cinema City',
        hall: '4DX',
        seats: ['A1', 'A2'],
        totalPrice: 35.98,
        bookingStatus: 'confirmed',
        bookingDate: now,
        paymentStatus: 'completed',
        paymentMethod: 'credit_card'
      },
      {
        user: admin._id,
        movieTitle: 'The Dark Knight',
        moviePoster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        showtimeDate: nextWeek,
        showtimeDisplay: '7:00 PM',
        theaterName: 'Cinema City',
        hall: 'VIP',
        seats: ['C4', 'C5', 'C6'],
        totalPrice: 74.97,
        bookingStatus: 'confirmed',
        bookingDate: now,
        paymentStatus: 'completed',
        paymentMethod: 'credit_card'
      },
      {
        user: admin._id,
        movieTitle: 'Interstellar',
        moviePoster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        showtimeDate: yesterday,
        showtimeDisplay: '1:00 PM',
        theaterName: 'Cinema City',
        hall: 'VIP',
        seats: ['F7', 'F8'],
        totalPrice: 45.98,
        bookingStatus: 'completed',
        bookingDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        paymentStatus: 'completed',
        paymentMethod: 'paypal'
      }
    ];
    
    // Insert bookings
    const savedBookings = [];
    for (const bookingData of bookings) {
      const booking = new Booking(bookingData);
      await booking.save();
      savedBookings.push(booking);
      console.log(`Created booking: ${booking._id}`);
    }
    
    // Update admin's booking history
    admin.bookingHistory = savedBookings.map(booking => booking._id);
    await admin.save();
    
    console.log(`Updated admin's booking history with ${savedBookings.length} bookings`);
    console.log('Done!');
  } catch (error) {
    console.error('Error adding booking data:', error);
  } finally {
    // Close MongoDB connection
    mongoose.disconnect();
  }
};

// Run the function
addBookingData();
