const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Function to check if movie exists
async function checkMovieExists() {
  try {
    const MOVIE_TITLE = "Ghostbusters: Frozen Empire";
    
    // Approach 1: Try with direct collection access (most reliable)
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("Available collections in database:");
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
    // Check in 'movies' collection directly
    const moviesCollection = db.collection('movies');
    const movieFromCollection = await moviesCollection.findOne({ title: MOVIE_TITLE });
    
    console.log("\nChecking directly in 'movies' collection:");
    if (movieFromCollection) {
      console.log(`✅ Movie "${MOVIE_TITLE}" found in 'movies' collection!`);
      console.log(`Movie ID: ${movieFromCollection._id}`);
      console.log('Movie details:', JSON.stringify(movieFromCollection, null, 2));
      
      // Use this ID for adding screenings
      console.log("\nTo add screenings for this movie, use the ID:");
      console.log(`${movieFromCollection._id}`);
    } else {
      console.log(`❌ Movie "${MOVIE_TITLE}" NOT found in 'movies' collection.`);
      
      // Try case-insensitive search
      console.log("\nTrying case-insensitive search:");
      const movieCaseInsensitive = await moviesCollection.findOne({ 
        title: { $regex: new RegExp(MOVIE_TITLE, 'i') } 
      });
      
      if (movieCaseInsensitive) {
        console.log(`✅ Movie found with title: "${movieCaseInsensitive.title}"`);
        console.log(`Movie ID: ${movieCaseInsensitive._id}`);
      } else {
        console.log("❌ No movie found with case-insensitive search either.");
        
        // List some movies to see what's available
        console.log("\nSample movies in the collection:");
        const sampleMovies = await moviesCollection.find({}).limit(5).toArray();
        sampleMovies.forEach(movie => console.log(`- ${movie.title} (ID: ${movie._id})`));
      }
    }
    
  } catch (error) {
    console.error('Error checking movie:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the function
checkMovieExists();