const express = require('express');
const router = express.Router();
const {
  createContent,
  getAllContent,
  getContentById,
  getContentBySlug,
  updateContent,
  deleteContent,
  getAllContentAdmin,
  publishContent,
  unpublishContent,
  archiveContent,
} = require('../controllers/contentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllContent);
router.get('/slug/:slug', getContentBySlug);
router.get('/:id', getContentById);

// Admin routes
router.post('/', protect, admin, createContent);
router.put('/:id', protect, admin, updateContent);
router.delete('/:id', protect, admin, deleteContent);
router.get('/admin/all', protect, admin, getAllContentAdmin);
router.put('/:id/publish', protect, admin, publishContent);
router.put('/:id/unpublish', protect, admin, unpublishContent);
router.put('/:id/archive', protect, admin, archiveContent);

module.exports = router;
