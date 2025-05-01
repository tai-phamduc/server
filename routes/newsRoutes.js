const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsById,
  getNewsByCategory,
  getFeaturedNews,
  getLatestNews,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getNews);
router.get('/featured', getFeaturedNews);
router.get('/latest', getLatestNews);
router.get('/category/:category', getNewsByCategory);
router.get('/:id', getNewsById);

// Protected routes (admin only)
router.post('/', protect, admin, createNews);
router.put('/:id', protect, admin, updateNews);
router.delete('/:id', protect, admin, deleteNews);

module.exports = router;
