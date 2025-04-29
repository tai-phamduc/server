const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

// @desc    Create a new showtime
// @route   POST /api/showtimes
// @access  Private/Admin
const createShowtime = async (req, res) => {
  try {
    const {
      movieId,
      theater,
      hall,
      startTime,
      endTime,
      price,
      totalSeats,
      seatMap,
    } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Create showtime
    const showtime = new Showtime({
      movie: movieId,
      theater,
      hall,
      startTime,
      endTime,
      price,
      totalSeats,
      seatsAvailable: totalSeats,
      seatMap,
    });

    await showtime.save();
    res.status(201).json(showtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all showtimes
// @route   GET /api/showtimes
// @access  Public
const getShowtimes = async (req, res) => {
  try {
    const { movieId, date, theater } = req.query;

    // Build filter object
    const filter = {};

    if (movieId) {
      filter.movie = movieId;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.startTime = { $gte: startOfDay, $lte: endOfDay };
    }

    if (theater) {
      filter.theater = theater;
    }

    // Only show active showtimes
    filter.isActive = true;

    const showtimes = await Showtime.find(filter)
      .populate('movie', 'title poster duration')
      .sort({ startTime: 1 });

    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get showtime by ID
// @route   GET /api/showtimes/:id
// @access  Public
const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate('movie', 'title poster duration genre director cast');

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a showtime
// @route   PUT /api/showtimes/:id
// @access  Private/Admin
const updateShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Update fields
    const {
      theater,
      hall,
      startTime,
      endTime,
      price,
      isActive,
    } = req.body;

    if (theater) showtime.theater = theater;
    if (hall) showtime.hall = hall;
    if (startTime) showtime.startTime = startTime;
    if (endTime) showtime.endTime = endTime;
    if (price) showtime.price = price;
    if (isActive !== undefined) showtime.isActive = isActive;

    await showtime.save();
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a showtime
// @route   DELETE /api/showtimes/:id
// @access  Private/Admin
const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if there are any bookings for this showtime
    if (showtime.bookedSeats.length > 0) {
      // Instead of deleting, mark as inactive
      showtime.isActive = false;
      await showtime.save();
      return res.json({ message: 'Showtime marked as inactive due to existing bookings' });
    }

    await showtime.remove();
    res.json({ message: 'Showtime removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available seats for a showtime
// @route   GET /api/showtimes/:id/seats
// @access  Public
const getAvailableSeats = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Return seat map and booked seats
    res.json({
      seatMap: showtime.seatMap,
      bookedSeats: showtime.bookedSeats,
      seatsAvailable: showtime.seatsAvailable,
      totalSeats: showtime.totalSeats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get showtimes by movie, theater, and date
// @route   GET /api/showtimes/movie/:movieId/theater/:theaterId/date/:date
// @access  Public
const getShowtimesByMovieTheaterDate = async (req, res) => {
  try {
    const { movieId, theaterId, date } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(theaterId)) {
      return res.status(400).json({ message: 'Invalid theater ID' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Create date range for the selected date (start of day to end of day)
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Find showtimes for the given movie, theater, and date
    const showtimes = await Showtime.find({
      movie: movieId,
      theater: theaterId,
      startTime: { $gte: startDate, $lte: endDate },
      isActive: true
    })
    .sort({ startTime: 1 })
    .populate('movie', 'title poster duration');

    res.json(showtimes);
  } catch (error) {
    console.error('Error getting showtimes by movie, theater, and date:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get showtimes by movie and date
// @route   GET /api/showtimes/movie/:movieId/date/:date
// @access  Public
const getShowtimesByMovieDate = async (req, res) => {
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

    // Create date range for the selected date (start of day to end of day)
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Find showtimes for the given movie and date
    const showtimes = await Showtime.find({
      movie: movieId,
      startTime: { $gte: startDate, $lte: endDate },
      isActive: true
    })
    .sort({ startTime: 1 })
    .populate('theater', 'name location')
    .populate('movie', 'title poster duration');

    // Group showtimes by theater
    const showtimesByTheater = {};

    showtimes.forEach(showtime => {
      const theaterId = showtime.theater._id.toString();

      if (!showtimesByTheater[theaterId]) {
        showtimesByTheater[theaterId] = {
          theater: {
            _id: showtime.theater._id,
            name: showtime.theater.name,
            location: showtime.theater.location
          },
          showtimes: []
        };
      }

      showtimesByTheater[theaterId].showtimes.push({
        _id: showtime._id,
        startTime: showtime.startTime,
        displayTime: showtime.displayTime,
        endTime: showtime.endTime,
        hall: showtime.hall,
        price: showtime.price,
        format: showtime.format,
        seatsAvailable: showtime.seatsAvailable
      });
    });

    // Convert to array
    const result = Object.values(showtimesByTheater);

    res.json(result);
  } catch (error) {
    console.error('Error getting showtimes by movie and date:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createShowtime,
  getShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
  getAvailableSeats,
  getShowtimesByMovieTheaterDate,
  getShowtimesByMovieDate,
};
