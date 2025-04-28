const searchService = require('../utils/searchService');

// @desc    Search movies
// @route   GET /api/search/movies
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const skip = (page - 1) * limit;
    const results = await searchService.searchMovies(query, {
      limit: parseInt(limit),
      skip: parseInt(skip),
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search events
// @route   GET /api/search/events
// @access  Public
const searchEvents = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const skip = (page - 1) * limit;
    const results = await searchService.searchEvents(query, {
      limit: parseInt(limit),
      skip: parseInt(skip),
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search news
// @route   GET /api/search/news
// @access  Public
const searchNews = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const skip = (page - 1) * limit;
    const results = await searchService.searchNews(query, {
      limit: parseInt(limit),
      skip: parseInt(skip),
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search theaters
// @route   GET /api/search/theaters
// @access  Public
const searchTheaters = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const skip = (page - 1) * limit;
    const results = await searchService.searchTheaters(query, {
      limit: parseInt(limit),
      skip: parseInt(skip),
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search content
// @route   GET /api/search/content
// @access  Public
const searchContent = async (req, res) => {
  try {
    const { query, page = 1, limit = 10, type, status = 'published' } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const skip = (page - 1) * limit;
    const results = await searchService.searchContent(query, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      type,
      status,
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Global search across all collections
// @route   GET /api/search
// @access  Public
const globalSearch = async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const results = await searchService.globalSearch(query, {
      limit: parseInt(limit),
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Autocomplete search
// @route   GET /api/search/autocomplete
// @access  Public
const autocompleteSearch = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // For simplicity, we'll just use the movie search for autocomplete
    const results = await searchService.searchMovies(query, {
      limit: parseInt(limit),
    });
    
    // Format results for autocomplete
    const suggestions = results.results.map(movie => ({
      id: movie._id,
      title: movie.title,
      type: 'movie',
      image: movie.poster,
    }));
    
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchMovies,
  searchEvents,
  searchNews,
  searchTheaters,
  searchContent,
  globalSearch,
  autocompleteSearch,
};
