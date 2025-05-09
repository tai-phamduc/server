const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Connect to MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://vercel-admin-user-680f8b6c07a74f558d36d535:ru6zkPGmlDWWg2Mt@movie-booking.xovn2xs.mongodb.net/movie-booking?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return addFiveMatchingScreenings();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Function to create seats for a screening
function createSeats(rows, columns, basePrice) {
  const seats = [];
  
  for (const row of rows) {
    for (let col = 1; col <= columns; col++) {
      // Determine seat type
      let type = 'standard';
      let price = basePrice;
      
      // Make some seats special types
      if ((row === 'F' || row === 'G' || row === 'H' || row === 'I') && col === 10) {
        type = 'couple';
        price = basePrice * 2.5; // Couple seats are more expensive
      } else if ((row === 'J') && (col === 1 || col === 10)) {
        type = 'accessible';
      }
      
      seats.push({
        seat_id: new mongoose.Types.ObjectId(),
        row,
        column: col,
        seatNumber: `${row}${col}`,
        status: 'available',
        price,
        booking_id: null,
        reservation_expires: null,
        type,
        reservedBy: null,
        reservedAt: null,
        lockVersion: 0
      });
    }
  }
  
  return seats;
}

// Function to add five screenings
async function addFiveMatchingScreenings() {
  try {
    // Movie ID
    const MOVIE_ID = '681331bb729f006d532d9723';
    
    // Get real cinema and room IDs from the database
    const Cinema = mongoose.model('Cinema', new mongoose.Schema({}));
    const cinemas = await Cinema.find().limit(1);
    
    if (cinemas.length === 0) {
      console.log('No cinemas found. Creating screenings with generated IDs.');
      return addScreeningsWithGeneratedIds();
    }
    
    const cinemaId = cinemas[0]._id;
    console.log(`Using cinema ID: ${cinemaId}`);
    
    // Get room ID from the cinema
    let roomId;
    if (cinemas[0].rooms && cinemas[0].rooms.length > 0) {
      roomId = cinemas[0].rooms[0]._id;
      console.log(`Using room ID: ${roomId}`);
    } else {
      roomId = new mongoose.Types.ObjectId();
      console.log(`No rooms found. Using generated room ID: ${roomId}`);
    }
    
    // Create screenings with different dates, times, and formats
    const now = new Date();
    
    // Create 5 different screening configurations
    const screeningConfigs = [
      // Tomorrow morning, 2D
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 1);
          date.setHours(0, 0, 0, 0);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 1);
          time.setHours(10, 0, 0, 0);
          return time;
        })(),
        format: '2D',
        language: 'English',
        subtitles: 'None',
        basePrice: 10
      },
      // Tomorrow afternoon, 3D
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 1);
          date.setHours(0, 0, 0, 0);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 1);
          time.setHours(14, 30, 0, 0);
          return time;
        })(),
        format: '3D',
        language: 'English',
        subtitles: 'None',
        basePrice: 12
      },
      // Tomorrow evening, IMAX
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 1);
          date.setHours(0, 0, 0, 0);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 1);
          time.setHours(19, 0, 0, 0);
          return time;
        })(),
        format: 'IMAX',
        language: 'English',
        subtitles: 'None',
        basePrice: 15
      },
      // Day after tomorrow, morning, 2D
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 2);
          date.setHours(0, 0, 0, 0);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 2);
          time.setHours(11, 30, 0, 0);
          return time;
        })(),
        format: '2D',
        language: 'English',
        subtitles: 'None',
        basePrice: 10
      },
      // Day after tomorrow, evening, 4DX
      {
        date: (() => {
          const date = new Date(now);
          date.setDate(date.getDate() + 2);
          date.setHours(0, 0, 0, 0);
          return date;
        })(),
        startTime: (() => {
          const time = new Date(now);
          time.setDate(time.getDate() + 2);
          time.setHours(20, 15, 0, 0);
          return time;
        })(),
        format: '4DX',
        language: 'English',
        subtitles: 'None',
        basePrice: 18
      }
    ];
    
    // Create screenings
    const Screening = mongoose.model('Screening', new mongoose.Schema({}, { strict: false }));
    
    for (const config of screeningConfigs) {
      // Calculate end time (assume 2 hours duration)
      const endTime = new Date(config.startTime);
      endTime.setHours(endTime.getHours() + 2);
      
      // Format display date and time
      const displayDate = config.startTime.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const displayTime = config.startTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      
      const dayOfWeek = config.startTime.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Create seat layout
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      const columns = 10;
      const seats = createSeats(rows, columns, config.basePrice);
      
      // Create pricing tiers
      const pricingTiers = {
        standard: config.basePrice,
        premium: config.basePrice * 1.5,
        vip: config.basePrice * 2,
        couple: config.basePrice * 2.5,
        accessible: config.basePrice
      };
      
      const screening = await Screening.create({
        movie_id: new mongoose.Types.ObjectId(MOVIE_ID),
        cinema_id: cinemaId,
        room_id: roomId,
        date: config.date,
        startTime: config.startTime,
        endTime: endTime,
        format: config.format,
        language: config.language,
        subtitles: config.subtitles,
        price: config.basePrice,
        pricingTiers: pricingTiers,
        seats: seats,
        totalSeats: seats.length,
        seatsAvailable: seats.length,
        isActive: true,
        status: 'scheduled',
        bookingEnabled: true,
        version: 1,
        specialEvent: false,
        promotionalDiscount: {
          isActive: false,
          discountPercentage: 0
        },
        concurrentBookingLimit: 10,
        currentConcurrentBookings: 0,
        displayDate: displayDate,
        displayTime: displayTime,
        dayOfWeek: dayOfWeek
      });
      
      console.log(`Created screening for ${displayDate} at ${displayTime} in ${config.format} format with ID: ${screening._id}`);
    }
    
    console.log('Successfully added 5 more screenings!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding screenings:', error);
    mongoose.disconnect();
  }
}

// Fallback function if no cinemas are found
async function addScreeningsWithGeneratedIds() {
  try {
    // Movie ID
    const MOVIE_ID = '681331bb729f006d532d9723';
    
    // Generate IDs
    const cinemaId = new mongoose.Types.ObjectId();
    const roomId = new mongoose.Types.ObjectId();
    
    console.log(`Using generated cinema ID: ${cinemaId}`);
    console.log(`Using generated room ID: ${roomId}`);
    
    // Rest of the function is the same as addFiveMatchingScreenings
    // but using the generated IDs
    // ...
    
    // This would be implemented if needed
    console.log('Implementation for generated IDs would go here');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error in fallback function:', error);
    mongoose.disconnect();
  }
}
