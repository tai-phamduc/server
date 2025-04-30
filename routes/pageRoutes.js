const express = require('express');
const router = express.Router();
const {
  getPages,
  getMenuPages,
  getFooterPages,
  getPageById,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  getAllPages,
  reorderPages
} = require('../controllers/pageController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPages);
router.get('/menu', getMenuPages);
router.get('/footer', getFooterPages);
router.get('/slug/:slug', getPageBySlug);
router.get('/:id', getPageById);

// Admin routes
router.get('/admin', protect, admin, getAllPages);
router.post('/', protect, admin, createPage);
router.put('/reorder', protect, admin, reorderPages);
router.put('/:id', protect, admin, updatePage);
router.delete('/:id', protect, admin, deletePage);

module.exports = router;
