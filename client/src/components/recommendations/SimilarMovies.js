import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaPlay } from 'react-icons/fa';
import { aiService } from '../../services/aiService';

const SimilarMovies = ({ movieId, limit = 4 }) => {
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      try {
        setLoading(true);
        const data = await aiService.getSimilarMovies(movieId, limit);
        setSimilarMovies(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching similar movies:', err);
        setError('Failed to load similar movies');
        setLoading(false);
      }
    };

    if (movieId) {
      fetchSimilarMovies();
    }
  }, [movieId, limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (similarMovies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No similar movies found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {similarMovies.map((movie) => (
        <div key={movie._id} className="bg-dark rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
          <div className="relative">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded flex items-center">
              <FaStar className="mr-1" />
              {movie.rating || '4.5'}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Link to={`/movies/${movie._id}`} className="bg-primary text-white rounded-full p-3">
                <FaPlay />
              </Link>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 line-clamp-1">{movie.title}</h3>
            <div className="flex items-center text-gray-400 text-sm mb-2">
              <span className="line-clamp-1">
                {movie.genres?.join(', ') || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{movie.duration} min</span>
              <Link to={`/movies/${movie._id}`} className="text-primary hover:underline text-sm">
                Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimilarMovies;
