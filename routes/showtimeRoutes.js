const express = require('express');
const router = express.Router();
const {
  createShowtime,
  getShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
  getAvailableSeats,
  getShowtimesByMovieTheaterDate,
  getShowtimesByMovieDate,
} = require('../controllers/showtimeController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getShowtimes);

router.route('/:id')
  .get(getShowtimeById);

router.route('/:id/seats')
  .get(getAvailableSeats);

router.route('/movie/:movieId/theater/:theaterId/date/:date')
  .get(getShowtimesByMovieTheaterDate);

router.route('/movie/:movieId/date/:date')
  .get(getShowtimesByMovieDate);

// Admin routes
router.route('/')
  .post(protect, admin, createShowtime);

router.route('/:id')
  .put(protect, admin, updateShowtime)
  .delete(protect, admin, deleteShowtime);

module.exports = router;
