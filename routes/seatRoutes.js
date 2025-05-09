const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getSeatTypes } = require('../controllers/seatController');
const { updateSeatStatus } = require('../controllers/screeningController');

// Public routes
router.get('/types', getSeatTypes);

// Seat status update route
router.put('/update', updateSeatStatus);

module.exports = router;
