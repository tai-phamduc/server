const mongoose = require('mongoose');

// Connect to MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://vercel-admin-user-680f8b6c07a74f558d36d535:ru6zkPGmlDWWg2Mt@movie-booking.xovn2xs.mongodb.net/movie-booking?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return checkExistingScreenings();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

async function checkExistingScreenings() {
  try {
    // Define a simple schema for Screening
    const Screening = mongoose.model('Screening', new mongoose.Schema({}, { strict: false }));
    
    // Find one screening to examine its structure
    const screenings = await Screening.find().limit(1);
    
    if (screenings.length === 0) {
      console.log('No screenings found in the database.');
      mongoose.disconnect();
      return;
    }
    
    // Get the structure of the first screening
    const screening = screenings[0];
    console.log('Existing screening structure:');
    console.log(JSON.stringify(screening, null, 2));
    
    // Also check for existing screenings for the specific movie
    const MOVIE_ID = '681331bb729f006d532d9723';
    const movieScreenings = await Screening.find({ movie_id: MOVIE_ID }).limit(1);
    
    if (movieScreenings.length > 0) {
      console.log('\nExisting screening for the specified movie:');
      console.log(JSON.stringify(movieScreenings[0], null, 2));
    } else {
      console.log('\nNo existing screenings found for the specified movie.');
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error checking existing screenings:', error);
    mongoose.disconnect();
  }
}
