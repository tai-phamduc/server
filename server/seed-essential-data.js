const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const colors = require('colors');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Configure colors
colors.enable();

// Load models
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking');
const Event = require('./models/Event');
const News = require('./models/News');
const Genre = require('./models/Genre');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movie-booking')
  .then(() => console.log('MongoDB Connected'.green.bold))
  .catch(err => {
    console.error(`Error: ${err.message}`.red.bold);
    process.exit(1);
  });

// Generate sample data
const generateData = async () => {
  try {
    console.log('Starting data generation...'.yellow);

    // Clear existing data
    await User.deleteMany();
    await Movie.deleteMany();
    await Theater.deleteMany();
    await Showtime.deleteMany();
    await Booking.deleteMany();
    await Event.deleteMany();
    await News.deleteMany();
    await Genre.deleteMany();

    console.log('Existing data cleared'.cyan);

    // Create users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
        isActive: true
      }
    ];

    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users created`.green);

    // Create genres
    const genres = [
      { name: 'Action', description: 'Action movies' },
      { name: 'Comedy', description: 'Comedy movies' },
      { name: 'Drama', description: 'Drama movies' },
      { name: 'Horror', description: 'Horror movies' },
      { name: 'Sci-Fi', description: 'Science Fiction movies' },
      { name: 'Adventure', description: 'Adventure movies' },
      { name: 'Romance', description: 'Romance movies' },
      { name: 'Fantasy', description: 'Fantasy movies' },
      { name: 'Thriller', description: 'Thriller movies' },
      { name: 'Animation', description: 'Animation movies' }
    ];

    const createdGenres = await Genre.create(genres);
    console.log(`${createdGenres.length} genres created`.green);

    // Create movies
    const movies = [
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        releaseDate: new Date('2010-07-16'),
        duration: 148,
        genre: ['Sci-Fi', 'Action', 'Thriller'],
        directorName: 'Christopher Nolan',
        cast: [
          { name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
          { name: 'Joseph Gordon-Levitt', character: 'Arthur' },
          { name: 'Ellen Page', character: 'Ariadne' }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        status: 'Now Playing',
        rating: 8.8,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        releaseDate: new Date('2008-07-18'),
        duration: 152,
        genre: ['Action', 'Crime', 'Drama'],
        directorName: 'Christopher Nolan',
        cast: [
          { name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
          { name: 'Heath Ledger', character: 'Joker' },
          { name: 'Aaron Eckhart', character: 'Harvey Dent' }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        status: 'Now Playing',
        rating: 9.0,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
        releaseDate: new Date('2019-04-26'),
        duration: 181,
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        directorName: 'Anthony Russo, Joe Russo',
        cast: [
          { name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man' },
          { name: 'Chris Evans', character: 'Steve Rogers / Captain America' },
          { name: 'Mark Ruffalo', character: 'Bruce Banner / Hulk' }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        status: 'Now Playing',
        rating: 8.4,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        releaseDate: new Date('2014-11-07'),
        duration: 169,
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        directorName: 'Christopher Nolan',
        cast: [
          { name: 'Matthew McConaughey', character: 'Cooper' },
          { name: 'Anne Hathaway', character: 'Brand' },
          { name: 'Jessica Chastain', character: 'Murph' }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        status: 'Now Playing',
        rating: 8.6,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        releaseDate: new Date('1994-09-23'),
        duration: 142,
        genre: ['Drama'],
        directorName: 'Frank Darabont',
        cast: [
          { name: 'Tim Robbins', character: 'Andy Dufresne' },
          { name: 'Morgan Freeman', character: 'Ellis Boyd "Red" Redding' },
          { name: 'Bob Gunton', character: 'Warden Norton' }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
        status: 'Now Playing',
        rating: 9.3,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      }
    ];

    const createdMovies = await Movie.create(movies);
    console.log(`${createdMovies.length} movies created`.green);

    // Create theaters
    const theaters = [
      {
        name: 'Cinema City',
        description: 'A premium movie theater with state-of-the-art technology and comfortable seating.',
        location: {
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: {
            type: 'Point',
            coordinates: [-73.9857, 40.7484]
          }
        },
        contactInfo: {
          phone: '+12125551234',
          email: 'info@cinemacity.com',
          website: 'https://www.cinemacity.com'
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
          friday: { open: '10:00', close: '23:00' },
          saturday: { open: '09:00', close: '23:00' },
          sunday: { open: '09:00', close: '23:00' }
        },
        halls: [
          {
            name: 'Hall 1',
            capacity: 150,
            seatLayout: {
              rows: 15,
              columns: 10,
              seatMap: new Map([
                ['A1', 'available'],
                ['A2', 'available'],
                ['B1', 'available'],
                ['B2', 'available']
              ])
            },
            features: ['Standard', 'Dolby Sound'],
            type: 'standard',
            isActive: true
          },
          {
            name: 'IMAX',
            capacity: 200,
            seatLayout: {
              rows: 20,
              columns: 10,
              seatMap: new Map([
                ['A1', 'available'],
                ['A2', 'available'],
                ['B1', 'available'],
                ['B2', 'available']
              ])
            },
            features: ['IMAX', 'Dolby Atmos', 'Recliner Seats'],
            type: 'imax',
            isActive: true
          }
        ],
        isActive: true,
        isFeatured: true,
        rating: 4.8,
        screens: 12,
        seatingCapacity: 2400
      },
      {
        name: 'Starlight Multiplex',
        description: 'A family-friendly multiplex offering affordable entertainment for all ages.',
        location: {
          address: '456 Broadway Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
          coordinates: {
            type: 'Point',
            coordinates: [-118.2437, 34.0522]
          }
        },
        contactInfo: {
          phone: '+13235555678',
          email: 'info@starlightmultiplex.com',
          website: 'https://www.starlightmultiplex.com'
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
          friday: { open: '11:00', close: '22:00' },
          saturday: { open: '10:00', close: '22:00' },
          sunday: { open: '10:00', close: '22:00' }
        },
        halls: [
          {
            name: 'Hall 1',
            capacity: 150,
            seatLayout: {
              rows: 15,
              columns: 10,
              seatMap: new Map([
                ['A1', 'available'],
                ['A2', 'available'],
                ['B1', 'available'],
                ['B2', 'available']
              ])
            },
            features: ['Standard', 'Dolby Sound'],
            type: 'standard',
            isActive: true
          },
          {
            name: 'VIP',
            capacity: 80,
            seatLayout: {
              rows: 8,
              columns: 10,
              seatMap: new Map([
                ['A1', 'available'],
                ['A2', 'available'],
                ['B1', 'available'],
                ['B2', 'available']
              ])
            },
            features: ['VIP', 'Recliner Seats', 'Food Service'],
            type: 'vip',
            isActive: true
          }
        ],
        isActive: true,
        isFeatured: true,
        rating: 4.5,
        screens: 16,
        seatingCapacity: 3200
      }
    ];

    const createdTheaters = await Theater.create(theaters);
    console.log(`${createdTheaters.length} theaters created`.green);

    // Create showtimes for May 2025
    const showtimes = [];
    const halls = ['Hall 1', 'Hall 2', 'IMAX', 'VIP', '4DX'];
    const formats = ['2D', '3D', 'IMAX', '4DX', 'Dolby Atmos'];

    // Generate showtimes for the next 30 days
    const startDate = new Date('2025-05-01');

    for (let day = 0; day < 31; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);

      // For each theater
      for (const theater of createdTheaters) {
        // For each movie (use up to 3 random movies)
        const shuffledMovies = [...createdMovies].sort(() => 0.5 - Math.random()).slice(0, 3);

        for (const movie of shuffledMovies) {
          // For each hall (use 2 random halls)
          const shuffledHalls = [...halls].sort(() => 0.5 - Math.random()).slice(0, 2);

          for (const hall of shuffledHalls) {
            // Generate 2-3 showtimes per day for this movie/hall
            const numShowtimes = 2 + Math.floor(Math.random() * 2);
            const startHours = [10, 13, 16, 19, 22]; // Possible start hours
            const shuffledHours = [...startHours].sort(() => 0.5 - Math.random()).slice(0, numShowtimes);

            for (const hour of shuffledHours) {
              // Create showtime date
              const showtimeDate = new Date(date);
              showtimeDate.setHours(hour, 0, 0, 0);

              // Calculate end time (assume 2-3 hours duration)
              const duration = movie.duration || 120; // Use movie duration or default to 2 hours
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
              const seatMap = new Map();
              const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              const seatsPerRow = Math.ceil(Math.sqrt(totalSeats));
              const rowCount = Math.ceil(totalSeats / seatsPerRow);

              for (let i = 0; i < rowCount; i++) {
                for (let j = 1; j <= seatsPerRow; j++) {
                  if ((i * seatsPerRow) + j <= totalSeats) {
                    seatMap.set(`${rows[i]}${j}`, 'available');
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
                language: 'English',
                subtitles: 'None',
                price: parseFloat(price.toFixed(2)),
                seatsAvailable: totalSeats,
                totalSeats: totalSeats,
                bookedSeats: [],
                reservedSeats: [],
                seatMap: seatMap,
                displayTime,
                isActive: true,
                status: 'open'
              };

              showtimes.push(showtime);
            }
          }
        }
      }
    }

    const createdShowtimes = await Showtime.insertMany(showtimes);
    console.log(`${createdShowtimes.length} showtimes created`.green);

    // Create bookings
    const bookings = [];
    const bookingStatuses = ['confirmed', 'cancelled', 'completed'];
    const paymentMethods = ['credit_card', 'paypal', 'cash'];
    const paymentStatuses = ['completed', 'pending', 'refunded'];

    // Create 10 bookings
    for (let i = 0; i < 10; i++) {
      // Get random user, movie, theater, and showtime
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const showtime = createdShowtimes[Math.floor(Math.random() * createdShowtimes.length)];

      // Find the corresponding movie and theater
      const movie = await Movie.findById(showtime.movie);
      const theater = await Theater.findById(showtime.theater);

      // Generate random seats (1-4 seats)
      const seatCount = Math.floor(Math.random() * 4) + 1;
      const seats = [];
      for (let j = 0; j < seatCount; j++) {
        const row = String.fromCharCode(65 + Math.floor(Math.random() * 10)); // A-J
        const number = Math.floor(Math.random() * 20) + 1; // 1-20
        seats.push(`${row}${number}`);
      }

      // Calculate prices
      const ticketPrice = showtime.price;
      const tax = ticketPrice * seatCount * 0.1; // 10% tax
      const serviceFee = seatCount * 1.5; // $1.5 per seat
      const totalPrice = (ticketPrice * seatCount) + tax + serviceFee;

      // Generate random booking status
      const bookingStatus = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)];

      // Generate payment status based on booking status
      let paymentStatus;
      if (bookingStatus === 'confirmed' || bookingStatus === 'completed') {
        paymentStatus = 'completed';
      } else if (bookingStatus === 'cancelled') {
        paymentStatus = Math.random() < 0.7 ? 'refunded' : 'pending';
      } else {
        paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      }

      // Generate cancellation data if booking is cancelled
      let cancellationDate = null;
      let refundAmount = 0;
      let refundPercentage = 0;
      let refundStatus = 'not_applicable';

      if (bookingStatus === 'cancelled') {
        // Generate cancellation date (1-48 hours after booking)
        const bookingDate = new Date();
        bookingDate.setHours(bookingDate.getHours() - Math.floor(Math.random() * 72)); // 0-72 hours ago

        cancellationDate = new Date(bookingDate);
        cancellationDate.setHours(cancellationDate.getHours() + Math.floor(Math.random() * 48) + 1); // 1-48 hours after booking

        // Calculate refund based on how early the cancellation was
        const hoursDifference = Math.floor((showtime.startTime - cancellationDate) / (1000 * 60 * 60));

        if (hoursDifference > 48) { // More than 48 hours before showtime
          refundPercentage = 100;
          refundAmount = totalPrice;
          refundStatus = 'completed';
        } else if (hoursDifference > 24) { // 24-48 hours before showtime
          refundPercentage = 75;
          refundAmount = totalPrice * 0.75;
          refundStatus = 'completed';
        } else if (hoursDifference > 12) { // 12-24 hours before showtime
          refundPercentage = 50;
          refundAmount = totalPrice * 0.5;
          refundStatus = 'completed';
        } else if (hoursDifference > 6) { // 6-12 hours before showtime
          refundPercentage = 25;
          refundAmount = totalPrice * 0.25;
          refundStatus = 'completed';
        } else { // Less than 6 hours before showtime
          refundPercentage = 0;
          refundAmount = 0;
          refundStatus = 'not_applicable';
        }
      }

      // Create booking object
      const booking = {
        user: user._id,
        movie: showtime.movie,
        theater: showtime.theater,
        showtime: showtime._id,
        seats,
        bookingNumber: `BK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        bookingDate: new Date(),
        showtimeDate: showtime.startTime,
        totalPrice,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus,
        bookingStatus,
        movieTitle: movie.title,
        theaterName: theater.name,
        showtimeDisplay: showtime.displayTime,
        seatsDisplay: seats.join(', '),
        hall: showtime.hall,
        ticketPrice,
        tax,
        serviceFee,
        cancellationDate,
        refundAmount,
        refundPercentage,
        refundStatus,
        notes: bookingStatus === 'cancelled' ? 'Cancelled by user' : ''
      };

      bookings.push(booking);
    }

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`${createdBookings.length} bookings created`.green);

    // Create events
    const events = [
      {
        title: 'Film Festival 2025',
        description: 'A celebration of independent cinema featuring screenings, workshops, and Q&A sessions with filmmakers.',
        shortDescription: 'A celebration of independent cinema.',
        date: new Date('2025-05-15'),
        startTime: '10:00 AM',
        endTime: '10:00 PM',
        location: 'Cinema City',
        venue: 'Main Hall',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        image: 'https://via.placeholder.com/800x600?text=Film+Festival',
        category: 'Festival',
        isActive: true,
        featured: true,
        organizer: 'Cinema City',
        ticketPrice: 25.99,
        capacity: 500
      },
      {
        title: 'Director\'s Cut: Christopher Nolan',
        description: 'A special screening of Christopher Nolan\'s films followed by a discussion about his unique directorial style.',
        shortDescription: 'Special screening of Christopher Nolan\'s films.',
        date: new Date('2025-05-25'),
        startTime: '2:00 PM',
        endTime: '10:00 PM',
        location: 'Starlight Multiplex',
        venue: 'Screen 1',
        address: '456 Broadway Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        image: 'https://via.placeholder.com/800x600?text=Directors+Cut',
        category: 'Special Screening',
        isActive: true,
        featured: true,
        organizer: 'Starlight Multiplex',
        ticketPrice: 15.99,
        capacity: 200
      },
      {
        title: 'Movie Marathon: Marvel Cinematic Universe',
        description: 'A 24-hour marathon of selected films from the Marvel Cinematic Universe.',
        shortDescription: '24-hour marathon of Marvel films.',
        date: new Date('2025-06-01'),
        startTime: '8:00 AM',
        endTime: '8:00 AM',
        location: 'Cinema City',
        venue: 'IMAX Theater',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        image: 'https://via.placeholder.com/800x600?text=Movie+Marathon',
        category: 'Marathon',
        isActive: true,
        featured: false,
        organizer: 'Cinema City',
        ticketPrice: 49.99,
        capacity: 150
      }
    ];

    const createdEvents = await Event.create(events);
    console.log(`${createdEvents.length} events created`.green);

    // Create news
    const news = [
      {
        title: 'New IMAX Screen Opening',
        content: 'Cinema City is proud to announce the opening of a new IMAX screen, providing an even more immersive movie experience for our customers. The new screen features state-of-the-art projection technology and an enhanced sound system that will transport viewers directly into the heart of the action.\n\nThe IMAX theater will open to the public next month with a special screening of the latest blockbuster releases. Tickets will be available for purchase online or at the box office starting next week.\n\n"We are thrilled to bring this cutting-edge technology to our customers," said the Cinema City manager. "This investment demonstrates our commitment to providing the best possible movie-going experience."',
        excerpt: 'Cinema City is proud to announce the opening of a new IMAX screen, providing an even more immersive movie experience for our customers.',
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        featuredImage: 'https://via.placeholder.com/800x600?text=IMAX+Opening',
        category: 'Announcement',
        categories: ['Announcement', 'Technology', 'Cinema'],
        tags: ['IMAX', 'Cinema City', 'Technology'],
        publishDate: new Date('2025-04-15'),
        status: 'published',
        featured: true
      },
      {
        title: 'Exclusive Interview with Christopher Nolan',
        content: 'We sat down with director Christopher Nolan to discuss his upcoming film and his thoughts on the future of cinema. In this exclusive interview, Nolan shares insights into his creative process and the challenges of filmmaking in the digital age.\n\n"I\'ve always been fascinated by the concept of time," Nolan explained when discussing the themes of his new project. "This film explores that in ways I haven\'t been able to before."\n\nNolan also expressed his continued commitment to shooting on film rather than digital, citing the unique aesthetic qualities that can only be achieved through traditional film stock. "There\'s a texture and depth to film that digital hasn\'t quite replicated," he noted.\n\nThe director\'s upcoming film is scheduled for release next summer and promises to be another mind-bending experience for audiences.',
        excerpt: 'We sat down with director Christopher Nolan to discuss his upcoming film and his thoughts on the future of cinema.',
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        featuredImage: 'https://via.placeholder.com/800x600?text=Nolan+Interview',
        category: 'Interview',
        categories: ['Interview', 'Directors', 'Hollywood'],
        tags: ['Christopher Nolan', 'Directors', 'Interviews'],
        publishDate: new Date('2025-04-20'),
        status: 'published',
        featured: true
      },
      {
        title: 'Summer Movie Preview',
        content: 'Get ready for an exciting summer movie season with our preview of the most anticipated releases. From action-packed blockbusters to thought-provoking indies, this summer has something for every type of movie fan.\n\nMarvel continues its cinematic universe with two major releases, while DC is set to launch a new franchise. Science fiction fans can look forward to adaptations of several beloved novels, and animation studios have a strong lineup of family-friendly features.\n\nIndependent cinema is also well-represented, with several Sundance favorites scheduled for wider release. Documentary enthusiasts will be pleased with a robust selection of compelling true stories coming to theaters.\n\nCheck our website regularly for showtimes and special events related to these upcoming releases.',
        excerpt: 'Get ready for an exciting summer movie season with our preview of the most anticipated releases.',
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        featuredImage: 'https://via.placeholder.com/800x600?text=Summer+Preview',
        category: 'Preview',
        categories: ['Preview', 'Coming Soon', 'Summer Movies'],
        tags: ['Summer', 'Blockbusters', 'Movie Preview'],
        publishDate: new Date('2025-04-25'),
        status: 'published',
        featured: false
      }
    ];

    const createdNews = await News.create(news);
    console.log(`${createdNews.length} news articles created`.green);

    console.log('Data generation completed successfully'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the data generation
generateData();
