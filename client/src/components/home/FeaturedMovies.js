import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaClock, FaFilm } from 'react-icons/fa';
import { movieService } from '../../services/api';

const FeaturedMovies = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getFeaturedMovies();
        setFeaturedMovies(data.slice(0, 5)); // Get only the first 5 featured movies
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured movies:', err);
        setError('Failed to load featured movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main featured movie skeleton */}
        <div className="bg-secondary rounded-lg overflow-hidden shadow-lg animate-pulse">
          <div className="h-96 bg-gray-700"></div>
          <div className="p-6">
            <div className="h-8 bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="flex items-center mb-4">
              <div className="h-4 bg-gray-700 rounded w-1/4 mr-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/5"></div>
            </div>
            <div className="flex space-x-4">
              <div className="h-10 bg-gray-700 rounded w-1/3"></div>
              <div className="h-10 bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </div>

        {/* Secondary featured movies skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-secondary rounded-lg overflow-hidden shadow-lg animate-pulse">
              <div className="h-40 bg-gray-700"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="flex items-center mb-2">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mr-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-1/4 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 text-white p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (featuredMovies.length === 0) {
    return (
      <div className="bg-secondary text-white p-4 rounded-lg">
        <p>No featured movies available at the moment. Check back soon!</p>
      </div>
    );
  }

  const mainMovie = featuredMovies[0];
  const secondaryMovies = featuredMovies.slice(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main featured movie */}
      <div className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
        <div className="h-96 bg-gray-700 relative">
          {mainMovie.poster && (
            <img
              src={mainMovie.poster}
              alt={mainMovie.title}
              className="w-full h-full object-cover"
            />
          )}
          {mainMovie.rating && (
            <div className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-2 py-1 rounded flex items-center">
              <FaStar className="mr-1" />
              {mainMovie.rating}
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{mainMovie.title}</h3>
          <div className="flex items-center text-gray-400 mb-4">
            <div className="flex items-center mr-4">
              <FaFilm className="mr-1" />
              <span>{mainMovie.genres?.join(', ') || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-1" />
              <span>{mainMovie.duration ? `${mainMovie.duration} min` : 'N/A'}</span>
            </div>
          </div>
          <div className="flex flex-wrap space-x-4">
            {mainMovie.trailer && (
              <a href={mainMovie.trailer} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex items-center mb-2">
                <FaPlay className="mr-2" /> Watch Trailer
              </a>
            )}
            <Link to={`/movies/${mainMovie._id}`} className="btn btn-secondary mb-2">
              Get Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary featured movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secondaryMovies.map((movie) => (
          <div key={movie._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
            <div className="h-40 bg-gray-700 relative">
              {movie.poster && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              )}
              {movie.rating && (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center">
                  <FaStar className="mr-0.5 text-xs" />
                  {movie.rating}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">{movie.title}</h3>
              <div className="flex items-center text-gray-400 mb-2 text-sm">
                <div className="flex items-center mr-2">
                  <FaFilm className="mr-1" />
                  <span className="line-clamp-1">{movie.genres?.join(', ') || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{movie.duration ? `${movie.duration} min` : 'N/A'}</span>
                </div>
              </div>
              <Link to={`/movies/${movie._id}`} className="text-primary hover:underline text-sm">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedMovies;
