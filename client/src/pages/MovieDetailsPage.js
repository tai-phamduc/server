import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaPlay, FaCalendarAlt, FaClock, FaFilm, FaUser, FaStar, FaShare, FaFacebook, FaTwitter, FaPinterest, FaMapMarkerAlt, FaLanguage, FaTicketAlt, FaArrowLeft, FaRobot, FaChartLine } from 'react-icons/fa';
import { movieService } from '../services/api';
import SimilarMovies from '../components/recommendations/SimilarMovies';
import SentimentAnalysis from '../components/ai/SentimentAnalysis';
import MovieTrendPrediction from '../components/analytics/MovieTrendPrediction';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieData = await movieService.getMovieById(id);
        setMovie(movieData);

        // Fetch similar movies based on genre
        if (movieData.genres && movieData.genres.length > 0) {
          const genreId = movieData.genres[0]._id;
          const similarMoviesData = await movieService.getMoviesByGenre(genreId);
          // Filter out the current movie and limit to 3
          const filteredMovies = similarMoviesData
            .filter(m => m._id !== id)
            .slice(0, 3);
          setSimilarMovies(filteredMovies);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Go back function
  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="bg-dark min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="container">
          <div className="bg-red-900 text-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={goBack}
              className="mt-4 flex items-center text-white hover:text-primary"
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="container">
          <div className="bg-secondary text-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Movie Not Found</h2>
            <p>The movie you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={goBack}
              className="mt-4 flex items-center text-white hover:text-primary"
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-900">
        {/* Background Image with Parallax Effect */}
        {movie.backdrop && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover transform scale-110 motion-safe:animate-subtle-zoom"
              loading="eager"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/1920x1080/1A202C/FFFFFF?text=${encodeURIComponent(movie.title)}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
          </div>
        )}

        <div className="container relative h-full flex items-center z-10 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Movie Poster with Animation */}
            <div className="hidden md:block transform hover:scale-105 transition-transform duration-300">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-[450px] w-auto rounded-lg shadow-2xl object-cover border-4 border-gray-800"
                  loading="eager"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/500x750/1A202C/FFFFFF?text=${encodeURIComponent(movie.title)}`;
                  }}
                />
              ) : (
                <div className="h-[450px] w-[300px] bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center">
                  <span className="text-gray-600 text-xl">{movie.title}</span>
                </div>
              )}
            </div>

            {/* Movie Info with Better Typography */}
            <div className="md:col-span-2">
              <button
                onClick={goBack}
                className="mb-4 flex items-center text-white hover:text-primary transition-colors"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-primary text-white px-3 py-1 rounded-md font-medium">
                  {movie.status || 'Now Playing'}
                </span>
                {movie.rating && (
                  <div className="flex items-center bg-yellow-900/50 text-yellow-400 px-3 py-1 rounded-md">
                    <FaStar className="mr-1" />
                    <span className="font-medium">{movie.rating}/10</span>
                  </div>
                )}
                {movie.mpaaRating && (
                  <span className="bg-gray-700 text-white px-3 py-1 rounded-md font-medium">
                    {movie.mpaaRating}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4">"{movie.tagline}"</p>
              )}

              <div className="flex flex-wrap items-center text-gray-300 mb-6 gap-4">
                {movie.releaseDate && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-primary" />
                    <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-primary" />
                    <span>{movie.duration} min</span>
                  </div>
                )}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex items-center flex-wrap gap-2">
                    <FaFilm className="mr-2 text-primary" />
                    {movie.genres.map((genre, index) => (
                      <span key={index} className="bg-gray-800 px-2 py-1 rounded text-sm">
                        {typeof genre === 'string' ? genre : genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg mb-6 backdrop-blur-sm">
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                {movie.trailerUrl && (
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary flex items-center hover:bg-gray-700 transition-colors"
                  >
                    <FaPlay className="mr-2" /> Watch Trailer
                  </a>
                )}
                <Link to={`/booking/${movie._id}`} className="btn btn-primary flex items-center hover:bg-red-700 transition-colors">
                  <FaTicketAlt className="mr-2" /> Get Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Details */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold">Movie Details</h2>
                <div className="ml-4 h-px bg-gradient-to-r from-primary to-transparent flex-grow"></div>
              </div>

              {/* Movie Info Card */}
              <div className="bg-secondary p-6 rounded-lg mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="inline-block w-1 h-6 bg-primary mr-3"></span>
                  Synopsis
                </h3>
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {movie.description || 'No description available.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {movie.directors && movie.directors.length > 0 && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">Director:</h4>
                        <div className="flex flex-wrap gap-2">
                          {movie.directors.map((director, idx) => (
                            <span key={idx} className="inline-flex items-center">
                              <FaUser className="mr-1 text-gray-400" size={14} />
                              {director.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {movie.writers && movie.writers.length > 0 && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">Writers:</h4>
                        <div className="flex flex-wrap gap-2">
                          {movie.writers.map((writer, idx) => (
                            <span key={idx} className="inline-flex items-center">
                              <FaUser className="mr-1 text-gray-400" size={14} />
                              {writer.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {movie.releaseDate && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">Release Date:</h4>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    )}

                    {movie.genres && movie.genres.length > 0 && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">Genres:</h4>
                        <div className="flex flex-wrap gap-2">
                          {movie.genres.map((genre, idx) => (
                            <span key={idx} className="bg-gray-700 text-white px-2 py-1 rounded-md text-sm">
                              {typeof genre === 'string' ? genre : genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {movie.language && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">Language:</h4>
                        <div className="flex items-center">
                          <FaLanguage className="mr-2 text-gray-400" />
                          <span>{movie.language}</span>
                        </div>
                      </div>
                    )}

                    {movie.country && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">Country:</h4>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-gray-400" />
                          <span>{movie.country}</span>
                        </div>
                      </div>
                    )}

                    {movie.duration && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">Duration:</h4>
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-gray-400" />
                          <span>{movie.duration} min</span>
                        </div>
                      </div>
                    )}

                    {movie.budget && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">Budget:</h4>
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-400">$</span>
                          <span>{movie.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {movie.rating && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">Rating:</h4>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={`${
                                  star <= Math.round(movie.rating / 2) ? 'text-yellow-400' : 'text-gray-500'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-yellow-400 font-bold">{movie.rating}/10</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cast Section with Improved Layout */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="bg-secondary p-6 rounded-lg mb-8 shadow-lg">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="inline-block w-1 h-6 bg-primary mr-3"></span>
                    Cast
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movie.cast.map((actor, index) => (
                      <div key={index} className="text-center group">
                        <div className="relative overflow-hidden rounded-lg mb-3">
                          {actor.photo ? (
                            <img
                              src={actor.photo}
                              alt={actor.name}
                              className="h-40 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/300x450/1A202C/FFFFFF?text=${encodeURIComponent(actor.name)}`;
                              }}
                            />
                          ) : (
                            <div className="h-40 w-full bg-gray-700 flex items-center justify-center">
                              <FaUser size={32} className="text-gray-500" />
                            </div>
                          )}
                          {actor.character && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              as {actor.character}
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm">{actor.name}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section with Better UI */}
              <div className="bg-secondary p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <span className="inline-block w-1 h-6 bg-primary mr-3"></span>
                    Reviews
                  </h3>
                  <Link to={`/movies/${movie._id}/reviews`} className="text-primary hover:text-red-400 transition-colors flex items-center">
                    See all reviews
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`${
                              star <= Math.round(movie.rating / 2) ? 'text-yellow-400' : 'text-gray-500'
                            }`}
                            size={20}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium">{movie.rating}/10</span>
                    </div>
                    <span className="text-gray-400">{movie.reviews?.length || 0} reviews</span>
                  </div>

                  <Link
                    to={`/review/create/${movie._id}`}
                    className="w-full bg-primary hover:bg-red-700 text-white py-2 rounded-md flex items-center justify-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Write a Review
                  </Link>
                </div>

                {movie.reviews && movie.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {movie.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                              {review.user?.avatar ? (
                                <img src={review.user.avatar} alt={review.user?.name} className="w-10 h-10 rounded-full" />
                              ) : (
                                <FaUser className="text-gray-500" />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold block">{review.user?.name || 'Anonymous'}</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    className={`${
                                      star <= Math.round(review.rating / 2) ? 'text-yellow-400' : 'text-gray-500'
                                    }`}
                                    size={12}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-medium mb-2">{review.title || 'Review'}</h4>
                        <p className="text-gray-300 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/30 p-6 rounded-lg text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <p className="text-gray-400">No reviews yet. Be the first to review this movie!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - AI-Powered Similar Movies */}
            <div>
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold mr-2">AI Insights</h2>
                <FaRobot className="text-primary" />
                <div className="ml-4 h-px bg-gradient-to-r from-primary to-transparent flex-grow"></div>
              </div>

              {/* Similar Movies Card */}
              <div className="bg-secondary p-6 rounded-lg mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="inline-block w-1 h-6 bg-blue-500 mr-3"></span>
                  <span>Similar Movies</span>
                  <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">AI Powered</span>
                </h3>

                <SimilarMovies movieId={id} limit={3} />
              </div>

              {/* AI Sentiment Analysis */}
              {movie.reviews && movie.reviews.length > 0 && (
                <div className="bg-secondary p-6 rounded-lg mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="inline-block w-1 h-6 bg-green-500 mr-3"></span>
                    <span>Audience Sentiment</span>
                    <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">AI Powered</span>
                  </h3>
                  <SentimentAnalysis reviews={movie.reviews} />
                </div>
              )}

              {/* AI Trend Prediction */}
              <div className="bg-secondary p-6 rounded-lg mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="inline-block w-1 h-6 bg-purple-500 mr-3"></span>
                  <FaChartLine className="mr-2 text-purple-500" />
                  <span>Box Office Prediction</span>
                  <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">AI Powered</span>
                </h3>

                <MovieTrendPrediction movieId={id} />
              </div>

              {/* Media Gallery */}
              {movie.gallery && movie.gallery.length > 0 && (
                <div className="bg-secondary p-6 rounded-lg mb-8 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="inline-block w-1 h-6 bg-yellow-500 mr-3"></span>
                    <span>Gallery</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {movie.gallery.slice(0, 4).map((image, index) => (
                      <div key={index} className="relative overflow-hidden rounded-lg group h-24">
                        <img
                          src={image}
                          alt={`${movie.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/400x300/1A202C/FFFFFF?text=Gallery+${index+1}`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {movie.gallery.length > 4 && (
                    <div className="text-center mt-3">
                      <button className="text-primary hover:text-red-400 transition-colors text-sm">
                        View all {movie.gallery.length} photos
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Share Section */}
              <div className="bg-secondary p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="inline-block w-1 h-6 bg-blue-400 mr-3"></span>
                  <span>Share</span>
                </h3>
                <div className="flex space-x-4">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                  >
                    <FaFacebook size={20} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=Check out ${movie.title}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full transition-colors"
                  >
                    <FaTwitter size={20} />
                  </a>
                  <a
                    href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(movie.poster)}&description=${encodeURIComponent(movie.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                  >
                    <FaPinterest size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Booking CTA */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          {movie.backdrop ? (
            <img
              src={movie.backdrop}
              alt="Background"
              className="w-full h-full object-cover opacity-20 blur-sm"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-red-700/90"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto bg-gray-900/80 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-800">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left side - Movie poster and basic info */}
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <img
                    src={movie.poster || `https://via.placeholder.com/300x450/1A202C/FFFFFF?text=${encodeURIComponent(movie.title)}`}
                    alt={movie.title}
                    className="w-full h-auto rounded-lg shadow-lg transform rotate-1 border-4 border-white/10"
                  />
                  {movie.rating && (
                    <div className="absolute -top-3 -right-3 bg-yellow-500 text-gray-900 font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-gray-900">
                      {movie.rating}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {movie.duration && (
                    <div className="flex items-center text-gray-300">
                      <FaClock className="mr-2 text-primary" />
                      <span>{movie.duration} min</span>
                    </div>
                  )}
                  {movie.mpaaRating && (
                    <div className="inline-block bg-gray-800 px-2 py-1 rounded text-sm text-white">
                      {movie.mpaaRating}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - Booking info */}
              <div className="w-full md:w-2/3 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Book Your Tickets</h2>
                <h3 className="text-xl md:text-2xl font-semibold mb-6 text-primary">{movie.title}</h3>

                <p className="text-gray-300 mb-8">
                  Don't miss the chance to watch this amazing movie on the big screen. Book your tickets now and enjoy the movie with your friends and family.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-primary mr-2" />
                      <span className="text-white">Available Now</span>
                    </div>

                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-primary mr-2" />
                      <span className="text-white">Multiple Theaters</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">Premium Seating</span>
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">IMAX Available</span>
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">Dolby Atmos</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    to={`/booking/${movie._id}`}
                    className="btn bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 font-bold"
                  >
                    <FaTicketAlt className="mr-2" /> Book Tickets
                  </Link>

                  {movie.trailerUrl && (
                    <a
                      href={movie.trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                    >
                      <FaPlay className="mr-2" /> Watch Trailer
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetailsPage;
