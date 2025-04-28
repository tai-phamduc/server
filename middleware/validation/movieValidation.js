const { body, param, query, validationResult } = require('express-validator');

// Validate movie creation
const validateCreateMovie = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ max: 2000 }).withMessage('Description cannot be more than 2000 characters'),
  
  body('releaseDate')
    .notEmpty().withMessage('Release date is required')
    .isISO8601().withMessage('Release date must be a valid date'),
  
  body('duration')
    .notEmpty().withMessage('Duration is required')
    .isInt({ min: 1, max: 600 }).withMessage('Duration must be between 1 and 600 minutes'),
  
  body('genre')
    .isArray({ min: 1, max: 5 }).withMessage('Please provide between 1 and 5 genres')
    .custom(genres => genres.every(genre => typeof genre === 'string'))
    .withMessage('All genres must be strings'),
  
  body('director')
    .notEmpty().withMessage('Director is required')
    .isString().withMessage('Director must be a string'),
  
  body('cast')
    .isArray({ min: 1, max: 20 }).withMessage('Please provide between 1 and 20 cast members')
    .custom(cast => cast.every(member => typeof member === 'string'))
    .withMessage('All cast members must be strings'),
  
  body('poster')
    .notEmpty().withMessage('Poster URL is required')
    .isURL().withMessage('Poster must be a valid URL'),
  
  body('trailer')
    .notEmpty().withMessage('Trailer URL is required')
    .isURL().withMessage('Trailer must be a valid URL'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Now Playing', 'Coming Soon', 'Featured']).withMessage('Status must be Now Playing, Coming Soon, or Featured'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
  
  body('language')
    .optional()
    .isString().withMessage('Language must be a string'),
  
  body('country')
    .optional()
    .isString().withMessage('Country must be a string'),
  
  body('ageRating')
    .optional()
    .isIn(['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated']).withMessage('Age rating must be G, PG, PG-13, R, NC-17, or Not Rated'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  
  body('images')
    .optional()
    .isArray({ max: 10 }).withMessage('You can only have up to 10 additional images')
    .custom(images => images.every(image => typeof image === 'string' && /^https?:\/\//.test(image)))
    .withMessage('All images must be valid URLs'),
];

// Validate movie update
const validateUpdateMovie = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 2000 }).withMessage('Description cannot be more than 2000 characters'),
  
  body('releaseDate')
    .optional()
    .isISO8601().withMessage('Release date must be a valid date'),
  
  body('duration')
    .optional()
    .isInt({ min: 1, max: 600 }).withMessage('Duration must be between 1 and 600 minutes'),
  
  body('genre')
    .optional()
    .isArray({ min: 1, max: 5 }).withMessage('Please provide between 1 and 5 genres')
    .custom(genres => genres.every(genre => typeof genre === 'string'))
    .withMessage('All genres must be strings'),
  
  body('director')
    .optional()
    .isString().withMessage('Director must be a string'),
  
  body('cast')
    .optional()
    .isArray({ min: 1, max: 20 }).withMessage('Please provide between 1 and 20 cast members')
    .custom(cast => cast.every(member => typeof member === 'string'))
    .withMessage('All cast members must be strings'),
  
  body('poster')
    .optional()
    .isURL().withMessage('Poster must be a valid URL'),
  
  body('trailer')
    .optional()
    .isURL().withMessage('Trailer must be a valid URL'),
  
  body('status')
    .optional()
    .isIn(['Now Playing', 'Coming Soon', 'Featured']).withMessage('Status must be Now Playing, Coming Soon, or Featured'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
  
  body('language')
    .optional()
    .isString().withMessage('Language must be a string'),
  
  body('country')
    .optional()
    .isString().withMessage('Country must be a string'),
  
  body('ageRating')
    .optional()
    .isIn(['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated']).withMessage('Age rating must be G, PG, PG-13, R, NC-17, or Not Rated'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  
  body('images')
    .optional()
    .isArray({ max: 10 }).withMessage('You can only have up to 10 additional images')
    .custom(images => images.every(image => typeof image === 'string' && /^https?:\/\//.test(image)))
    .withMessage('All images must be valid URLs'),
];

// Validate movie ID
const validateMovieId = [
  param('id')
    .isMongoId().withMessage('Invalid movie ID format'),
];

// Validate movie search
const validateMovieSearch = [
  query('keyword')
    .optional()
    .isString().withMessage('Keyword must be a string'),
  
  query('status')
    .optional()
    .isIn(['Now Playing', 'Coming Soon', 'Featured']).withMessage('Status must be Now Playing, Coming Soon, or Featured'),
  
  query('genre')
    .optional()
    .isString().withMessage('Genre must be a string'),
  
  query('director')
    .optional()
    .isString().withMessage('Director must be a string'),
  
  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('Minimum rating must be between 0 and 10'),
  
  query('maxRating')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('Maximum rating must be between 0 and 10'),
  
  query('sortBy')
    .optional()
    .isIn(['title', 'releaseDate', 'rating', 'createdAt']).withMessage('Sort by must be title, releaseDate, rating, or createdAt'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('year')
    .optional()
    .isInt({ min: 1900, max: 2100 }).withMessage('Year must be between 1900 and 2100'),
];

// Middleware to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateCreateMovie: [...validateCreateMovie, validate],
  validateUpdateMovie: [...validateUpdateMovie, validate],
  validateMovieId: [...validateMovieId, validate],
  validateMovieSearch: [...validateMovieSearch, validate],
};
