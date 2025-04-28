import React from 'react';
import { FaTimes, FaTicketAlt, FaDollarSign, FaFilm, FaTheaterMasks, FaBuilding } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';

const BookingHistoryStats = ({ stats, onClose }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
        aria-label="Close stats"
      >
        <FaTimes size={20} />
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Your Booking Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Bookings */}
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-primary bg-opacity-20 p-3 rounded-full mr-4">
            <FaTicketAlt size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Bookings</p>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </div>
        </div>
        
        {/* Total Spent */}
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-green-500 bg-opacity-20 p-3 rounded-full mr-4">
            <FaDollarSign size={24} className="text-green-500" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
          </div>
        </div>
        
        {/* Average Per Booking */}
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full mr-4">
            <FaTicketAlt size={24} className="text-blue-500" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Average Per Booking</p>
            <p className="text-2xl font-bold">
              {stats.totalBookings > 0 
                ? formatCurrency(stats.totalSpent / stats.totalBookings) 
                : formatCurrency(0)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Favorite Genres */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <FaTheaterMasks size={20} className="mr-2 text-purple-400" />
            <h3 className="text-lg font-bold">Favorite Genres</h3>
          </div>
          
          {stats.favoriteGenres && stats.favoriteGenres.length > 0 ? (
            <ul className="space-y-2">
              {stats.favoriteGenres.slice(0, 5).map((genre, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{genre.name}</span>
                  <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded text-xs">
                    {genre.count} {genre.count === 1 ? 'movie' : 'movies'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No genre data available</p>
          )}
        </div>
        
        {/* Favorite Theaters */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <FaBuilding size={20} className="mr-2 text-blue-400" />
            <h3 className="text-lg font-bold">Favorite Theaters</h3>
          </div>
          
          {stats.favoriteTheaters && stats.favoriteTheaters.length > 0 ? (
            <ul className="space-y-2">
              {stats.favoriteTheaters.map((theater, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{theater.name}</span>
                  <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                    {theater.count} {theater.count === 1 ? 'visit' : 'visits'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No theater data available</p>
          )}
        </div>
      </div>
      
      {/* Most Watched Movies */}
      <div className="mt-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <FaFilm size={20} className="mr-2 text-red-400" />
            <h3 className="text-lg font-bold">Most Watched Movies</h3>
          </div>
          
          {stats.mostWatchedMovies && stats.mostWatchedMovies.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.mostWatchedMovies.map((movie, index) => (
                <li key={index} className="bg-gray-800 p-3 rounded flex justify-between items-center">
                  <span>{movie.title}</span>
                  <span className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs">
                    {movie.count} {movie.count === 1 ? 'time' : 'times'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No movie data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryStats;
