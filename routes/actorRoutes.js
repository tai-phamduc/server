const express = require('express');
const router = express.Router();
const { 
  getActors, 
  getTopActors,
  getActorById, 
  getActorBySlug,
  getMoviesByActor,
  createActor, 
  updateActor, 
  deleteActor 
} = require('../controllers/actorController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getActors);
router.get('/top', getTopActors);
router.get('/slug/:slug', getActorBySlug);
router.get('/:id', getActorById);
router.get('/:id/movies', getMoviesByActor);

// Admin routes
router.post('/', protect, admin, createActor);
router.put('/:id', protect, admin, updateActor);
router.delete('/:id', protect, admin, deleteActor);

module.exports = router;
