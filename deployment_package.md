# Deployment Package for New Screening Endpoints

This package contains the code changes needed to add two new endpoints to the movie booking API:

1. `GET /api/screenings/:id/all-seats` - Returns all seats of a screening organized by row
2. `GET /api/screenings/:id/details` - Returns specific screening details including movie name, room type, and formatted time

## Changes to Make

### 1. Update `controllers/screeningController.js`

Add these two new controller functions:

```javascript
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
```

Then update the module exports to include these new functions:

```javascript
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
};
```

### 2. Update `routes/screeningRoutes.js`

First, update the imports to include the new controller functions:

```javascript
const {
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
} = require('../controllers/screeningController');
```

Then add the new routes:

```javascript
router.route('/:id/all-seats')
  .get(getAllSeats);

router.route('/:id/details')
  .get(getScreeningDetails);
```

## Testing

After deploying these changes, you can test the new endpoints using the following URLs:

1. `GET https://movie-ticket-booking-api.vercel.app/api/screenings/{screeningId}/all-seats`
2. `GET https://movie-ticket-booking-api.vercel.app/api/screenings/{screeningId}/details`

Replace `{screeningId}` with a valid screening ID from your database.

## Expected Responses

### GET /api/screenings/:id/all-seats

```json
{
  "screening": {
    "_id": "681d97a07c8c575a1a1e1d39",
    "movie_id": "681331bb729f006d532d9723",
    "cinema_id": "68121d9d5e6e61cab67ae98f",
    "room_id": "681d97a07c8c575a1a1e1cd4",
    "date": "2025-05-10T00:00:00.000Z",
    "startTime": "2025-05-10T03:00:00.000Z",
    "endTime": "2025-05-10T05:00:00.000Z",
    "format": "2D",
    "language": "English",
    "price": 10,
    "status": "scheduled",
    "displayDate": "Sat, May 10, 2025",
    "displayTime": "10:00 AM"
  },
  "seats": {
    "A": [
      {
        "_id": "...",
        "seat_id": "...",
        "row": "A",
        "column": 1,
        "seatNumber": "A1",
        "status": "available",
        "price": 10,
        "type": "standard"
      },
      // More seats...
    ],
    // More rows...
  },
  "totalSeats": 100,
  "seatsAvailable": 100
}
```

### GET /api/screenings/:id/details

```json
{
  "screeningId": "681d97a07c8c575a1a1e1d39",
  "movieName": "Movie Title",
  "roomType": "Standard",
  "startTime": "May 10, 2025, 10:00 AM",
  "format": "2D",
  "seats": [
    {
      "_id": "...",
      "seat_id": "...",
      "row": "A",
      "column": 1,
      "seatNumber": "A1",
      "status": "available",
      "price": 10,
      "type": "standard"
    },
    // More seats...
  ],
  "totalSeats": 100,
  "seatsAvailable": 100
}
```
