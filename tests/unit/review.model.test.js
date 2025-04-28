const mongoose = require('mongoose');
const Review = require('../../models/Review');
const User = require('../../models/User');
const Movie = require('../../models/Movie');

// Import test setup
require('../setup');

describe('Review Model', () => {
  let user, movie;

  // Set up test data before each test
  beforeEach(async () => {
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

  // Test creating a review
  it('should create a new review', async () => {
    const review = new Review({
      user: user._id,
      movie: movie._id,
      ...reviewData
    });

    const savedReview = await review.save();

    expect(savedReview._id).toBeDefined();
    expect(savedReview.rating).toBe(reviewData.rating);
    expect(savedReview.title).toBe(reviewData.title);
    expect(savedReview.comment).toBe(reviewData.comment);
    expect(savedReview.user.toString()).toBe(user._id.toString());
    expect(savedReview.movie.toString()).toBe(movie._id.toString());
  });

  // Test like method
  it('should like a review', async () => {
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

    // Like the review
    await review.like(likerUser._id);

    // Fetch the updated review
    const updatedReview = await Review.findById(review._id);

    expect(updatedReview.likes).toBe(1);
    expect(updatedReview.likedBy).toContainEqual(likerUser._id);
  });

  // Test dislike method
  it('should dislike a review', async () => {
    const review = new Review({
      user: user._id,
      movie: movie._id,
      ...reviewData
    });
    await review.save();

    // Create another user to dislike the review
    const dislikerUser = new User({
      name: 'Disliker User',
      email: 'disliker@example.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });
    await dislikerUser.save();

    // Dislike the review
    await review.dislike(dislikerUser._id);

    // Fetch the updated review
    const updatedReview = await Review.findById(review._id);

    expect(updatedReview.dislikes).toBe(1);
    expect(updatedReview.dislikedBy).toContainEqual(dislikerUser._id);
  });

  // Test report method
  it('should report a review', async () => {
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

    // Report the review
    await review.report(reporterUser._id, 'spam');

    // Fetch the updated review
    const updatedReview = await Review.findById(review._id);

    expect(updatedReview.isReported).toBe(true);
    expect(updatedReview.reportCount).toBe(1);
    expect(updatedReview.reportedBy).toContainEqual(reporterUser._id);
    expect(updatedReview.reportReasons).toContain('spam');
  });

  // Test approve method
  it('should approve a review', async () => {
    const review = new Review({
      user: user._id,
      movie: movie._id,
      ...reviewData,
      isApproved: false
    });
    await review.save();

    // Approve the review
    await review.approve();

    // Fetch the updated review
    const updatedReview = await Review.findById(review._id);

    expect(updatedReview.isApproved).toBe(true);
  });

  // Test reject method
  it('should reject a review', async () => {
    const review = new Review({
      user: user._id,
      movie: movie._id,
      ...reviewData,
      isApproved: true
    });
    await review.save();

    // Reject the review
    await review.reject();

    // Fetch the updated review
    const updatedReview = await Review.findById(review._id);

    expect(updatedReview.isApproved).toBe(false);
  });

  // Test static method findByMovie
  it('should find reviews by movie', async () => {
    // Create a new user for each review to avoid duplicate key error
    const user1 = new User({
      name: 'User 1',
      email: 'user1@example.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });
    await user1.save();

    const user2 = new User({
      name: 'User 2',
      email: 'user2@example.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });
    await user2.save();

    // Create multiple reviews for the same movie
    await Review.create({
      user: user1._id,
      movie: movie._id,
      rating: 9,
      title: 'Review 1',
      comment: 'Comment 1',
      isApproved: true
    });

    await Review.create({
      user: user2._id,
      movie: movie._id,
      rating: 8,
      title: 'Review 2',
      comment: 'Comment 2',
      isApproved: true
    });

    // Create a review for another movie
    const anotherMovie = new Movie({
      title: 'Another Movie',
      description: 'This is another test movie',
      releaseDate: new Date('2023-02-01'),
      duration: 110,
      genre: ['Comedy'],
      director: 'Another Director',
      cast: ['Actor 3'],
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

    const user3 = new User({
      name: 'User 3',
      email: 'user3@example.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });
    await user3.save();

    await Review.create({
      user: user3._id,
      movie: anotherMovie._id,
      rating: 7,
      title: 'Review for another movie',
      comment: 'Comment for another movie',
      isApproved: true
    });

    // Test findByMovie method
    const reviews = await Review.findByMovie(movie._id);

    expect(reviews).toHaveLength(2);
    expect(reviews[0].movie.toString()).toBe(movie._id.toString());
    expect(reviews[1].movie.toString()).toBe(movie._id.toString());
  });

  // Test static method findReported
  it('should find reported reviews', async () => {
    // Create a new user for the reported review
    const reporterUser = new User({
      name: 'Reporter User',
      email: 'reporter_test@example.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });
    await reporterUser.save();

    // Create a new movie for the reported review
    const reportedMovie = new Movie({
      title: 'Reported Movie',
      description: 'This is a movie with reported reviews',
      releaseDate: new Date('2023-03-01'),
      duration: 130,
      genre: ['Horror'],
      director: 'Horror Director',
      cast: ['Actor 4'],
      poster: 'https://example.com/poster3.jpg',
      trailer: 'https://example.com/trailer3',
      status: 'Now Playing',
      rating: 6.0,
      language: 'English',
      country: 'USA',
      ageRating: 'R',
      isActive: true
    });
    await reportedMovie.save();

    // Create a reported review
    const reportedReview = new Review({
      user: reporterUser._id,
      movie: reportedMovie._id,
      rating: 6,
      title: 'Reported Review',
      comment: 'This review is reported',
      isApproved: true,
      isReported: true,
      reportCount: 2,
      reportReasons: ['spam', 'offensive']
    });
    await reportedReview.save();

    // Create a new user for the normal review
    const normalUser = new User({
      name: 'Normal User',
      email: 'normal_test@example.com',
      password: 'password123',
      role: 'user',
      isVerified: true
    });
    await normalUser.save();

    // Create a new movie for the normal review
    const normalMovie = new Movie({
      title: 'Normal Movie',
      description: 'This is a movie with normal reviews',
      releaseDate: new Date('2023-04-01'),
      duration: 115,
      genre: ['Romance'],
      director: 'Romance Director',
      cast: ['Actor 5'],
      poster: 'https://example.com/poster4.jpg',
      trailer: 'https://example.com/trailer4',
      status: 'Now Playing',
      rating: 7.5,
      language: 'English',
      country: 'USA',
      ageRating: 'PG-13',
      isActive: true
    });
    await normalMovie.save();

    // Create a non-reported review
    await Review.create({
      user: normalUser._id,
      movie: normalMovie._id,
      rating: 8,
      title: 'Normal Review',
      comment: 'This review is not reported',
      isApproved: true,
      isReported: false
    });

    // Test findReported method
    const reportedReviews = await Review.findReported();

    expect(reportedReviews).toHaveLength(1);
    expect(reportedReviews[0].isReported).toBe(true);
    expect(reportedReviews[0].title).toBe('Reported Review');
  });

  // Test virtual property netLikes
  it('should calculate net likes correctly', async () => {
    const review = new Review({
      user: user._id,
      movie: movie._id,
      ...reviewData,
      likes: 10,
      dislikes: 3
    });

    expect(review.netLikes).toBe(7);
  });
});
