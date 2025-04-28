const express = require('express');
const router = express.Router();
const { 
  getDirectors, 
  getTopDirectors,
  getDirectorById, 
  getDirectorBySlug,
  getMoviesByDirector,
  createDirector, 
  updateDirector, 
  deleteDirector 
} = require('../controllers/directorController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getDirectors);
router.get('/top', getTopDirectors);
router.get('/slug/:slug', getDirectorBySlug);
router.get('/:id', getDirectorById);
router.get('/:id/movies', getMoviesByDirector);

// Admin routes
router.post('/', protect, admin, createDirector);
router.put('/:id', protect, admin, updateDirector);
router.delete('/:id', protect, admin, deleteDirector);

module.exports = router;
