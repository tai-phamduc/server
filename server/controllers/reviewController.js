const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { clearCachePattern } = require('../middleware/cacheMiddleware');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { movieId, rating, title, comment } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: req.user._id,
      movie: movieId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    // Create review
    const review = new Review({
      user: req.user._id,
      movie: movieId,
      rating,
      title,
      comment,
    });

    await review.save();

    // Update movie rating
    const allReviews = await Review.find({ movie: movieId });
    const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / allReviews.length;

    movie.rating = averageRating;
    await movie.save();

    // Clear cache for related endpoints
    clearCachePattern(`/api/reviews/movie/${movieId}`);
    clearCachePattern(`/api/movies/${movieId}`);
    clearCachePattern('/api/movies/top-rated');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a movie
// @route   GET /api/reviews/movie/:id
// @access  Public
const getMovieReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort === 'likes'
      ? { likes: -1 }
      : { createdAt: -1 };

    // Use static method to find reviews by movie
    const reviews = await Review.findByMovie(req.params.id, {
      sort,
      limit,
      skip
    });

    // Get total count for pagination
    const total = await Review.countDocuments({
      movie: req.params.id,
      isApproved: true
    });

    res.json({
      reviews,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name profilePicture')
      .populate('movie', 'title poster');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the review belongs to the user
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { rating, title, comment } = req.body;

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    // Update movie rating
    const movie = await Movie.findById(review.movie);
    const allReviews = await Review.find({ movie: review.movie });
    const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / allReviews.length;

    movie.rating = averageRating;
    await movie.save();

    // Clear cache for related endpoints
    clearCachePattern(`/api/reviews/${review._id}`);
    clearCachePattern(`/api/reviews/movie/${review.movie}`);
    clearCachePattern(`/api/movies/${review.movie}`);
    clearCachePattern('/api/movies/top-rated');

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the review belongs to the user or if the user is an admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await review.remove();

    // Update movie rating
    const movie = await Movie.findById(review.movie);
    const allReviews = await Review.find({ movie: review.movie });

    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
      const averageRating = totalRating / allReviews.length;
      movie.rating = averageRating;
    } else {
      movie.rating = 0;
    }

    await movie.save();

    // Clear cache for related endpoints
    clearCachePattern(`/api/reviews/${req.params.id}`);
    clearCachePattern(`/api/reviews/movie/${review.movie}`);
    clearCachePattern(`/api/movies/${review.movie}`);
    clearCachePattern('/api/movies/top-rated');

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a review
// @route   PUT /api/reviews/:id/like
// @access  Private
const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Use the like method from the model
    await review.like(req.user._id);

    // Populate user info before returning
    await review.populate('userInfo');

    // Clear cache for this review
    clearCachePattern(`/api/reviews/${review._id}`);
    clearCachePattern(`/api/reviews/movie/${review.movie}`);

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Dislike a review
// @route   PUT /api/reviews/:id/dislike
// @access  Private
const dislikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Use the dislike method from the model
    await review.dislike(req.user._id);

    // Populate user info before returning
    await review.populate('userInfo');

    // Clear cache for this review
    clearCachePattern(`/api/reviews/${review._id}`);
    clearCachePattern(`/api/reviews/movie/${review.movie}`);

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (admin only)
// @route   GET /api/reviews/admin
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('movie', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Review.countDocuments({});

    res.json({
      reviews,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reported reviews (admin only)
// @route   GET /api/reviews/reported
// @access  Private/Admin
const getReportedReviews = async (req, res) => {
  try {
    // Use static method to find reported reviews
    const reviews = await Review.findReported();

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or disapprove a review (admin only)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (req.body.isApproved) {
      // Use the approve method from the model
      await review.approve();
    } else {
      // Use the reject method from the model
      await review.reject();
    }

    // Clear cache for related endpoints
    clearCachePattern(`/api/reviews/${review._id}`);
    clearCachePattern(`/api/reviews/movie/${review.movie}`);
    clearCachePattern('/api/reviews/admin');
    clearCachePattern('/api/reviews/reported');

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Report a review
// @route   PUT /api/reviews/:id/report
// @access  Private
const reportReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const { reason } = req.body;

    if (!reason || !['spam', 'inappropriate', 'offensive', 'spoiler', 'other'].includes(reason)) {
      return res.status(400).json({ message: 'Valid report reason is required' });
    }

    // Use the report method from the model
    await review.report(req.user._id, reason);

    // Clear cache for related endpoints
    clearCachePattern(`/api/reviews/${review._id}`);
    clearCachePattern('/api/reviews/reported');

    res.json({ message: 'Review reported successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's review for a movie
// @route   GET /api/reviews/user/movie/:id
// @access  Private
const getUserReviewForMovie = async (req, res) => {
  try {
    const review = await Review.findOne({
      user: req.user._id,
      movie: req.params.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getMovieReviews,
  getReviewById,
  updateReview,
  deleteReview,
  likeReview,
  dislikeReview,
  getAllReviews,
  getReportedReviews,
  approveReview,
  reportReview,
  getUserReviewForMovie,
};
