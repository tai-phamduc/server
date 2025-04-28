const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking?retryWrites=true&w=majority&appName=movie-booking';

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB Atlas Connected'))
.catch(err => {
  console.error('MongoDB Atlas Connection Error:', err);
  process.exit(1);
});

// Sample movie data
const movies = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    storyLine: 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb\'s rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible, inception. Instead of the perfect heist, Cobb and his team of specialists have to pull off the reverse: their task is not to steal an idea, but to plant one. If they succeed, it could be the perfect crime. But no amount of careful planning or expertise can prepare the team for the dangerous enemy that seems to predict their every move. An enemy that only Cobb could have seen coming.',
    releaseDate: new Date('2010-07-16'),
    releaseMonth: 'July',
    releaseYear: 2010,
    duration: 148,
    genre: ['Action', 'Adventure', 'Sci-Fi', 'Thriller'],
    directorName: 'Christopher Nolan',
    writer: 'Christopher Nolan',
    writers: ['Christopher Nolan'],
    cast: [
      {
        name: 'Leonardo DiCaprio',
        character: 'Dom Cobb',
        photo: 'https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
        order: 1
      },
      {
        name: 'Joseph Gordon-Levitt',
        character: 'Arthur',
        photo: 'https://image.tmdb.org/t/p/w500/4U9G4YwTlIEbAymBaseltS38eH4.jpg',
        order: 2
      },
      {
        name: 'Ellen Page',
        character: 'Ariadne',
        photo: 'https://image.tmdb.org/t/p/w500/vDZTkJH8vVqZ5RaZzJwNmITGFgF.jpg',
        order: 3
      }
    ],
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    trailerThumbnail: 'https://img.youtube.com/vi/YoHD9XEInc0/maxresdefault.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 8.8,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    isFeatured: true,
    reviewCount: 1000,
    totalRating: 8800,
    images: [
      'https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
      'https://image.tmdb.org/t/p/w500/8ZTVqvKDQ8emSGUEMjsS4yHAwrN.jpg',
      'https://image.tmdb.org/t/p/w500/2WgieNR1tGHlpJUsolbVzbUbE1O.jpg'
    ],
    gallery: [
      'https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
      'https://image.tmdb.org/t/p/w500/8ZTVqvKDQ8emSGUEMjsS4yHAwrN.jpg',
      'https://image.tmdb.org/t/p/w500/2WgieNR1tGHlpJUsolbVzbUbE1O.jpg'
    ]
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    storyLine: 'Set within a year after the events of Batman Begins (2005), Batman, Lieutenant James Gordon, and new District Attorney Harvey Dent successfully begin to round up the criminals that plague Gotham City, until a mysterious and sadistic criminal mastermind known only as "The Joker" appears in Gotham, creating a new wave of chaos. Batman\'s struggle against The Joker becomes deeply personal, forcing him to "confront everything he believes" and improve his technology to stop him. A love triangle develops between Bruce Wayne, Dent, and Rachel Dawes.',
    releaseDate: new Date('2008-07-18'),
    releaseMonth: 'July',
    releaseYear: 2008,
    duration: 152,
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
    directorName: 'Christopher Nolan',
    writer: 'Jonathan Nolan, Christopher Nolan',
    writers: ['Jonathan Nolan', 'Christopher Nolan'],
    cast: [
      {
        name: 'Christian Bale',
        character: 'Bruce Wayne / Batman',
        photo: 'https://image.tmdb.org/t/p/w500/qCpZn2e3dimwbryLnqxZuGrHKxn.jpg',
        order: 1
      },
      {
        name: 'Heath Ledger',
        character: 'Joker',
        photo: 'https://image.tmdb.org/t/p/w500/5Y9HnYYa9jF4NunY9lSgJGjSe8Z.jpg',
        order: 2
      },
      {
        name: 'Aaron Eckhart',
        character: 'Harvey Dent / Two-Face',
        photo: 'https://image.tmdb.org/t/p/w500/5EFQvRHlpP1Iaw2e7G5tRFkQQD0.jpg',
        order: 3
      }
    ],
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    trailerThumbnail: 'https://img.youtube.com/vi/EXeTwQWrcwY/maxresdefault.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 9.0,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    isFeatured: true,
    reviewCount: 1200,
    totalRating: 10800,
    images: [
      'https://image.tmdb.org/t/p/w500/nnMC0BM6XbjIIrT4miYmMtPGcQV.jpg',
      'https://image.tmdb.org/t/p/w500/tDynwDj3pvexrEQ8wb0uy8EdcGQ.jpg',
      'https://image.tmdb.org/t/p/w500/hqkIcbrOHL60XWgUBzrVV1Wqu1X.jpg'
    ],
    gallery: [
      'https://image.tmdb.org/t/p/w500/nnMC0BM6XbjIIrT4miYmMtPGcQV.jpg',
      'https://image.tmdb.org/t/p/w500/tDynwDj3pvexrEQ8wb0uy8EdcGQ.jpg',
      'https://image.tmdb.org/t/p/w500/hqkIcbrOHL60XWgUBzrVV1Wqu1X.jpg'
    ]
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    storyLine: 'Earth\'s future has been riddled by disasters, famines, and droughts. There is only one way to ensure mankind\'s survival: Interstellar travel. A newly discovered wormhole in the far reaches of our solar system allows a team of astronauts to go where no man has gone before, a planet that may have the right environment to sustain human life.',
    releaseDate: new Date('2014-11-07'),
    releaseMonth: 'November',
    releaseYear: 2014,
    duration: 169,
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    directorName: 'Christopher Nolan',
    writer: 'Jonathan Nolan, Christopher Nolan',
    writers: ['Jonathan Nolan', 'Christopher Nolan'],
    cast: [
      {
        name: 'Matthew McConaughey',
        character: 'Cooper',
        photo: 'https://image.tmdb.org/t/p/w500/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg',
        order: 1
      },
      {
        name: 'Anne Hathaway',
        character: 'Brand',
        photo: 'https://image.tmdb.org/t/p/w500/tLelKoPNiyJCSEtQTz1FGv4TLGc.jpg',
        order: 2
      },
      {
        name: 'Jessica Chastain',
        character: 'Murph',
        photo: 'https://image.tmdb.org/t/p/w500/lodMzLKSdrPcBry6TdoDsMN3Vge.jpg',
        order: 3
      }
    ],
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    trailerThumbnail: 'https://img.youtube.com/vi/zSWdZVtXT7E/maxresdefault.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 8.6,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    isFeatured: true,
    reviewCount: 950,
    totalRating: 8170,
    images: [
      'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      'https://image.tmdb.org/t/p/w500/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
      'https://image.tmdb.org/t/p/w500/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg'
    ],
    gallery: [
      'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      'https://image.tmdb.org/t/p/w500/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
      'https://image.tmdb.org/t/p/w500/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg'
    ]
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    storyLine: 'Chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit. The film portrays the man\'s unique way of dealing with his new, torturous life; along the way he befriends a number of fellow prisoners, most notably a wise long-term inmate named Red.',
    releaseDate: new Date('1994-10-14'),
    releaseMonth: 'October',
    releaseYear: 1994,
    duration: 142,
    genre: ['Drama'],
    directorName: 'Frank Darabont',
    writer: 'Frank Darabont, Stephen King',
    writers: ['Frank Darabont', 'Stephen King'],
    cast: [
      {
        name: 'Tim Robbins',
        character: 'Andy Dufresne',
        photo: 'https://image.tmdb.org/t/p/w500/hsCu1JUzQQ4pl7uFxAVFLOs9yHh.jpg',
        order: 1
      },
      {
        name: 'Morgan Freeman',
        character: 'Ellis Boyd \'Red\' Redding',
        photo: 'https://image.tmdb.org/t/p/w500/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg',
        order: 2
      },
      {
        name: 'Bob Gunton',
        character: 'Warden Norton',
        photo: 'https://image.tmdb.org/t/p/w500/bfn4WvhGo2QKYtv5ynk7tKu7NnL.jpg',
        order: 3
      }
    ],
    poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    trailerThumbnail: 'https://img.youtube.com/vi/6hB3S9bIaco/maxresdefault.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 9.3,
    language: 'English',
    country: 'USA',
    ageRating: 'R',
    isActive: true,
    isFeatured: true,
    reviewCount: 1500,
    totalRating: 13950,
    images: [
      'https://image.tmdb.org/t/p/w500/9eSoJrj8LkbUzuPUX1FOcroSGSn.jpg',
      'https://image.tmdb.org/t/p/w500/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
      'https://image.tmdb.org/t/p/w500/avedvodAZUcwqevBfm8p4G2NziQ.jpg'
    ],
    gallery: [
      'https://image.tmdb.org/t/p/w500/9eSoJrj8LkbUzuPUX1FOcroSGSn.jpg',
      'https://image.tmdb.org/t/p/w500/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
      'https://image.tmdb.org/t/p/w500/avedvodAZUcwqevBfm8p4G2NziQ.jpg'
    ]
  },
  {
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    storyLine: 'After the devastating events of Avengers: Infinity War (2018), the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos\'s actions and undo the chaos to the universe, no matter what consequences may be in store, and no matter who they face...',
    releaseDate: new Date('2019-04-26'),
    releaseMonth: 'April',
    releaseYear: 2019,
    duration: 181,
    genre: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
    directorName: 'Anthony Russo, Joe Russo',
    writer: 'Christopher Markus, Stephen McFeely',
    writers: ['Christopher Markus', 'Stephen McFeely'],
    cast: [
      {
        name: 'Robert Downey Jr.',
        character: 'Tony Stark / Iron Man',
        photo: 'https://image.tmdb.org/t/p/w500/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg',
        order: 1
      },
      {
        name: 'Chris Evans',
        character: 'Steve Rogers / Captain America',
        photo: 'https://image.tmdb.org/t/p/w500/3bOGNsHlrswhyW79uvIHH1V43JI.jpg',
        order: 2
      },
      {
        name: 'Mark Ruffalo',
        character: 'Bruce Banner / Hulk',
        photo: 'https://image.tmdb.org/t/p/w500/z3dvKqMNf0zV5TsQwpnKEzwNmQd.jpg',
        order: 3
      }
    ],
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    trailerThumbnail: 'https://img.youtube.com/vi/TcMBFSGVi1c/maxresdefault.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 8.4,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    isFeatured: true,
    reviewCount: 1100,
    totalRating: 9240,
    images: [
      'https://image.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
      'https://image.tmdb.org/t/p/w500/orjiB3oUIsyz60hoEqkiGpy5CeO.jpg',
      'https://image.tmdb.org/t/p/w500/wVPs5oM6eZzB8EGHsYrBXN7h5Cb.jpg'
    ],
    gallery: [
      'https://image.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
      'https://image.tmdb.org/t/p/w500/orjiB3oUIsyz60hoEqkiGpy5CeO.jpg',
      'https://image.tmdb.org/t/p/w500/wVPs5oM6eZzB8EGHsYrBXN7h5Cb.jpg'
    ]
  }
];

