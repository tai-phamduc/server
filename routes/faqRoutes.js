const express = require('express');
const router = express.Router();
const { 
  getFAQs,
  getFAQCategories,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  reorderFAQs
} = require('../controllers/faqController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getFAQs);
router.get('/categories', getFAQCategories);
router.get('/:id', getFAQById);

// Admin routes
router.post('/', protect, admin, createFAQ);
router.put('/:id', protect, admin, updateFAQ);
router.delete('/:id', protect, admin, deleteFAQ);
router.put('/reorder', protect, admin, reorderFAQs);

module.exports = router;
