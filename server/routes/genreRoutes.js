const express = require('express');
const router = express.Router();
const { 
  getGenres, 
  getGenreById, 
  getGenreBySlug,
  getMoviesByGenre,
  createGenre, 
  updateGenre, 
  deleteGenre 
} = require('../controllers/genreController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getGenres);
router.get('/slug/:slug', getGenreBySlug);
router.get('/:id', getGenreById);
router.get('/:id/movies', getMoviesByGenre);

// Admin routes
router.post('/', protect, admin, createGenre);
router.put('/:id', protect, admin, updateGenre);
router.delete('/:id', protect, admin, deleteGenre);

module.exports = router;
