const Theater = require('../models/Theater');

// @desc    Create a new theater
// @route   POST /api/theaters
// @access  Private/Admin
const createTheater = async (req, res) => {
  try {
    const theater = new Theater(req.body);
    const createdTheater = await theater.save();
    res.status(201).json(createdTheater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all theaters
// @route   GET /api/theaters
// @access  Public
const getTheaters = async (req, res) => {
  try {
    const { city, name } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    
    // Only show active theaters
    filter.isActive = true;
    
    const theaters = await Theater.find(filter).sort({ name: 1 });
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get theater by ID
// @route   GET /api/theaters/:id
// @access  Public
const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    res.json(theater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a theater
// @route   PUT /api/theaters/:id
// @access  Private/Admin
const updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    const updatedTheater = await Theater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedTheater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a theater
// @route   DELETE /api/theaters/:id
// @access  Private/Admin
const deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    // Instead of deleting, mark as inactive
    theater.isActive = false;
    await theater.save();
    
    res.json({ message: 'Theater marked as inactive' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get theaters by city
// @route   GET /api/theaters/city/:city
// @access  Public
const getTheatersByCity = async (req, res) => {
  try {
    const theaters = await Theater.find({
      'location.city': { $regex: req.params.city, $options: 'i' },
      isActive: true,
    }).sort({ name: 1 });
    
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a hall to a theater
// @route   POST /api/theaters/:id/halls
// @access  Private/Admin
const addHall = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    theater.halls.push(req.body);
    await theater.save();
    
    res.status(201).json(theater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a hall in a theater
// @route   PUT /api/theaters/:id/halls/:hallId
// @access  Private/Admin
const updateHall = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    const hallIndex = theater.halls.findIndex(
      hall => hall._id.toString() === req.params.hallId
    );
    
    if (hallIndex === -1) {
      return res.status(404).json({ message: 'Hall not found' });
    }
    
    theater.halls[hallIndex] = { ...theater.halls[hallIndex], ...req.body };
    await theater.save();
    
    res.json(theater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTheater,
  getTheaters,
  getTheaterById,
  updateTheater,
  deleteTheater,
  getTheatersByCity,
  addHall,
  updateHall,
};
