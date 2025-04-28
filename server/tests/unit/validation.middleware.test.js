const { validateCreateMovie, validateUpdateMovie, validateMovieId, validateMovieSearch } = require('../../middleware/validation/movieValidation');
const { validateCreateReview, validateUpdateReview, validateReviewId, validateMovieIdForReviews, validateReviewApproval, validateReviewReport } = require('../../middleware/validation/reviewValidation');

// Mock Express request and response
const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Movie Validation Middleware', () => {
  beforeEach(() => {
    mockNext.mockClear();
  });
  
  describe('validateCreateMovie', () => {
    it('should pass validation for valid movie data', async () => {
      const req = mockRequest({
        title: 'Test Movie',
        description: 'This is a test movie',
        releaseDate: '2023-01-01',
        duration: 120,
        genre: ['Action', 'Adventure'],
        director: 'Test Director',
        cast: ['Actor 1', 'Actor 2'],
        poster: 'https://example.com/poster.jpg',
        trailer: 'https://example.com/trailer',
        status: 'Now Playing'
      });
      const res = mockResponse();
      
      // Call all middleware functions in the array
      for (const middleware of validateCreateMovie) {
        await middleware(req, res, mockNext);
      }
      
      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should fail validation for invalid movie data', async () => {
      const req = mockRequest({
        // Missing required fields
        title: '',
        description: 'This is a test movie',
        // Invalid duration
        duration: -10,
        genre: ['Action', 'Adventure'],
        director: 'Test Director',
        cast: ['Actor 1', 'Actor 2'],
        poster: 'not-a-url',
        trailer: 'not-a-url',
        status: 'Invalid Status'
      });
      const res = mockResponse();
      
      // Call all middleware functions in the array
      for (const middleware of validateCreateMovie) {
        await middleware(req, res, mockNext);
        // If res.status was called, stop the middleware chain
        if (res.status.mock.calls.length > 0) break;
      }
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toHaveProperty('errors');
    });
  });
  
  describe('validateMovieId', () => {
    it('should pass validation for valid movie ID', async () => {
      const req = mockRequest({}, { id: '507f1f77bcf86cd799439011' });
      const res = mockResponse();
      
      // Call all middleware functions in the array
      for (const middleware of validateMovieId) {
        await middleware(req, res, mockNext);
      }
      
      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should fail validation for invalid movie ID', async () => {
      const req = mockRequest({}, { id: 'invalid-id' });
      const res = mockResponse();
      
      // Call all middleware functions in the array
      for (const middleware of validateMovieId) {
        await middleware(req, res, mockNext);
        // If res.status was called, stop the middleware chain
        if (res.status.mock.calls.length > 0) break;
      }
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toHaveProperty('errors');
    });
  });
});

describe('Review Validation Middleware', () => {
  beforeEach(() => {
    mockNext.mockClear();
  });
  
  describe('validateCreateReview', () => {
    it('should pass validation for valid review data', async () => {
      const req = mockRequest({
        movieId: '507f1f77bcf86cd799439011',
        rating: 8,
        title: 'Great movie',
        comment: 'I really enjoyed this movie',
        spoiler: false,
        watchedInTheater: true
      });
      const res = mockResponse();
      
      // Call all middleware functions in the array
      for (const middleware of validateCreateReview) {
        await middleware(req, res, mockNext);
      }
      
      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should fail validation for invalid review data', async () => {
      const req = mockRequest({
        // Invalid movieId
        movieId: 'invalid-id',
        // Invalid rating
        rating: 11,
        title: '',
        comment: '',
        spoiler: 'not-a-boolean'
      });
      const res = mockResponse();
      
      // Call all middleware functions in the array
      for (const middleware of validateCreateReview) {
        await middleware(req, res, mockNext);
        // If res.status was called, stop the middleware chain
        if (res.status.mock.calls.length > 0) break;
      }
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toHaveProperty('errors');
    });
  });
  
  describe('validateReviewReport', () => {
    it('should pass validation for valid report reason', async () => {
      const req = mockRequest({
        reason: 'spam'
      });
      const res = mockResponse();
      
      // Call all middleware functions in the array
      for (const middleware of validateReviewReport) {
        await middleware(req, res, mockNext);
      }
      
      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should fail validation for invalid report reason', async () => {
      const req = mockRequest({
        reason: 'invalid-reason'
      });
      const res = mockResponse();
      
      // Call all middleware functions in the array
      for (const middleware of validateReviewReport) {
        await middleware(req, res, mockNext);
        // If res.status was called, stop the middleware chain
        if (res.status.mock.calls.length > 0) break;
      }
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toHaveProperty('errors');
    });
  });
});
