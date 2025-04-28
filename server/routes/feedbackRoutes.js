const express = require('express');
const router = express.Router();
const { 
  getDisplayedFeedback,
  getTopRatedFeedback,
  createFeedback,
  getAllFeedback,
  approveFeedback,
  displayFeedback,
  hideFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getDisplayedFeedback);
router.get('/top', getTopRatedFeedback);
router.post('/', createFeedback);

// Admin routes
router.get('/admin', protect, admin, getAllFeedback);
router.put('/:id/approve', protect, admin, approveFeedback);
router.put('/:id/display', protect, admin, displayFeedback);
router.put('/:id/hide', protect, admin, hideFeedback);
router.delete('/:id', protect, admin, deleteFeedback);

module.exports = router;