// Define Movie model
const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a movie description'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    storyLine: {
      type: String,
      trim: true,
      maxlength: [5000, 'Story line cannot be more than 5000 characters'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please provide a release date'],
      index: true,
    },
    releaseMonth: {
      type: String,
      trim: true,
    },
    releaseYear: {
      type: Number,
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Please provide the movie duration'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [600, 'Duration cannot exceed 600 minutes (10 hours)'],
    },
    genre: {
      type: [String],
      required: [true, 'Please provide at least one genre'],
      validate: {
        validator: function(v) {
          return v.length > 0 && v.length <= 5; // At least 1 genre, max 5 genres
        },
        message: 'Please provide between 1 and 5 genres',
      },
      index: true,
    },
    genres: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
    }],
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Director',
    },
    directorName: {
      type: String,
      trim: true,
    },
    writer: {
      type: String,
      trim: true,
    },
    writers: [{
      type: String,
      trim: true,
    }],
    cast: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Actor',
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        character: {
          type: String,
          trim: true,
        },
        photo: {
          type: String, // URL to image
          default: '',
        },
        order: {
          type: Number,
          default: 0,
        },
      }
    ],
    poster: {
      type: String, // URL to image
      required: [true, 'Please provide a poster URL'],
    },
    trailer: {
      type: String, // URL to video
      required: [true, 'Please provide a trailer URL'],
    },
    trailerThumbnail: {
      type: String, // URL to trailer thumbnail image
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Now Playing', 'Coming Soon', 'Featured'],
        message: '{VALUE} is not a valid status',
      },
      required: [true, 'Please provide the movie status'],
      index: true,
    },
    displayStatus: {
      type: String,
      default: 'In theater',
      trim: true,
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [10, 'Rating cannot be more than 10'],
      default: 0,
    },
    language: {
      type: String,
      trim: true,
      default: 'English',
    },
    languages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Language',
    }],
    country: {
      type: String,
      trim: true,
      default: 'USA',
    },
    countries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    }],
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    ageRating: {
      type: String,
      enum: {
        values: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated'],
        message: '{VALUE} is not a valid age rating',
      },
      default: 'Not Rated',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
    ticketUrl: {
      type: String,
      default: '',
    },
    movieInfo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Movie = mongoose.model('Movie', MovieSchema);

// Function to seed movies
const seedMovies = async () => {
  try {
    // Delete existing movies
    await Movie.deleteMany({});
    console.log('Deleted existing movies');

    // Insert new movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`Created ${createdMovies.length} movies`);

    // Close MongoDB connection
    mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding movies:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed function
seedMovies();
