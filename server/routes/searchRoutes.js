const express = require('express');
const router = express.Router();
const {
  searchMovies,
  searchEvents,
  searchNews,
  searchTheaters,
  searchContent,
  globalSearch,
  autocompleteSearch,
} = require('../controllers/searchController');

// Global search
router.get('/', globalSearch);

// Specific collection searches
router.get('/movies', searchMovies);
router.get('/events', searchEvents);
router.get('/news', searchNews);
router.get('/theaters', searchTheaters);
router.get('/content', searchContent);

// Autocomplete
router.get('/autocomplete', autocompleteSearch);

module.exports = router;
