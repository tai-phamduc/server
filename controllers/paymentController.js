const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const stripePayment = require('../utils/stripePayment');
const paypalPayment = require('../utils/paypalPayment');

// @desc    Create a payment intent (Stripe)
// @route   POST /api/payments/stripe/create-payment-intent
// @access  Private
const createStripePaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment && existingPayment.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Create payment intent
    const { success, clientSecret, paymentIntentId, error } = await stripePayment.createPaymentIntent(
      booking.totalPrice,
      'usd',
      { bookingId, userId: req.user._id.toString() }
    );

    if (!success) {
      return res.status(400).json({ message: error });
    }

    // Create or update payment record
    let payment;
    if (existingPayment) {
      payment = existingPayment;
      payment.paymentIntentId = paymentIntentId;
      payment.amount = booking.totalPrice;
      payment.paymentStatus = 'pending';
    } else {
      payment = new Payment({
        booking: bookingId,
        user: req.user._id,
        amount: booking.totalPrice,
        paymentMethod: 'stripe',
        paymentIntentId,
      });
    }

    await payment.save();

    res.json({
      clientSecret,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm a Stripe payment
// @route   POST /api/payments/stripe/confirm
// @access  Private
const confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Check payment intent status
    const { success, status, error } = await stripePayment.confirmPaymentIntent(paymentIntentId);

    if (!success) {
      return res.status(400).json({ message: error });
    }

    // Find payment by payment intent ID
    const payment = await Payment.findOne({ paymentIntentId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status
    if (status === 'succeeded') {
      payment.paymentStatus = 'completed';
      payment.paymentDate = Date.now();

      // Update booking status through the dedicated endpoint
      const booking = await Booking.findById(payment.booking);

      // Call the updateBookingAfterPayment function directly
      const axios = require('axios');
      try {
        await axios.put(
          `${process.env.API_URL || 'http://localhost:5003'}/api/bookings/${booking._id}/payment-complete`,
          {},
          {
            headers: {
              Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`,
            },
          }
        );
      } catch (err) {
        console.error('Error updating booking after payment:', err.message);
        // Continue anyway, as the payment was successful
      }
    } else if (status === 'requires_payment_method') {
      payment.paymentStatus = 'failed';
    }

    await payment.save();

    res.json({
      success: true,
      status,
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a PayPal order
// @route   POST /api/payments/paypal/create-order
// @access  Private
const createPayPalOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment && existingPayment.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Create PayPal order
    const { success, order, orderId, error } = await paypalPayment.createOrder(
      booking.totalPrice,
      'USD',
      `Payment for booking #${booking.bookingNumber}`
    );

    if (!success) {
      return res.status(400).json({ message: error });
    }

    // Create or update payment record
    let payment;
    if (existingPayment) {
      payment = existingPayment;
      payment.paymentIntentId = orderId;
      payment.amount = booking.totalPrice;
      payment.paymentStatus = 'pending';
      payment.paymentMethod = 'paypal';
    } else {
      payment = new Payment({
        booking: bookingId,
        user: req.user._id,
        amount: booking.totalPrice,
        paymentMethod: 'paypal',
        paymentIntentId: orderId,
      });
    }

    await payment.save();

    res.json({
      orderId,
      paymentId: payment._id,
      links: order.links,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Capture a PayPal order
// @route   POST /api/payments/paypal/capture-order
// @access  Private
const capturePayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Capture PayPal order
    const { success, captureData, error } = await paypalPayment.captureOrder(orderId);

    if (!success) {
      return res.status(400).json({ message: error });
    }

    // Find payment by payment intent ID
    const payment = await Payment.findOne({ paymentIntentId: orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status
    payment.paymentStatus = 'completed';
    payment.paymentDate = Date.now();
    payment.metadata = captureData;

    // Get capture ID for potential refunds
    const captureId = captureData.purchase_units[0].payments.captures[0].id;
    payment.receiptUrl = captureData.purchase_units[0].payments.captures[0].links.find(
      (link) => link.rel === 'receipt'
    )?.href;

    await payment.save();

    // Update booking status through the dedicated endpoint
    const booking = await Booking.findById(payment.booking);

    // Call the updateBookingAfterPayment function directly
    const axios = require('axios');
    try {
      await axios.put(
        `${process.env.API_URL || 'http://localhost:5003'}/api/bookings/${booking._id}/payment-complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`,
          },
        }
      );
    } catch (err) {
      console.error('Error updating booking after payment:', err.message);
      // Continue anyway, as the payment was successful
    }

    res.json({
      success: true,
      captureId,
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process a cash payment
// @route   POST /api/payments/cash
// @access  Private/Admin
const processCashPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment && existingPayment.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Create or update payment record
    let payment;
    if (existingPayment) {
      payment = existingPayment;
      payment.amount = booking.totalPrice;
      payment.paymentStatus = 'completed';
      payment.paymentMethod = 'cash';
      payment.paymentDate = Date.now();
    } else {
      payment = new Payment({
        booking: bookingId,
        user: booking.user,
        amount: booking.totalPrice,
        paymentMethod: 'cash',
        paymentStatus: 'completed',
        paymentDate: Date.now(),
      });
    }

    await payment.save();

    // Update booking status through the dedicated endpoint
    // For cash payments, we can call the function directly since we're already admin
    const axios = require('axios');
    try {
      await axios.put(
        `${process.env.API_URL || 'http://localhost:5003'}/api/bookings/${booking._id}/payment-complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`,
          },
        }
      );
    } catch (err) {
      console.error('Error updating booking after payment:', err.message);
      // Continue anyway, as the payment was successful
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments for a user
// @route   GET /api/payments
// @access  Private
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('booking', 'bookingNumber totalPrice bookingStatus')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('booking');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if payment belongs to user or user is admin
    if (payment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refund a payment
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
const refundPayment = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const payment = await Payment.findById(req.params.id).populate('booking');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Payment cannot be refunded' });
    }

    // Process refund based on payment method
    let refundResult;
    if (payment.paymentMethod === 'stripe') {
      refundResult = await stripePayment.refundPayment(
        payment.paymentIntentId,
        amount || payment.amount,
        reason
      );
    } else if (payment.paymentMethod === 'paypal') {
      // For PayPal, we need the capture ID from the metadata
      const captureId = payment.metadata.purchase_units[0].payments.captures[0].id;
      refundResult = await paypalPayment.refundPayment(
        captureId,
        amount || payment.amount,
        'USD',
        reason
      );
    } else {
      // For cash payments, just update the status
      refundResult = { success: true };
    }

    if (!refundResult.success) {
      return res.status(400).json({ message: refundResult.error });
    }

    // Update payment record
    payment.paymentStatus = 'refunded';
    payment.refundAmount = amount || payment.amount;
    payment.refundDate = Date.now();
    payment.refundReason = reason;

    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.booking);
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments (admin only)
// @route   GET /api/payments/admin
// @access  Private/Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate('booking', 'bookingNumber totalPrice bookingStatus')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment statistics (admin only)
// @route   GET /api/payments/stats
// @access  Private/Admin
const getPaymentStats = async (req, res) => {
  try {
    // Get total revenue
    const totalRevenue = await Payment.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get revenue by payment method
    const revenueByMethod = await Payment.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' } } },
    ]);

    // Get revenue by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueByDate = await Payment.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          paymentDate: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get count by payment status
    const countByStatus = await Payment.aggregate([
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueByMethod,
      revenueByDate,
      countByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
