const express = require('express');
const router = express.Router();
const {
  createReview,
  getMovieReviews,
  getReviewById,
  updateReview,
  deleteReview,
  likeReview,
  dislikeReview,
  getAllReviews,
  getReportedReviews,
  approveReview,
  reportReview,
  getUserReviewForMovie,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  validateCreateReview,
  validateUpdateReview,
  validateReviewId,
  validateMovieIdForReviews,
  validateReviewApproval,
  validateReviewReport,
} = require('../middleware/validation/reviewValidation');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Public routes
router.route('/movie/:id')
  .get(validateMovieIdForReviews, cacheMiddleware({
    duration: 300,
    etag: true,
    varyOn: ['Accept-Language']
  }), getMovieReviews);

router.route('/:id')
  .get(validateReviewId, cacheMiddleware({
    duration: 300,
    etag: true
  }), getReviewById);

// Protected routes
router.route('/')
  .post(protect, validateCreateReview, createReview);

router.route('/:id')
  .put(protect, validateReviewId, validateUpdateReview, updateReview)
  .delete(protect, validateReviewId, deleteReview);

router.route('/:id/like')
  .put(protect, validateReviewId, likeReview);

router.route('/:id/dislike')
  .put(protect, validateReviewId, dislikeReview);

// Admin routes
router.route('/admin')
  .get(protect, admin, getAllReviews);

router.route('/reported')
  .get(protect, admin, getReportedReviews);

router.route('/:id/approve')
  .put(protect, admin, validateReviewId, validateReviewApproval, approveReview);

router.route('/:id/report')
  .put(protect, validateReviewId, validateReviewReport, reportReview);

router.route('/user/movie/:id')
  .get(protect, getUserReviewForMovie);

module.exports = router;
