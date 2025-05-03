const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getSeatTypes } = require('../controllers/seatController');

// Public routes
router.get('/types', getSeatTypes);

module.exports = router;
