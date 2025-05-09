const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to get all movies
async function getAllMovies() {
  let connection;
  try {
    // Connect to MongoDB and wait for connection to be established
    connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Get direct access to the database
    const db = mongoose.connection.db;
    
    // Access the movies collection
    const moviesCollection = db.collection('movies');
    
    // Count total movies
    const totalMovies = await moviesCollection.countDocuments();
    console.log(`Total movies in database: ${totalMovies}`);
    
    // Get all movies (with optional limit)
    const limit = 100; // Change this if you want to see more or fewer movies
    const movies = await moviesCollection.find({})
      .sort({ title: 1 }) // Sort alphabetically by title
      .limit(limit)
      .toArray();
    
    console.log(`\nDisplaying ${movies.length} movies (sorted alphabetically):`);
    console.log('='.repeat(80));
    
    // Display movie information in a readable format
    movies.forEach((movie, index) => {
      console.log(`${index + 1}. "${movie.title}" (ID: ${movie._id})`);
      console.log(`   Release Date: ${movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'N/A'}`);
      console.log(`   Status: ${movie.status || 'N/A'}`);
      console.log(`   Rating: ${movie.rating || 'N/A'}`);
      
      // Show genres if available
      if (movie.genres && movie.genres.length > 0) {
        console.log(`   Genres: ${Array.isArray(movie.genres) ? 
          movie.genres.map(g => typeof g === 'object' ? g.name : g).join(', ') : 
          movie.genres}`);
      }
      
      console.log('-'.repeat(80));
    });
    
    // Save to file option
    const fs = require('fs');
    const saveToFile = false; // Set to true if you want to save the full data to a file
    
    if (saveToFile) {
      fs.writeFileSync('all_movies.json', JSON.stringify(movies, null, 2));
      console.log('\nFull movie data saved to all_movies.json');
    }
    
  } catch (error) {
    console.error('Error getting movies:', error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

// Run the function
getAllMovies();