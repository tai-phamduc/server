const Director = require('../models/Director');
const Movie = require('../models/Movie');
const asyncHandler = require('express-async-handler');

// @desc    Get all directors
// @route   GET /api/directors
// @access  Public
const getDirectors = asyncHandler(async (req, res) => {
  const featured = req.query.featured === 'true';
  const withCount = req.query.withCount === 'true';
  
  let query = { isActive: true };
  
  if (featured) {
    query.isFeatured = true;
  }
  
  let directors;
  
  if (withCount) {
    directors = await Director.find(query)
      .sort({ name: 1 })
      .lean();
    
    // Get movie counts for each director
    const directorIds = directors.map(director => director._id);
    const movieCounts = await Movie.aggregate([
      { $match: { director: { $in: directorIds }, isActive: true } },
      { $group: { _id: '$director', count: { $sum: 1 } } }
    ]);
    
    // Create a map of director ID to count
    const countMap = {};
    movieCounts.forEach(item => {
      countMap[item._id] = item.count;
    });
    
    // Add count to each director
    directors = directors.map(director => ({
      ...director,
      moviesCount: countMap[director._id] || 0
    }));
  } else {
    directors = await Director.find(query)
      .sort({ name: 1 });
  }
  
  res.json(directors);
});

// @desc    Get top directors
// @route   GET /api/directors/top
// @access  Public
const getTopDirectors = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const topDirectors = await Director.findTopDirectors(limit);
  
  res.json(topDirectors);
});

// @desc    Get director by ID
// @route   GET /api/directors/:id
// @access  Public
const getDirectorById = asyncHandler(async (req, res) => {
  const director = await Director.findById(req.params.id);
  
  if (!director || !director.isActive) {
    res.status(404);
    throw new Error('Director not found');
  }
  
  res.json(director);
});

// @desc    Get director by slug
// @route   GET /api/directors/slug/:slug
// @access  Public
const getDirectorBySlug = asyncHandler(async (req, res) => {
  const director = await Director.findOne({ 
    slug: req.params.slug,
    isActive: true
  });
  
  if (!director) {
    res.status(404);
    throw new Error('Director not found');
  }
  
  res.json(director);
});

// @desc    Get movies by director
// @route   GET /api/directors/:id/movies
// @access  Public
const getMoviesByDirector = asyncHandler(async (req, res) => {
  const director = await Director.findById(req.params.id);
  
  if (!director || !director.isActive) {
    res.status(404);
    throw new Error('Director not found');
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const movies = await Movie.find({ 
    director: req.params.id,
    isActive: true
  })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('genres', 'name')
    .populate('cast.actor', 'name');
  
  const total = await Movie.countDocuments({ 
    director: req.params.id,
    isActive: true
  });
  
  res.json({
    director,
    movies,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create a director
// @route   POST /api/directors
// @access  Private/Admin
const createDirector = asyncHandler(async (req, res) => {
  const { 
    name, 
    photo, 
    bio, 
    birthDate, 
    birthPlace, 
    nationality, 
    awards,
    socialMedia,
    isFeatured
  } = req.body;
  
  // Check if director already exists
  const directorExists = await Director.findOne({ name });
  
  if (directorExists) {
    res.status(400);
    throw new Error('Director already exists');
  }
  
  const director = await Director.create({
    name,
    photo,
    bio,
    birthDate,
    birthPlace,
    nationality,
    awards,
    socialMedia,
    isFeatured,
    createdBy: req.user._id
  });
  
  res.status(201).json(director);
});

// @desc    Update a director
// @route   PUT /api/directors/:id
// @access  Private/Admin
const updateDirector = asyncHandler(async (req, res) => {
  const { 
    name, 
    photo, 
    bio, 
    birthDate, 
    birthPlace, 
    nationality, 
    awards,
    socialMedia,
    isFeatured,
    isActive,
    metaTitle,
    metaDescription,
    metaKeywords
  } = req.body;
  
  const director = await Director.findById(req.params.id);
  
  if (!director) {
    res.status(404);
    throw new Error('Director not found');
  }
  
  // Update fields
  if (name) director.name = name;
  if (photo !== undefined) director.photo = photo;
  if (bio !== undefined) director.bio = bio;
  if (birthDate !== undefined) director.birthDate = birthDate;
  if (birthPlace !== undefined) director.birthPlace = birthPlace;
  if (nationality !== undefined) director.nationality = nationality;
  if (awards !== undefined) director.awards = awards;
  if (socialMedia !== undefined) director.socialMedia = socialMedia;
  if (isFeatured !== undefined) director.isFeatured = isFeatured;
  if (isActive !== undefined) director.isActive = isActive;
  if (metaTitle !== undefined) director.metaTitle = metaTitle;
  if (metaDescription !== undefined) director.metaDescription = metaDescription;
  if (metaKeywords !== undefined) director.metaKeywords = metaKeywords;
  
  director.updatedBy = req.user._id;
  
  const updatedDirector = await director.save();
  
  res.json(updatedDirector);
});

// @desc    Delete a director
// @route   DELETE /api/directors/:id
// @access  Private/Admin
const deleteDirector = asyncHandler(async (req, res) => {
  const director = await Director.findById(req.params.id);
  
  if (!director) {
    res.status(404);
    throw new Error('Director not found');
  }
  
  // Check if director is used in any movies
  const moviesCount = await Movie.countDocuments({ director: req.params.id });
  
  if (moviesCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete director. They are credited in ${moviesCount} movies.`);
  }
  
  await director.remove();
  
  res.json({ message: 'Director removed' });
});

module.exports = {
  getDirectors,
  getTopDirectors,
  getDirectorById,
  getDirectorBySlug,
  getMoviesByDirector,
  createDirector,
  updateDirector,
  deleteDirector
};
