const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Configure colors
colors.enable();

// Initialize Express app
const app = express();

// Connect to MongoDB with improved error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movie-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      connectTimeoutMS: 10000, // Connection timeout
      socketTimeoutMS: 45000, // Socket timeout
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.green.bold);
    console.log(`Database: ${conn.connection.name}`.cyan);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`.red.bold);
    console.error('Make sure MongoDB is running and the connection string is correct'.yellow);
    // Don't exit the process, allow the server to start anyway
    return false;
  }
};

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
    'http://localhost:3003',
    'http://127.0.0.1:3003'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (_, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`[${new Date().toISOString()}] Error: ${err.message}`.red);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack.gray);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// API Routes
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const newsRoutes = require('./routes/newsRoutes');

// Use routes
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);

// Basic route for testing API
app.get('/api', (_, res) => {
  res.json({
    message: 'Welcome to the Movie Booking API',
    version: '1.0.0',
    status: 'active',
    documentation: '/api-docs',
    health: '/api/health'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Global error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...'.red.bold);
  console.error(error.name, error.message, error.stack);
  // Give the server time to send any pending responses before shutting down
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED REJECTION! 💥'.red.bold);
  console.error(error.name, error.message, error.stack);
  // Don't exit the process, just log the error
});

// Start server with improved error handling
const startServer = async () => {
  try {
    // Try to connect to MongoDB but don't block server startup
    await connectDB();

    // Set port and start server
    const PORT = 5010; // Use a specific port that's likely to be available
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`.green.bold);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        const newPort = 5020; // Try a completely different port
        console.error(`Port ${PORT} is already in use. Trying port ${newPort}...`.yellow);
        setTimeout(() => {
          server.close();
          app.listen(newPort, () => {
            console.log(`Server running on port ${newPort}`.green.bold);
          });
        }, 1000);
      } else {
        console.error(`Server error: ${error.message}`.red);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...'.cyan);
      server.close(() => {
        console.log('Process terminated.'.cyan);
      });
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`.red.bold);
  }
};

// Start the server
startServer();
