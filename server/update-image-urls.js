const mongoose = require('mongoose');
const colors = require('colors');
const Movie = require('./models/Movie');
const Event = require('./models/Event');
const News = require('./models/News');
const Theater = require('./models/Theater');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/movie-booking')
  .then(() => console.log('MongoDB Connected'.green.bold))
  .catch(err => {
    console.error(`Error: ${err.message}`.red.bold);
    process.exit(1);
  });

// Function to generate placeholder image URLs
const getMoviePlaceholder = (title) => {
  const formattedTitle = title.replace(/\s+/g, '+');
  return `https://via.placeholder.com/500x750/2D3748/FFFFFF?text=${formattedTitle}`;
};

const getPosterPlaceholder = (title) => {
  const formattedTitle = title.replace(/\s+/g, '+');
  return `https://via.placeholder.com/1280x720/2D3748/FFFFFF?text=${formattedTitle}`;
};

const getPersonPlaceholder = (name) => {
  const formattedName = name.replace(/\s+/g, '+');
  return `https://via.placeholder.com/300x450/2D3748/FFFFFF?text=${formattedName}`;
};

const getEventPlaceholder = (title) => {
  const formattedTitle = title.replace(/\s+/g, '+');
  return `https://via.placeholder.com/800x450/1A202C/FFFFFF?text=${formattedTitle}`;
};

const getNewsPlaceholder = (title) => {
  const formattedTitle = title.replace(/\s+/g, '+');
  return `https://via.placeholder.com/800x450/1A202C/FFFFFF?text=${formattedTitle}`;
};

const getTheaterPlaceholder = (name) => {
  const formattedName = name.replace(/\s+/g, '+');
  return `https://via.placeholder.com/800x450/1A202C/FFFFFF?text=${formattedName}`;
};

// Update image URLs in all collections
const updateImageUrls = async () => {
  try {
    console.log('Starting image URL updates...'.yellow);

    // Update Movie images
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies to update`.cyan);
    
    for (const movie of movies) {
      const updates = {
        poster: getMoviePlaceholder(movie.title),
        backdrop: getPosterPlaceholder(movie.title),
      };
      
      // Update cast images if they exist
      if (movie.cast && movie.cast.length > 0) {
        movie.cast.forEach((castMember, index) => {
          if (castMember.name) {
            movie.cast[index].photo = getPersonPlaceholder(castMember.name);
          }
        });
      }
      
      // Update crew images if they exist
      if (movie.crew && movie.crew.length > 0) {
        movie.crew.forEach((crewMember, index) => {
          if (crewMember.name) {
            movie.crew[index].photo = getPersonPlaceholder(crewMember.name);
          }
        });
      }
      
      // Update gallery images if they exist
      if (movie.gallery && movie.gallery.length > 0) {
        movie.gallery = Array(movie.gallery.length).fill().map((_, i) => 
          getPosterPlaceholder(`${movie.title} Gallery ${i+1}`)
        );
      }
      
      await Movie.findByIdAndUpdate(movie._id, movie);
    }
    console.log('Movie images updated'.green);

    // Update Event images
    const events = await Event.find();
    console.log(`Found ${events.length} events to update`.cyan);
    
    for (const event of events) {
      event.image = getEventPlaceholder(event.title);
      
      // Update gallery images if they exist
      if (event.gallery && event.gallery.length > 0) {
        event.gallery = Array(event.gallery.length).fill().map((_, i) => 
          getEventPlaceholder(`${event.title} Gallery ${i+1}`)
        );
      }
      
      await Event.findByIdAndUpdate(event._id, event);
    }
    console.log('Event images updated'.green);

    // Update News images
    const newsItems = await News.find();
    console.log(`Found ${newsItems.length} news items to update`.cyan);
    
    for (const newsItem of newsItems) {
      newsItem.featuredImage = getNewsPlaceholder(newsItem.title);
      
      // Update gallery images if they exist
      if (newsItem.gallery && newsItem.gallery.length > 0) {
        newsItem.gallery = Array(newsItem.gallery.length).fill().map((_, i) => 
          getNewsPlaceholder(`${newsItem.title} Gallery ${i+1}`)
        );
      }
      
      await News.findByIdAndUpdate(newsItem._id, newsItem);
    }
    console.log('News images updated'.green);

    // Update Theater images
    const theaters = await Theater.find();
    console.log(`Found ${theaters.length} theaters to update`.cyan);
    
    for (const theater of theaters) {
      // Update theater images
      if (theater.images && theater.images.length > 0) {
        theater.images = Array(theater.images.length).fill().map((_, i) => 
          getTheaterPlaceholder(`${theater.name} ${i+1}`)
        );
      } else {
        theater.images = [getTheaterPlaceholder(theater.name)];
      }
      
      await Theater.findByIdAndUpdate(theater._id, theater);
    }
    console.log('Theater images updated'.green);

    // Update User images
    const users = await User.find();
    console.log(`Found ${users.length} users to update`.cyan);
    
    for (const user of users) {
      if (user.name) {
        user.avatar = getPersonPlaceholder(user.name);
        await User.findByIdAndUpdate(user._id, user);
      }
    }
    console.log('User images updated'.green);

    console.log('All image URLs updated successfully'.green.bold);
    mongoose.disconnect();
    
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the function
updateImageUrls();
