const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./swagger');
// Temporarily disable MongoDB connection
// const connectDB = require('./config/db');
// Temporarily disable rate limiting middleware
// const {
//   apiLimiter,
//   authLimiter,
//   searchLimiter,
//   userActionLimiter,
//   contentCreationLimiter
// } = require('./middleware/rateLimitMiddleware');
// const securityMiddleware = require('./middleware/securityMiddleware');
// const loggerMiddleware = require('./middleware/loggerMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
// const { performanceMiddleware } = require('./middleware/performanceMiddleware');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Set environment variables for development
if (process.env.NODE_ENV !== 'production') {
  process.env.USE_SAMPLE_DATA = 'true';
}

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Initialize Express app
const app = express();

// Start reminder service
// Temporarily disable reminder service to fix server issues
/*
const reminderService = require('./services/reminderService');
reminderService.start();
*/

// Apply security middleware
// securityMiddleware(app);

// Apply logger middleware
// loggerMiddleware(app);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3001', 'http://127.0.0.1:3001', 'https://movie-booking-client.vercel.app', 'https://movie-booking-api-pink.vercel.app', 'https://movie-ticket-booking-api.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true }));

// Performance monitoring middleware
// app.use(performanceMiddleware);

// Apply rate limiting to all API requests
// app.use('/api', apiLimiter);

// Apply stricter rate limiting to auth routes
// app.use('/api/users/login', authLimiter);
// app.use('/api/users/register', authLimiter);
// app.use('/api/users/forgot-password', authLimiter);

// Apply search rate limiting
// app.use('/api/movies/search', searchLimiter);
// app.use('/api/search', searchLimiter);

// Apply user action rate limiting
// app.use('/api/reviews/:id/like', userActionLimiter);
// app.use('/api/reviews/:id/dislike', userActionLimiter);
// app.use('/api/reviews/:id/report', userActionLimiter);
// app.use('/api/users/profile', userActionLimiter);

// Apply content creation rate limiting
// app.use('/api/reviews', contentCreationLimiter);
// app.use('/api/content', contentCreationLimiter);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Special route for API test page
app.get('/api-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/api-test.html'));
});

// Swagger API documentation
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//   explorer: true,
//   customCss: '.swagger-ui .topbar { display: none }',
//   customSiteTitle: 'Movie Booking API Documentation',
// }));

// app.get('/api-docs.json', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerSpec);
// });

// Health check endpoint
app.get('/api/health', (req, res) =>   {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/theaters', require('./routes/theaterRoutes'));
app.use('/api/showtimes', require('./routes/showtimeRoutes'));
// New routes using updated models
app.use('/api/cinemas', require('./routes/cinemaRoutes'));
app.use('/api/screenings', require('./routes/screeningRoutes'));
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
app.use('/api/booking-history', require('./routes/bookingHistoryRoutes'));
app.use('/api/languages', require('./routes/languageRoutes'));
app.use('/api/countries', require('./routes/countryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
// Basic route for testing API
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Movie Booking API' });
});

// Serve static files from the client build directory in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  // Any route that is not an API route should be handled by the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
} else {
  // In development, handle non-API routes
  app.use((req, res, next) => {
    // Let API routes be handled by the API handlers
    if (req.path.startsWith('/api')) {
      return next();
    }

    // For direct API server access, send a helpful response
    if (req.headers.host.includes('5003')) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Movie Booking API Server</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
              h1 { color: #e50914; }
              a { color: #e50914; text-decoration: none; }
              a:hover { text-decoration: underline; }
              code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <h1>Movie Booking API Server</h1>
            <p>This is the API server running on port 5003. The client application is served separately on port 3000.</p>
            <p>You're trying to access: <code>${req.path}</code></p>
            <p>To access the client application, please go to: <a href="http://localhost:3000${req.path}">http://localhost:3000${req.path}</a></p>
            <p>To test the API directly, try accessing: <a href="/api/movies">/api/movies</a></p>
          </body>
        </html>
      `);
    }

    // If this is a proxied request from the client dev server, just pass it through
    next();
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Set port and start server
const PORT = process.env.PORT || 5005; // Changed to 5005

// Start server with improved error handling
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    setTimeout(() => {
      app.listen(PORT + 1, () => {
        console.log(`Server running on port ${PORT + 1}`);
      }).on('error', (err) => {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
      });
    }, 1000);
  } else {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
});

// Export for Vercel
module.exports = app;
