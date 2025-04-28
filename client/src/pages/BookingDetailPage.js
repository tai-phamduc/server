import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaTicketAlt, FaQrcode, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCouch, FaTimesCircle, FaDownload, FaShareAlt } from 'react-icons/fa';
import { bookingService, authService } from '../services/api';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getBookingById(id);
        setBooking(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate, currentUser]);

  const handleCancelClick = () => {
    setShowCancelModal(true);
    setCancelReason('');
    setCancelSuccess(null);
    setCancelError(null);
  };

  const handleCancelConfirm = async () => {
    try {
      setCancelLoading(true);
      const result = await bookingService.cancelBooking(booking._id, { reason: cancelReason });

      // Update booking with all relevant cancellation details
      setBooking({
        ...booking,
        bookingStatus: 'cancelled',
        cancellationDate: new Date().toISOString(),
        refundStatus: result.refundStatus || 'pending',
        refundAmount: result.refundAmount || 0,
        refundPercentage: result.refundPercentage || 0,
        notes: cancelReason || booking.notes
      });

      setCancelSuccess(result.message);
      setCancelLoading(false);

      // Close modal after a delay
      setTimeout(() => {
        setShowCancelModal(false);
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
          case 'PERMISSION_DENIED':
            errorMessage = 'You do not have permission to cancel this booking.';
            break;
          case 'SERVER_ERROR':
            errorMessage = 'Server error. Please try again later or contact support.';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-dark py-12">
        <div className="container">
          <div className="bg-secondary p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error || 'Booking not found'}</p>
            <Link to="/my-tickets" className="btn btn-primary flex items-center w-fit">
              <FaArrowLeft className="mr-2" /> Back to My Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <Link to="/my-tickets" className="flex items-center text-gray-300 hover:text-primary mb-6">
            <FaArrowLeft className="mr-2" /> Back to My Tickets
          </Link>

          <div className="bg-secondary rounded-lg overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-gray-800 p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{booking.movieTitle}</h1>
                <span className={`text-sm px-3 py-1 rounded ${
                  booking.bookingStatus === 'confirmed' ? 'bg-green-800 text-green-100' :
                  booking.bookingStatus === 'cancelled' ? 'bg-red-800 text-red-100' :
                  booking.bookingStatus === 'pending' ? 'bg-yellow-800 text-yellow-100' :
                  'bg-blue-800 text-blue-100'
                }`}>
                  {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                </span>
              </div>

              <div className="flex items-center text-gray-400 text-sm">
                <span>Booking #: {booking.bookingNumber}</span>
                <span className="mx-2">•</span>
                <span>Booked on: {formatDate(booking.createdAt)}</span>
              </div>
            </div>

            {/* QR Code */}
            {booking.bookingStatus !== 'cancelled' && (
              <div className="p-6 flex justify-center">
                <div className="bg-white p-4 rounded-lg">
                  {booking.qrCode ? (
                    <img
                      src={booking.qrCode}
                      alt="Ticket QR Code"
                      className="w-48 h-48"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-200">
                      <FaQrcode className="text-6xl text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Ticket Details</h2>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaCalendarAlt className="mt-1 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-gray-400">{formatDate(booking.showtimeDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaClock className="mt-1 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-gray-400">{booking.showtimeDisplay || formatTime(booking.showtimeDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaMapMarkerAlt className="mt-1 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Theater</p>
                        <p className="text-gray-400">{booking.theaterName}, {booking.hall}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaCouch className="mt-1 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Seats</p>
                        <p className="text-gray-400">{booking.seats.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tickets ({booking.seats.length} x ${booking.ticketPrice?.toFixed(2) || '0.00'})</span>
                      <span>${(booking.ticketPrice * booking.seats.length).toFixed(2) || '0.00'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${booking.tax?.toFixed(2) || '0.00'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>${booking.serviceFee?.toFixed(2) || '0.00'}</span>
                    </div>

                    {booking.exchangeFee > 0 && (
                      <div className="flex justify-between">
                        <span>Exchange Fee</span>
                        <span>${booking.exchangeFee?.toFixed(2) || '0.00'}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-700 my-2 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${booking.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Payment Method</span>
                      <span>{booking.paymentMethod || 'Credit Card'}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Payment Status</span>
                      <span>{booking.paymentStatus || 'Paid'}</span>
                    </div>

                    {/* Refund information for cancelled bookings */}
                    {booking.bookingStatus === 'cancelled' && booking.refundAmount > 0 && (
                      <>
                        <div className="border-t border-gray-700 my-2 pt-2"></div>
                        <div className="flex justify-between text-sm">
                          <span>Refund Amount</span>
                          <span className="text-green-400">${booking.refundAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Refund Percentage</span>
                          <span>{booking.refundPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Refund Status</span>
                          <span className={
                            booking.refundStatus === 'completed' ? 'text-green-400' :
                            booking.refundStatus === 'pending' ? 'text-yellow-400' :
                            booking.refundStatus === 'failed' ? 'text-red-400' : 'text-gray-400'
                          }>
                            {booking.refundStatus.charAt(0).toUpperCase() + booking.refundStatus.slice(1)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                {booking.bookingStatus !== 'cancelled' && (
                  <button
                    onClick={handleCancelClick}
                    className="btn btn-danger flex items-center"
                    disabled={booking.bookingStatus === 'completed'}
                  >
                    <FaTimesCircle className="mr-2" /> Cancel Booking
                  </button>
                )}

                <button className="btn btn-primary flex items-center">
                  <FaDownload className="mr-2" /> Download Ticket
                </button>

                <button className="btn btn-secondary flex items-center">
                  <FaShareAlt className="mr-2" /> Share
                </button>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-gray-400 text-sm">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>

            <p className="mb-4">
              Are you sure you want to cancel your booking for <strong>{booking.movieTitle}</strong>?
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

export default BookingDetailPage;
