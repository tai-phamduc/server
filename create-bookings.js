const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load models
const User = require('./models/User');
const Booking = require('./models/Booking');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

// Generate booking data
const generateBookings = async () => {
  try {
    // Clear existing bookings
    await Booking.deleteMany();
    console.log('Existing bookings cleared');

    // Find a user
    const user = await User.findOne();
    
    if (!user) {
      console.error('No user found. Please create a user first.');
      process.exit(1);
    }

    // Create sample bookings
    const bookings = [
      {
        user: user._id,
        movie: new mongoose.Types.ObjectId(),
        showtime: new mongoose.Types.ObjectId(),
        theater: new mongoose.Types.ObjectId(),
        seats: ['A1', 'A2'],
        bookingNumber: 'BK-20250510-001',
        bookingDate: new Date(),
        showtimeDate: new Date('2025-05-10T19:00:00Z'),
        totalPrice: 31.58,
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        movieTitle: 'Inception',
        theaterName: 'Cinema City',
        showtimeDisplay: '7:00 PM',
        seatsDisplay: 'A1, A2',
        hall: 'Hall 1',
        ticketPrice: 12.99,
        tax: 2.60,
        serviceFee: 3.00,
        ticketPriceFormatted: '$12.99',
        taxFormatted: '$2.60',
        serviceFeeFormatted: '$3.00',
        totalPriceFormatted: '$31.58',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-20250510-001'
      },
      {
        user: user._id,
        movie: new mongoose.Types.ObjectId(),
        showtime: new mongoose.Types.ObjectId(),
        theater: new mongoose.Types.ObjectId(),
        seats: ['B5', 'B6', 'B7'],
        bookingNumber: 'BK-20250512-002',
        bookingDate: new Date(),
        showtimeDate: new Date('2025-05-12T20:30:00Z'),
        totalPrice: 53.97,
        paymentMethod: 'paypal',
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        movieTitle: 'The Dark Knight',
        theaterName: 'Starlight Cinema',
        showtimeDisplay: '8:30 PM',
        seatsDisplay: 'B5, B6, B7',
        hall: 'Hall 2',
        ticketPrice: 14.99,
        tax: 4.50,
        serviceFee: 4.50,
        ticketPriceFormatted: '$14.99',
        taxFormatted: '$4.50',
        serviceFeeFormatted: '$4.50',
        totalPriceFormatted: '$53.97',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-20250512-002'
      },
      {
        user: user._id,
        movie: new mongoose.Types.ObjectId(),
        showtime: new mongoose.Types.ObjectId(),
        theater: new mongoose.Types.ObjectId(),
        seats: ['C10', 'C11'],
        bookingNumber: 'BK-20250515-003',
        bookingDate: new Date('2025-05-03T09:20:00Z'),
        showtimeDate: new Date('2025-05-15T18:15:00Z'),
        totalPrice: 42.58,
        paymentMethod: 'credit_card',
        paymentStatus: 'refunded',
        bookingStatus: 'cancelled',
        movieTitle: 'Dune',
        theaterName: 'Royal Theater',
        showtimeDisplay: '6:15 PM',
        seatsDisplay: 'C10, C11',
        hall: 'IMAX',
        ticketPrice: 17.99,
        tax: 3.60,
        serviceFee: 3.00,
        ticketPriceFormatted: '$17.99',
        taxFormatted: '$3.60',
        serviceFeeFormatted: '$3.00',
        totalPriceFormatted: '$42.58',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-20250515-003',
        notes: 'Cancelled by user. Reason: Schedule conflict.',
        cancellationDate: new Date('2025-05-04T16:30:00Z'),
        refundAmount: 42.58,
        refundPercentage: 100,
        refundStatus: 'completed'
      },
      {
        user: user._id,
        movie: new mongoose.Types.ObjectId(),
        showtime: new mongoose.Types.ObjectId(),
        theater: new mongoose.Types.ObjectId(),
        seats: ['D3', 'D4'],
        bookingNumber: 'BK-20250520-004',
        bookingDate: new Date('2025-05-05T11:15:00Z'),
        showtimeDate: new Date('2025-05-20T19:45:00Z'),
        totalPrice: 33.78,
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        movieTitle: 'Avengers: Endgame',
        theaterName: 'Cinema City',
        showtimeDisplay: '7:45 PM',
        seatsDisplay: 'D3, D4',
        hall: 'Hall 3',
        ticketPrice: 13.99,
        tax: 2.80,
        serviceFee: 3.00,
        ticketPriceFormatted: '$13.99',
        taxFormatted: '$2.80',
        serviceFeeFormatted: '$3.00',
        totalPriceFormatted: '$33.78',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-20250520-004'
      }
    ];

    // Insert bookings
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`${createdBookings.length} bookings created`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the function
generateBookings();
