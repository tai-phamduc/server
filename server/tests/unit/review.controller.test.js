const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const reviewController = require('../../controllers/reviewController');
const Review = require('../../models/Review');
const Movie = require('../../models/Movie');
const User = require('../../models/User');
const { clearCachePattern } = require('../../middleware/cacheMiddleware');

// Import test setup
require('../setup');

// Mock the clearCachePattern function
jest.mock('../../middleware/cacheMiddleware', () => ({
  clearCachePattern: jest.fn(),
}));

describe('Review Controller', () => {
  let user, movie;
  
  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Create a test user
    user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });
    await user.save();
    
    // Create a test movie
    movie = new Movie({
      title: 'Test Movie',
      description: 'This is a test movie',
      releaseDate: new Date('2023-01-01'),
      duration: 120,
      genre: ['Action'],
      director: 'Test Director',
      cast: ['Actor 1'],
      poster: 'https://example.com/poster.jpg',
      trailer: 'https://example.com/trailer',
      status: 'Now Playing',
      rating: 8.0,
      language: 'English',
      country: 'USA',
      ageRating: 'PG-13',
      isActive: true
    });
    await movie.save();
  });
  
  // Test data for review
  const reviewData = {
    rating: 8,
    title: 'Great movie',
    comment: 'I really enjoyed this movie',
    spoiler: false,
    watchedInTheater: true
  };
  
  describe('createReview', () => {
    it('should create a new review', async () => {
      // Mock request with review data and authenticated user
      const req = httpMocks.createRequest({
        body: {
          ...reviewData,
          movieId: movie._id.toString()
        },
        user: {
          _id: user._id
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await reviewController.createReview(req, res);
      
      // Get response data
      const data = res._getJSONData();
      
      // Assertions
      expect(res.statusCode).toBe(201);
      expect(data.rating).toBe(reviewData.rating);
      expect(data.title).toBe(reviewData.title);
      expect(data.user.toString()).toBe(user._id.toString());
      expect(data.movie.toString()).toBe(movie._id.toString());
      
      // Verify cache was cleared
      expect(clearCachePattern).toHaveBeenCalledWith(`/api/reviews/movie/${movie._id.toString()}`);
      expect(clearCachePattern).toHaveBeenCalledWith(`/api/movies/${movie._id.toString()}`);
      expect(clearCachePattern).toHaveBeenCalledWith('/api/movies/top-rated');
    });
    
    it('should return 404 if movie not found', async () => {
      // Mock request with non-existent movie ID
      const req = httpMocks.createRequest({
        body: {
          ...reviewData,
          movieId: new mongoose.Types.ObjectId().toString()
        },
        user: {
          _id: user._id
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await reviewController.createReview(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('Movie not found');
    });
    
    it('should prevent duplicate reviews from the same user', async () => {
      // Create an existing review
      await Review.create({
        user: user._id,
        movie: movie._id,
        ...reviewData
      });
      
      // Mock request with same user and movie
      const req = httpMocks.createRequest({
        body: {
          ...reviewData,
          movieId: movie._id.toString()
        },
        user: {
          _id: user._id
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await reviewController.createReview(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe('You have already reviewed this movie');
    });
  });
  
  describe('getMovieReviews', () => {
    it('should get all reviews for a movie', async () => {
      // Create test reviews
      await Review.create({
        user: user._id,
        movie: movie._id,
        ...reviewData,
        isApproved: true
      });
      
      // Create another user
      const anotherUser = new User({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123',
        role: 'user',
        isVerified: true
      });
      await anotherUser.save();
      
      // Create another review
      await Review.create({
        user: anotherUser._id,
        movie: movie._id,
        ...reviewData,
        title: 'Another review',
        isApproved: true
      });
      
      // Mock request with params
      const req = httpMocks.createRequest({
        params: {
          id: movie._id.toString()
        },
        query: {}
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await reviewController.getMovieReviews(req, res);
      
      // Get response data
      const data = res._getJSONData();
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(data.reviews).toBeInstanceOf(Array);
      expect(data.reviews.length).toBe(2);
      expect(data.total).toBe(2);
      expect(data.page).toBe(1);
    });
    
    it('should handle pagination and sorting', async () => {
      // Create multiple reviews
      for (let i = 0; i < 5; i++) {
        // Create a new user for each review
        const reviewUser = new User({
          name: `User ${i}`,
          email: `user${i}@example.com`,
          password: 'password123',
          role: 'user',
          isVerified: true
        });
        await reviewUser.save();
        
        await Review.create({
          user: reviewUser._id,
          movie: movie._id,
          ...reviewData,
          title: `Review ${i}`,
          isApproved: true
        });
      }
      
      // Mock request with pagination params
      const req = httpMocks.createRequest({
        params: {
          id: movie._id.toString()
        },
        query: {
          page: 2,
          limit: 2,
          sort: 'likes'
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await reviewController.getMovieReviews(req, res);
      
      // Get response data
      const data = res._getJSONData();
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(data.reviews).toBeInstanceOf(Array);
      expect(data.reviews.length).toBe(2);
      expect(data.page).toBe(2);
      expect(data.pages).toBe(3); // 5 reviews with 2 per page = 3 pages
    });
  });
  
  describe('likeReview', () => {
    it('should like a review', async () => {
      // Create a test review
      const review = new Review({
        user: user._id,
        movie: movie._id,
        ...reviewData
      });
      await review.save();
      
      // Create another user to like the review
      const likerUser = new User({
        name: 'Liker User',
        email: 'liker@example.com',
        password: 'password123',
        role: 'user',
        isVerified: true
      });
      await likerUser.save();
      
      // Mock the like method
      const likeSpy = jest.spyOn(Review.prototype, 'like');
      
      // Mock request with params and authenticated user
      const req = httpMocks.createRequest({
        params: {
          id: review._id.toString()
        },
        user: {
          _id: likerUser._id
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await reviewController.likeReview(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(likeSpy).toHaveBeenCalledWith(likerUser._id);
      
      // Verify cache was cleared
      expect(clearCachePattern).toHaveBeenCalledWith(`/api/reviews/${review._id.toString()}`);
      expect(clearCachePattern).toHaveBeenCalledWith(`/api/reviews/movie/${review.movie.toString()}`);
      
      // Restore the spy
      likeSpy.mockRestore();
    });
    
    it('should return 404 if review not found', async () => {
      // Mock request with non-existent review ID
      const req = httpMocks.createRequest({
        params: {
          id: new mongoose.Types.ObjectId().toString()
        },
        user: {
          _id: user._id
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await reviewController.likeReview(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('Review not found');
    });
  });
  
  describe('reportReview', () => {
    it('should report a review', async () => {
      // Create a test review
      const review = new Review({
        user: user._id,
        movie: movie._id,
        ...reviewData
      });
      await review.save();
      
      // Create another user to report the review
      const reporterUser = new User({
        name: 'Reporter User',
        email: 'reporter@example.com',
        password: 'password123',
        role: 'user',
        isVerified: true
      });
      await reporterUser.save();
      
      // Mock the report method
      const reportSpy = jest.spyOn(Review.prototype, 'report');
      
      // Mock request with params, body, and authenticated user
      const req = httpMocks.createRequest({
        params: {
          id: review._id.toString()
        },
        body: {
          reason: 'spam'
        },
        user: {
          _id: reporterUser._id
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await reviewController.reportReview(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(reportSpy).toHaveBeenCalledWith(reporterUser._id, 'spam');
      expect(res._getJSONData().message).toBe('Review reported successfully');
      
      // Verify cache was cleared
      expect(clearCachePattern).toHaveBeenCalledWith(`/api/reviews/${review._id.toString()}`);
      expect(clearCachePattern).toHaveBeenCalledWith('/api/reviews/reported');
      
      // Restore the spy
      reportSpy.mockRestore();
    });
    
    it('should validate report reason', async () => {
      // Create a test review
      const review = new Review({
        user: user._id,
        movie: movie._id,
        ...reviewData
      });
      await review.save();
      
      // Mock request with invalid reason
      const req = httpMocks.createRequest({
        params: {
          id: review._id.toString()
        },
        body: {
          reason: 'invalid-reason'
        },
        user: {
          _id: user._id
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await reviewController.reportReview(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe('Valid report reason is required');
    });
  });
});
