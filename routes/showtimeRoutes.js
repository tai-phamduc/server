const express = require('express');
const router = express.Router();
const {
  createShowtime,
  getShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
  getAvailableSeats,
} = require('../controllers/showtimeController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getShowtimes);

router.route('/:id')
  .get(getShowtimeById);

router.route('/:id/seats')
  .get(getAvailableSeats);

// Admin routes
router.route('/')
  .post(protect, admin, createShowtime);

router.route('/:id')
  .put(protect, admin, updateShowtime)
  .delete(protect, admin, deleteShowtime);

module.exports = router;
