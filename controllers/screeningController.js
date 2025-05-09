const Screening = require('../models/Screening');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

// @desc    Create a new screening
// @route   POST /api/screenings
// @access  Private/Admin
const createScreening = async (req, res) => {
  try {
    const screening = new Screening(req.body);
    const createdScreening = await screening.save();
    res.status(201).json(createdScreening);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all screenings
// @route   GET /api/screenings
// @access  Public
const getScreenings = async (req, res) => {
  try {
    const { movie, cinema, date, startTime, endTime } = req.query;

    // Build filter object
    const filter = {};

    if (movie) {
      filter.movie_id = movie;
    }

    if (cinema) {
      filter.cinema_id = cinema;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.startTime = { $gte: startOfDay, $lte: endOfDay };
    } else if (startTime && endTime) {
      filter.startTime = { $gte: new Date(startTime), $lte: new Date(endTime) };
    } else if (startTime) {
      filter.startTime = { $gte: new Date(startTime) };
    } else if (endTime) {
      filter.startTime = { $lte: new Date(endTime) };
    } else {
      // Default to future screenings
      filter.startTime = { $gte: new Date() };
    }

    // Only show active screenings
    filter.isActive = true;

    const screenings = await Screening.find(filter)
      .sort({ startTime: 1 })
      .populate('movie_id', 'title poster duration')
      .populate('cinema_id', 'name location rooms');

    res.json(screenings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get screening by ID
// @route   GET /api/screenings/:id
// @access  Public
const getScreeningById = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id)
      .populate('movie_id', 'title poster duration')
      .populate('cinema_id', 'name location rooms');

    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    res.json(screening);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update screening
// @route   PUT /api/screenings/:id
// @access  Private/Admin
const updateScreening = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id);

    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    Object.keys(req.body).forEach(key => {
      screening[key] = req.body[key];
    });

    const updatedScreening = await screening.save();
    res.json(updatedScreening);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete screening
// @route   DELETE /api/screenings/:id
// @access  Private/Admin
const deleteScreening = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id);

    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Instead of deleting, mark as inactive
    screening.isActive = false;
    screening.status = 'cancelled';
    await screening.save();

    res.json({ message: 'Screening removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available seats
// @route   GET /api/screenings/:id/seats
// @access  Public
const getAvailableSeats = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id);

    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Filter available seats
    const availableSeats = screening.seats.filter(seat => seat.status === 'available');

    res.json(availableSeats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reserve seats
// @route   POST /api/screenings/:id/reserve
// @access  Public
const reserveSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: 'Seat IDs are required' });
    }

    const screening = await Screening.findById(req.params.id);

    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Check if all seats are available
    const unavailableSeats = screening.seats.filter(
      seat => seatIds.includes(seat._id.toString()) && seat.status !== 'available'
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seats are not available',
        unavailableSeats: unavailableSeats.map(seat => ({ row: seat.row, column: seat.column }))
      });
    }

    // Reserve seats
    await screening.reserveSeats(seatIds);

    res.json({ message: 'Seats reserved successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Release seats
// @route   POST /api/screenings/:id/release
// @access  Public
const releaseSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: 'Seat IDs are required' });
    }

    const screening = await Screening.findById(req.params.id);

    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Release seats
    await screening.releaseSeats(seatIds);

    res.json({ message: 'Seats released successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get screenings by movie, cinema, and date
// @route   GET /api/screenings/movie/:movieId/cinema/:cinemaId/date/:date
// @access  Public
const getScreeningsByMovieCinemaDate = async (req, res) => {
  try {
    const { movieId, cinemaId, date } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(cinemaId)) {
      return res.status(400).json({ message: 'Invalid cinema ID' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const screenings = await Screening.findByMovieCinemaDate(movieId, cinemaId, date);
    res.json(screenings);
  } catch (error) {
    console.error('Error getting screenings by movie, cinema, and date:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get screenings by movie and date
// @route   GET /api/screenings/movie/:movieId/date/:date
// @access  Public
const getScreeningsByMovieDate = async (req, res) => {
  try {
    const { movieId, date } = req.params;

    // Validate movieId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const screenings = await Screening.findByMovieAndDate(movieId, date);

    // Group screenings by cinema
    const screeningsByCinema = {};

    screenings.forEach(screening => {
      const cinemaId = screening.cinema_id._id.toString();

      if (!screeningsByCinema[cinemaId]) {
        screeningsByCinema[cinemaId] = {
          cinema: {
            _id: screening.cinema_id._id,
            name: screening.cinema_id.name,
            location: screening.cinema_id.location
          },
          screenings: []
        };
      }

      // Find the room in the cinema's rooms array
      const room = screening.cinema_id.rooms.find(r => r._id.toString() === screening.room_id.toString());

      screeningsByCinema[cinemaId].screenings.push({
        _id: screening._id,
        startTime: screening.startTime,
        displayTime: screening.displayTime,
        endTime: screening.endTime,
        room: room ? room.name : 'Unknown Room',
        roomType: room ? room.type : 'standard',
        price: screening.price,
        format: screening.format,
        seatsAvailable: screening.seatsAvailable
      });
    });

    // Convert to array
    const result = Object.values(screeningsByCinema);

    res.json(result);
  } catch (error) {
    console.error('Error getting screenings by movie and date:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all seats of a screening
// @route   GET /api/screenings/:id/all-seats
// @access  Public
const getAllSeats = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id);

    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Return all seats with their status
    const seats = screening.seats.map(seat => ({
      _id: seat._id,
      seat_id: seat.seat_id,
      row: seat.row,
      column: seat.column,
      seatNumber: seat.seatNumber,
      status: seat.status,
      price: seat.price,
      type: seat.type
    }));

    // Group seats by row for easier frontend rendering
    const seatsByRow = {};
    seats.forEach(seat => {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row].push(seat);
    });

    // Sort each row by column
    Object.keys(seatsByRow).forEach(row => {
      seatsByRow[row].sort((a, b) => a.column - b.column);
    });

    // Get screening details
    const screeningDetails = {
      _id: screening._id,
      movie_id: screening.movie_id,
      cinema_id: screening.cinema_id,
      room_id: screening.room_id,
      date: screening.date,
      startTime: screening.startTime,
      endTime: screening.endTime,
      format: screening.format,
      language: screening.language,
      price: screening.price,
      pricingTiers: screening.pricingTiers,
      status: screening.status,
      displayDate: screening.displayDate,
      displayTime: screening.displayTime
    };

    res.json({
      screening: screeningDetails,
      seats: seatsByRow,
      totalSeats: screening.totalSeats,
      seatsAvailable: screening.seatsAvailable
    });
  } catch (error) {
    console.error('Error getting all seats:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get screening details with movie name, room type, formatted time and seats
// @route   GET /api/screenings/:id/details
// @access  Public
const getScreeningDetails = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id)
      .populate('movie_id', 'title')
      .populate({
        path: 'cinema_id',
        select: 'name rooms location',
      });

    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Find the room in the cinema's rooms array
    let roomType = 'Standard';
    if (screening.cinema_id && screening.cinema_id.rooms) {
      const room = screening.cinema_id.rooms.find(
        r => r._id.toString() === screening.room_id.toString()
      );
      if (room) {
        roomType = room.type.charAt(0).toUpperCase() + room.type.slice(1); // Capitalize first letter
      }
    }

    // Format the start time
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    const formattedStartTime = new Date(screening.startTime).toLocaleString('en-US', options);

    // Get movie name and ID
    const movieName = screening.movie_id ? screening.movie_id.title : 'Unknown Movie';
    const movieId = screening.movie_id ? screening.movie_id._id : null;

    // Get cinema address (city and state)
    let address = 'Unknown Location';
    if (screening.cinema_id && screening.cinema_id.location && screening.cinema_id.location.address) {
      const { city, state } = screening.cinema_id.location.address;
      if (city && state) {
        address = `${city}, ${state}`;
      } else if (city) {
        address = city;
      } else if (state) {
        address = state;
      }
    }

    // Return the response
    res.json({
      screeningId: screening._id,
      movieId,
      movieName,
      roomType,
      address,
      startTime: formattedStartTime,
      format: screening.format,
      seats: screening.seats,
      totalSeats: screening.totalSeats,
      seatsAvailable: screening.seatsAvailable
    });
  } catch (error) {
    console.error('Error getting screening details:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update seat status
// @route   PATCH /api/seats/update
// @access  Public
const updateSeatStatus = async (req, res) => {
  try {
    const { screeningId, seats, status } = req.body;

    // Validate required fields
    if (!screeningId || !seats || !status) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['screeningId', 'seats', 'status']
      });
    }

    // Ensure seats is an array
    const seatNumbers = Array.isArray(seats) ? seats : [seats];

    if (seatNumbers.length === 0) {
      return res.status(400).json({ message: 'At least one seat is required' });
    }

    // Validate status
    const validStatuses = ['available', 'booked', 'reserved', 'unavailable', 'maintenance'];
    let normalizedStatus = status.toLowerCase();

    // Map "taken" to "booked" for compatibility with client code
    if (normalizedStatus === 'taken') {
      normalizedStatus = 'booked';
    }

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')} (or "taken" which maps to "booked")`,
        providedStatus: status,
        validOptions: [...validStatuses, 'taken']
      });
    }

    // Find the screening
    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Check if the screening has a seats array
    if (!screening.seats || !Array.isArray(screening.seats)) {
      return res.status(400).json({ message: 'Screening does not have a valid seats array' });
    }

    // Create a map of seat numbers for efficient lookup
    const seatStatusMap = {};
    screening.seats.forEach(seat => {
      if (seat && seat.seatNumber) {
        seatStatusMap[seat.seatNumber] = {
          status: seat.status,
          index: screening.seats.indexOf(seat)
        };
      }
    });

    // Check if all seats exist
    const nonExistentSeats = seatNumbers.filter(seatNumber => !seatStatusMap[seatNumber]);
    if (nonExistentSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seats do not exist in this screening',
        nonExistentSeats
      });
    }

    // Update seat status
    const updatedSeats = [];
    for (const seatNumber of seatNumbers) {
      const seatInfo = seatStatusMap[seatNumber];
      if (seatInfo) {
        const seatIndex = seatInfo.index;
        const oldStatus = screening.seats[seatIndex].status;

        // Update the seat status
        screening.seats[seatIndex].status = normalizedStatus;

        // If seat is being booked, set reservation info
        if (normalizedStatus === 'booked' || normalizedStatus === 'reserved') {
          screening.seats[seatIndex].reservedAt = new Date();
          if (req.user) {
            screening.seats[seatIndex].reservedBy = req.user._id;
          }
        }

        // If seat is being released, clear reservation info
        if (normalizedStatus === 'available') {
          screening.seats[seatIndex].reservedAt = null;
          screening.seats[seatIndex].reservedBy = null;
        }

        updatedSeats.push({
          seatNumber,
          oldStatus,
          newStatus: normalizedStatus
        });
      }
    }

    // Update the count of available seats
    const availableSeats = screening.seats.filter(seat => seat.status === 'available').length;
    screening.seatsAvailable = availableSeats;

    // Update screening status if needed
    if (availableSeats === 0) {
      screening.status = 'sold_out';
    } else if (availableSeats <= screening.totalSeats * 0.1) { // Less than 10% seats available
      screening.status = 'almost_full';
    } else {
      screening.status = 'open';
    }

    // Save the updated screening
    await screening.save();

    res.json({
      message: `Successfully updated ${updatedSeats.length} seats to '${normalizedStatus}' status`,
      screeningId,
      updatedSeats,
      seatsAvailable: screening.seatsAvailable,
      screeningStatus: screening.status
    });
  } catch (error) {
    console.error('Error updating seat status:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update seats by ID to booked status
// @route   PUT /api/seats/book-by-id
// @access  Public
const bookSeatsByIds = async (req, res) => {
  try {
    const { screeningId, seatNumber } = req.body;

    console.log('Booking request received:', req.body);

    // Validate required fields
    if (!screeningId || !seatNumber) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['screeningId', 'seatNumber']
      });
    }

    // Ensure seatNumber is an array
    const seatIds = Array.isArray(seatNumber) ? seatNumber : [seatNumber];

    if (seatIds.length === 0) {
      return res.status(400).json({ message: 'At least one seat ID is required' });
    }

    // Find the screening
    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    // Check if the screening has a seats array
    if (!screening.seats || !Array.isArray(screening.seats)) {
      return res.status(400).json({ message: 'Screening does not have a valid seats array' });
    }

    // Create a map of seat IDs for efficient lookup
    const seatIdMap = {};
    screening.seats.forEach(seat => {
      if (seat && seat._id) {
        seatIdMap[seat._id.toString()] = {
          status: seat.status,
          index: screening.seats.indexOf(seat),
          seatNumber: seat.seatNumber
        };
      }
    });

    // Check if all seats exist
    const nonExistentSeats = seatIds.filter(seatId => !seatIdMap[seatId]);
    if (nonExistentSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seat IDs do not exist in this screening',
        nonExistentSeats
      });
    }

    // Check if seats are available
    const unavailableSeats = [];
    for (const seatId of seatIds) {
      const seatInfo = seatIdMap[seatId];
      if (seatInfo && seatInfo.status !== 'available') {
        unavailableSeats.push({
          seatId,
          seatNumber: seatInfo.seatNumber,
          currentStatus: seatInfo.status
        });
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seats are not available for booking',
        unavailableSeats
      });
    }

    // Update the status of each seat to 'booked'
    const updatedSeats = [];
    for (const seatId of seatIds) {
      const seatInfo = seatIdMap[seatId];
      if (seatInfo) {
        const seatIndex = seatInfo.index;
        const oldStatus = screening.seats[seatIndex].status;

        // Update the seat status
        screening.seats[seatIndex].status = 'booked';

        // Set reservation info
        screening.seats[seatIndex].reservedAt = new Date();
        if (req.user) {
          screening.seats[seatIndex].reservedBy = req.user._id;
        }

        updatedSeats.push({
          seatId,
          seatNumber: seatInfo.seatNumber,
          oldStatus,
          newStatus: 'booked'
        });
      }
    }

    // Update the count of available seats
    const availableSeats = screening.seats.filter(seat => seat.status === 'available').length;
    screening.seatsAvailable = availableSeats;

    // Update screening status if needed
    if (availableSeats === 0) {
      screening.status = 'sold_out';
    } else if (availableSeats <= screening.totalSeats * 0.1) { // Less than 10% seats available
      screening.status = 'almost_full';
    } else {
      screening.status = 'open';
    }

    // Save the updated screening
    await screening.save();

    res.json({
      message: `Successfully booked ${updatedSeats.length} seats`,
      screeningId,
      updatedSeats,
      seatsAvailable: screening.seatsAvailable,
      screeningStatus: screening.status
    });
  } catch (error) {
    console.error('Error booking seats by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createScreening,
  getScreenings,
  getScreeningById,
  updateScreening,
  deleteScreening,
  getAvailableSeats,
  getAllSeats,
  reserveSeats,
  releaseSeats,
  getScreeningsByMovieCinemaDate,
  getScreeningsByMovieDate,
  getScreeningDetails,
  updateSeatStatus,
  bookSeatsByIds,
};
