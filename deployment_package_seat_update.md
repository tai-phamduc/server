# Deployment Package for Seat Status Update Endpoint

This package contains the code changes needed to add a new endpoint to the movie booking API:

`PATCH /api/seats/update` - Updates the status of multiple seats in a screening

## Changes to Make

### 1. Update `controllers/screeningController.js`

Add this new controller function:

```javascript
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
    const normalizedStatus = status.toLowerCase();
    
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        providedStatus: status
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
```

Update the module exports in `controllers/screeningController.js` to include this new function:

```javascript
module.exports = {
  // ... existing exports
  updateSeatStatus,
};
```

### 2. Update `routes/seatRoutes.js`

Update the imports to include the new controller function:

```javascript
const { getSeatTypes } = require('../controllers/seatController');
const { updateSeatStatus } = require('../controllers/screeningController');
```

Add the new route:

```javascript
// Seat status update route
router.patch('/update', updateSeatStatus);
```

## Testing

After deploying these changes, you can test the new endpoint using the following:

### PATCH /api/seats/update

```
PATCH https://movie-ticket-booking-api.vercel.app/api/seats/update
```

Request body:
```json
{
  "screeningId": "681d97a07c8c575a1a1e1d39",
  "seats": ["A1", "A2", "A3"],
  "status": "Booked"
}
```

Headers:
```
Content-Type: application/json
```

The endpoint will automatically normalize the status to lowercase, so "Booked" will be converted to "booked".

## Expected Response

```json
{
  "message": "Successfully updated 3 seats to 'booked' status",
  "screeningId": "681d97a07c8c575a1a1e1d39",
  "updatedSeats": [
    {
      "seatNumber": "A1",
      "oldStatus": "available",
      "newStatus": "booked"
    },
    {
      "seatNumber": "A2",
      "oldStatus": "available",
      "newStatus": "booked"
    },
    {
      "seatNumber": "A3",
      "oldStatus": "available",
      "newStatus": "booked"
    }
  ],
  "seatsAvailable": 97,
  "screeningStatus": "open"
}
```

## Client-Side Usage

In your client-side code, you can use this endpoint as follows:

```javascript
await cinemaApi.patch(
  "/seats/update",
  {
    screeningId: screening.screeningId,
    seats: seats.map(seat => seat.seatNumber),
    status: "Booked",
  }
);
```

This will update the status of the specified seats to "booked" in the database.
