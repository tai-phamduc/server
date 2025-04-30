const Genre = require('../models/Genre');
const Movie = require('../models/Movie');
const asyncHandler = require('express-async-handler');

// @desc    Get all genres
// @route   GET /api/genres
// @access  Public
const getGenres = asyncHandler(async (req, res) => {
  const featured = req.query.featured === 'true';
  const withCount = req.query.withCount === 'true';

  let query = { isActive: true };

  if (featured) {
    query.isFeatured = true;
  }

  let genres;

  if (withCount) {
    genres = await Genre.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    // Get movie counts for each genre
    const genreIds = genres.map(genre => genre._id);
    const movieCounts = await Movie.aggregate([
      { $match: { genres: { $in: genreIds }, isActive: true } },
      { $unwind: '$genres' },
      { $match: { genres: { $in: genreIds } } },
      { $group: { _id: '$genres', count: { $sum: 1 } } }
    ]);

    // Create a map of genre ID to count
    const countMap = {};
    movieCounts.forEach(item => {
      countMap[item._id] = item.count;
    });

    // Add count to each genre
    genres = genres.map(genre => ({
      ...genre,
      moviesCount: countMap[genre._id] || 0
    }));
  } else {
    genres = await Genre.find(query)
      .sort({ order: 1, name: 1 });
  }

  res.json(genres);
});

// @desc    Get genre by ID
// @route   GET /api/genres/:id
// @access  Public
const getGenreById = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre || !genre.isActive) {
    res.status(404);
    throw new Error('Genre not found');
  }

  res.json(genre);
});

// @desc    Get genre by slug
// @route   GET /api/genres/slug/:slug
// @access  Public
const getGenreBySlug = asyncHandler(async (req, res) => {
  const genre = await Genre.findOne({
    slug: req.params.slug,
    isActive: true
  });

  if (!genre) {
    res.status(404);
    throw new Error('Genre not found');
  }

  res.json(genre);
});

// @desc    Get movies by genre
// @route   GET /api/genres/:id/movies
// @access  Public
const getMoviesByGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre || !genre.isActive) {
    res.status(404);
    throw new Error('Genre not found');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const movies = await Movie.find({
    genres: req.params.id,
    isActive: true
  })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('director', 'name')
    .populate('cast.actor', 'name');

  const total = await Movie.countDocuments({
    genres: req.params.id,
    isActive: true
  });

  res.json({
    genre,
    movies,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create a genre
// @route   POST /api/genres
// @access  Private/Admin
const createGenre = asyncHandler(async (req, res) => {
  const { name, description, image, icon, color, order, isFeatured } = req.body;

  // Check if genre already exists
  const genreExists = await Genre.findOne({ name });

  if (genreExists) {
    res.status(400);
    throw new Error('Genre already exists');
  }

  const genre = await Genre.create({
    name,
    description,
    image,
    icon,
    color,
    order,
    isFeatured,
    createdBy: req.user._id
  });

  res.status(201).json(genre);
});

// @desc    Update a genre
// @route   PUT /api/genres/:id
// @access  Private/Admin
const updateGenre = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    image,
    icon,
    color,
    order,
    isFeatured,
    isActive,
    metaTitle,
    metaDescription,
    metaKeywords
  } = req.body;

  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    res.status(404);
    throw new Error('Genre not found');
  }

  // Update fields
  if (name) genre.name = name;
  if (description !== undefined) genre.description = description;
  if (image !== undefined) genre.image = image;
  if (icon !== undefined) genre.icon = icon;
  if (color !== undefined) genre.color = color;
  if (order !== undefined) genre.order = order;
  if (isFeatured !== undefined) genre.isFeatured = isFeatured;
  if (isActive !== undefined) genre.isActive = isActive;
  if (metaTitle !== undefined) genre.metaTitle = metaTitle;
  if (metaDescription !== undefined) genre.metaDescription = metaDescription;
  if (metaKeywords !== undefined) genre.metaKeywords = metaKeywords;

  genre.updatedBy = req.user._id;

  const updatedGenre = await genre.save();

  res.json(updatedGenre);
});

// @desc    Delete a genre
// @route   DELETE /api/genres/:id
// @access  Private/Admin
const deleteGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    res.status(404);
    throw new Error('Genre not found');
  }

  // Check if genre is used in any movies
  const moviesCount = await Movie.countDocuments({ genres: req.params.id });

  if (moviesCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete genre. It is used in ${moviesCount} movies.`);
  }

  await Genre.deleteOne({ _id: req.params.id });

  res.json({ message: 'Genre removed' });
});

// @desc    Reorder genres
// @route   PUT /api/genres/reorder
// @access  Private/Admin
const reorderGenres = asyncHandler(async (req, res) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error('Invalid order data');
  }

  const updatePromises = orders.map(item => {
    return Genre.findByIdAndUpdate(
      item.id,
      { order: item.order },
      { new: true }
    );
  });

  await Promise.all(updatePromises);

  res.json({ message: 'Genres reordered successfully' });
});

module.exports = {
  getGenres,
  getGenreById,
  getGenreBySlug,
  getMoviesByGenre,
  createGenre,
  updateGenre,
  deleteGenre,
  reorderGenres
};
