const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingAfterPayment
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected routes
router.route('/')
  .post(protect, createBooking)
  .get(protect, getUserBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

router.route('/:id/payment-complete')
  .put(protect, updateBookingAfterPayment);

// Admin routes
router.route('/admin')
  .get(protect, admin, getAllBookings);

module.exports = router;
