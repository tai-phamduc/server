import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaTicketAlt, FaCog, FaHistory, FaStar, FaEdit, FaRobot } from 'react-icons/fa';
import { authService, movieService } from '../services/api';
import UserInsights from '../components/analytics/UserInsights';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          setError('You must be logged in to view this page');
          setLoading(false);
          return;
        }
        
        setUser(currentUser);
        
        // In a real implementation, these would be API calls
        // For now, we'll use mock data
        
        // Mock bookings
        setBookings([
          {
            _id: '1',
            movie: { _id: '1', title: 'Inception', poster: 'https://example.com/inception.jpg' },
            showtime: { date: '2023-11-15T19:00:00Z', theater: { name: 'Cinema City' } },
            seats: ['A1', 'A2'],
            totalAmount: 25,
            createdAt: '2023-11-10T14:30:00Z'
          },
          {
            _id: '2',
            movie: { _id: '3', title: 'The Dark Knight', poster: 'https://example.com/dark-knight.jpg' },
            showtime: { date: '2023-11-20T20:30:00Z', theater: { name: 'Starlight Cinema' } },
            seats: ['B5', 'B6'],
            totalAmount: 30,
            createdAt: '2023-11-18T10:15:00Z'
          }
        ]);
        
        // Mock reviews
        setReviews([
          {
            _id: '1',
            movie: { _id: '1', title: 'Inception', poster: 'https://example.com/inception.jpg' },
            rating: 4.5,
            title: 'Mind-blowing experience',
            comment: 'One of the best movies I\'ve ever seen. The concept is brilliant and the execution is flawless.',
            createdAt: '2023-11-12T09:45:00Z'
          },
          {
            _id: '2',
            movie: { _id: '3', title: 'The Dark Knight', poster: 'https://example.com/dark-knight.jpg' },
            rating: 5,
            title: 'A masterpiece',
            comment: 'Heath Ledger\'s performance as the Joker is legendary. This movie redefined superhero films.',
            createdAt: '2023-11-22T16:20:00Z'
          }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

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
            <Link to="/login" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="container">
          <div className="bg-secondary text-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Not Logged In</h2>
            <p>You must be logged in to view your profile.</p>
            <Link to="/login" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen py-12">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-lg p-6 mb-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 bg-gray-700 rounded-full mb-4 flex items-center justify-center">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUser size={48} className="text-gray-500" />
                  )}
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-400">{user.role}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3" />
                  <span>{user.email}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <Link to="/account/edit" className="flex items-center text-primary hover:underline">
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/my-bookings" className="flex items-center text-white hover:text-primary">
                  <FaTicketAlt className="mr-3" />
                  My Bookings
                </Link>
                <Link to="/my-reviews" className="flex items-center text-white hover:text-primary">
                  <FaStar className="mr-3" />
                  My Reviews
                </Link>
                <Link to="/watch-history" className="flex items-center text-white hover:text-primary">
                  <FaHistory className="mr-3" />
                  Watch History
                </Link>
                <Link to="/account/settings" className="flex items-center text-white hover:text-primary">
                  <FaCog className="mr-3" />
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right Column - Activity and AI Insights */}
          <div className="lg:col-span-2">
            {/* Recent Activity */}
            <div className="bg-secondary rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
              
              {/* Recent Bookings */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Recent Bookings</h4>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-16 h-24 bg-gray-700 rounded mr-4">
                            {booking.movie.poster && (
                              <img
                                src={booking.movie.poster}
                                alt={booking.movie.title}
                                className="w-full h-full object-cover rounded"
                              />
                            )}
                          </div>
                          <div>
                            <h5 className="font-semibold">{booking.movie.title}</h5>
                            <p className="text-sm text-gray-400">
                              {new Date(booking.showtime.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })} at {new Date(booking.showtime.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <p className="text-sm text-gray-400">{booking.showtime.theater.name}</p>
                            <p className="text-sm text-gray-400">Seats: {booking.seats.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No recent bookings</p>
                )}
                
                <div className="mt-4">
                  <Link to="/my-bookings" className="text-primary hover:underline">
                    View all bookings
                  </Link>
                </div>
              </div>
              
              {/* Recent Reviews */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Recent Reviews</h4>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-12 h-16 bg-gray-700 rounded mr-4">
                            {review.movie.poster && (
                              <img
                                src={review.movie.poster}
                                alt={review.movie.title}
                                className="w-full h-full object-cover rounded"
                              />
                            )}
                          </div>
                          <div>
                            <h5 className="font-semibold">{review.movie.title}</h5>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`${
                                    star <= Math.round(review.rating) ? 'text-yellow-400' : 'text-gray-500'
                                  }`}
                                  size={12}
                                />
                              ))}
                              <span className="ml-2 text-sm">{review.rating}/5</span>
                            </div>
                          </div>
                        </div>
                        <h6 className="font-semibold text-sm">{review.title}</h6>
                        <p className="text-sm text-gray-300 mt-1">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No recent reviews</p>
                )}
                
                <div className="mt-4">
                  <Link to="/my-reviews" className="text-primary hover:underline">
                    View all reviews
                  </Link>
                </div>
              </div>
            </div>
            
            {/* AI Insights */}
            <UserInsights userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
