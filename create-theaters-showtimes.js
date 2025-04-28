const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load models
const User = require('./models/User');
const Theater = require('./models/Theater');
const Showtime = require('./models/Showtime');
const Movie = require('./models/Movie');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

// Generate theater and showtime data
const generateData = async () => {
  try {
    // Find admin user
    const user = await User.findOne({ role: 'admin' }) || await User.findOne();
    
    if (!user) {
      console.error('No user found. Please create a user first.');
      process.exit(1);
    }

    // Find movies
    const movies = await Movie.find().limit(10);
    
    if (movies.length === 0) {
      console.error('No movies found. Please create movies first.');
      process.exit(1);
    }

    // Clear existing theaters and showtimes
    await Theater.deleteMany();
    await Showtime.deleteMany();
    console.log('Existing theaters and showtimes cleared');

    // Create sample theaters
    const theaters = [
      {
        name: 'Cinema City',
        description: 'A premium movie theater with state-of-the-art technology and comfortable seating.',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '+1 (212) 555-1234',
        email: 'info@cinemacity.com',
        website: 'https://www.cinemacity.com',
        location: {
          type: 'Point',
          coordinates: [-73.9857, 40.7484]
        },
        images: [
          'https://example.com/theaters/cinema-city-1.jpg',
          'https://example.com/theaters/cinema-city-2.jpg'
        ],
        amenities: ['IMAX', 'Dolby Atmos', 'VIP Seating', 'Restaurant', 'Bar', 'Parking'],
        openingHours: {
          monday: { open: '10:00', close: '23:00' },
          tuesday: { open: '10:00', close: '23:00' },
          wednesday: { open: '10:00', close: '23:00' },
          thursday: { open: '10:00', close: '23:00' },
          friday: { open: '10:00', close: '01:00' },
          saturday: { open: '09:00', close: '01:00' },
          sunday: { open: '09:00', close: '23:00' }
        },
        isActive: true,
        isFeatured: true,
        rating: 4.8,
        totalScreens: 12,
        totalSeats: 2400,
        createdBy: user._id
      },
      {
        name: 'Starlight Multiplex',
        description: 'A family-friendly multiplex offering affordable entertainment for all ages.',
        address: '456 Broadway Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        phone: '+1 (323) 555-5678',
        email: 'info@starlightmultiplex.com',
        website: 'https://www.starlightmultiplex.com',
        location: {
          type: 'Point',
          coordinates: [-118.2437, 34.0522]
        },
        images: [
          'https://example.com/theaters/starlight-multiplex-1.jpg',
          'https://example.com/theaters/starlight-multiplex-2.jpg'
        ],
        amenities: ['3D Screens', 'Arcade', 'Food Court', 'Free Parking', 'Birthday Packages'],
        openingHours: {
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '00:00' },
          saturday: { open: '10:00', close: '00:00' },
          sunday: { open: '10:00', close: '22:00' }
        },
        isActive: true,
        isFeatured: true,
        rating: 4.5,
        totalScreens: 16,
        totalSeats: 3200,
        createdBy: user._id
      },
      {
        name: 'Royal Theater',
        description: 'A historic theater with classic charm and modern amenities.',
        address: '789 Park Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10021',
        country: 'USA',
        phone: '+1 (212) 555-9012',
        email: 'info@royaltheater.com',
        website: 'https://www.royaltheater.com',
        location: {
          type: 'Point',
          coordinates: [-73.9650, 40.7680]
        },
        images: [
          'https://example.com/theaters/royal-theater-1.jpg',
          'https://example.com/theaters/royal-theater-2.jpg'
        ],
        amenities: ['Dolby Atmos', 'Dine-in Service', 'VIP Lounge', 'Valet Parking', 'Bar'],
        openingHours: {
          monday: { open: '12:00', close: '23:00' },
          tuesday: { open: '12:00', close: '23:00' },
          wednesday: { open: '12:00', close: '23:00' },
          thursday: { open: '12:00', close: '23:00' },
          friday: { open: '12:00', close: '01:00' },
          saturday: { open: '11:00', close: '01:00' },
          sunday: { open: '11:00', close: '23:00' }
        },
        isActive: true,
        isFeatured: true,
        rating: 4.7,
        totalScreens: 8,
        totalSeats: 1200,
        createdBy: user._id
      }
    ];

    const createdTheaters = await Theater.insertMany(theaters);
    console.log(`${createdTheaters.length} theaters created`);

    // Create showtimes for May 2025
    const showtimes = [];
    const halls = ['Hall 1', 'Hall 2', 'IMAX', 'VIP', '4DX'];
    const formats = ['2D', '3D', 'IMAX', '4DX', 'Dolby Atmos'];
    const languages = ['English', 'Spanish', 'French'];
    const subtitles = [true, false];
    
    // Generate showtimes for the next 30 days
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    for (let day = 0; day < 30; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      
      // For each theater
      for (const theater of createdTheaters) {
        // For each movie (use up to 5 random movies)
        const shuffledMovies = [...movies].sort(() => 0.5 - Math.random()).slice(0, 5);
        
        for (const movie of shuffledMovies) {
          // For each hall (use 2-3 random halls)
          const shuffledHalls = [...halls].sort(() => 0.5 - Math.random()).slice(0, 2 + Math.floor(Math.random() * 2));
          
          for (const hall of shuffledHalls) {
            // Generate 2-4 showtimes per day for this movie/hall
            const numShowtimes = 2 + Math.floor(Math.random() * 3);
            const startHours = [10, 13, 16, 19, 22]; // Possible start hours
            const shuffledHours = [...startHours].sort(() => 0.5 - Math.random()).slice(0, numShowtimes);
            
            for (const hour of shuffledHours) {
              // Create showtime date
              const showtimeDate = new Date(date);
              showtimeDate.setHours(hour, 0, 0, 0);
              
              // Skip if the date is in the past
              if (showtimeDate < new Date()) continue;
              
              // Calculate end time (assume 2-3 hours duration)
              const duration = 120 + Math.floor(Math.random() * 60); // 2-3 hours in minutes
              const endTime = new Date(showtimeDate);
              endTime.setMinutes(endTime.getMinutes() + duration);
              
              // Determine price based on format and time
              let price = 12.99; // Base price
              if (hall === 'IMAX') price += 7;
              else if (hall === '4DX') price += 5;
              else if (hall === 'VIP') price += 10;
              
              if (hour >= 19) price += 2; // Evening premium
              
              // Format display time
              const displayHour = hour % 12 === 0 ? 12 : hour % 12;
              const displayTime = `${displayHour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
              
              // Determine format based on hall
              let format = '2D';
              if (hall === 'IMAX') format = 'IMAX';
              else if (hall === '4DX') format = '4DX';
              else if (Math.random() > 0.7) format = '3D';
              
              // Create seat map
              const totalSeats = hall === 'IMAX' ? 200 : (hall === 'VIP' ? 80 : 150);
              const seatMap = {};
              const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              const seatsPerRow = Math.ceil(Math.sqrt(totalSeats));
              const rowCount = Math.ceil(totalSeats / seatsPerRow);
              
              for (let i = 0; i < rowCount; i++) {
                for (let j = 1; j <= seatsPerRow; j++) {
                  if ((i * seatsPerRow) + j <= totalSeats) {
                    seatMap[`${rows[i]}${j}`] = 'available';
                  }
                }
              }
              
              // Create showtime object
              const showtime = {
                movie: movie._id,
                theater: theater._id,
                hall,
                date: date,
                startTime: showtimeDate,
                endTime: endTime,
                format,
                language: languages[Math.floor(Math.random() * languages.length)],
                subtitles: subtitles[Math.floor(Math.random() * subtitles.length)],
                price: parseFloat(price.toFixed(2)),
                seatsAvailable: totalSeats,
                totalSeats: totalSeats,
                seatMap,
                displayTime,
                isActive: true,
                isFeatured: Math.random() > 0.8, // 20% chance to be featured
                specialEvent: Math.random() > 0.9, // 10% chance to be a special event
                eventDetails: Math.random() > 0.9 ? 'Special screening with exclusive content and merchandise' : null,
                createdBy: user._id
              };
              
              showtimes.push(showtime);
            }
          }
        }
      }
    }

    const createdShowtimes = await Showtime.insertMany(showtimes);
    console.log(`${createdShowtimes.length} showtimes created`);

    console.log('Data generation completed successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the function
generateData();
