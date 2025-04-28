const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3001', 'http://127.0.0.1:3001'],
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

// API Routes
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/theaters', require('./routes/theaterRoutes'));
app.use('/api/showtimes', require('./routes/showtimeRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Basic route for testing API
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Movie Booking API' });
});

// Set environment variables for development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'development';
  process.env.USE_SAMPLE_DATA = 'true';
  process.env.JWT_SECRET = 'dev-secret-key-for-jwt-token-generation';
}

// Set port and start server
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
