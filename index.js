const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Initialize Express app
const app = express();

// CORS configuration for Vercel deployment
const corsOptions = {
  origin: '*', // Allow all origins for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection - Optimized for Vercel serverless environment
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/?retryWrites=true&w=majority&appName=movie-booking';

    const client = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log('MongoDB Connected');
    cachedDb = client;
    return cachedDb;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
}

// Connect to MongoDB
connectToDatabase();

// Health check endpoint with caching
app.get('/api/health', (req, res) => {
  // Cache for 5 minutes
  res.setHeader('Cache-Control', 's-maxage=300');
  res.status(200).json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/theaters', require('./routes/theaterRoutes'));
app.use('/api/showtimes', require('./routes/showtimeRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));

// New API Routes
app.use('/api/genres', require('./routes/genreRoutes'));
app.use('/api/directors', require('./routes/directorRoutes'));
app.use('/api/actors', require('./routes/actorRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/blog-categories', require('./routes/blogCategoryRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/api/pages', require('./routes/pageRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
// app.use('/api/booking-history', require('./routes/bookingHistoryRoutes'));

// Basic route for testing API with caching
app.get('/api', (req, res) => {
  // Cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600');
  res.json({
    message: 'Welcome to the Movie Booking API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5010;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
