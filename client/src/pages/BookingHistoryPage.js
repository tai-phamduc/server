import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaHome, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCouch, FaTicketAlt, FaChartBar } from 'react-icons/fa';
import { bookingService } from '../services/api';
import { formatDate, formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BookingHistoryStats from '../components/bookings/BookingHistoryStats';

const BookingHistoryPage = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getDetailedBookingHistory();
        setBookingHistory(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking history:', error);
        setError('Failed to load booking history. Please try again later.');
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, []);

  const fetchStats = async () => {
    if (stats) {
      setShowStats(!showStats);
      return;
    }

    try {
      setStatsLoading(true);
      const data = await bookingService.getBookingHistoryStats();
      setStats(data);
      setStatsLoading(false);
      setShowStats(true);
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      setError('Failed to load booking statistics. Please try again later.');
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="container mx-auto px-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-900 text-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <Link to="/" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/profile" className="text-gray-400 hover:text-white mr-4">
              <FaArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold">Booking History</h1>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={fetchStats} 
              className={`flex items-center px-4 py-2 rounded ${showStats ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              <FaChartBar className="mr-2" /> 
              {statsLoading ? 'Loading...' : (showStats ? 'Hide Stats' : 'View Stats')}
            </button>
            <Link to="/profile" className="text-gray-400 hover:text-white flex items-center">
              <FaUser className="mr-2" /> Profile
            </Link>
            <Link to="/" className="text-gray-400 hover:text-white flex items-center">
              <FaHome className="mr-2" /> Home
            </Link>
          </div>
        </div>

        {showStats && stats && (
          <BookingHistoryStats stats={stats} onClose={() => setShowStats(false)} />
        )}

        {bookingHistory.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <FaTicketAlt size={48} className="mx-auto mb-4 text-gray-500" />
            <h2 className="text-2xl font-bold mb-2">No Booking History</h2>
            <p className="text-gray-400 mb-6">You haven't made any bookings yet.</p>
            <Link to="/movies" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {bookingHistory.map((monthData, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-700 p-4">
                  <h2 className="text-xl font-bold">{monthData.month} {monthData.year}</h2>
                  <p className="text-gray-400">Total spent: {formatCurrency(monthData.totalSpent)}</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {monthData.bookings.map((booking) => (
                      <div key={booking._id} className="bg-gray-900 rounded-lg overflow-hidden flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-48 md:h-auto">
                          <img 
                            src={booking.moviePoster || 'https://via.placeholder.com/300x450/1A202C/FFFFFF?text=No+Poster'} 
                            alt={booking.movieTitle} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold">{booking.movieTitle}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              booking.bookingStatus === 'confirmed' ? 'bg-green-900 text-green-300' :
                              booking.bookingStatus === 'completed' ? 'bg-blue-900 text-blue-300' :
                              booking.bookingStatus === 'cancelled' ? 'bg-red-900 text-red-300' :
                              'bg-gray-700 text-gray-300'
                            }`}>
                              {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-400">
                              <FaCalendarAlt className="mr-2" />
                              {formatDate(booking.showtimeDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <FaClock className="mr-2" />
                              {booking.showtimeDisplay}
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <FaMapMarkerAlt className="mr-2" />
                              {booking.theaterName} • {booking.hall}
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <FaCouch className="mr-2" />
                              {booking.seats.join(', ')}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-400">Booked on {formatDate(booking.bookingDate)}</p>
                              <p className="font-bold">{formatCurrency(booking.totalPrice)}</p>
                            </div>
                            <Link 
                              to={`/booking/${booking._id}`} 
                              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                          
                          {booking.bookingStatus === 'cancelled' && (
                            <div className="mt-2 p-2 bg-gray-800 rounded">
                              <p className="text-sm text-gray-400">Cancelled on {formatDate(booking.cancellationDate)}</p>
                              {booking.refundStatus && (
                                <p className="text-sm">
                                  Refund: {formatCurrency(booking.refundAmount)} ({booking.refundPercentage}%)
                                  <span className="ml-2 px-2 py-0.5 bg-green-900 text-green-300 rounded-full text-xs">
                                    {booking.refundStatus}
                                  </span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
