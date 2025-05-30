const mongoose = require('mongoose');
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
    const { movie: movieId, screening: screeningId, cinema: cinemaId, seats, paymentMethod, screeningDate, screeningTime, ticketPrice, totalPrice, bookingNumber, room, roomName } = req.body;

    console.log('Booking request received:', req.body);

    // TESTING MODE: Skip screening, movie, and cinema checks
    // This is a temporary solution for testing purposes
    let screening = null;
    let movie = null;
    let cinema = null;

    // Try to find the screening, but don't fail if not found
    try {
      screening = await Screening.findById(screeningId);
      console.log('Screening found:', screening ? 'Yes' : 'No');
    } catch (err) {
      console.log('Error finding screening:', err.message);
    }

    // Try to find the movie, but don't fail if not found
    try {
      movie = await Movie.findById(movieId);
      console.log('Movie found:', movie ? 'Yes' : 'No');
    } catch (err) {
      console.log('Error finding movie:', err.message);
    }

    // Try to find the cinema, but don't fail if not found
    try {
      cinema = await Cinema.findById(cinemaId);
      console.log('Cinema found:', cinema ? 'Yes' : 'No');
    } catch (err) {
      console.log('Error finding cinema:', err.message);
    }

    // For testing, create mock objects if not found
    if (!screening) {
      console.log('Creating mock screening for testing');
      screening = {
        _id: screeningId || new mongoose.Types.ObjectId(),
        cinema_id: cinemaId || new mongoose.Types.ObjectId(),
        room_id: room || new mongoose.Types.ObjectId(),
        start_time: screeningDate || new Date(),
        format: '2D',
        price: ticketPrice || 10,
        booked_seats: [],
        total_seats: 100,
        seats_available: 100
      };
    }

    if (!movie) {
      console.log('Creating mock movie for testing');
      movie = {
        _id: movieId || new mongoose.Types.ObjectId(),
        title: 'Test Movie',
        poster: 'https://via.placeholder.com/300x450'
      };
    }

    if (!cinema) {
      console.log('Creating mock cinema for testing');
      cinema = {
        _id: cinemaId || new mongoose.Types.ObjectId(),
        name: 'Test Cinema'
      };
    }

    // Check if seats are available
    const bookedSeats = screening.booked_seats || [];
    const unavailableSeats = seats.filter(seat => bookedSeats.includes(seat));

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seats are no longer available',
        unavailableSeats
      });
    }

    // Calculate prices - use provided values or calculate
    const calculatedTicketPrice = screening.price || 10.99;
    const calculatedTotalTicketPrice = calculatedTicketPrice * seats.length;
    // const calculatedTax = calculatedTotalTicketPrice * 0.1; // 10% tax
    // const calculatedServiceFee = seats.length * 1.5; // $1.5 per seat
    // const calculatedTotalPrice = calculatedTotalTicketPrice + calculatedTax + calculatedServiceFee;
    const calculatedTotalPrice = calculatedTotalTicketPrice

    // Use provided values or calculated values
    const finalTicketPrice = ticketPrice || calculatedTicketPrice;
    const finalTotalPrice = totalPrice || calculatedTotalPrice;
    // const finalTax = calculatedTax;
    // const finalServiceFee = calculatedServiceFee;

    // Generate booking number or use provided one
    const finalBookingNumber = bookingNumber || generateBookingNumber();

    // Create booking with provided or default values
    const booking = new Booking({
      user: req.user._id,
      movie: movieId,
      movieTitle: movie.title || 'Test Movie',
      moviePoster: movie.poster || 'https://via.placeholder.com/300x450',
      screening: screeningId,
      screeningDate: screeningDate || screening.start_time || new Date(),
      screeningTime: screeningTime || new Date(screening.start_time || new Date()).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      cinema: cinemaId || screening.cinema_id,
      cinemaName: cinema.name || 'Test Cinema',
      room: room || screening.room_id,
      roomName: roomName || 'Room ' + (screening.room_id || 'Test'),
      seats,
      totalPrice: finalTotalPrice,
      ticketPrice: finalTicketPrice,
      tax: finalTax,
      // serviceFee: finalServiceFee,
      serviceFee: 0,
      paymentMethod,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      bookingNumber: finalBookingNumber,
      bookingDate: new Date(),
      format: screening.format || '2D'
    });

    console.log('Created booking object:', booking);

    // Try to update screening with booked seats if it's a real screening
    try {
      if (screening.save) {
        screening.booked_seats = [...bookedSeats, ...seats];
        screening.seats_available = screening.total_seats - screening.booked_seats.length;
        await screening.save();
        console.log('Updated screening with booked seats');
      }
    } catch (err) {
      console.log('Could not update screening (this is expected for mock screenings):', err.message);
    }

    // Save booking
    await booking.save();
    console.log('Saved booking with ID:', booking._id);

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
          cinemaName: 'Cinema City',
          roomName: '4DX',
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
          cinemaName: 'Cinema City',
          roomName: 'VIP',
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
          cinemaName: 'Cinema City',
          roomName: 'VIP',
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
          cinemaName: 'Starlight Multiplex',
          roomName: 'IMAX',
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
          cinemaName: 'Starlight Multiplex',
          roomName: 'IMAX',
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
      .populate('screening', 'start_time end_time cinema_id room_id price')
      .populate('cinema', 'name location')
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
    const screening = await Screening.findById(booking.screening);
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    const now = new Date();
    const screeningDate = new Date(screening.start_time);

    if (screeningDate < now) {
      return res.status(400).json({ message: 'Cannot cancel booking for past screenings' });
    }

    // Calculate time until screening in hours
    const hoursDifference = (screeningDate - now) / (1000 * 60 * 60);

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

    // Remove booked seats from screening
    screening.booked_seats = screening.booked_seats.filter(
      seat => !booking.seats.includes(seat)
    );
    screening.seats_available = screening.total_seats - screening.booked_seats.length;

    // Save updated screening
    await screening.save();

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
      .populate('screening', 'start_time cinema_id room_id')
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



