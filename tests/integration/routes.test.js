const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const Movie = require('../../models/Movie');
const Review = require('../../models/Review');
const User = require('../../models/User');
const movieRoutes = require('../../routes/movieRoutes');
const reviewRoutes = require('../../routes/reviewRoutes');
const { protect, admin } = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Import test setup
require('../setup');

// Mock the auth middleware
jest.mock('../../middleware/authMiddleware', () => ({
  protect: jest.fn((req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'testsecret');
        req.user = decoded;
        next();
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  }),
  admin: jest.fn((req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as an admin' });
    }
  }),
}));

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);

describe('API Routes', () => {
  let adminUser, regularUser, adminToken, userToken, testMovie;
  
  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create admin user
    adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      isVerified: true
    });
    await adminUser.save();
    
    // Create regular user
    regularUser = new User({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });
    await regularUser.save();
    
    // Generate tokens
    adminToken = jwt.sign(
      { id: adminUser._id, role: 'admin' },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );
    
    userToken = jwt.sign(
      { id: regularUser._id, role: 'user' },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );
    
    // Create a test movie
    testMovie = new Movie({
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
    await testMovie.save();
  });
  
  describe('Movie Routes', () => {
    it('GET /api/movies should return all movies', async () => {
      const res = await request(app).get('/api/movies');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
    
    it('GET /api/movies/:id should return a specific movie', async () => {
      const res = await request(app).get(`/api/movies/${testMovie._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(testMovie._id.toString());
      expect(res.body.title).toBe(testMovie.title);
    });
    
    it('POST /api/movies should create a new movie when authenticated as admin', async () => {
      const newMovie = {
        title: 'New Test Movie',
        description: 'This is a new test movie',
        releaseDate: '2023-02-01',
        duration: 130,
        genre: ['Comedy'],
        director: 'Another Director',
        cast: ['Actor 2'],
        poster: 'https://example.com/poster2.jpg',
        trailer: 'https://example.com/trailer2',
        status: 'Coming Soon',
        language: 'English',
        country: 'USA',
        ageRating: 'PG'
      };
      
      const res = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newMovie);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(newMovie.title);
      expect(res.body._id).toBeDefined();
    });
    
    it('POST /api/movies should return 401 when not authenticated', async () => {
      const newMovie = {
        title: 'New Test Movie',
        description: 'This is a new test movie',
        releaseDate: '2023-02-01',
        duration: 130,
        genre: ['Comedy'],
        director: 'Another Director',
        cast: ['Actor 2'],
        poster: 'https://example.com/poster2.jpg',
        trailer: 'https://example.com/trailer2',
        status: 'Coming Soon'
      };
      
      const res = await request(app)
        .post('/api/movies')
        .send(newMovie);
      
      expect(res.statusCode).toBe(401);
    });
    
    it('PUT /api/movies/:id should update a movie when authenticated as admin', async () => {
      const updatedData = {
        title: 'Updated Movie Title'
      };
      
      const res = await request(app)
        .put(`/api/movies/${testMovie._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(updatedData.title);
    });
    
    it('DELETE /api/movies/:id should delete a movie when authenticated as admin', async () => {
      const res = await request(app)
        .delete(`/api/movies/${testMovie._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Movie removed');
      
      // Verify movie was deleted
      const deletedMovie = await Movie.findById(testMovie._id);
      expect(deletedMovie).toBeNull();
    });
  });
  
  describe('Review Routes', () => {
    let testReview;
    
    beforeEach(async () => {
      // Create a test review
      testReview = new Review({
        user: regularUser._id,
        movie: testMovie._id,
        rating: 8,
        title: 'Great movie',
        comment: 'I really enjoyed this movie',
        isApproved: true
      });
      await testReview.save();
    });
    
    it('GET /api/reviews/movie/:id should return all reviews for a movie', async () => {
      const res = await request(app).get(`/api/reviews/movie/${testMovie._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.reviews).toBeInstanceOf(Array);
      expect(res.body.reviews.length).toBeGreaterThan(0);
    });
    
    it('GET /api/reviews/:id should return a specific review', async () => {
      const res = await request(app).get(`/api/reviews/${testReview._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(testReview._id.toString());
      expect(res.body.title).toBe(testReview.title);
    });
    
    it('POST /api/reviews should create a new review when authenticated', async () => {
      // Create another movie for the new review
      const anotherMovie = new Movie({
        title: 'Another Movie',
        description: 'This is another test movie',
        releaseDate: new Date('2023-02-01'),
        duration: 110,
        genre: ['Comedy'],
        director: 'Another Director',
        cast: ['Actor 2'],
        poster: 'https://example.com/poster2.jpg',
        trailer: 'https://example.com/trailer2',
        status: 'Now Playing',
        rating: 7.0,
        language: 'English',
        country: 'USA',
        ageRating: 'PG',
        isActive: true
      });
      await anotherMovie.save();
      
      const newReview = {
        movieId: anotherMovie._id.toString(),
        rating: 9,
        title: 'Excellent movie',
        comment: 'One of the best movies I have seen'
      };
      
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newReview);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(newReview.title);
      expect(res.body.rating).toBe(newReview.rating);
      expect(res.body.movie).toBe(anotherMovie._id.toString());
    });
    
    it('PUT /api/reviews/:id/like should like a review when authenticated', async () => {
      const res = await request(app)
        .put(`/api/reviews/${testReview._id}/like`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(200);
      
      // Verify review was liked
      const updatedReview = await Review.findById(testReview._id);
      expect(updatedReview.likes).toBeGreaterThan(0);
    });
    
    it('PUT /api/reviews/:id/report should report a review when authenticated', async () => {
      const reportData = {
        reason: 'spam'
      };
      
      const res = await request(app)
        .put(`/api/reviews/${testReview._id}/report`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(reportData);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Review reported successfully');
      
      // Verify review was reported
      const updatedReview = await Review.findById(testReview._id);
      expect(updatedReview.isReported).toBe(true);
    });
    
    it('GET /api/reviews/reported should return reported reviews when authenticated as admin', async () => {
      // Report the test review
      testReview.isReported = true;
      testReview.reportCount = 1;
      await testReview.save();
      
      const res = await request(app)
        .get('/api/reviews/reported')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].isReported).toBe(true);
    });
  });
});
