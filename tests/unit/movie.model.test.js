const mongoose = require('mongoose');
const Movie = require('../../models/Movie');

// Import test setup
require('../setup');

describe('Movie Model', () => {
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

  // Test creating a movie
  it('should create a new movie', async () => {
    const movie = new Movie(movieData);
    const savedMovie = await movie.save();

    expect(savedMovie._id).toBeDefined();
    expect(savedMovie.title).toBe(movieData.title);
    expect(savedMovie.description).toBe(movieData.description);
    expect(savedMovie.duration).toBe(movieData.duration);
    expect(savedMovie.genre).toEqual(expect.arrayContaining(movieData.genre));
    expect(savedMovie.status).toBe(movieData.status);
    expect(savedMovie.rating).toBe(movieData.rating);
  });

  // Test static method findNowPlaying
  it('should find now playing movies', async () => {
    // Create test movies
    await Movie.create({
      ...movieData,
      title: 'Now Playing Movie 1',
      status: 'Now Playing'
    });

    await Movie.create({
      ...movieData,
      title: 'Now Playing Movie 2',
      status: 'Now Playing'
    });

    await Movie.create({
      ...movieData,
      title: 'Coming Soon Movie',
      status: 'Coming Soon'
    });

    // Test findNowPlaying method
    const nowPlayingMovies = await Movie.findNowPlaying();

    expect(nowPlayingMovies).toHaveLength(2);
    expect(nowPlayingMovies[0].status).toBe('Now Playing');
    expect(nowPlayingMovies[1].status).toBe('Now Playing');
  });

  // Test static method findComingSoon
  it('should find coming soon movies', async () => {
    // Create test movies
    await Movie.create({
      ...movieData,
      title: 'Coming Soon Movie 1',
      status: 'Coming Soon'
    });

    await Movie.create({
      ...movieData,
      title: 'Now Playing Movie',
      status: 'Now Playing'
    });

    // Test findComingSoon method
    const comingSoonMovies = await Movie.findComingSoon();

    expect(comingSoonMovies).toHaveLength(1);
    expect(comingSoonMovies[0].status).toBe('Coming Soon');
    expect(comingSoonMovies[0].title).toBe('Coming Soon Movie 1');
  });

  // Test static method findFeatured
  it('should find featured movies', async () => {
    // Create test movies
    await Movie.create({
      ...movieData,
      title: 'Featured Movie 1',
      status: 'Featured'
    });

    await Movie.create({
      ...movieData,
      title: 'Featured Movie 2',
      status: 'Featured'
    });

    await Movie.create({
      ...movieData,
      title: 'Now Playing Movie',
      status: 'Now Playing'
    });

    // Test findFeatured method
    const featuredMovies = await Movie.findFeatured();

    expect(featuredMovies).toHaveLength(2);
    expect(featuredMovies[0].status).toBe('Featured');
    expect(featuredMovies[1].status).toBe('Featured');
  });

  // Test static method findByGenre
  it('should find movies by genre', async () => {
    // Create test movies
    await Movie.create({
      ...movieData,
      title: 'Action Movie',
      genre: ['Action', 'Thriller']
    });

    await Movie.create({
      ...movieData,
      title: 'Comedy Movie',
      genre: ['Comedy']
    });

    await Movie.create({
      ...movieData,
      title: 'Action Comedy',
      genre: ['Action', 'Comedy']
    });

    // Test findByGenre method
    const actionMovies = await Movie.findByGenre('Action');

    expect(actionMovies).toHaveLength(2);
    expect(actionMovies[0].genre).toEqual(expect.arrayContaining(['Action']));
    expect(actionMovies[1].genre).toEqual(expect.arrayContaining(['Action']));
  });

  // Test static method findTopRated
  it('should find top rated movies', async () => {
    // Create test movies
    const highRatedMovie = await Movie.create({
      ...movieData,
      title: 'High Rated Movie',
      rating: 9.5,
      reviewCount: 10,
      totalRating: 95
    });

    const mediumRatedMovie = await Movie.create({
      ...movieData,
      title: 'Medium Rated Movie',
      rating: 7.5,
      reviewCount: 8,
      totalRating: 60
    });

    const lowRatedMovie = await Movie.create({
      ...movieData,
      title: 'Low Rated Movie',
      rating: 5.5,
      reviewCount: 6,
      totalRating: 33
    });

    // Test findTopRated method with limit
    const topRatedMovies = await Movie.findTopRated(2);

    expect(topRatedMovies).toHaveLength(2);
    expect(topRatedMovies[0].rating).toBe(9.5);
    expect(topRatedMovies[1].rating).toBe(7.5);
  });

  // Test virtual property averageRating
  it('should calculate average rating correctly', async () => {
    const movie = new Movie({
      ...movieData,
      reviewCount: 2,
      totalRating: 17 // 8.5 average
    });

    expect(movie.averageRating).toBe('8.5');
  });
});
