const Actor = require('../models/Actor');
const Movie = require('../models/Movie');
const asyncHandler = require('express-async-handler');

// @desc    Get all actors
// @route   GET /api/actors
// @access  Public
const getActors = asyncHandler(async (req, res) => {
  const featured = req.query.featured === 'true';
  const withCount = req.query.withCount === 'true';
  
  let query = { isActive: true };
  
  if (featured) {
    query.isFeatured = true;
  }
  
  let actors;
  
  if (withCount) {
    actors = await Actor.find(query)
      .sort({ name: 1 })
      .lean();
    
    // Get movie counts for each actor
    const actorIds = actors.map(actor => actor._id);
    const movieCounts = await Movie.aggregate([
      { $match: { 'cast.actor': { $in: actorIds }, isActive: true } },
      { $unwind: '$cast' },
      { $match: { 'cast.actor': { $in: actorIds } } },
      { $group: { _id: '$cast.actor', count: { $sum: 1 } } }
    ]);
    
    // Create a map of actor ID to count
    const countMap = {};
    movieCounts.forEach(item => {
      countMap[item._id] = item.count;
    });
    
    // Add count to each actor
    actors = actors.map(actor => ({
      ...actor,
      moviesCount: countMap[actor._id] || 0
    }));
  } else {
    actors = await Actor.find(query)
      .sort({ name: 1 });
  }
  
  res.json(actors);
});

// @desc    Get top actors
// @route   GET /api/actors/top
// @access  Public
const getTopActors = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const topActors = await Actor.findTopActors(limit);
  
  res.json(topActors);
});

// @desc    Get actor by ID
// @route   GET /api/actors/:id
// @access  Public
const getActorById = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id);
  
  if (!actor || !actor.isActive) {
    res.status(404);
    throw new Error('Actor not found');
  }
  
  res.json(actor);
});

// @desc    Get actor by slug
// @route   GET /api/actors/slug/:slug
// @access  Public
const getActorBySlug = asyncHandler(async (req, res) => {
  const actor = await Actor.findOne({ 
    slug: req.params.slug,
    isActive: true
  });
  
  if (!actor) {
    res.status(404);
    throw new Error('Actor not found');
  }
  
  res.json(actor);
});

// @desc    Get movies by actor
// @route   GET /api/actors/:id/movies
// @access  Public
const getMoviesByActor = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id);
  
  if (!actor || !actor.isActive) {
    res.status(404);
    throw new Error('Actor not found');
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const movies = await Movie.find({ 
    'cast.actor': req.params.id,
    isActive: true
  })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('director', 'name')
    .populate('genres', 'name');
  
  // Add character information for this actor
  const moviesWithCharacter = movies.map(movie => {
    const movieObj = movie.toObject();
    const castMember = movie.cast.find(c => c.actor.toString() === req.params.id);
    movieObj.character = castMember ? castMember.character : '';
    return movieObj;
  });
  
  const total = await Movie.countDocuments({ 
    'cast.actor': req.params.id,
    isActive: true
  });
  
  res.json({
    actor,
    movies: moviesWithCharacter,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create an actor
// @route   POST /api/actors
// @access  Private/Admin
const createActor = asyncHandler(async (req, res) => {
  const { 
    name, 
    photo, 
    bio, 
    birthDate, 
    birthPlace, 
    nationality,
    height,
    awards,
    socialMedia,
    isFeatured
  } = req.body;
  
  // Check if actor already exists
  const actorExists = await Actor.findOne({ name });
  
  if (actorExists) {
    res.status(400);
    throw new Error('Actor already exists');
  }
  
  const actor = await Actor.create({
    name,
    photo,
    bio,
    birthDate,
    birthPlace,
    nationality,
    height,
    awards,
    socialMedia,
    isFeatured,
    createdBy: req.user._id
  });
  
  res.status(201).json(actor);
});

// @desc    Update an actor
// @route   PUT /api/actors/:id
// @access  Private/Admin
const updateActor = asyncHandler(async (req, res) => {
  const { 
    name, 
    photo, 
    bio, 
    birthDate, 
    birthPlace, 
    nationality,
    height,
    awards,
    socialMedia,
    isFeatured,
    isActive,
    metaTitle,
    metaDescription,
    metaKeywords
  } = req.body;
  
  const actor = await Actor.findById(req.params.id);
  
  if (!actor) {
    res.status(404);
    throw new Error('Actor not found');
  }
  
  // Update fields
  if (name) actor.name = name;
  if (photo !== undefined) actor.photo = photo;
  if (bio !== undefined) actor.bio = bio;
  if (birthDate !== undefined) actor.birthDate = birthDate;
  if (birthPlace !== undefined) actor.birthPlace = birthPlace;
  if (nationality !== undefined) actor.nationality = nationality;
  if (height !== undefined) actor.height = height;
  if (awards !== undefined) actor.awards = awards;
  if (socialMedia !== undefined) actor.socialMedia = socialMedia;
  if (isFeatured !== undefined) actor.isFeatured = isFeatured;
  if (isActive !== undefined) actor.isActive = isActive;
  if (metaTitle !== undefined) actor.metaTitle = metaTitle;
  if (metaDescription !== undefined) actor.metaDescription = metaDescription;
  if (metaKeywords !== undefined) actor.metaKeywords = metaKeywords;
  
  actor.updatedBy = req.user._id;
  
  const updatedActor = await actor.save();
  
  res.json(updatedActor);
});

// @desc    Delete an actor
// @route   DELETE /api/actors/:id
// @access  Private/Admin
const deleteActor = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id);
  
  if (!actor) {
    res.status(404);
    throw new Error('Actor not found');
  }
  
  // Check if actor is used in any movies
  const moviesCount = await Movie.countDocuments({ 'cast.actor': req.params.id });
  
  if (moviesCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete actor. They appear in ${moviesCount} movies.`);
  }
  
  await actor.remove();
  
  res.json({ message: 'Actor removed' });
});

module.exports = {
  getActors,
  getTopActors,
  getActorById,
  getActorBySlug,
  getMoviesByActor,
  createActor,
  updateActor,
  deleteActor
};
