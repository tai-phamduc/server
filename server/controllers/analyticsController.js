const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Track page view
// @route   POST /api/analytics/pageview
// @access  Public
const trackPageView = async (req, res) => {
  try {
    const { page, sessionId, referrer, device, location } = req.body;

    const analytics = new Analytics({
      type: 'pageView',
      page,
      sessionId,
      referrer,
      device,
      location,
      user: req.user ? req.user._id : null,
    });

    await analytics.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track event
// @route   POST /api/analytics/event
// @access  Public
const trackEvent = async (req, res) => {
  try {
    const { category, action, label, value, sessionId, device, location, metadata } = req.body;

    const analytics = new Analytics({
      type: 'event',
      category,
      action,
      label,
      value,
      sessionId,
      device,
      location,
      metadata,
      user: req.user ? req.user._id : null,
    });

    await analytics.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track conversion
// @route   POST /api/analytics/conversion
// @access  Private
const trackConversion = async (req, res) => {
  try {
    const { type, value, metadata } = req.body;

    const analytics = new Analytics({
      type: 'conversion',
      category: type,
      value,
      metadata,
      user: req.user._id,
    });

    await analytics.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track error
// @route   POST /api/analytics/error
// @access  Public
const trackError = async (req, res) => {
  try {
    const { message, stack, page, sessionId, device } = req.body;

    const analytics = new Analytics({
      type: 'error',
      page,
      sessionId,
      device,
      metadata: { message, stack },
      user: req.user ? req.user._id : null,
    });

    await analytics.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track performance
// @route   POST /api/analytics/performance
// @access  Public
const trackPerformance = async (req, res) => {
  try {
    const { page, duration, metrics, sessionId, device } = req.body;

    const analytics = new Analytics({
      type: 'performance',
      page,
      duration,
      sessionId,
      device,
      metadata: { metrics },
      user: req.user ? req.user._id : null,
    });

    await analytics.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get page view statistics
// @route   GET /api/analytics/pageviews
// @access  Private/Admin
const getPageViewStats = async (req, res) => {
  try {
    const { startDate, endDate, page } = req.query;

    // Build filter object
    const filter = { type: 'pageView' };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (page) {
      filter.page = page;
    }

    // Get total page views
    const totalPageViews = await Analytics.countDocuments(filter);

    // Get page views by page
    const pageViewsByPage = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get page views by date
    const pageViewsByDate = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get page views by device type
    const pageViewsByDevice = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$device.type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get page views by country
    const pageViewsByCountry = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalPageViews,
      pageViewsByPage,
      pageViewsByDate,
      pageViewsByDevice,
      pageViewsByCountry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event statistics
// @route   GET /api/analytics/events
// @access  Private/Admin
const getEventStats = async (req, res) => {
  try {
    const { startDate, endDate, category, action } = req.query;

    // Build filter object
    const filter = { type: 'event' };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (category) {
      filter.category = category;
    }

    if (action) {
      filter.action = action;
    }

    // Get total events
    const totalEvents = await Analytics.countDocuments(filter);

    // Get events by category
    const eventsByCategory = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get events by action
    const eventsByAction = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get events by date
    const eventsByDate = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalEvents,
      eventsByCategory,
      eventsByAction,
      eventsByDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversion statistics
// @route   GET /api/analytics/conversions
// @access  Private/Admin
const getConversionStats = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    // Build filter object
    const filter = { type: 'conversion' };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (type) {
      filter.category = type;
    }

    // Get total conversions
    const totalConversions = await Analytics.countDocuments(filter);

    // Get conversions by type
    const conversionsByType = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 }, value: { $sum: '$value' } } },
      { $sort: { count: -1 } },
    ]);

    // Get conversions by date
    const conversionsByDate = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          value: { $sum: '$value' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get total conversion value
    const totalValue = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);

    res.json({
      totalConversions,
      totalValue: totalValue[0]?.total || 0,
      conversionsByType,
      conversionsByDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get error statistics
// @route   GET /api/analytics/errors
// @access  Private/Admin
const getErrorStats = async (req, res) => {
  try {
    const { startDate, endDate, page } = req.query;

    // Build filter object
    const filter = { type: 'error' };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (page) {
      filter.page = page;
    }

    // Get total errors
    const totalErrors = await Analytics.countDocuments(filter);

    // Get errors by page
    const errorsByPage = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get errors by date
    const errorsByDate = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get most common error messages
    const commonErrors = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$metadata.message', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      totalErrors,
      errorsByPage,
      errorsByDate,
      commonErrors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get performance statistics
// @route   GET /api/analytics/performance
// @access  Private/Admin
const getPerformanceStats = async (req, res) => {
  try {
    const { startDate, endDate, page } = req.query;

    // Build filter object
    const filter = { type: 'performance' };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (page) {
      filter.page = page;
    }

    // Get average duration by page
    const avgDurationByPage = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$page', avgDuration: { $avg: '$duration' } } },
      { $sort: { avgDuration: -1 } },
    ]);

    // Get average duration by date
    const avgDurationByDate = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          avgDuration: { $avg: '$duration' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get average duration by device type
    const avgDurationByDevice = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$device.type', avgDuration: { $avg: '$duration' } } },
      { $sort: { avgDuration: -1 } },
    ]);

    res.json({
      avgDurationByPage,
      avgDurationByDate,
      avgDurationByDevice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get new users in the last 30 days
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Get total movies
    const totalMovies = await Movie.countDocuments();

    // Get total bookings
    const totalBookings = await Booking.countDocuments();

    // Get bookings in the last 30 days
    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Get total revenue
    const totalRevenue = await Payment.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get revenue in the last 30 days
    const recentRevenue = await Payment.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get page views in the last 30 days
    const pageViews = await Analytics.countDocuments({
      type: 'pageView',
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Get page views by date
    const pageViewsByDate = await Analytics.aggregate([
      {
        $match: {
          type: 'pageView',
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get bookings by date
    const bookingsByDate = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get revenue by date
    const revenueByDate = await Payment.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalUsers,
      newUsers,
      totalMovies,
      totalBookings,
      recentBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentRevenue: recentRevenue[0]?.total || 0,
      pageViews,
      pageViewsByDate,
      bookingsByDate,
      revenueByDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  trackPageView,
  trackEvent,
  trackConversion,
  trackError,
  trackPerformance,
  getPageViewStats,
  getEventStats,
  getConversionStats,
  getErrorStats,
  getPerformanceStats,
  getDashboardStats,
};
