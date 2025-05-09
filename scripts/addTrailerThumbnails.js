const mongoose = require('mongoose');
require('dotenv').config();
const Movie = require('../models/Movie');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => {
    console.log('MongoDB Connected');
    addTrailerThumbnails();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Function to extract YouTube video ID from URL
const extractYoutubeId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Function to generate YouTube thumbnail URL from video ID
const generateThumbnailUrl = (videoId) => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Main function to add trailer thumbnails
const addTrailerThumbnails = async () => {
  try {
    console.log('Starting to add trailer thumbnails...');
    
    // Find all movies without trailer thumbnails
    const movies = await Movie.find({ 
      trailer: { $exists: true, $ne: '' },
      $or: [
        { trailerThumbnail: { $exists: false } },
        { trailerThumbnail: '' }
      ]
    });
    
    console.log(`Found ${movies.length} movies that need trailer thumbnails`);
    
    let updatedCount = 0;
    
    for (const movie of movies) {
      const videoId = extractYoutubeId(movie.trailer);
      if (videoId) {
        const thumbnailUrl = generateThumbnailUrl(videoId);
        movie.trailerThumbnail = thumbnailUrl;
        await movie.save();
        updatedCount++;
        console.log(`Updated thumbnail for "${movie.title}": ${thumbnailUrl}`);
      } else {
        console.log(`Could not extract YouTube ID from trailer URL for "${movie.title}"`);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} movie trailer thumbnails`);
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding trailer thumbnails:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};