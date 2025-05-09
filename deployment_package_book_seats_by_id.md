# Deployment Package for Book Seats by ID Endpoint

This package contains the code changes needed to add a new endpoint to the movie booking API:

`PATCH /api/seats/book-by-id` - Updates the status of multiple seats to "booked" using their IDs

## Changes to Make

### 1. Update `controllers/screeningController.js`

Add this new controller function:

```javascript
// @desc    Update seats by ID to booked status
// @route   PATCH /api/seats/book-by-id
// @access  Public
const bookSeatsByIds = async (req, res) => {
  try {
    const { screeningId, seatIdList } = req.body;

    // Validate required fields
    if (!screeningId || !seatIdList) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['screeningId', 'seatIdList']
      });
    }

    // Ensure seatIdList is an array
    const seatIds = Array.isArray(seatIdList) ? seatIdList : [seatIdList];
    
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
```

Update the module exports in `controllers/screeningController.js` to include this new function:

```javascript
module.exports = {
  // ... existing exports
  bookSeatsByIds,
};
```

### 2. Update `routes/seatRoutes.js`

Update the imports to include the new controller function:

```javascript
const { updateSeatStatus, bookSeatsByIds } = require('../controllers/screeningController');
```

Add the new route:

```javascript
router.patch('/book-by-id', bookSeatsByIds);
```

## Testing

After deploying these changes, you can test the new endpoint using the following:

### PATCH /api/seats/book-by-id

```
PATCH https://movie-ticket-booking-api.vercel.app/api/seats/book-by-id
```

Request body:
```json
{
  "screeningId": "681d97a07c8c575a1a1e1d39",
  "seatIdList": ["5f8d3a1e9d3e2a1b3c4d5e6f", "5f8d3a1e9d3e2a1b3c4d5e70"]
}
```

Headers:
```
Content-Type: application/json
```

## Expected Response

```json
{
  "message": "Successfully booked 2 seats",
  "screeningId": "681d97a07c8c575a1a1e1d39",
  "updatedSeats": [
    {
      "seatId": "5f8d3a1e9d3e2a1b3c4d5e6f",
      "seatNumber": "A1",
      "oldStatus": "available",
      "newStatus": "booked"
    },
    {
      "seatId": "5f8d3a1e9d3e2a1b3c4d5e70",
      "seatNumber": "A2",
      "oldStatus": "available",
      "newStatus": "booked"
    }
  ],
  "seatsAvailable": 98,
  "screeningStatus": "open"
}
```

## Client-Side Usage

In your client-side code, you can use this endpoint as follows:

```javascript
await cinemaApi.patch(
  "/seats/book-by-id",
  {
    screeningId: screening.screeningId,
    seatIdList: selectedSeats.map(seat => seat._id)
  }
);
```

This will update the status of the specified seats to "booked" in the database.
