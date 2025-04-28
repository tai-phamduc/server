const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load models
const User = require('./models/User');
const Movie = require('./models/Movie');
const Genre = require('./models/Genre');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

// Generate movie data
const generateMovies = async () => {
  try {
    // Find admin user
    const user = await User.findOne({ role: 'admin' }) || await User.findOne();

    if (!user) {
      console.error('No user found. Please create a user first.');
      process.exit(1);
    }

    // Find genres
    const genres = await Genre.find();

    if (genres.length === 0) {
      console.log('No genres found. Creating default genres...');

      // Create default genres
      const defaultGenres = [
        { name: 'Action', description: 'Action films', createdBy: user._id },
        { name: 'Adventure', description: 'Adventure films', createdBy: user._id },
        { name: 'Comedy', description: 'Comedy films', createdBy: user._id },
        { name: 'Drama', description: 'Drama films', createdBy: user._id },
        { name: 'Horror', description: 'Horror films', createdBy: user._id },
        { name: 'Sci-Fi', description: 'Science Fiction films', createdBy: user._id },
        { name: 'Thriller', description: 'Thriller films', createdBy: user._id },
        { name: 'Romance', description: 'Romance films', createdBy: user._id },
        { name: 'Fantasy', description: 'Fantasy films', createdBy: user._id },
        { name: 'Animation', description: 'Animation films', createdBy: user._id }
      ];

      await Genre.insertMany(defaultGenres);
      console.log('Default genres created');
    }

    // Get all genres after potential creation
    const allGenres = await Genre.find();

    // Clear existing movies
    await Movie.deleteMany();
    console.log('Existing movies cleared');

    // Create sample movies
    const movies = [
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        releaseDate: new Date('2010-07-16'),
        duration: 148,
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        genres: allGenres.filter(g => ['Action', 'Sci-Fi', 'Thriller'].includes(g.name)).map(g => g._id),
        directorName: 'Christopher Nolan',
        cast: [
          { name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
          { name: 'Joseph Gordon-Levitt', character: 'Arthur' },
          { name: 'Ellen Page', character: 'Ariadne' },
          { name: 'Tom Hardy', character: 'Eames' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
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
        genre: ['Action', 'Crime', 'Drama', 'Thriller'],
        genres: allGenres.filter(g => ['Action', 'Crime', 'Drama', 'Thriller'].includes(g.name)).map(g => g._id),
        directorName: 'Christopher Nolan',
        cast: [
          { name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
          { name: 'Heath Ledger', character: 'Joker' },
          { name: 'Aaron Eckhart', character: 'Harvey Dent' },
          { name: 'Michael Caine', character: 'Alfred' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        status: 'Now Playing',
        rating: 9.0,
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
        genres: allGenres.filter(g => ['Adventure', 'Drama', 'Sci-Fi'].includes(g.name)).map(g => g._id),
        directorName: 'Christopher Nolan',
        cast: [
          { name: 'Matthew McConaughey', character: 'Cooper' },
          { name: 'Anne Hathaway', character: 'Brand' },
          { name: 'Jessica Chastain', character: 'Murph' },
          { name: 'Michael Caine', character: 'Professor Brand' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        status: 'Now Playing',
        rating: 8.6,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'The Godfather',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        releaseDate: new Date('1972-03-24'),
        duration: 175,
        genre: ['Crime', 'Drama'],
        genres: allGenres.filter(g => ['Crime', 'Drama'].includes(g.name)).map(g => g._id),
        directorName: 'Francis Ford Coppola',
        cast: [
          { name: 'Marlon Brando', character: 'Don Vito Corleone' },
          { name: 'Al Pacino', character: 'Michael Corleone' },
          { name: 'James Caan', character: 'Sonny Corleone' },
          { name: 'Robert Duvall', character: 'Tom Hagen' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        trailer: 'https://www.youtube.com/watch?v=sY1S34973zA',
        status: 'Now Playing',
        rating: 9.2,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        releaseDate: new Date('1994-10-14'),
        duration: 154,
        genre: ['Crime', 'Drama'],
        genres: allGenres.filter(g => ['Crime', 'Drama'].includes(g.name)).map(g => g._id),
        directorName: 'Quentin Tarantino',
        cast: [
          { name: 'John Travolta', character: 'Vincent Vega' },
          { name: 'Samuel L. Jackson', character: 'Jules Winnfield' },
          { name: 'Uma Thurman', character: 'Mia Wallace' },
          { name: 'Bruce Willis', character: 'Butch Coolidge' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        trailer: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
        status: 'Now Playing',
        rating: 8.9,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'The Matrix',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        releaseDate: new Date('1999-03-31'),
        duration: 136,
        genre: ['Action', 'Sci-Fi'],
        genres: allGenres.filter(g => ['Action', 'Sci-Fi'].includes(g.name)).map(g => g._id),
        directorName: 'Lana Wachowski, Lilly Wachowski',
        cast: [
          { name: 'Keanu Reeves', character: 'Neo' },
          { name: 'Laurence Fishburne', character: 'Morpheus' },
          { name: 'Carrie-Anne Moss', character: 'Trinity' },
          { name: 'Hugo Weaving', character: 'Agent Smith' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        trailer: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
        status: 'Now Playing',
        rating: 8.7,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Forrest Gump',
        description: 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
        releaseDate: new Date('1994-07-06'),
        duration: 142,
        genre: ['Drama', 'Romance'],
        genres: allGenres.filter(g => ['Drama', 'Romance'].includes(g.name)).map(g => g._id),
        directorName: 'Robert Zemeckis',
        cast: [
          { name: 'Tom Hanks', character: 'Forrest Gump' },
          { name: 'Robin Wright', character: 'Jenny Curran' },
          { name: 'Gary Sinise', character: 'Lieutenant Dan Taylor' },
          { name: 'Sally Field', character: 'Mrs. Gump' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
        trailer: 'https://www.youtube.com/watch?v=bLvqoHBptjg',
        status: 'Now Playing',
        rating: 8.8,
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
        genres: allGenres.filter(g => ['Drama'].includes(g.name)).map(g => g._id),
        directorName: 'Frank Darabont',
        cast: [
          { name: 'Tim Robbins', character: 'Andy Dufresne' },
          { name: 'Morgan Freeman', character: 'Ellis Boyd "Red" Redding' },
          { name: 'Bob Gunton', character: 'Warden Norton' },
          { name: 'William Sadler', character: 'Heywood' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
        status: 'Now Playing',
        rating: 9.3,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
        releaseDate: new Date('2001-12-19'),
        duration: 178,
        genre: ['Adventure', 'Fantasy'],
        genres: allGenres.filter(g => ['Adventure', 'Fantasy'].includes(g.name)).map(g => g._id),
        directorName: 'Peter Jackson',
        cast: [
          { name: 'Elijah Wood', character: 'Frodo Baggins' },
          { name: 'Ian McKellen', character: 'Gandalf' },
          { name: 'Viggo Mortensen', character: 'Aragorn' },
          { name: 'Sean Astin', character: 'Sam' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
        trailer: 'https://www.youtube.com/watch?v=V75dMMIW2B4',
        status: 'Now Playing',
        rating: 8.8,
        language: 'English',
        country: 'New Zealand, USA',
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
        releaseDate: new Date('2019-04-26'),
        duration: 181,
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        genres: allGenres.filter(g => ['Action', 'Adventure', 'Sci-Fi'].includes(g.name)).map(g => g._id),
        directorName: 'Anthony Russo, Joe Russo',
        cast: [
          { name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man' },
          { name: 'Chris Evans', character: 'Steve Rogers / Captain America' },
          { name: 'Mark Ruffalo', character: 'Bruce Banner / Hulk' },
          { name: 'Chris Hemsworth', character: 'Thor' }
        ],
        poster: 'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        status: 'Now Playing',
        rating: 8.4,
        language: 'English',
        country: 'USA',
        isActive: true,
        isFeatured: true
      }
    ];

    const createdMovies = await Movie.insertMany(movies);
    console.log(`${createdMovies.length} movies created`);

    console.log('Movie data generation completed successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the function
generateMovies();
