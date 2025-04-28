const { body, param, query, validationResult } = require('express-validator');

// Validate review creation
const validateCreateReview = [
  body('movieId')
    .notEmpty().withMessage('Movie ID is required')
    .isMongoId().withMessage('Invalid movie ID format'),
  
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
  
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  
  body('comment')
    .notEmpty().withMessage('Comment is required')
    .isString().withMessage('Comment must be a string')
    .isLength({ max: 1000 }).withMessage('Comment cannot be more than 1000 characters'),
  
  body('spoiler')
    .optional()
    .isBoolean().withMessage('Spoiler must be a boolean'),
  
  body('watchedInTheater')
    .optional()
    .isBoolean().withMessage('Watched in theater must be a boolean'),
];

// Validate review update
const validateUpdateReview = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
  
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  
  body('comment')
    .optional()
    .isString().withMessage('Comment must be a string')
    .isLength({ max: 1000 }).withMessage('Comment cannot be more than 1000 characters'),
  
  body('spoiler')
    .optional()
    .isBoolean().withMessage('Spoiler must be a boolean'),
  
  body('watchedInTheater')
    .optional()
    .isBoolean().withMessage('Watched in theater must be a boolean'),
];

// Validate review ID
const validateReviewId = [
  param('id')
    .isMongoId().withMessage('Invalid review ID format'),
];

// Validate movie ID for reviews
const validateMovieIdForReviews = [
  param('id')
    .isMongoId().withMessage('Invalid movie ID format'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', 'likes']).withMessage('Sort must be createdAt or likes'),
];

// Validate review approval
const validateReviewApproval = [
  body('isApproved')
    .isBoolean().withMessage('isApproved must be a boolean'),
];

// Validate review report
const validateReviewReport = [
  body('reason')
    .notEmpty().withMessage('Reason is required')
    .isIn(['spam', 'inappropriate', 'offensive', 'spoiler', 'other']).withMessage('Reason must be spam, inappropriate, offensive, spoiler, or other'),
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
  validateCreateReview: [...validateCreateReview, validate],
  validateUpdateReview: [...validateUpdateReview, validate],
  validateReviewId: [...validateReviewId, validate],
  validateMovieIdForReviews: [...validateMovieIdForReviews, validate],
  validateReviewApproval: [...validateReviewApproval, validate],
  validateReviewReport: [...validateReviewReport, validate],
};
