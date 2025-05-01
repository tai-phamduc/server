const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Screening = require('../models/Screening');

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to generate seat layout for a room
const generateSeatLayout = (rows, columns, roomType = 'standard') => {
  const seats = [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= columns; j++) {
      let seatType = 'standard';
      let price = 10;

      // Make some seats premium or VIP based on position
      if (roomType === 'premium' || roomType === 'vip') {
        if (i >= Math.floor(rows * 0.6)) {
          seatType = 'premium';
          price = 15;
        }
        if (i >= Math.floor(rows * 0.8)) {
          seatType = 'vip';
          price = 20;
        }
      }

      // Make some seats couple seats
      if (j % 10 === 0 && j > 0 && i >= Math.floor(rows * 0.5)) {
        seatType = 'couple';
        price = 25;
      }

      // Make some seats accessible
      if (i === rows - 1 && (j === 1 || j === columns)) {
        seatType = 'accessible';
        price = 10;
      }

      seats.push({
        row: rowLabels[i],
        column: j,
        seatNumber: `${rowLabels[i]}${j}`,
        type: seatType,
        price: price,
        isActive: true
      });
    }
  }

  return seats;
};

// Function to create a room is no longer needed as we're using Cinema's embedded rooms

// Function to create a screening
const createScreening = async (movieId, cinemaId, roomIndex, startTime, format = '2D', price = 10) => {
  try {
    // Calculate end time (movie duration + 30 minutes for ads and trailers)
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error(`Movie with ID ${movieId} not found`);
    }

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + movie.duration + 30);

    // Get the date part only
    const date = new Date(startTime);
    date.setHours(0, 0, 0, 0);

    // Get cinema and room details
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      throw new Error(`Cinema with ID ${cinemaId} not found`);
    }

    if (roomIndex >= cinema.rooms.length) {
      throw new Error(`Room index ${roomIndex} is out of bounds for cinema ${cinema.name}`);
    }

    const room = cinema.rooms[roomIndex];

    // Create screening seats based on room's seatLayout
    const screeningSeats = [];

    // Generate seats if the room doesn't have a seatLayout or seats
    if (!room.seatLayout || !room.seatLayout.seats || room.seatLayout.seats.length === 0) {
      const rows = room.seatLayout?.rows || 10;
      const columns = room.seatLayout?.columns || 10;
      const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      for (let i = 0; i < rows; i++) {
        for (let j = 1; j <= columns; j++) {
          let seatType = 'standard';
          let seatPrice = price;

          // Make some seats premium or VIP based on position
          if (room.type === 'premium' || room.type === 'vip') {
            if (i >= Math.floor(rows * 0.6)) {
              seatType = 'premium';
              seatPrice = price * 1.5;
            }
            if (i >= Math.floor(rows * 0.8)) {
              seatType = 'vip';
              seatPrice = price * 2;
            }
          }

          // Make some seats couple seats
          if (j % 10 === 0 && j > 0 && i >= Math.floor(rows * 0.5)) {
            seatType = 'couple';
            seatPrice = price * 2.5;
          }

          // Make some seats accessible
          if (i === rows - 1 && (j === 1 || j === columns)) {
            seatType = 'accessible';
            seatPrice = price;
          }

          screeningSeats.push({
            seat_id: new mongoose.Types.ObjectId(),
            row: rowLabels[i],
            column: j,
            seatNumber: `${rowLabels[i]}${j}`,
            status: 'available',
            price: seatPrice,
            type: seatType
          });
        }
      }
    } else {
      // Use existing seats from the room's seatLayout
      room.seatLayout.seats.forEach(seat => {
        let seatPrice = price;
        if (seat.type === 'premium') seatPrice = price * 1.5;
        if (seat.type === 'vip') seatPrice = price * 2;
        if (seat.type === 'couple') seatPrice = price * 2.5;

        screeningSeats.push({
          seat_id: new mongoose.Types.ObjectId(),
          row: seat.row,
          column: seat.column,
          seatNumber: seat.seatNumber,
          status: 'available',
          price: seatPrice,
          type: seat.type
        });
      });
    }

    const screening = new Screening({
      movie_id: movieId,
      cinema_id: cinemaId,
      room_id: room._id,
      date,
      startTime,
      endTime,
      format,
      price,
      pricingTiers: {
        standard: price,
        premium: price * 1.5,
        vip: price * 2,
        couple: price * 2.5,
        accessible: price
      },
      seats: screeningSeats,
      totalSeats: screeningSeats.length,
      seatsAvailable: screeningSeats.length,
      isActive: true,
      status: 'scheduled',
      bookingEnabled: true
    });

    return await screening.save();
  } catch (error) {
    console.error('Error creating screening:', error);
    throw error;
  }
};

