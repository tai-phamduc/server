const Language = require('../models/Language');
const Movie = require('../models/Movie');
const asyncHandler = require('express-async-handler');

// @desc    Get all languages
// @route   GET /api/languages
// @access  Public
const getLanguages = asyncHandler(async (req, res) => {
  const withCount = req.query.withCount === 'true';

  let languages;

  if (withCount) {
    languages = await Language.findWithMoviesCount();
  } else {
    languages = await Language.findActive();
  }

  res.json(languages);
});

// @desc    Get default language
// @route   GET /api/languages/default
// @access  Public
const getDefaultLanguage = asyncHandler(async (req, res) => {
  const language = await Language.findDefault();

  if (!language) {
    res.status(404);
    throw new Error('Default language not found');
  }

  res.json(language);
});

// @desc    Get language by ID
// @route   GET /api/languages/:id
// @access  Public
const getLanguageById = asyncHandler(async (req, res) => {
  const language = await Language.findById(req.params.id);

  if (!language || !language.isActive) {
    res.status(404);
    throw new Error('Language not found');
  }

  res.json(language);
});

// @desc    Get language by code
// @route   GET /api/languages/code/:code
// @access  Public
const getLanguageByCode = asyncHandler(async (req, res) => {
  const language = await Language.findByCode(req.params.code);

  if (!language) {
    res.status(404);
    throw new Error('Language not found');
  }

  res.json(language);
});

// @desc    Get movies by language
// @route   GET /api/languages/:id/movies
// @access  Public
const getMoviesByLanguage = asyncHandler(async (req, res) => {
  const language = await Language.findById(req.params.id);

  if (!language || !language.isActive) {
    res.status(404);
    throw new Error('Language not found');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const movies = await Movie.find({
    language: req.params.id,
    isActive: true
  })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('director', 'name')
    .populate('cast.actor', 'name');

  const total = await Movie.countDocuments({
    language: req.params.id,
    isActive: true
  });

  res.json({
    language,
    movies,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create a language
// @route   POST /api/languages
// @access  Private/Admin
const createLanguage = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    nativeName,
    flag,
    isActive,
    isDefault,
    order
  } = req.body;

  // Check if language already exists
  const languageExists = await Language.findOne({
    $or: [{ name }, { code }]
  });

  if (languageExists) {
    res.status(400);
    throw new Error('Language already exists');
  }

  // If this is set as default, unset any existing default
  if (isDefault) {
    await Language.updateMany(
      { isDefault: true },
      { isDefault: false }
    );
  }

  const language = await Language.create({
    name,
    code,
    nativeName,
    flag,
    isActive: isActive !== undefined ? isActive : true,
    isDefault: isDefault || false,
    order: order || 0,
    createdBy: req.user._id
  });

  res.status(201).json(language);
});

// @desc    Update a language
// @route   PUT /api/languages/:id
// @access  Private/Admin
const updateLanguage = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    nativeName,
    flag,
    isActive,
    isDefault,
    order
  } = req.body;

  const language = await Language.findById(req.params.id);

  if (!language) {
    res.status(404);
    throw new Error('Language not found');
  }

  // Check if code is being changed and if it already exists
  if (code && code !== language.code) {
    const codeExists = await Language.findOne({ code });
    if (codeExists) {
      res.status(400);
      throw new Error('Language code already exists');
    }
  }

  // If this is set as default, unset any existing default
  if (isDefault && !language.isDefault) {
    await Language.updateMany(
      { isDefault: true },
      { isDefault: false }
    );
  }

  // Update fields
  if (name) language.name = name;
  if (code) language.code = code;
  if (nativeName !== undefined) language.nativeName = nativeName;
  if (flag !== undefined) language.flag = flag;
  if (isActive !== undefined) language.isActive = isActive;
  if (isDefault !== undefined) language.isDefault = isDefault;
  if (order !== undefined) language.order = order;

  language.updatedBy = req.user._id;

  const updatedLanguage = await language.save();

  res.json(updatedLanguage);
});

// @desc    Delete a language
// @route   DELETE /api/languages/:id
// @access  Private/Admin
const deleteLanguage = asyncHandler(async (req, res) => {
  const language = await Language.findById(req.params.id);

  if (!language) {
    res.status(404);
    throw new Error('Language not found');
  }

  // Check if language is default
  if (language.isDefault) {
    res.status(400);
    throw new Error('Cannot delete default language');
  }

  // Check if language is used in any movies
  const moviesCount = await Movie.countDocuments({ language: req.params.id });

  if (moviesCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete language. It is used in ${moviesCount} movies.`);
  }

  await Language.deleteOne({ _id: req.params.id });

  res.json({ message: 'Language removed' });
});

// @desc    Reorder languages
// @route   PUT /api/languages/reorder
// @access  Private/Admin
const reorderLanguages = asyncHandler(async (req, res) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error('Invalid order data');
  }

  const updatePromises = orders.map(item => {
    return Language.findByIdAndUpdate(
      item.id,
      { order: item.order },
      { new: true }
    );
  });

  await Promise.all(updatePromises);

  res.json({ message: 'Languages reordered successfully' });
});

module.exports = {
  getLanguages,
  getDefaultLanguage,
  getLanguageById,
  getLanguageByCode,
  getMoviesByLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  reorderLanguages
};
