const express = require('express');
const router = express.Router();
const { 
  getMovieComments,
  getNewsComments,
  getEventComments,
  getCommentReplies,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  reportComment,
  approveComment,
  rejectComment,
  getReportedComments
} = require('../controllers/commentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/movie/:id', getMovieComments);
router.get('/news/:id', getNewsComments);
router.get('/event/:id', getEventComments);
router.get('/:id/replies', getCommentReplies);

// Protected routes
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, likeComment);
router.put('/:id/dislike', protect, dislikeComment);
router.put('/:id/report', protect, reportComment);

// Admin routes
router.get('/reported', protect, admin, getReportedComments);
router.put('/:id/approve', protect, admin, approveComment);
router.put('/:id/reject', protect, admin, rejectComment);

module.exports = router;
