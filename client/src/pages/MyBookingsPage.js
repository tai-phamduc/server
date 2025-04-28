import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaInfoCircle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCouch, FaArrowLeft } from 'react-icons/fa';
import { bookingService, authService } from '../services/api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'past', 'cancelled'

  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getUserBookings();

        // If API returns empty array, use mock data for development
        if (data.length === 0 && process.env.NODE_ENV === 'development') {
          // Generate mock data
          const now = new Date();
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);

          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);

          const nextWeek = new Date(now);
          nextWeek.setDate(now.getDate() + 7);

          const mockBookings = [
            {
              _id: '1',
              movieTitle: 'Inception',
              moviePoster: 'https://via.placeholder.com/300x450/1A202C/FFFFFF?text=Inception',
              showtimeDate: tomorrow.toISOString(),
              showtimeDisplay: '7:30 PM',
              theaterName: 'Cinema City',
              hall: 'Hall 1',
              seats: ['A1', 'A2'],
              totalPrice: 25.98,
              bookingStatus: 'confirmed',
              bookingDate: now.toISOString()
            },
            {
              _id: '2',
              movieTitle: 'The Dark Knight',
              moviePoster: 'https://via.placeholder.com/300x450/1A202C/FFFFFF?text=Dark+Knight',
              showtimeDate: nextWeek.toISOString(),
              showtimeDisplay: '8:00 PM',
              theaterName: 'Royal Theater',
              hall: 'IMAX',
              seats: ['C4', 'C5', 'C6'],
              totalPrice: 45.99,
              bookingStatus: 'confirmed',
              bookingDate: now.toISOString()
            },
            {
              _id: '3',
              movieTitle: 'Interstellar',
              moviePoster: 'https://via.placeholder.com/300x450/1A202C/FFFFFF?text=Interstellar',
              showtimeDate: yesterday.toISOString(),
              showtimeDisplay: '6:15 PM',
              theaterName: 'Starlight Cinema',
              hall: 'Hall 3',
              seats: ['F7', 'F8'],
              totalPrice: 22.50,
              bookingStatus: 'completed',
              bookingDate: new Date(now.setDate(now.getDate() - 3)).toISOString()
            },
            {
              _id: '4',
              movieTitle: 'The Matrix',
              moviePoster: 'https://via.placeholder.com/300x450/1A202C/FFFFFF?text=Matrix',
              showtimeDate: new Date(now.setDate(now.getDate() - 5)).toISOString(),
              showtimeDisplay: '9:00 PM',
              theaterName: 'Cinema City',
              hall: '4DX',
              seats: ['D10', 'D11'],
              totalPrice: 32.99,
              bookingStatus: 'cancelled',
              cancellationDate: new Date(now.setDate(now.getDate() - 4)).toISOString(),
              refundStatus: 'completed',
              refundAmount: 29.69,
              refundPercentage: 90,
              bookingDate: new Date(now.setDate(now.getDate() - 7)).toISOString()
            },
            {
              _id: '5',
              movieTitle: 'Dune',
              moviePoster: 'https://via.placeholder.com/300x450/1A202C/FFFFFF?text=Dune',
              showtimeDate: new Date(now.setDate(now.getDate() + 10)).toISOString(),
              showtimeDisplay: '5:45 PM',
              theaterName: 'Royal Theater',
              hall: 'Dolby Atmos',
              seats: ['H3', 'H4', 'H5', 'H6'],
              totalPrice: 52.00,
              bookingStatus: 'confirmed',
              bookingDate: now.toISOString()
            }
          ];

          setBookings(mockBookings);
        } else {
          setBookings(data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, currentUser]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
    setCancelReason('');
    setCancelSuccess(null);
    setCancelError(null);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;

    try {
      setCancelLoading(true);
      const result = await bookingService.cancelBooking(selectedBooking._id, { reason: cancelReason });

      // Update the booking in the list
      setBookings(bookings.map(booking =>
        booking._id === selectedBooking._id
          ? {
              ...booking,
              bookingStatus: 'cancelled',
              cancellationDate: new Date().toISOString(),
              refundStatus: result.refundStatus || 'pending',
              refundAmount: result.refundAmount || 0,
              refundPercentage: result.refundPercentage || 0
            }
          : booking
      ));

      setCancelSuccess(result.message);
      setCancelLoading(false);

      // Close modal after a delay
      setTimeout(() => {
        setShowCancelModal(false);
        setSelectedBooking(null);
      }, 3000);
    } catch (err) {
      console.error('Error cancelling booking:', err);

      // Handle different error types
      let errorMessage = 'Failed to cancel booking. Please try again later.';

      if (err.code) {
        // This is our custom error format from the API service
        switch (err.code) {
          case 'NETWORK_ERROR':
            errorMessage = 'Network error. Please check your connection and try again.';
            break;
          case 'BOOKING_NOT_FOUND':
            errorMessage = 'Booking not found. It may have been already cancelled.';
            break;
          case 'INVALID_REQUEST':
            errorMessage = err.message || 'This booking cannot be cancelled.';
            break;
          case 'BOOKING_CONFLICT':
            errorMessage = 'This booking cannot be cancelled as it has already been processed.';
            break;
          default:
            errorMessage = err.message || errorMessage;
        }
      } else if (err.response?.data?.message) {
        // Standard API error
        errorMessage = err.response.data.message;
      }

      setCancelError(errorMessage);
      setCancelLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const showtime = new Date(booking.showtimeDate);
    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return booking.bookingStatus !== 'cancelled' && showtime > now;
      case 'past':
        return booking.bookingStatus !== 'cancelled' && showtime <= now;
      case 'cancelled':
        return booking.bookingStatus === 'cancelled';
      default: // 'all'
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container">
        <div className="flex items-center mb-8">
          <Link to="/profile" className="text-gray-400 hover:text-white mr-4">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">My Bookings</h1>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto pb-1">
          <button
            className={`px-4 py-2 font-medium text-sm mr-4 ${
              activeTab === 'all'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm mr-4 ${
              activeTab === 'upcoming'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm mr-4 ${
              activeTab === 'past'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'cancelled'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-secondary p-8 rounded-lg text-center">
            <FaTicketAlt className="text-primary text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Bookings Found</h2>
            <p className="text-gray-400 mb-6">
              {activeTab === 'all'
                ? "You haven't booked any tickets yet."
                : activeTab === 'upcoming'
                ? "You don't have any upcoming bookings."
                : activeTab === 'past'
                ? "You don't have any past bookings."
                : "You don't have any cancelled bookings."}
            </p>
            <Link to="/movies" className="btn btn-primary">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className={`bg-secondary rounded-lg overflow-hidden shadow-lg ${
                  booking.bookingStatus === 'cancelled' ? 'opacity-75' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 bg-gray-800 h-48 md:h-auto">
                    {booking.moviePoster ? (
                      <img
                        src={booking.moviePoster}
                        alt={booking.movieTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <FaTicketAlt className="text-4xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-2/3 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{booking.movieTitle}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        booking.bookingStatus === 'confirmed' ? 'bg-green-800 text-green-100' :
                        booking.bookingStatus === 'cancelled' ? 'bg-red-800 text-red-100' :
                        booking.bookingStatus === 'pending' ? 'bg-yellow-800 text-yellow-100' :
                        'bg-blue-800 text-blue-100'
                      }`}>
                        {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <FaCalendarAlt className="mr-2" />
                        <span>{formatDate(booking.showtimeDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <FaClock className="mr-2" />
                        <span>{booking.showtimeDisplay || formatTime(booking.showtimeDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{booking.theaterName}, {booking.hall}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <FaCouch className="mr-2" />
                        <span>Seats: {booking.seats.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">${booking.totalPrice?.toFixed(2) || '0.00'}</span>

                        {/* Show refund info for cancelled bookings */}
                        {booking.bookingStatus === 'cancelled' && booking.refundAmount > 0 && (
                          <div className="text-sm text-green-400">
                            Refund: ${booking.refundAmount.toFixed(2)}
                            <span className="text-gray-400 ml-1">
                              ({booking.refundStatus === 'completed' ? 'Processed' :
                                booking.refundStatus === 'pending' ? 'Pending' :
                                booking.refundStatus === 'failed' ? 'Failed' :
                                booking.refundStatus})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {booking.bookingStatus !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelClick(booking)}
                            className="btn btn-sm btn-danger flex items-center"
                            disabled={booking.bookingStatus === 'completed'}
                          >
                            <FaTimesCircle className="mr-1" /> Cancel
                          </button>
                        )}
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="btn btn-sm btn-primary flex items-center"
                        >
                          <FaInfoCircle className="mr-1" /> Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>

            <p className="mb-4">
              Are you sure you want to cancel your booking for <strong>{selectedBooking.movieTitle}</strong>?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Reason for cancellation (optional)</label>
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                rows="3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
              ></textarea>
            </div>

            {cancelSuccess && (
              <div className="bg-green-900 text-green-100 p-3 rounded mb-4">
                {cancelSuccess}
              </div>
            )}

            {cancelError && (
              <div className="bg-red-900 text-red-100 p-3 rounded mb-4">
                {cancelError}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                Close
              </button>
              <button
                className="btn btn-danger"
                onClick={handleCancelConfirm}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  'Confirm Cancellation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
