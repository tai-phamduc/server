const express = require('express');
const router = express.Router();
const { 
  getTags,
  getFeaturedTags,
  getTagById,
  getTagBySlug,
  getContentByTag,
  createTag,
  updateTag,
  deleteTag,
  reorderTags
} = require('../controllers/tagController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTags);
router.get('/featured', getFeaturedTags);
router.get('/slug/:slug', getTagBySlug);
router.get('/:id', getTagById);
router.get('/:id/content', getContentByTag);

// Admin routes
router.post('/', protect, admin, createTag);
router.put('/:id', protect, admin, updateTag);
router.delete('/:id', protect, admin, deleteTag);
router.put('/reorder', protect, admin, reorderTags);

module.exports = router;
