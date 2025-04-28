const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const movieController = require('../../controllers/movieController');
const Movie = require('../../models/Movie');
const { clearCachePattern } = require('../../middleware/cacheMiddleware');

// Import test setup
require('../setup');

// Mock the clearCachePattern function
jest.mock('../../middleware/cacheMiddleware', () => ({
  clearCachePattern: jest.fn(),
}));

describe('Movie Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Test data
  const movieData = {
    title: 'Test Movie',
    description: 'This is a test movie',
    releaseDate: new Date('2023-01-01'),
    duration: 120,
    genre: ['Action', 'Adventure'],
    director: 'Test Director',
    cast: ['Actor 1', 'Actor 2'],
    poster: 'https://example.com/poster.jpg',
    trailer: 'https://example.com/trailer',
    status: 'Now Playing',
    rating: 8.5,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true
  };
  
  describe('getMovies', () => {
    it('should get all movies', async () => {
      // Create test movies
      await Movie.create(movieData);
      await Movie.create({
        ...movieData,
        title: 'Another Movie'
      });
      
      // Mock request and response
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.getMovies(req, res);
      
      // Get response data
      const data = res._getJSONData();
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBe(2);
      expect(data[0].title).toBeDefined();
      expect(data[1].title).toBeDefined();
    });
    
    it('should handle query parameters', async () => {
      // Create test movies
      await Movie.create(movieData);
      await Movie.create({
        ...movieData,
        title: 'Another Movie'
      });
      
      // Mock request with query parameters
      const req = httpMocks.createRequest({
        query: {
          limit: 1,
          page: 1
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.getMovies(req, res);
      
      // Get response data
      const data = res._getJSONData();
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBe(1);
    });
  });
  
  describe('getMovieById', () => {
    it('should get a movie by ID', async () => {
      // Create a test movie
      const movie = await Movie.create(movieData);
      
      // Mock request with params
      const req = httpMocks.createRequest({
        params: {
          id: movie._id.toString()
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.getMovieById(req, res);
      
      // Get response data
      const data = res._getJSONData();
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(data._id.toString()).toBe(movie._id.toString());
      expect(data.title).toBe(movie.title);
    });
    
    it('should return 404 if movie not found', async () => {
      // Mock request with non-existent ID
      const req = httpMocks.createRequest({
        params: {
          id: new mongoose.Types.ObjectId().toString()
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.getMovieById(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('Movie not found');
    });
  });
  
  describe('createMovie', () => {
    it('should create a new movie', async () => {
      // Mock request with movie data
      const req = httpMocks.createRequest({
        body: movieData
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.createMovie(req, res);
      
      // Get response data
      const data = res._getJSONData();
      
      // Assertions
      expect(res.statusCode).toBe(201);
      expect(data.title).toBe(movieData.title);
      expect(data._id).toBeDefined();
      
      // Verify cache was cleared
      expect(clearCachePattern).toHaveBeenCalledWith('/api/movies');
    });
    
    it('should handle validation errors', async () => {
      // Mock request with invalid data (missing required fields)
      const req = httpMocks.createRequest({
        body: {
          title: 'Invalid Movie'
          // Missing required fields
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.createMovie(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBeDefined();
    });
  });
  
  describe('updateMovie', () => {
    it('should update a movie', async () => {
      // Create a test movie
      const movie = await Movie.create(movieData);
      
      // Mock request with params and updated data
      const req = httpMocks.createRequest({
        params: {
          id: movie._id.toString()
        },
        body: {
          title: 'Updated Movie Title'
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.updateMovie(req, res);
      
      // Get response data
      const data = res._getJSONData();
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(data.title).toBe('Updated Movie Title');
      
      // Verify cache was cleared
      expect(clearCachePattern).toHaveBeenCalledWith('/api/movies');
      expect(clearCachePattern).toHaveBeenCalledWith(`/api/movies/${movie._id.toString()}`);
    });
    
    it('should return 404 if movie not found', async () => {
      // Mock request with non-existent ID
      const req = httpMocks.createRequest({
        params: {
          id: new mongoose.Types.ObjectId().toString()
        },
        body: {
          title: 'Updated Movie Title'
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.updateMovie(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('Movie not found');
    });
  });
  
  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      // Create a test movie
      const movie = await Movie.create(movieData);
      
      // Mock request with params
      const req = httpMocks.createRequest({
        params: {
          id: movie._id.toString()
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.deleteMovie(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().message).toBe('Movie removed');
      
      // Verify movie was deleted
      const deletedMovie = await Movie.findById(movie._id);
      expect(deletedMovie).toBeNull();
      
      // Verify cache was cleared
      expect(clearCachePattern).toHaveBeenCalledWith('/api/movies');
    });
    
    it('should return 404 if movie not found', async () => {
      // Mock request with non-existent ID
      const req = httpMocks.createRequest({
        params: {
          id: new mongoose.Types.ObjectId().toString()
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.deleteMovie(req, res);
      
      // Assertions
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('Movie not found');
    });
  });
  
  describe('getTopRatedMovies', () => {
    it('should get top rated movies', async () => {
      // Create test movies with different ratings
      await Movie.create({
        ...movieData,
        title: 'High Rated Movie',
        rating: 9.5,
        reviewCount: 10,
        totalRating: 95
      });
      
      await Movie.create({
        ...movieData,
        title: 'Medium Rated Movie',
        rating: 7.5,
        reviewCount: 8,
        totalRating: 60
      });
      
      // Mock request with query parameters
      const req = httpMocks.createRequest({
        query: {
          limit: 1
        }
      });
      const res = httpMocks.createResponse();
      
      // Call controller method
      await movieController.getTopRatedMovies(req, res);
      
      // Get response data
      const data = res._getJSONData();
      
      // Assertions
      expect(res.statusCode).toBe(200);
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBe(1);
      expect(data[0].rating).toBe(9.5);
    });
  });
});
