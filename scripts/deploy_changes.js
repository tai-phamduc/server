/**
 * Deployment Instructions
 * 
 * This file contains the changes that need to be deployed to the server.
 * 
 * 1. Add the new controller functions to controllers/screeningController.js:
 *    - getAllSeats: Gets all seats of a screening organized by row
 *    - getScreeningDetails: Gets specific screening details including movie name, room type, and formatted time
 * 
 * 2. Add the new routes to routes/screeningRoutes.js:
 *    - GET /api/screenings/:id/all-seats
 *    - GET /api/screenings/:id/details
 * 
 * 3. Deploy the changes to the server at https://movie-ticket-booking-api.vercel.app
 * 
 * The code for the new controller functions and routes is provided below.
 */

// New controller functions to add to controllers/screeningController.js

/**
 * @desc    Get all seats of a screening
 * @route   GET /api/screenings/:id/all-seats
 * @access  Public
 */
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

/**
 * @desc    Get screening details with movie name, room type, formatted time and seats
 * @route   GET /api/screenings/:id/details
 * @access  Public
 */
const getScreeningDetails = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id)
      .populate('movie_id', 'title')
      .populate({
        path: 'cinema_id',
        select: 'name rooms',
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

    // Get movie name
    const movieName = screening.movie_id ? screening.movie_id.title : 'Unknown Movie';

    // Return the response
    res.json({
      screeningId: screening._id,
      movieName,
      roomType,
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

// New routes to add to routes/screeningRoutes.js

/**
 * router.route('/:id/all-seats')
 *   .get(getAllSeats);
 * 
 * router.route('/:id/details')
 *   .get(getScreeningDetails);
 */

// Don't forget to update the exports in the controller file and import in the routes file
/**
 * module.exports = {
 *   // ... existing exports
 *   getAllSeats,
 *   getScreeningDetails,
 * };
 */
