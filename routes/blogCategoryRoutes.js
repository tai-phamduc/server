const express = require('express');
const router = express.Router();
const { 
  getBlogCategories,
  getParentCategories,
  getCategoryById,
  getCategoryBySlug,
  getNewsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
} = require('../controllers/blogCategoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBlogCategories);
router.get('/parents', getParentCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);
router.get('/:id/news', getNewsByCategory);

// Admin routes
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);
router.put('/reorder', protect, admin, reorderCategories);

module.exports = router;
