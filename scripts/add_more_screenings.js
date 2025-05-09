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

// Function to create multiple screenings
async function createMultipleScreenings() {
  try {
    // Get movies
    const movies = await Movie.find().limit(5);
    if (movies.length === 0) {
      console.log('No movies found. Please add movies first.');
      mongoose.disconnect();
      return;
    }
    
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
    
    // Screening 1: Today evening, 2D
    const screening1StartTime = new Date(now);
    screening1StartTime.setHours(19, 0, 0, 0);
    const screening1EndTime = new Date(screening1StartTime);
    screening1EndTime.setHours(screening1EndTime.getHours() + 2);
    
    // Screening 2: Tomorrow afternoon, 3D
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const screening2StartTime = new Date(tomorrow);
    screening2StartTime.setHours(15, 30, 0, 0);
    const screening2EndTime = new Date(screening2StartTime);
    screening2EndTime.setHours(screening2EndTime.getHours() + 2, screening2EndTime.getMinutes() + 15);
    
    // Screening 3: Tomorrow evening, IMAX
    const screening3StartTime = new Date(tomorrow);
    screening3StartTime.setHours(20, 0, 0, 0);
    const screening3EndTime = new Date(screening3StartTime);
    screening3EndTime.setHours(screening3EndTime.getHours() + 2, screening3EndTime.getMinutes() + 30);
    
    // Screening 4: Day after tomorrow, morning, 2D
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const screening4StartTime = new Date(dayAfterTomorrow);
    screening4StartTime.setHours(10, 0, 0, 0);
    const screening4EndTime = new Date(screening4StartTime);
    screening4EndTime.setHours(screening4EndTime.getHours() + 1, screening4EndTime.getMinutes() + 45);
    
    // Screening 5: Day after tomorrow, evening, 4DX
    const screening5StartTime = new Date(dayAfterTomorrow);
    screening5StartTime.setHours(18, 15, 0, 0);
    const screening5EndTime = new Date(screening5StartTime);
    screening5EndTime.setHours(screening5EndTime.getHours() + 2, screening5EndTime.getMinutes() + 15);
    
    // Create screening objects
    const screeningConfigs = [
      {
        movie: movies[0],
        cinema: cinemas[0],
        room: roomIds[0],
        date: now,
        startTime: screening1StartTime,
        endTime: screening1EndTime,
        format: '2D',
        basePrice: 10
      },
      {
        movie: movies[1] || movies[0],
        cinema: cinemas[0],
        room: roomIds[1] || roomIds[0],
        date: tomorrow,
        startTime: screening2StartTime,
        endTime: screening2EndTime,
        format: '3D',
        basePrice: 12
      },
      {
        movie: movies[2] || movies[0],
        cinema: cinemas[0],
        room: roomIds[2] || roomIds[0],
        date: tomorrow,
        startTime: screening3StartTime,
        endTime: screening3EndTime,
        format: 'IMAX',
        basePrice: 15
      },
      {
        movie: movies[3] || movies[1] || movies[0],
        cinema: cinemas[1] || cinemas[0],
        room: roomIds[0],
        date: dayAfterTomorrow,
        startTime: screening4StartTime,
        endTime: screening4EndTime,
        format: '2D',
        basePrice: 8
      },
      {
        movie: movies[4] || movies[2] || movies[0],
        cinema: cinemas[1] || cinemas[0],
        room: roomIds[1] || roomIds[0],
        date: dayAfterTomorrow,
        startTime: screening5StartTime,
        endTime: screening5EndTime,
        format: '4DX',
        basePrice: 18
      }
    ];
    
    for (const config of screeningConfigs) {
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const columns = 12;
      const seats = createSeats(rows, columns, 'standard', config.basePrice);
      
      const screening = await Screening.create({
        movie_id: config.movie._id,
        cinema_id: config.cinema._id,
        room_id: config.room,
        date: config.date,
        startTime: config.startTime,
        endTime: config.endTime,
        format: config.format,
        price: config.basePrice,
        seats: seats,
        totalSeats: seats.length,
        seatsAvailable: seats.length,
        status: 'scheduled'
      });
      
      screenings.push(screening);
      console.log(`Created screening for "${config.movie.title}" at ${config.startTime.toLocaleString()} in ${config.format} format`);
    }
    
    console.log(`Successfully created ${screenings.length} screenings`);
    console.log('Screening IDs:');
    screenings.forEach(screening => console.log(screening._id));
    
  } catch (error) {
    console.error('Error creating screenings:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the function
createMultipleScreenings();