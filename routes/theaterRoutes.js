const express = require('express');
const router = express.Router();
const {
  createTheater,
  getTheaters,
  getTheaterById,
  updateTheater,
  deleteTheater,
  getTheatersByCity,
  addHall,
  updateHall,
} = require('../controllers/theaterController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getTheaters);

router.route('/:id')
  .get(getTheaterById);

router.route('/city/:city')
  .get(getTheatersByCity);

// Admin routes
router.route('/')
  .post(protect, admin, createTheater);

router.route('/:id')
  .put(protect, admin, updateTheater)
  .delete(protect, admin, deleteTheater);

router.route('/:id/halls')
  .post(protect, admin, addHall);

router.route('/:id/halls/:hallId')
  .put(protect, admin, updateHall);

module.exports = router;
