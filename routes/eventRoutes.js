const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  getFeaturedEvents,
  getUpcomingEvents,
  getPastEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/past', getPastEvents);
router.get('/:id', getEventById);

// Protected routes (admin only)
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;
