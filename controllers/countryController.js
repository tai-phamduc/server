const Country = require('../models/Country');
const Movie = require('../models/Movie');
const asyncHandler = require('express-async-handler');

// @desc    Get all countries
// @route   GET /api/countries
// @access  Public
const getCountries = asyncHandler(async (req, res) => {
  const withCount = req.query.withCount === 'true';

  let countries;

  if (withCount) {
    countries = await Country.findWithMoviesCount();
  } else {
    countries = await Country.findActive();
  }

  res.json(countries);
});

// @desc    Get country by ID
// @route   GET /api/countries/:id
// @access  Public
const getCountryById = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);

  if (!country || !country.isActive) {
    res.status(404);
    throw new Error('Country not found');
  }

  res.json(country);
});

// @desc    Get country by code
// @route   GET /api/countries/code/:code
// @access  Public
const getCountryByCode = asyncHandler(async (req, res) => {
  const country = await Country.findByCode(req.params.code);

  if (!country) {
    res.status(404);
    throw new Error('Country not found');
  }

  res.json(country);
});

// @desc    Get movies by country
// @route   GET /api/countries/:id/movies
// @access  Public
const getMoviesByCountry = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);

  if (!country || !country.isActive) {
    res.status(404);
    throw new Error('Country not found');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const movies = await Movie.find({
    country: req.params.id,
    isActive: true
  })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('director', 'name')
    .populate('cast.actor', 'name');

  const total = await Movie.countDocuments({
    country: req.params.id,
    isActive: true
  });

  res.json({
    country,
    movies,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create a country
// @route   POST /api/countries
// @access  Private/Admin
const createCountry = asyncHandler(async (req, res) => {
  const { name, code, flag, isActive, order } = req.body;

  // Check if country already exists
  const countryExists = await Country.findOne({
    $or: [{ name }, { code }]
  });

  if (countryExists) {
    res.status(400);
    throw new Error('Country already exists');
  }

  const country = await Country.create({
    name,
    code,
    flag,
    isActive: isActive !== undefined ? isActive : true,
    order: order || 0,
    createdBy: req.user._id
  });

  res.status(201).json(country);
});

// @desc    Update a country
// @route   PUT /api/countries/:id
// @access  Private/Admin
const updateCountry = asyncHandler(async (req, res) => {
  const { name, code, flag, isActive, order } = req.body;

  const country = await Country.findById(req.params.id);

  if (!country) {
    res.status(404);
    throw new Error('Country not found');
  }

  // Check if code is being changed and if it already exists
  if (code && code !== country.code) {
    const codeExists = await Country.findOne({ code });
    if (codeExists) {
      res.status(400);
      throw new Error('Country code already exists');
    }
  }

  // Update fields
  if (name) country.name = name;
  if (code) country.code = code;
  if (flag !== undefined) country.flag = flag;
  if (isActive !== undefined) country.isActive = isActive;
  if (order !== undefined) country.order = order;

  country.updatedBy = req.user._id;

  const updatedCountry = await country.save();

  res.json(updatedCountry);
});

// @desc    Delete a country
// @route   DELETE /api/countries/:id
// @access  Private/Admin
const deleteCountry = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);

  if (!country) {
    res.status(404);
    throw new Error('Country not found');
  }

  // Check if country is used in any movies
  const moviesCount = await Movie.countDocuments({ country: req.params.id });

  if (moviesCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete country. It is used in ${moviesCount} movies.`);
  }

  await Country.deleteOne({ _id: req.params.id });

  res.json({ message: 'Country removed' });
});

// @desc    Reorder countries
// @route   PUT /api/countries/reorder
// @access  Private/Admin
const reorderCountries = asyncHandler(async (req, res) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error('Invalid order data');
  }

  const updatePromises = orders.map(item => {
    return Country.findByIdAndUpdate(
      item.id,
      { order: item.order },
      { new: true }
    );
  });

  await Promise.all(updatePromises);

  res.json({ message: 'Countries reordered successfully' });
});

module.exports = {
  getCountries,
  getCountryById,
  getCountryByCode,
  getMoviesByCountry,
  createCountry,
  updateCountry,
  deleteCountry,
  reorderCountries
};