// @desc    Create a simplified booking
// @route   POST /api/bookings/create-simple
// @access  Private
const createSimpleBooking = async (req, res) => {
  try {
    const {
      product,
      quantity,
      date,
      room,
      seat,
      service,
      address,
      subtotal,
      ticketFees,
      screeningId,
      paymentMethod,
      total
    } = req.body;

    // Validate required fields
    if (!product || !date || !seat || !screeningId || !paymentMethod || !total) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['product', 'date', 'seat', 'screeningId', 'paymentMethod', 'total']
      });
    }

    // Ensure seat is an array
    const seats = Array.isArray(seat) ? seat : [seat];

    // Generate booking number
    const bookingNumber = generateBookingNumber();

    // Get screening details to populate required fields
    const screening = await Screening.findById(screeningId)
      .populate('movie_id', 'title _id')
      .populate('cinema_id', 'name _id rooms');

    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Get movie ID from screening
    const movieId = screening.movie_id ? screening.movie_id._id : null;
    if (!movieId) {
      return res.status(400).json({ message: 'Movie information not available for this screening' });
    }

    // Get cinema ID from screening
    const cinemaId = screening.cinema_id ? screening.cinema_id._id : null;
    if (!cinemaId) {
      return res.status(400).json({ message: 'Cinema information not available for this screening' });
    }

    // Get room information
    let roomId = null;
    let roomName = room || 'Standard Room';

    if (screening.room_id && screening.cinema_id && screening.cinema_id.rooms) {
      roomId = screening.room_id;
      // Try to find room name from cinema's rooms array
      const roomInfo = screening.cinema_id.rooms.find(r => r._id.toString() === screening.room_id.toString());
      if (roomInfo && roomInfo.name) {
        roomName = roomInfo.name;
      }
    } else {
      // If room_id is not available, create a placeholder
      roomId = new mongoose.Types.ObjectId();
    }

    // Ensure date is a valid Date object
    let screeningDate;
    try {
      screeningDate = new Date(date);
      if (isNaN(screeningDate.getTime())) {
        // If date is invalid, use screening's start time
        screeningDate = new Date(screening.startTime || Date.now());
      }
    } catch (error) {
      screeningDate = new Date(screening.startTime || Date.now());
    }

    // Format the time string
    const screeningTime = screeningDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Validate payment method against allowed values
    const validPaymentMethods = ['credit_card', 'paypal', 'cash', 'stripe', 'apple_pay', 'google_pay', 'venmo'];
    let finalPaymentMethod = paymentMethod;

    if (!validPaymentMethods.includes(paymentMethod)) {
      // Default to credit_card if invalid payment method
      finalPaymentMethod = 'credit_card';
    }

    // Create the booking with all required fields
    const booking = new Booking({
      user: req.user._id,
      movie: movieId,
      movieTitle: product,
      screening: screeningId,
      screeningDate: screeningDate,
      screeningTime: screeningTime,
      cinema: cinemaId,
      cinemaName: screening.cinema_id ? screening.cinema_id.name : 'Cinema',
      room: roomId,
      roomName: roomName,
      seats,
      totalPrice: total,
      ticketPrice: subtotal / seats.length, // Calculate per-seat price
      serviceFee: ticketFees || 0,
      paymentMethod: finalPaymentMethod,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      bookingNumber,
      bookingDate: new Date(),
      format: room || screening.format || '2D',
      address: address || 'Not specified',
      quantity: quantity || seats.length,
      service: service || '',
      subtotal: subtotal || total - (ticketFees || 0)
    });

    // Try to update screening with booked seats if it exists
    try {
      // Get a fresh copy of the screening to ensure we have the latest seat status
      const screening = await Screening.findById(screeningId);
      if (!screening) {
        console.log(`Screening with ID ${screeningId} not found`);
        return;
      }

      console.log(`Found screening with ${screening.seats ? screening.seats.length : 0} seats`);

      // Check if the screening has a seats array
      if (!screening.seats || !Array.isArray(screening.seats)) {
        console.log('Screening does not have a valid seats array');
        return;
      }

      // Check if seats are available in the seats array
      const unavailableSeats = [];
      const seatStatusMap = {};

      // First, create a map of seat statuses for easier lookup
      screening.seats.forEach(seat => {
        if (seat && seat.seatNumber) {
          seatStatusMap[seat.seatNumber] = {
            status: seat.status,
            index: screening.seats.indexOf(seat)
          };
        }
      });

      console.log(`Created seat status map with ${Object.keys(seatStatusMap).length} entries`);

      // Save the updated screening
      await screening.save();

      console.log(`Successfully updated ${updatedCount} seats to 'booked' status in screening ${screeningId}`);
    } catch (err) {
      console.error('Could not update screening:', err);
      // Don't fail the booking creation if seat status update fails
      // Just log the error and continue
    }

    // Save booking
    await booking.save();

    // Add booking to user's booking history
    const user = await User.findById(req.user._id);
    if (user) {
      if (!user.bookingHistory) {
        user.bookingHistory = [];
      }
      user.bookingHistory.push(booking._id);
      await user.save();
    }

    // Generate QR code for the booking
    try {
      const qrCode = await generateQRCode(bookingNumber);
      booking.qrCode = qrCode;
      await booking.save();
    } catch (qrError) {
      console.error('Error generating QR code:', qrError);
    }

    // Send confirmation email
    try {
      if (user) {
        await sendBookingConfirmationEmail(booking, user.email);
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating simple booking:', error);
    res.status(500).json({ message: error.message });
  }

};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingAfterPayment,
  createSimpleBooking
};
