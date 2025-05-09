const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function getAllMovies() {
  try {
    // Connect to MongoDB using the connection string from .env
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections in database`);
    
    // Potential collection names that might contain movies
    const potentialMovieCollections = ['movies', 'movie', 'films', 'shows', 'content'];
    
    // Check each collection for movie-like documents
    let moviesFound = false;
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await mongoose.connection.db.collection(collectionName).countDocuments();
      
      console.log(`Checking collection: ${collectionName} (${count} documents)`);
      
      // Skip empty collections
      if (count === 0) continue;
      
      // Get a sample document to check its structure
      const sampleDoc = await mongoose.connection.db.collection(collectionName)
        .findOne({});
      
      // Check if this collection likely contains movies
      const hasMovieFields = sampleDoc && 
        (sampleDoc.title || sampleDoc.name) && 
        (sampleDoc.releaseDate || sampleDoc.release_date || sampleDoc.year);
      
      const isPotentialMovieCollection = potentialMovieCollections.includes(collectionName.toLowerCase());
      
      if (hasMovieFields || isPotentialMovieCollection) {
        console.log(`\nFound potential movie collection: ${collectionName}`);
        
        // Get all documents from this collection
        const movies = await mongoose.connection.db.collection(collectionName)
          .find({})
          .sort({ title: 1, name: 1 }) // Sort by title or name
          .toArray();
        
        console.log(`\nDisplaying ${movies.length} items from ${collectionName}:`);
        console.log('='.repeat(80));
        
        // Display movie information in a readable format
        movies.forEach((movie, index) => {
          const title = movie.title || movie.name || 'Untitled';
          console.log(`${index + 1}. "${title}" (ID: ${movie._id})`);
          
          // Display common movie fields if they exist
          if (movie.releaseDate || movie.release_date) 
            console.log(`   Release Date: ${new Date(movie.releaseDate || movie.release_date).toLocaleDateString()}`);
          
          if (movie.status) console.log(`   Status: ${movie.status}`);
          if (movie.rating) console.log(`   Rating: ${movie.rating}`);
          
          // Show genres if available
          if (movie.genres && movie.genres.length > 0) {
            console.log(`   Genres: ${Array.isArray(movie.genres) ? 
              movie.genres.map(g => typeof g === 'object' ? (g.name || g) : g).join(', ') : 
              movie.genres}`);
          }
          
          console.log('-'.repeat(80));
        });
        
        moviesFound = true;
        
        // Option to save to file
        const fs = require('fs');
        const saveToFile = false; // Set to true if you want to save the data
        
        if (saveToFile) {
          fs.writeFileSync(`${collectionName}.json`, JSON.stringify(movies, null, 2));
          console.log(`\nFull data saved to ${collectionName}.json`);
        }
      }
    }
    
    if (!moviesFound) {
      console.log('\nNo collections containing movie-like documents were found.');
      console.log('You may need to check a different database or create movies first.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('\nDisconnected from MongoDB');
    }
  }
}

getAllMovies();