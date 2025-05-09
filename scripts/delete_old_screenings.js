const mongoose = require('mongoose');

// Connect to MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://vercel-admin-user-680f8b6c07a74f558d36d535:ru6zkPGmlDWWg2Mt@movie-booking.xovn2xs.mongodb.net/movie-booking?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return deleteOldScreenings();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

async function deleteOldScreenings() {
  try {
    // Define a simple schema for Screening
    const Screening = mongoose.model('Screening', new mongoose.Schema({}, { strict: false }));
    
    // The IDs of the screenings we want to delete
    // These are the IDs from the first script that created screenings with incorrect structure
    const screeningIdsToDelete = [
      '681d9531282690b0e4b287c8',
      '681d9533282690b0e4b2888a',
      '681d9533282690b0e4b2894c',
      '681d9533282690b0e4b28a0e',
      '681d9533282690b0e4b28ad0'
    ];
    
    console.log('Attempting to delete the following screening IDs:');
    screeningIdsToDelete.forEach(id => console.log(`- ${id}`));
    
    // Delete the screenings
    const result = await Screening.deleteMany({ _id: { $in: screeningIdsToDelete } });
    
    console.log(`Deleted ${result.deletedCount} screenings`);
    
    // Verify the screenings were deleted
    const remainingScreenings = await Screening.find({ _id: { $in: screeningIdsToDelete } });
    
    if (remainingScreenings.length > 0) {
      console.log('Warning: Some screenings were not deleted:');
      remainingScreenings.forEach(screening => console.log(`- ${screening._id}`));
    } else {
      console.log('All specified screenings were successfully deleted');
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error deleting screenings:', error);
    mongoose.disconnect();
  }
}
