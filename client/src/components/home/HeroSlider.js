import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaTicketAlt } from 'react-icons/fa';
import { movieService } from '../../services/api';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getMoviesByStatus('Featured');
        // Get only the first 3 featured movies for the slider
        setSlides(data.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured movies for slider:', err);
        setError('Failed to load featured movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) {
    return (
      <div className="relative h-[600px] bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded-md w-32 mx-auto mb-4"></div>
          <div className="h-16 bg-gray-800 rounded-md w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-800 rounded-md w-64 mx-auto mb-6"></div>
          <div className="flex justify-center gap-4">
            <div className="h-12 bg-gray-800 rounded-md w-32"></div>
            <div className="h-12 bg-gray-800 rounded-md w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-[600px] bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900 text-white p-6 rounded-lg max-w-md text-center">
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[600px] bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-3xl px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Welcome to MovieHub</h2>
          <p className="text-gray-300 mb-6">
            Book your favorite movies online
          </p>
          <Link to="/movies" className="btn btn-primary">
            Explore Movies
          </Link>
        </div>
      </div>
    );
  }

  const currentMovie = slides[currentSlide];

  return (
    <div className="relative h-[600px] bg-gray-900 overflow-hidden">
      {/* Background image */}
      {currentMovie.backdrop && (
        <div className="absolute inset-0">
          <img
            src={currentMovie.backdrop || currentMovie.poster}
            alt={currentMovie.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
      )}

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-primary' : 'bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-3xl px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-block bg-primary text-white px-3 py-1 rounded-md">
              {currentMovie.status || 'Featured'}
            </span>
            {currentMovie.rating && (
              <span className="inline-flex items-center bg-secondary text-white px-3 py-1 rounded-md">
                <FaStar className="mr-1" />
                {currentMovie.rating}
              </span>
            )}
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-4">{currentMovie.title}</h2>

          <p className="text-gray-300 mb-6">
            {currentMovie.directors?.map(d => d.name).join(', ') || 'Unknown Director'} / {currentMovie.country || 'N/A'} / {new Date(currentMovie.releaseDate).getFullYear() || 'N/A'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={`/movies/${currentMovie._id}`} className="btn btn-secondary">
              More Info
            </Link>
            <Link to={`/booking/${currentMovie._id}`} className="btn btn-primary flex items-center justify-center">
              <FaTicketAlt className="mr-2" />
              Get Ticket
            </Link>
            {currentMovie.trailerUrl && (
              <Link to={currentMovie.trailerUrl} target="_blank" className="btn btn-outline flex items-center justify-center">
                <FaPlay className="mr-2" />
                Watch Trailer
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
