const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  // TESTING MODE: Always create a mock user for any request
  // This is a temporary solution for testing purposes
  // Remove or comment out this block in production
  req.user = {
    _id: '68103f6d15a978dacd8967b8',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user'
  };
  return next();

  // The code below is commented out for testing purposes
  // Uncomment this code and remove the block above for production use
  /*
  // For development purposes, always create a mock user
  if (process.env.NODE_ENV === 'development' && process.env.USE_SAMPLE_DATA === 'true') {
    req.user = {
      _id: '60d0fe4f5311236168a109ca',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    };
    return next();
  }

  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
  */
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