// Main function to add sample data
const addSampleData = async () => {
  try {
    console.log('Starting to add sample data...');

    // Get existing movies
    const movies = await Movie.find().limit(5);
    if (movies.length === 0) {
      console.error('No movies found in the database');
      process.exit(1);
    }

    // Get existing cinemas
    const cinemas = await Cinema.find().limit(2);
    if (cinemas.length === 0) {
      console.error('No cinemas found in the database');
      process.exit(1);
    }

    console.log(`Found ${movies.length} movies and ${cinemas.length} cinemas`);

    // Create rooms for each cinema if they don't exist
    for (const cinema of cinemas) {
      if (cinema.rooms.length === 0) {
        console.log(`Creating rooms for cinema: ${cinema.name}`);

        // Add rooms to the cinema
        await cinema.addRoom({
          name: 'Room 1',
          capacity: 100,
          type: 'standard',
          seatLayout: {
            rows: 10,
            columns: 10,
            seats: generateSeatLayout(10, 10, 'standard')
          }
        });

        await cinema.addRoom({
          name: 'Room 2',
          capacity: 80,
          type: 'premium',
          seatLayout: {
            rows: 8,
            columns: 10,
            seats: generateSeatLayout(8, 10, 'premium')
          }
        });

        await cinema.addRoom({
          name: 'Room 3',
          capacity: 50,
          type: 'vip',
          seatLayout: {
            rows: 5,
            columns: 10,
            seats: generateSeatLayout(5, 10, 'vip')
          }
        });

        console.log(`Created rooms for cinema: ${cinema.name}`);
      } else {
        console.log(`Cinema ${cinema.name} already has ${cinema.rooms.length} rooms`);
      }
    }

    // Create screenings for the next 7 days
    console.log('Creating screenings for the next 7 days...');

    // Delete existing screenings first
    await Screening.deleteMany({});
    console.log('Deleted existing screenings');

    // Use a future date (next year) to avoid validation issues
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    futureDate.setHours(0, 0, 0, 0);

    for (let day = 0; day < 7; day++) {
      const date = new Date(futureDate);
      date.setDate(date.getDate() + day);

      console.log(`Creating screenings for ${date.toISOString().split('T')[0]}`);

      for (const cinema of cinemas) {
        for (const movie of movies) {
          // Create 3 screenings per movie per cinema per day
          const screeningTimes = [
            new Date(new Date(date).setHours(10, 0, 0, 0)),
            new Date(new Date(date).setHours(14, 30, 0, 0)),
            new Date(new Date(date).setHours(19, 0, 0, 0))
          ];

          for (let i = 0; i < screeningTimes.length; i++) {
            const roomIndex = i % cinema.rooms.length;

            await createScreening(
              movie._id,
              cinema._id,
              roomIndex,
              new Date(screeningTimes[i]),
              i === 2 ? '3D' : '2D',
              i === 2 ? 15 : 10
            );
          }
        }
      }
    }

    console.log('Sample data added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
};

// Run the function
addSampleData();
