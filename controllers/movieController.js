const Movie = require('../models/Movie');
const { clearCachePattern } = require('../middleware/cacheMiddleware');

// @desc    Get all movies with filtering, sorting, and pagination
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const {
      keyword,
      status,
      genre,
      director,
      minRating,
      maxRating,
      sortBy,
      sortOrder,
      page,
      limit,
      year,
    } = req.query;

    // Fallback to sample data if MongoDB is not connected
    if (process.env.NODE_ENV === 'development' && process.env.USE_SAMPLE_DATA === 'true') {
      let movieData = require('../data/movieData');

      // Apply filters to sample data
      if (keyword) {
        const keywordLower = keyword.toLowerCase();
        movieData = movieData.filter(movie =>
          movie.title.toLowerCase().includes(keywordLower) ||
          movie.description.toLowerCase().includes(keywordLower)
        );
      }

      if (status) {
        movieData = movieData.filter(movie => movie.status === status);
      }

      if (genre) {
        const genres = genre.split(',');
        movieData = movieData.filter(movie =>
          movie.genre && genres.some(g => movie.genre.includes(g))
        );
      }

      if (director && director.trim() !== '') {
        const directorLower = director.toLowerCase();
        movieData = movieData.filter(movie =>
          movie.directorName && movie.directorName.toLowerCase().includes(directorLower)
        );
      }

      if (minRating) {
        movieData = movieData.filter(movie => movie.rating >= Number(minRating));
      }

      if (maxRating) {
        movieData = movieData.filter(movie => movie.rating <= Number(maxRating));
      }

      if (year) {
        movieData = movieData.filter(movie => {
          const releaseYear = new Date(movie.releaseDate).getFullYear();
          return releaseYear === Number(year);
        });
      }

      // Apply sorting
      if (sortBy) {
        movieData.sort((a, b) => {
          if (sortOrder === 'desc') {
            return b[sortBy] > a[sortBy] ? 1 : -1;
          } else {
            return a[sortBy] > b[sortBy] ? 1 : -1;
          }
        });
      } else {
        // Default sort by releaseDate desc
        movieData.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      }

      // Apply pagination
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMovies = movieData.slice(startIndex, endIndex);

      return res.json({
        movies: paginatedMovies,
        page: pageNumber,
        pages: Math.ceil(movieData.length / pageSize),
        total: movieData.length,
      });
    }

    // Build filter object for MongoDB
    const filter = {};

    // Search by keyword in title or description
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by genre
    if (genre) {
      filter.genre = { $in: genre.split(',') };
    }

    // Filter by director
    if (director) {
      filter.director = { $regex: director, $options: 'i' };
    }

    // Filter by rating range
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }

    // Filter by release year
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      filter.releaseDate = { $gte: startDate, $lte: endDate };
    }

    // Set up pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Set up sorting
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    // Execute query with pagination
    // const movies = await Movie.find(filter)
    //   .sort(sort)
    //   .skip(skip)
    //   .limit(pageSize);

    const movies = await Movie.find({});

    // Get total count for pagination
    const totalMovies = await Movie.countDocuments(filter);

    res.json({
      movies,
      page: pageNumber,
      pages: Math.ceil(totalMovies / pageSize),
      total: totalMovies,
    });
  } catch (error) {
    // Fallback to sample data if there's an error
    try {
      let movieData = require('../data/movieData');

      // Apply basic filters to sample data
      const pageNumber = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMovies = movieData.slice(startIndex, endIndex);

      return res.json({
        movies: paginatedMovies,
        page: pageNumber,
        pages: Math.ceil(movieData.length / pageSize),
        total: movieData.length,
      });
    } catch (fallbackError) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get movies by status
// @route   GET /api/movies/status/:status
// @access  Public
const getMoviesByStatus = async (req, res) => {
  try {
    let movies;
    const status = req.params.status;

    // Fallback to sample data if MongoDB is not connected
    if (process.env.NODE_ENV === 'development' && process.env.USE_SAMPLE_DATA === 'true') {
      const movieData = require('../data/movieData');
      movies = movieData.filter(movie => movie.status === status);
      return res.json(movies);
    }

    // Use static methods based on status
    switch (status) {
      case 'Now Playing':
        movies = await Movie.findNowPlaying();
        break;
      case 'Coming Soon':
        movies = await Movie.findComingSoon();
        break;
      case 'Featured':
        movies = await Movie.findFeatured();
        break;
      default:
        movies = await Movie.find({ status, isActive: true });
    }

    res.json(movies);
  } catch (error) {
    // Fallback to sample data if there's an error
    try {
      const movieData = require('../data/movieData');
      const movies = movieData.filter(movie => movie.status === status);
      return res.json(movies);
    } catch (fallbackError) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get movies by genre
// @route   GET /api/movies/genre/:genre
// @access  Public
const getMoviesByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;

    // Fallback to sample data if MongoDB is not connected
    if (process.env.NODE_ENV === 'development' && process.env.USE_SAMPLE_DATA === 'true') {
      const movieData = require('../data/movieData');
      const movies = movieData.filter(movie =>
        movie.genre && movie.genre.includes(genre)
      );
      return res.json(movies);
    }

    // Use static method to find movies by genre
    const movies = await Movie.findByGenre(genre);
    res.json(movies);
  } catch (error) {
    // Fallback to sample data if there's an error
    try {
      const movieData = require('../data/movieData');
      const movies = movieData.filter(movie =>
        movie.genre && movie.genre.includes(req.params.genre)
      );
      return res.json(movies);
    } catch (fallbackError) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Create a movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const createdMovie = await movie.save();

    // Clear cache for movie-related endpoints
    clearCachePattern('/api/movies');

    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Clear cache for movie-related endpoints and specific movie
    clearCachePattern('/api/movies');
    clearCachePattern(`/api/movies/${req.params.id}`);

    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await Movie.findByIdAndDelete(req.params.id);

    // Clear cache for movie-related endpoints
    clearCachePattern('/api/movies');

    res.json({ message: 'Movie removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search movies by keyword
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const movies = await Movie.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { director: { $regex: keyword, $options: 'i' } },
        { cast: { $in: [new RegExp(keyword, 'i')] } },
      ],
    });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended movies based on a movie
// @route   GET /api/movies/:id/recommendations
// @access  Public
const getMovieRecommendations = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Find movies with similar genres, excluding the current movie
    const recommendations = await Movie.find({
      _id: { $ne: movie._id },
      genre: { $in: movie.genre },
    })
      .sort({ rating: -1 })
      .limit(6);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Public
const getTopRatedMovies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Use static method to find top rated movies
    const movies = await Movie.findTopRated(limit);

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  getMoviesByStatus,
  getMoviesByGenre,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
  getMovieRecommendations,
  getTopRatedMovies,
};
