const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => {
    console.log('MongoDB Connected');
    // Run the main function after connection is established
    addSampleScreenings();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Main function to add sample screenings
const addSampleScreenings = async () => {
  try {
    // Check if there are already screenings in the database
    const screeningCount = await mongoose.connection.db.collection('screenings').countDocuments();
    console.log(`Found ${screeningCount} screenings in the database`);

    // If there are already screenings, don't add more
    if (screeningCount > 10) {
      console.log('Screenings already exist in the database. Skipping sample data creation.');
      process.exit(0);
      return;
    }

    // Get movies from the database
    const movies = await mongoose.connection.db.collection('movies').find({}).toArray();
    if (movies.length === 0) {
      console.error('No movies found in the database. Please add movies first.');
      process.exit(1);
      return;
    }

    // Get cinemas from the database
    const cinemas = await mongoose.connection.db.collection('cinemas').find({}).toArray();
    if (cinemas.length === 0) {
      console.error('No cinemas found in the database. Please add cinemas first.');
      process.exit(1);
      return;
    }

    // Create sample screenings
    const sampleScreenings = [];

    // Generate screenings for the next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const screeningDate = new Date();
      screeningDate.setDate(screeningDate.getDate() + dayOffset);
      
      // Format date as YYYY-MM-DD
      const formattedDate = screeningDate.toISOString().split('T')[0];
      
      // For each movie (limit to first 5 movies)
      for (let i = 0; i < Math.min(movies.length, 5); i++) {
        const movie = movies[i];
        
        // For each cinema
        for (let j = 0; j < cinemas.length; j++) {
          const cinema = cinemas[j];
          
          // For each room in the cinema (limit to first 3 rooms)
          for (let k = 0; k < Math.min(cinema.rooms.length, 3); k++) {
            const room = cinema.rooms[k];
            
            // Generate 3-4 showtimes per day for each room
            const showtimes = ['10:00', '13:00', '16:00', '19:00', '22:00'];
            const selectedShowtimes = showtimes.slice(0, 3 + Math.floor(Math.random() * 2)); // 3 or 4 showtimes
            
            for (let l = 0; l < selectedShowtimes.length; l++) {
              const showtime = selectedShowtimes[l];
              
              // Calculate end time (movie duration in minutes + 30 minutes for ads/trailers)
              const startHour = parseInt(showtime.split(':')[0]);
              const startMinute = parseInt(showtime.split(':')[1]);
              const durationInMinutes = movie.duration + 30;
              
              const endHour = Math.floor((startHour * 60 + startMinute + durationInMinutes) / 60) % 24;
              const endMinute = (startMinute + durationInMinutes) % 60;
              
              const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
              
              // Generate seats
              const seats = [];
              const rows = room.seatingLayout.rows;
              const seatsPerRow = room.seatingLayout.seatsPerRow;
              const aisleSeats = room.seatingLayout.aisleSeats || [];
              
              for (let row = 0; row < rows; row++) {
                const rowLabel = String.fromCharCode(65 + row); // A, B, C, ...
                
                for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
                  // Skip aisle seats
                  if (aisleSeats.includes(seatNum)) {
                    continue;
                  }
                  
                  // Determine seat type based on position
                  let type = 'standard';
                  if (row < 2) {
                    type = 'premium'; // First two rows are premium
                  } else if (row >= rows - 2) {
                    type = 'vip'; // Last two rows are VIP
                  }
                  
                  // Some seats in the middle are couple seats
                  if (row >= Math.floor(rows / 2) - 1 && row <= Math.floor(rows / 2) + 1 && 
                      seatNum >= Math.floor(seatsPerRow / 2) - 1 && seatNum <= Math.floor(seatsPerRow / 2) + 1) {
                    type = 'couple';
                  }
                  
                  // Add accessible seats in specific locations
                  if ((row === Math.floor(rows / 2) && seatNum === 1) || 
                      (row === Math.floor(rows / 2) && seatNum === seatsPerRow)) {
                    type = 'accessible';
                  }
                  
                  // Randomly mark some seats as booked (about 20%)
                  const isBooked = Math.random() < 0.2;
                  
                  seats.push({
                    row: rowLabel,
                    number: seatNum,
                    type: type,
                    price: type === 'standard' ? movie.price : 
                           type === 'premium' ? movie.price * 1.5 : 
                           type === 'vip' ? movie.price * 2 : 
                           type === 'couple' ? movie.price * 2.5 : 
                           movie.price,
                    isBooked: isBooked,
                    isReserved: false,
                    isAvailable: !isBooked
                  });
                }
              }
              
              // Create the screening
              sampleScreenings.push({
                movie: movie._id,
                cinema: cinema._id,
                room: room._id || room.number.toString(),
                roomName: room.name,
                date: formattedDate,
                startTime: showtime,
                endTime: endTime,
                format: movie.format[Math.floor(Math.random() * movie.format.length)],
                language: movie.language,
                subtitles: Math.random() < 0.3 ? 'English' : null,
                price: movie.price,
                seats: seats,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }
          }
        }
      }
    }

    // Insert screenings into the database
    const result = await mongoose.connection.db.collection('screenings').insertMany(sampleScreenings);
    console.log(`Inserted ${result.insertedCount} screenings`);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};
