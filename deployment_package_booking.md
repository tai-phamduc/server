# Deployment Package for New Booking Endpoints

This package contains the code changes needed to add two new endpoints to the movie booking API:

1. `GET /api/screenings/:id/details` - Returns specific screening details including movie name, movie ID, room type, formatted time, cinema address, and seats
2. `POST /api/bookings/create-simple` - Creates a new booking with simplified fields

## Changes to Make

### 1. Update `controllers/screeningController.js`

Add this new controller function:

```javascript
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
```

Update the module exports in `controllers/screeningController.js` to include this new function:

```javascript
module.exports = {
  // ... existing exports
  getScreeningDetails,
};
```

### 2. Update `routes/screeningRoutes.js`

First, update the imports to include the new controller function:

```javascript
const {
  // ... existing imports
  getScreeningDetails,
} = require('../controllers/screeningController');
```

Then add the new route:

```javascript
router.route('/:id/details')
  .get(getScreeningDetails);
```

### 3. Update `controllers/bookingController.js`

Add this new controller function:

```javascript
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
      const screening = await Screening.findById(screeningId);
      if (screening) {
        // Check if seats are available in the seats array
        const unavailableSeats = [];

        // Check if the seats are available in the screening's seats array
        for (const seatNumber of seats) {
          const seatIndex = screening.seats.findIndex(s => s.seatNumber === seatNumber && s.status === 'available');
          if (seatIndex === -1) {
            unavailableSeats.push(seatNumber);
          }
        }

        if (unavailableSeats.length > 0) {
          return res.status(400).json({
            message: 'Some seats are no longer available',
            unavailableSeats
          });
        }

        // Update the status of each seat to 'booked'
        for (const seatNumber of seats) {
          const seatIndex = screening.seats.findIndex(s => s.seatNumber === seatNumber);
          if (seatIndex !== -1) {
            screening.seats[seatIndex].status = 'booked';
            screening.seats[seatIndex].reservedAt = new Date();
            screening.seats[seatIndex].reservedBy = req.user._id;
          }
        }

        // Update the count of available seats
        const availableSeats = screening.seats.filter(seat => seat.status === 'available').length;
        screening.seatsAvailable = availableSeats;

        // Also maintain the legacy booked_seats array if it exists
        if (Array.isArray(screening.booked_seats)) {
          screening.booked_seats = [...(screening.booked_seats || []), ...seats];
        }

        // Save the updated screening
        await screening.save();

        console.log(`Updated ${seats.length} seats to 'booked' status in screening ${screeningId}`);
      }
    } catch (err) {
      console.log('Could not update screening:', err.message);
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
```

Update the module exports in `controllers/bookingController.js` to include this new function:

```javascript
module.exports = {
  // ... existing exports
  createSimpleBooking,
};
```

### 4. Update `routes/bookingRoutes.js`

First, update the imports to include the new controller function:

```javascript
const {
  // ... existing imports
  createSimpleBooking,
} = require('../controllers/bookingController');
```

Then add the new route:

```javascript
router.route('/create-simple')
  .post(protect, createSimpleBooking);
```

## Testing

After deploying these changes, you can test the new endpoints using the following:

### 1. GET /api/screenings/:id/details

```
GET https://movie-ticket-booking-api.vercel.app/api/screenings/{screeningId}/details
```

Replace `{screeningId}` with a valid screening ID from your database.

### 2. POST /api/bookings/create-simple

```
POST https://movie-ticket-booking-api.vercel.app/api/bookings/create-simple
```

Request body:
```json
{
  "product": "The Witcher Season 2",
  "quantity": 2,
  "date": "2025-05-10T10:00:00.000Z",
  "room": "IMAX",
  "seat": ["A1", "A2"],
  "service": "Standard",
  "address": "New York, NY",
  "subtotal": 30.00,
  "ticketFees": 2.50,
  "screeningId": "681d97a07c8c575a1a1e1d39",
  "paymentMethod": "credit_card",
  "total": 32.50
}
```

Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_AUTH_TOKEN
```

Replace `YOUR_AUTH_TOKEN` with a valid authentication token and `screeningId` with a valid screening ID from your database.
