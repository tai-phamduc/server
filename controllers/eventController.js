const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    // Use a simpler query to avoid potential issues
    const events = await Event.find({}, {
      title: 1,
      slug: 1,
      description: 1,
      shortDescription: 1,
      date: 1,
      endDate: 1,
      displayDate: 1,
      startTime: 1,
      endTime: 1,
      location: 1,
      image: 1,
      featured: 1,
      category: 1
    }).sort({ date: 1 }).limit(req.query.limit ? parseInt(req.query.limit) : 100);

    res.json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ message: 'Error retrieving events. Please try again later.' });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    // Use a simpler query to avoid potential issues
    const event = await Event.findById(req.params.id, {
      title: 1,
      slug: 1,
      description: 1,
      shortDescription: 1,
      date: 1,
      endDate: 1,
      displayDate: 1,
      startTime: 1,
      endTime: 1,
      location: 1,
      venue: 1,
      address: 1,
      city: 1,
      state: 1,
      zipCode: 1,
      country: 1,
      image: 1,
      gallery: 1,
      featured: 1,
      category: 1,
      categories: 1,
      organizer: 1,
      ticketPrice: 1,
      ticketUrl: 1,
      schedule: 1
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error getting event by ID:', error);
    res.status(500).json({ message: 'Error retrieving event. Please try again later.' });
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
const getFeaturedEvents = async (req, res) => {
  try {
    // Use a simpler query to avoid potential issues
    const events = await Event.find({ featured: true }, {
      title: 1,
      slug: 1,
      description: 1,
      shortDescription: 1,
      date: 1,
      endDate: 1,
      displayDate: 1,
      startTime: 1,
      endTime: 1,
      location: 1,
      image: 1,
      featured: 1,
      category: 1
    }).sort({ date: 1 }).limit(req.query.limit ? parseInt(req.query.limit) : 100);

    res.json(events);
  } catch (error) {
    console.error('Error getting featured events:', error);
    res.status(500).json({ message: 'Error retrieving featured events. Please try again later.' });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
const getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    // Use a simpler query to avoid potential issues
    const events = await Event.find({ date: { $gte: currentDate } }, {
      title: 1,
      slug: 1,
      description: 1,
      shortDescription: 1,
      date: 1,
      endDate: 1,
      displayDate: 1,
      startTime: 1,
      endTime: 1,
      location: 1,
      image: 1,
      featured: 1,
      category: 1
    }).sort({ date: 1 }).limit(req.query.limit ? parseInt(req.query.limit) : 100);

    res.json(events);
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    res.status(500).json({ message: 'Error retrieving upcoming events. Please try again later.' });
  }
};

// @desc    Get past events
// @route   GET /api/events/past
// @access  Public
const getPastEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    // Use a simpler query to avoid potential issues
    const events = await Event.find({ date: { $lt: currentDate } }, {
      title: 1,
      slug: 1,
      description: 1,
      shortDescription: 1,
      date: 1,
      endDate: 1,
      displayDate: 1,
      startTime: 1,
      endTime: 1,
      location: 1,
      image: 1,
      featured: 1,
      category: 1
    }).sort({ date: -1 }).limit(req.query.limit ? parseInt(req.query.limit) : 100);

    res.json(events);
  } catch (error) {
    console.error('Error getting past events:', error);
    res.status(500).json({ message: 'Error retrieving past events. Please try again later.' });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  getFeaturedEvents,
  getUpcomingEvents,
  getPastEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
