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
    
    // Try with default Mongoose model
    const MovieModel = mongoose.model('Movie', { title: String });
    const movieFromModel = await MovieModel.findOne({ title: MOVIE_TITLE });
    
    console.log("Checking with Mongoose model 'Movie' (collection 'movies'):");
    if (movieFromModel) {
      console.log(`✅ Movie "${MOVIE_TITLE}" found using Mongoose model!`);
      console.log(`Movie ID: ${movieFromModel._id}`);
      console.log('Movie details:', movieFromModel);
    } else {
      console.log(`❌ Movie "${MOVIE_TITLE}" NOT found using Mongoose model.`);
    }
    
    // Try with direct collection access
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("\nAvailable collections in database:");
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
    // Check in 'movies' collection directly
    const moviesCollection = db.collection('movies');
    const movieFromCollection = await moviesCollection.findOne({ title: MOVIE_TITLE });
    
    console.log("\nChecking directly in 'movies' collection:");
    if (movieFromCollection) {
      console.log(`✅ Movie "${MOVIE_TITLE}" found in 'movies' collection!`);
      console.log(`Movie ID: ${movieFromCollection._id}`);
      console.log('Movie details:', movieFromCollection);
    } else {
      console.log(`❌ Movie "${MOVIE_TITLE}" NOT found in 'movies' collection.`);
    }
    
  } catch (error) {
    console.error('Error checking movie:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the function
checkMovieExists();
