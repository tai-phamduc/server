const Booking = require('../models/Booking');
const Screening = require('../models/Screening');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const User = require('../models/User');
const { generateQRCode } = require('../utils/qrCodeGenerator');
const { sendBookingConfirmationEmail, sendBookingCancellationEmail } = require('../utils/emailSender');

// Helper function to generate booking number
const generateBookingNumber = () => {
  const timestamp = new Date().getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK-${timestamp}-${random}`;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { movieId, showtimeId, seats, paymentMethod } = req.body;

    // Check if screening exists
    const showtime = await Screening.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if cinema exists
    const cinema = await Cinema.findById(showtime.cinema_id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }

    // Check if seats are available
    const bookedSeats = showtime.bookedSeats || [];
    const unavailableSeats = seats.filter(seat => bookedSeats.includes(seat));

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seats are no longer available',
        unavailableSeats
      });
    }

    // Calculate prices
    const ticketPrice = showtime.price || 10.99;
    const totalTicketPrice = ticketPrice * seats.length;
    const tax = totalTicketPrice * 0.1; // 10% tax
    const serviceFee = seats.length * 1.5; // $1.5 per seat
    const totalPrice = totalTicketPrice + tax + serviceFee;

    // Generate booking number
    const bookingNumber = generateBookingNumber();

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      movie: movieId,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      showtime: showtimeId,
      showtimeDate: showtime.startTime,
      showtimeDisplay: showtime.displayTime,
      cinema: showtime.cinema_id,
      cinemaName: cinema.name,
      room: showtime.room_id,
      seats,
      totalPrice,
      ticketPrice,
      tax,
      serviceFee,
      paymentMethod,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      bookingNumber,
      bookingDate: new Date(),
      format: showtime.format || '2D'
    });

    // Update showtime with booked seats
    showtime.bookedSeats = [...bookedSeats, ...seats];
    showtime.seatsAvailable = showtime.totalSeats - showtime.bookedSeats.length;

    // Save booking and updated showtime
    await booking.save();
    await showtime.save();

    // Add booking to user's booking history
    const user = await User.findById(req.user._id);
    if (user) {
      if (!user.bookingHistory) {
        user.bookingHistory = [];
      }
      user.bookingHistory.push(booking._id);
      await user.save();
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    // First try to get bookings from user's booking history
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookingHistory',
        options: { sort: { bookingDate: -1 } }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user has booking history, return it
    if (user.bookingHistory && user.bookingHistory.length > 0) {
      return res.json(user.bookingHistory);
    }

    // If no booking history, fall back to direct query
    let bookings = await Booking.find({ user: req.user._id })
      .sort({ bookingDate: -1 });

    // If no bookings found and this is admin user, create sample bookings
    if (bookings.length === 0 && user.email === 'admin@example.com') {
      console.log('Creating sample bookings for admin user');

      // Create sample bookings
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);

      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7);

      const sampleBookings = [
        {
          user: user._id,
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
          paymentMethod: 'credit_card',
          bookingNumber: `BK-${Date.now()}-${Math.floor(10000 + Math.random() * 90000)}`
        },
        {
          user: user._id,
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
          paymentMethod: 'credit_card',
          bookingNumber: `BK-${Date.now()}-${Math.floor(10000 + Math.random() * 90000)}`
        },
        {
          user: user._id,
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
          paymentMethod: 'paypal',
          bookingNumber: `BK-${Date.now()}-${Math.floor(10000 + Math.random() * 90000)}`
        },
        {
          user: user._id,
          movieTitle: 'The Shawshank Redemption',
          moviePoster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
          showtimeDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          showtimeDisplay: '10:00 PM',
          theaterName: 'Starlight Multiplex',
          hall: 'IMAX',
          seats: ['D10', 'D11'],
          totalPrice: 43.98,
          bookingStatus: 'cancelled',
          bookingDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          paymentStatus: 'refunded',
          paymentMethod: 'credit_card',
          bookingNumber: `BK-${Date.now()}-${Math.floor(10000 + Math.random() * 90000)}`,
          cancellationDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
          refundAmount: 39.58,
          refundPercentage: 90,
          refundStatus: 'completed'
        },
        {
          user: user._id,
          movieTitle: 'Avengers: Endgame',
          moviePoster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
          showtimeDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
          showtimeDisplay: '1:00 PM',
          theaterName: 'Starlight Multiplex',
          hall: 'IMAX',
          seats: ['H3', 'H4', 'H5', 'H6'],
          totalPrice: 79.96,
          bookingStatus: 'confirmed',
          bookingDate: now,
          paymentStatus: 'completed',
          paymentMethod: 'paypal',
          bookingNumber: `BK-${Date.now()}-${Math.floor(10000 + Math.random() * 90000)}`
        }
      ];

      // Insert sample bookings
      const savedBookings = [];
      for (const bookingData of sampleBookings) {
        const booking = new Booking(bookingData);
        await booking.save();
        savedBookings.push(booking);
      }

      // Update bookings variable with saved bookings
      bookings = savedBookings;
      console.log(`Created ${savedBookings.length} sample bookings for admin user`);
    }

    // If bookings found, update user's booking history
    if (bookings.length > 0) {
      user.bookingHistory = bookings.map(booking => booking._id);
      await user.save();
      console.log(`Updated user's booking history with ${bookings.length} bookings`);
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title poster director cast genre duration')
      .populate('showtime', 'startTime endTime theater hall price')
      .populate('theater', 'name location')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user or if the user is an admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user or if the user is an admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Check if screening has passed
    const showtime = await Screening.findById(booking.showtime);
    if (!showtime) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    const now = new Date();
    const showtimeDate = new Date(showtime.startTime);

    if (showtimeDate < now) {
      return res.status(400).json({ message: 'Cannot cancel booking for past showtimes' });
    }

    // Calculate time until showtime in hours
    const hoursDifference = (showtimeDate - now) / (1000 * 60 * 60);

    // Determine refund amount based on cancellation policy
    let refundAmount = 0;
    let refundPercentage = 0;

    if (hoursDifference >= 48) {
      // Full refund if cancelled at least 48 hours before showtime
      refundPercentage = 100;
      refundAmount = booking.totalPrice;
    } else if (hoursDifference >= 24) {
      // 75% refund if cancelled between 24-48 hours before showtime
      refundPercentage = 75;
      refundAmount = booking.totalPrice * 0.75;
    } else if (hoursDifference >= 12) {
      // 50% refund if cancelled between 12-24 hours before showtime
      refundPercentage = 50;
      refundAmount = booking.totalPrice * 0.5;
    } else if (hoursDifference >= 6) {
      // 25% refund if cancelled between 6-12 hours before showtime
      refundPercentage = 25;
      refundAmount = booking.totalPrice * 0.25;
    } else if (hoursDifference >= 2) {
      // 10% refund if cancelled between 2-6 hours before showtime
      refundPercentage = 10;
      refundAmount = booking.totalPrice * 0.1;
    } else {
      // No refund if cancelled less than 2 hours before showtime
      return res.status(400).json({
        message: 'Bookings can only be cancelled at least 2 hours before the showtime',
      });
    }

    // Round refund amount to 2 decimal places
    refundAmount = Math.round(refundAmount * 100) / 100;

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.cancellationDate = new Date();
    booking.refundAmount = refundAmount;
    booking.refundPercentage = refundPercentage;
    booking.refundStatus = refundAmount > 0 ? 'pending' : 'not_applicable';
    booking.notes = req.body.reason || 'Cancelled by user';

    // Remove booked seats from showtime
    showtime.bookedSeats = showtime.bookedSeats.filter(
      seat => !booking.seats.includes(seat)
    );
    showtime.seatsAvailable = showtime.totalSeats - showtime.bookedSeats.length;

    // Save updated showtime
    await showtime.save();

    // Process refund if applicable
    if (refundAmount > 0 && booking.paymentStatus === 'completed') {
      try {
        // Process refund based on payment method
        if (booking.paymentMethod === 'credit_card') {
          // In a real app, this would call the Stripe API to process the refund
          // For now, we'll just simulate a successful refund
          booking.paymentStatus = 'refunded';
          booking.refundStatus = 'completed';
          booking.refundTransactionId = `ref_${Date.now()}`;
        } else if (booking.paymentMethod === 'paypal') {
          // In a real app, this would call the PayPal API to process the refund
          // For now, we'll just simulate a successful refund
          booking.paymentStatus = 'refunded';
          booking.refundStatus = 'completed';
          booking.refundTransactionId = `ref_${Date.now()}`;
        } else {
          // For cash or other payment methods, mark as manual refund required
          booking.refundStatus = 'manual_required';
        }
      } catch (refundError) {
        console.error('Refund processing error:', refundError);
        booking.refundStatus = 'failed';
        booking.notes += ` | Refund processing error: ${refundError.message}`;
      }
    }

    // Save booking with all updates at once
    await booking.save();

    // Send cancellation confirmation email
    try {
      const user = await User.findById(booking.user);
      if (user) {
        await sendBookingCancellationEmail(booking, user.email);
      }
    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError);
    }

    res.json({
      booking,
      refundAmount,
      refundPercentage,
      message: refundAmount > 0
        ? `Booking cancelled. Refund of $${refundAmount} (${refundPercentage}%) will be processed.`
        : 'Booking cancelled. No refund is applicable due to late cancellation.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings/admin
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('movie', 'title')
      .populate('user', 'name email')
      .populate('showtime', 'startTime theater hall')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status after payment
// @route   PUT /api/bookings/:id/payment-complete
// @access  Private
const updateBookingAfterPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user or if the user is an admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update booking status
    booking.paymentStatus = 'completed';
    booking.bookingStatus = 'confirmed';

    // Generate QR code
    const qrCode = await generateQRCode(booking.bookingNumber);
    booking.qrCode = qrCode;

    // Save updated booking
    await booking.save();

    // Send confirmation email
    const user = await User.findById(booking.user);
    if (user) {
      // Add booking to user's booking history if not already there
      if (!user.bookingHistory) {
        user.bookingHistory = [];
      }
      if (!user.bookingHistory.includes(booking._id)) {
        user.bookingHistory.push(booking._id);
        await user.save();
      }

      await sendBookingConfirmationEmail(booking, user.email);
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingAfterPayment
};
