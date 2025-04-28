const express = require('express');
const router = express.Router();
const {
  createStripePaymentIntent,
  confirmStripePayment,
  createPayPalOrder,
  capturePayPalOrder,
  processCashPayment,
  getUserPayments,
  getPaymentById,
  refundPayment,
  getAllPayments,
  getPaymentStats,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.route('/')
  .get(protect, getUserPayments);

router.route('/:id')
  .get(protect, getPaymentById);

// Stripe routes
router.route('/stripe/create-payment-intent')
  .post(protect, createStripePaymentIntent);

router.route('/stripe/confirm')
  .post(protect, confirmStripePayment);

// PayPal routes
router.route('/paypal/create-order')
  .post(protect, createPayPalOrder);

router.route('/paypal/capture-order')
  .post(protect, capturePayPalOrder);

// Admin routes
router.route('/cash')
  .post(protect, admin, processCashPayment);

router.route('/:id/refund')
  .post(protect, admin, refundPayment);

router.route('/admin')
  .get(protect, admin, getAllPayments);

router.route('/stats')
  .get(protect, admin, getPaymentStats);

module.exports = router;
