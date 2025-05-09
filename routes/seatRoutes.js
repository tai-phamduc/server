const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getSeatTypes } = require('../controllers/seatController');
const { updateSeatStatus, bookSeatsByIds, changeSeatStatus } = require('../controllers/screeningController');

// Public routes
router.get('/types', getSeatTypes);

// Seat status update routes
router.put('/update', updateSeatStatus);
router.put('/book-by-id', bookSeatsByIds);
router.put('/status', changeSeatStatus);

module.exports = router;
