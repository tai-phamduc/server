const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define schemas
const ScreeningSeatSchema = new mongoose.Schema({
  seat_id: mongoose.Schema.Types.ObjectId,
  row: String,
  column: Number,
  seatNumber: String,
  status: {
    type: String,
    enum: ['available', 'booked', 'reserved', 'unavailable', 'maintenance'],
    default: 'available',
  },
  price: Number,
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'couple', 'accessible'],
    default: 'standard',
  }
});

const ScreeningSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  cinema_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX', 'ScreenX'],
    default: '2D'
  },
  price: {
    type: Number,
    required: true
  },
  seats: [ScreeningSeatSchema],
  totalSeats: {
    type: Number,
    default: 0
  },
  seatsAvailable: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'sold_out', 'almost_full', 'open'],
    default: 'scheduled'
  }
}, { timestamps: true });

// Create models
const Screening = mongoose.model('Screening', ScreeningSchema);
const Movie = mongoose.model('Movie', { title: String });
const Cinema = mongoose.model('Cinema', { name: String });
const Room = mongoose.model('Room', { name: String, cinema: mongoose.Schema.Types.ObjectId });

// Function to create seats for a screening
function createSeats(rows, columns, seatType, basePrice) {
  const seats = [];
  
  for (const row of rows) {
    for (let col = 1; col <= columns; col++) {
      let price = basePrice;
      let type = seatType;
      
      // Make some seats premium or VIP based on position
      if (row >= 'D' && row <= 'F' && col >= 4 && col <= 9) {
        type = 'premium';
        price = basePrice * 1.3;
      } else if (row >= 'G' && row <= 'H' && col >= 4 && col <= 9) {
        type = 'vip';
        price = basePrice * 1.5;
      }
      
      seats.push({
        seat_id: new mongoose.Types.ObjectId(),
        row,
        column: col,
        seatNumber: `${row}${col}`,
        status: 'available',
        price: Math.round(price * 100) / 100,
        type
      });
    }
  }
  
  return seats;
}

// Function to create multiple screenings for a specific movie
async function createSpecificMovieScreenings() {
  try {
    const MOVIE_ID = '681331bb729f006d532d9723';
    
    // Verify the movie exists
    const movie = await Movie.findById(MOVIE_ID);
    if (!movie) {
      console.log(`Movie with ID ${MOVIE_ID} not found.`);
      mongoose.disconnect();
      return;
    }
    
    console.log(`Creating screenings for movie: ${movie.title}`);
    
    // Get cinemas
    const cinemas = await Cinema.find().limit(2);
    if (cinemas.length === 0) {
      console.log('No cinemas found. Please add cinemas first.');
      mongoose.disconnect();
      return;
    }
    
    // Get rooms
    const rooms = await Room.find({ cinema: cinemas[0]._id }).limit(3);
    let roomIds = [];
    
    if (rooms.length === 0) {
      console.log('No rooms found. Using generated room IDs.');
      roomIds = [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
      ];
    } else {
      roomIds = rooms.map(room => room._id);
    }
    
    // Create screenings with different dates, times, and formats
    const now = new Date();
    const screenings = [];
    
    // Create different screening times across the next week
    const screeningConfigs = [
      // Today evening, 2D
      {
        date: new Date(now),
        startTime: (() => {
          const time = new Date(now);
          time.setHours(19, 30, 0, 0);
          return time;
        })(),
        format: '2D',
        basePrice: 10,
        cinema: cinemas[0],
        room: roomIds[0]
      },
      // Tomorrow morning, 3D
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 1);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 1);
          time.setHours(11, 0, 0, 0);
          return time;
        })(),
        format: '3D',
        basePrice: 12,
        cinema: cinemas[0],
        room: roomIds[1] || roomIds[0]
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
          time.setHours(20, 15, 0, 0);
          return time;
        })(),
        format: 'IMAX',
        basePrice: 15,
        cinema: cinemas[0],
        room: roomIds[2] || roomIds[0]
      },
      // Weekend matinee, 2D
      {
        date: (() => {
          const date = new Date(now);
          // Find the next Saturday
          date.setDate(date.getDate() + (6 - date.getDay() + 7) % 7);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          // Find the next Saturday
          time.setDate(time.getDate() + (6 - time.getDay() + 7) % 7);
          time.setHours(14, 0, 0, 0);
          return time;
        })(),
        format: '2D',
        basePrice: 11,
        cinema: cinemas[1] || cinemas[0],
        room: roomIds[0]
      },
      // Weekend evening, 4DX
      {
        date: (() => {
          const date = new Date(now);
          // Find the next Sunday
          date.setDate(date.getDate() + (7 - date.getDay() + 7) % 7);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          // Find the next Sunday
          time.setDate(time.getDate() + (7 - time.getDay() + 7) % 7);
          time.setHours(18, 45, 0, 0);
          return time;
        })(),
        format: '4DX',
        basePrice: 18,
        cinema: cinemas[1] || cinemas[0],
        room: roomIds[1] || roomIds[0]
      }
    ];
    
    for (const config of screeningConfigs) {
      // Calculate end time (assume 2 hours duration)
      const endTime = new Date(config.startTime);
      endTime.setHours(endTime.getHours() + 2);
      
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const columns = 12;
      const seats = createSeats(rows, columns, 'standard', config.basePrice);
      
      const screening = await Screening.create({
        movie_id: mongoose.Types.ObjectId(MOVIE_ID),
        cinema_id: config.cinema._id,
        room_id: config.room,
        date: config.date,
        startTime: config.startTime,
        endTime: endTime,
        format: config.format,
        price: config.basePrice,
        seats: seats,
        totalSeats: seats.length,
        seatsAvailable: seats.length,
        status: 'scheduled'
      });
      
      screenings.push(screening);
      console.log(`Created screening for "${movie.title}" at ${config.startTime.toLocaleString()} in ${config.format} format`);
    }
    
    console.log(`Successfully created ${screenings.length} screenings for movie: ${movie.title}`);
    console.log('Screening IDs:');
    screenings.forEach(screening => console.log(screening._id));
    
  } catch (error) {
    console.error('Error creating screenings:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the function
createSpecificMovieScreenings();