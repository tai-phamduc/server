const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Define schemas
const ScreeningSeatSchema = new mongoose.Schema({
  seat_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  row: {
    type: String,
    required: true,
    trim: true,
  },
  column: {
    type: Number,
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'booked', 'blocked', 'maintenance'],
    default: 'available',
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'couple', 'accessible', 'unavailable'],
    default: 'standard',
  },
  reservedAt: {
    type: Date,
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reservationExpires: {
    type: Date,
  },
});

// Function to create seats for a screening
function createSeats(rows, columns, type, basePrice) {
  const seats = [];

  for (const row of rows) {
    for (let col = 1; col <= columns; col++) {
      seats.push({
        seat_id: new mongoose.Types.ObjectId(),
        row,
        column: col,
        seatNumber: `${row}${col}`,
        status: 'available',
        price: basePrice,
        type
      });
    }
  }

  return seats;
}

// Connect to MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://vercel-admin-user-680f8b6c07a74f558d36d535:ru6zkPGmlDWWg2Mt@movie-booking.xovn2xs.mongodb.net/movie-booking?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return addFiveMoreScreenings();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Function to add five more screenings
async function addFiveMoreScreenings() {
  try {
    // Movie ID
    const MOVIE_ID = '681331bb729f006d532d9723';

    // Create a cinema and room ID
    const cinemaId = new mongoose.Types.ObjectId();
    const roomId = new mongoose.Types.ObjectId();

    console.log(`Using generated cinema ID: ${cinemaId}`);
    console.log(`Using generated room ID: ${roomId}`);

    // Create screenings with different dates, times, and formats
    const now = new Date();

    // Create 5 different screening configurations
    const screeningConfigs = [
      // Tomorrow morning, 2D
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 1);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 1);
          time.setHours(10, 30, 0, 0);
          return time;
        })(),
        format: '2D',
        basePrice: 9.5,
        cinemaId: cinemaId,
        roomId: roomId
      },
      // Tomorrow afternoon, 3D
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 1);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 1);
          time.setHours(14, 45, 0, 0);
          return time;
        })(),
        format: '3D',
        basePrice: 12.5,
        cinemaId: cinemaId,
        roomId: roomId
      },
      // Tomorrow evening, IMAX
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 1);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 1);
          time.setHours(19, 15, 0, 0);
          return time;
        })(),
        format: 'IMAX',
        basePrice: 15,
        cinemaId: cinemaId,
        roomId: roomId
      },
      // Day after tomorrow, morning, 2D
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 2);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 2);
          time.setHours(11, 0, 0, 0);
          return time;
        })(),
        format: '2D',
        basePrice: 9.5,
        cinemaId: cinemaId,
        roomId: roomId
      },
      // Day after tomorrow, evening, 4DX
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 2);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 2);
          time.setHours(20, 0, 0, 0);
          return time;
        })(),
        format: '4DX',
        basePrice: 18,
        cinemaId: cinemaId,
        roomId: roomId
      }
    ];

    // Create screenings
    const Screening = mongoose.model('Screening', new mongoose.Schema({
      movie_id: mongoose.Schema.Types.ObjectId,
      cinema_id: mongoose.Schema.Types.ObjectId,
      room_id: mongoose.Schema.Types.ObjectId,
      date: Date,
      startTime: Date,
      endTime: Date,
      format: String,
      price: Number,
      seats: [ScreeningSeatSchema],
      totalSeats: Number,
      seatsAvailable: Number,
      status: String,
      isActive: Boolean
    }));

    for (const config of screeningConfigs) {
      // Calculate end time (assume 2 hours duration)
      const endTime = new Date(config.startTime);
      endTime.setHours(endTime.getHours() + 2);

      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const columns = 12;
      const seats = createSeats(rows, columns, 'standard', config.basePrice);

      const screening = await Screening.create({
        movie_id: new mongoose.Types.ObjectId(MOVIE_ID),
        cinema_id: config.cinemaId,
        room_id: config.roomId,
        date: config.date,
        startTime: config.startTime,
        endTime: endTime,
        format: config.format,
        price: config.basePrice,
        seats: seats,
        totalSeats: seats.length,
        seatsAvailable: seats.length,
        status: 'scheduled',
        isActive: true
      });

      console.log(`Created screening at ${config.startTime.toLocaleString()} in ${config.format} format with ID: ${screening._id}`);
    }

    console.log('Successfully added 5 more screenings!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding screenings:', error);
    mongoose.disconnect();
  }
}
