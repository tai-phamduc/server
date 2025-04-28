const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/movie-booking')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Sample movie data
const movies = [
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    releaseDate: new Date('1994-10-14'),
    duration: 142,
    genre: ['Drama'],
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    status: 'Now Playing',
    rating: 9.3,
    language: 'English',
    country: 'USA',
    ageRating: 'R',
    isActive: true,
    reviewCount: 0,
    totalRating: 0,
    images: [
      'https://m.media-amazon.com/images/M/MV5BNTYxOTYyMzE3NV5BMl5BanBnXkFtZTcwOTMxNDY3Mw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BNzAwOTk3MDg5MV5BMl5BanBnXkFtZTcwODMxNDY3Mw@@._V1_.jpg'
    ]
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    releaseDate: new Date('1972-03-24'),
    duration: 175,
    genre: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    trailer: 'https://www.youtube.com/watch?v=sY1S34973zA',
    status: 'Now Playing',
    rating: 9.2,
    language: 'English',
    country: 'USA',
    ageRating: 'R',
    isActive: true,
    reviewCount: 0,
    totalRating: 0,
    images: [
      'https://m.media-amazon.com/images/M/MV5BYTgzZTJlMDUtMGIxNy00ODJiLWI3NjAtYzQ4OTQ3MGQ3ZGRmXkEyXkFqcGdeQXVyMDc2NTEzMw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTczMTk5MjkwOF5BMl5BanBnXkFtZTgwMDI0Mjk1NDM@._V1_.jpg'
    ]
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseDate: new Date('2008-07-18'),
    duration: 152,
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    status: 'Featured',
    rating: 9.0,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    reviewCount: 0,
    totalRating: 0,
    images: [
      'https://m.media-amazon.com/images/M/MV5BMTM5OTMyMjIxOV5BMl5BanBnXkFtZTcwNzU3MDIzMw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTkyMjQ4ODk1NF5BMl5BanBnXkFtZTcwMDM3MDIzMw@@._V1_.jpg'
    ]
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseDate: new Date('2010-07-16'),
    duration: 148,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    status: 'Featured',
    rating: 8.8,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    reviewCount: 0,
    totalRating: 0,
    images: [
      'https://m.media-amazon.com/images/M/MV5BNjM2MDEyNjk4MF5BMl5BanBnXkFtZTcwNDc1NTI4Mw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMjIyNjk1OTgzNV5BMl5BanBnXkFtZTcwOTc1NTI4Mw@@._V1_.jpg'
    ]
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    releaseDate: new Date('2024-03-01'),
    duration: 166,
    genre: ['Action', 'Adventure', 'Drama'],
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    poster: 'https://m.media-amazon.com/images/M/MV5BODk0MzZmMGUtZGVlOS00MjYyLTk2MjctZGM2NWUzZTc1ODRjXkEyXkFqcGdeQXVyODA0MjgyNzM@._V1_.jpg',
    trailer: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    status: 'Coming Soon',
    rating: 8.5,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    reviewCount: 0,
    totalRating: 0,
    images: [
      'https://m.media-amazon.com/images/M/MV5BODI0MGI2YjItYzg1Ny00MmFjLTg4ODUtYzRkMWJlOGFhYjlhXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BYTJlNzE4YmMtZTU4ZS00NzI1LWJhZTYtMDlkZmNhZjc5NjE5XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg'
    ]
  }
];

// Sample user data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$ij3DjrHVVv9WvnVfuXKTT.Z.LVFSfLGZRJXSeAgP.ErwDYVbTHOty', // 123456
    role: 'admin',
    isVerified: true,
    profilePicture: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$ij3DjrHVVv9WvnVfuXKTT.Z.LVFSfLGZRJXSeAgP.ErwDYVbTHOty', // 123456
    role: 'user',
    isVerified: true,
    profilePicture: 'https://www.gravatar.com/avatar/11111111111111111111111111111111?d=mp&f=y'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2a$10$ij3DjrHVVv9WvnVfuXKTT.Z.LVFSfLGZRJXSeAgP.ErwDYVbTHOty', // 123456
    role: 'user',
    isVerified: true,
    profilePicture: 'https://www.gravatar.com/avatar/22222222222222222222222222222222?d=mp&f=y'
  }
];

// Function to seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Movie.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Insert movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`${createdMovies.length} movies created`);
    
    // Create reviews
    const reviews = [
      {
        user: createdUsers[1]._id, // John Doe
        movie: createdMovies[0]._id, // The Shawshank Redemption
        rating: 10,
        title: 'A masterpiece',
        comment: 'One of the best movies ever made. The story, acting, and direction are all perfect.',
        isApproved: true,
        watchedInTheater: true
      },
      {
        user: createdUsers[2]._id, // Jane Smith
        movie: createdMovies[0]._id, // The Shawshank Redemption
        rating: 9,
        title: 'Incredible film',
        comment: 'A powerful story of hope and redemption. Morgan Freeman and Tim Robbins deliver outstanding performances.',
        isApproved: true,
        watchedInTheater: false
      },
      {
        user: createdUsers[1]._id, // John Doe
        movie: createdMovies[1]._id, // The Godfather
        rating: 10,
        title: 'A cinematic masterpiece',
        comment: 'The Godfather is the definition of a perfect film. Marlon Brando and Al Pacino are legendary in their roles.',
        isApproved: true,
        watchedInTheater: false
      },
      {
        user: createdUsers[2]._id, // Jane Smith
        movie: createdMovies[2]._id, // The Dark Knight
        rating: 9,
        title: 'Heath Ledger\'s Joker is unforgettable',
        comment: 'Christopher Nolan created a superhero film that transcends the genre. Heath Ledger\'s performance as the Joker is one of the greatest in cinema history.',
        isApproved: true,
        watchedInTheater: true
      },
      {
        user: createdUsers[1]._id, // John Doe
        movie: createdMovies[3]._id, // Inception
        rating: 8,
        title: 'Mind-bending thriller',
        comment: 'Nolan\'s imagination and creativity are on full display in this complex, layered narrative about dreams within dreams.',
        isApproved: true,
        watchedInTheater: true
      }
    ];
    
    // Insert reviews
    for (const review of reviews) {
      const newReview = new Review(review);
      await newReview.save();
    }
    
    console.log(`${reviews.length} reviews created`);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
