const express = require('express');
const router = express.Router();
const {
  getLanguages,
  getDefaultLanguage,
  getLanguageById,
  getLanguageByCode,
  getMoviesByLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  reorderLanguages
} = require('../controllers/languageController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getLanguages);
router.get('/default', getDefaultLanguage);
router.get('/code/:code', getLanguageByCode);
router.get('/:id', getLanguageById);
router.get('/:id/movies', getMoviesByLanguage);

// Admin routes
router.post('/', protect, admin, createLanguage);
router.put('/reorder', protect, admin, reorderLanguages);
router.put('/:id', protect, admin, updateLanguage);
router.delete('/:id', protect, admin, deleteLanguage);

module.exports = router;
