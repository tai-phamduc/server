const express = require('express');
const router = express.Router();
const {
  getCountries,
  getCountryById,
  getCountryByCode,
  getMoviesByCountry,
  createCountry,
  updateCountry,
  deleteCountry,
  reorderCountries
} = require('../controllers/countryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCountries);
router.get('/code/:code', getCountryByCode);
router.get('/:id', getCountryById);
router.get('/:id/movies', getMoviesByCountry);

// Admin routes
router.post('/', protect, admin, createCountry);
router.put('/reorder', protect, admin, reorderCountries);
router.put('/:id', protect, admin, updateCountry);
router.delete('/:id', protect, admin, deleteCountry);

module.exports = router;
