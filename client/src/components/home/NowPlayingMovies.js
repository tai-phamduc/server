import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../../services/api';
import { FaClock, FaFilm } from 'react-icons/fa';

const NowPlayingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getMoviesByStatus('Now Playing');
        setMovies(data.slice(0, 4)); // Get only the first 4 movies
        setLoading(false);
      } catch (err) {
        console.error('Error fetching now playing movies:', err);
        setError('Failed to load movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-secondary rounded-lg overflow-hidden shadow-lg animate-pulse">
            <div className="h-64 bg-gray-700"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-10 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
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

  if (movies.length === 0) {
    return (
      <div className="bg-secondary text-white p-4 rounded-lg">
        <p>No movies currently playing. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div key={movie._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
          <div className="h-64 bg-gray-700 relative">
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
            {movie.rating && (
              <div className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-2 py-1 rounded">
                {movie.rating}
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 line-clamp-1">{movie.title}</h3>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-sm text-gray-400">
                <FaFilm className="mr-1" />
                <span className="line-clamp-1">
                  {movie.genres?.join(', ') || 'N/A'}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FaClock className="mr-1" />
                <span>{movie.duration ? `${movie.duration} min` : 'N/A'}</span>
              </div>
            </div>
            <Link to={`/movies/${movie._id}`} className="btn btn-primary w-full">
              Get Ticket
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NowPlayingMovies;
