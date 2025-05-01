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

// @desc    Search cinemas
// @route   GET /api/search/cinemas
// @access  Public
const searchCinemas = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const skip = (page - 1) * limit;
    const results = await searchService.searchCinemas(query, {
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
    const { query, limit = 10, type } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const itemLimit = Math.ceil(parseInt(limit) / 3); // Divide limit among the three types

    let suggestions = [];

    // If type is specified, only search that type
    if (type === 'movie') {
      const movieResults = await searchService.searchMovies(query, { limit: parseInt(limit) });
      suggestions = movieResults.results.map(movie => ({
        id: movie._id,
        title: movie.title,
        type: 'movie',
        image: movie.poster,
        releaseDate: movie.releaseDate,
      }));
    } else if (type === 'event') {
      const eventResults = await searchService.searchEvents(query, { limit: parseInt(limit) });
      suggestions = eventResults.results.map(event => ({
        id: event._id,
        title: event.title,
        type: 'event',
        image: event.image,
        date: event.date,
      }));
    } else if (type === 'news') {
      const newsResults = await searchService.searchNews(query, { limit: parseInt(limit) });
      suggestions = newsResults.results.map(news => ({
        id: news._id,
        title: news.title,
        type: 'news',
        image: news.featuredImage,
        publishDate: news.publishDate,
      }));
    } else {
      // Search all types
      const [movieResults, eventResults, newsResults] = await Promise.all([
        searchService.searchMovies(query, { limit: itemLimit }),
        searchService.searchEvents(query, { limit: itemLimit }),
        searchService.searchNews(query, { limit: itemLimit }),
      ]);

      // Combine results
      const movieSuggestions = movieResults.results.map(movie => ({
        id: movie._id,
        title: movie.title,
        type: 'movie',
        image: movie.poster,
        releaseDate: movie.releaseDate,
      }));

      const eventSuggestions = eventResults.results.map(event => ({
        id: event._id,
        title: event.title,
        type: 'event',
        image: event.image,
        date: event.date,
      }));

      const newsSuggestions = newsResults.results.map(news => ({
        id: news._id,
        title: news.title,
        type: 'news',
        image: news.featuredImage,
        publishDate: news.publishDate,
      }));

      suggestions = [...movieSuggestions, ...eventSuggestions, ...newsSuggestions];
    }

    // Limit the total number of suggestions
    suggestions = suggestions.slice(0, parseInt(limit));

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchMovies,
  searchEvents,
  searchNews,
  searchCinemas,
  searchContent,
  globalSearch,
  autocompleteSearch,
};
