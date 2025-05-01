require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Event = require('../models/Event');
const News = require('../models/News');
const User = require('../models/User');

// Import sample data
const sampleMovies = require('../data/sampleMovies');
const sampleEvents = require('../data/sampleEvents');
const sampleNews = require('../data/sampleNews');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to create a slug from a title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Function to populate movies
const populateMovies = async () => {
  try {
    console.log('Checking for existing movies...');

    // Get existing movie titles
    const existingMovies = await Movie.find({}, 'title');
    const existingTitles = new Set(existingMovies.map(movie => movie.title));
    console.log(`Found ${existingTitles.size} existing movies`);

    // Filter out movies that already exist
    const newMovies = sampleMovies.filter(movie => !existingTitles.has(movie.title));
    console.log(`Found ${newMovies.length} new movies to add`);

    if (newMovies.length === 0) {
      console.log('No new movies to add');
      return;
    }

    // Prepare movie data with slugs
    const moviesWithSlugs = newMovies.map(movie => ({
      ...movie,
      slug: createSlug(movie.title)
    }));

    // Insert movies
    const result = await Movie.insertMany(moviesWithSlugs);
    console.log(`${result.length} new movies inserted successfully`);
  } catch (error) {
    console.error('Error populating movies:', error);
  }
};

// Function to populate events
const populateEvents = async () => {
  try {
    console.log('Checking for existing events...');

    // Get existing event titles
    const existingEvents = await Event.find({}, 'title');
    const existingTitles = new Set(existingEvents.map(event => event.title));
    console.log(`Found ${existingTitles.size} existing events`);

    // Filter out events that already exist
    const newEvents = sampleEvents.filter(event => !existingTitles.has(event.title));
    console.log(`Found ${newEvents.length} new events to add`);

    if (newEvents.length === 0) {
      console.log('No new events to add');
      return;
    }

    // Prepare event data with slugs and default coordinates if missing
    const eventsWithSlugs = newEvents.map(event => {
      // Add default coordinates if missing
      if (!event.coordinates) {
        event.coordinates = {
          type: "Point",
          coordinates: [-74.0060, 40.7128] // Default to New York City coordinates
        };
      }

      return {
        ...event,
        slug: createSlug(event.title)
      };
    });

    // Insert events
    const result = await Event.insertMany(eventsWithSlugs);
    console.log(`${result.length} new events inserted successfully`);
  } catch (error) {
    console.error('Error populating events:', error);
  }
};

// Function to populate news
const populateNews = async () => {
  try {
    console.log('Checking for existing news articles...');

    // Get existing news titles
    const existingNews = await News.find({}, 'title');
    const existingTitles = new Set(existingNews.map(news => news.title));
    console.log(`Found ${existingTitles.size} existing news articles`);

    // Filter out news that already exist
    const newNews = sampleNews.filter(news => !existingTitles.has(news.title));
    console.log(`Found ${newNews.length} new news articles to add`);

    if (newNews.length === 0) {
      console.log('No new news articles to add');
      return;
    }

    // Find an admin user to set as author
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Creating a default admin user...');
      const defaultAdmin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      await defaultAdmin.save();
      console.log('Default admin user created');
      adminUser = defaultAdmin;
    }

    // Prepare news data with slugs and author
    const newsWithSlugsAndAuthor = newNews.map(news => ({
      ...news,
      slug: createSlug(news.title),
      author: adminUser._id
    }));

    // Insert news
    const result = await News.insertMany(newsWithSlugsAndAuthor);
    console.log(`${result.length} new news articles inserted successfully`);
  } catch (error) {
    console.error('Error populating news:', error);
  }
};

// Main function to populate all data
const populateDatabase = async () => {
  try {
    await populateMovies();
    await populateEvents();
    await populateNews();
    console.log('Database population completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error populating database:', error);
    mongoose.connection.close();
  }
};

// Run the population script
populateDatabase();
