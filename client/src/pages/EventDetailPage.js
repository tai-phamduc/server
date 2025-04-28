import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaUsers, FaArrowLeft, FaShare, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { eventService, authService } from '../services/api';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(id);
        setEvent(eventData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };

    const user = authService.getCurrentUser();
    setCurrentUser(user);

    fetchEventDetails();
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  const handleRegister = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    try {
      setRegistering(true);
      setRegistrationError(null);

      const result = await eventService.registerForEvent(id, {
        userId: currentUser._id,
        name: currentUser.name,
        email: currentUser.email
      });

      setRegistrationSuccess(true);
      setRegistering(false);
    } catch (err) {
      console.error('Error registering for event:', err);
      setRegistrationError(err.message || 'Failed to register for this event. Please try again later.');
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const getEventDuration = () => {
    if (!event.startTime || !event.endTime) return 'Duration not specified';

    // Parse time strings (assuming format like "10:00 AM")
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return { hours, minutes };
    };

    const start = parseTime(event.startTime);
    const end = parseTime(event.endTime);

    // Calculate duration in minutes
    let durationMinutes = (end.hours * 60 + end.minutes) - (start.hours * 60 + start.minutes);

    // Handle overnight events
    if (durationMinutes < 0) durationMinutes += 24 * 60;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
    }
  };

  const isEventFull = () => {
    return event.attendees >= event.capacity;
  };

  const getAvailabilityStatus = () => {
    if (isEventFull()) {
      return { text: 'Sold Out', color: 'bg-red-600' };
    }

    const spotsLeft = event.capacity - (event.attendees || 0);
    if (spotsLeft <= 10) {
      return { text: `Only ${spotsLeft} spots left!`, color: 'bg-yellow-600' };
    }

    return { text: 'Available', color: 'bg-green-600' };
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
          <div className="bg-red-900 text-white p-6 rounded-lg max-w-4xl mx-auto">
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

  if (!event) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="container">
          <div className="bg-secondary text-white p-6 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Event Not Found</h2>
            <p>The event you're looking for doesn't exist or has been removed.</p>
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

  const availabilityStatus = getAvailabilityStatus();

  return (
    <div className="bg-dark min-h-screen py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={goBack}
              className="flex items-center text-white hover:text-primary"
            >
              <FaArrowLeft className="mr-2" /> Back to Events
            </button>
          </div>

          <div className="bg-secondary rounded-lg overflow-hidden shadow-lg mb-8">
            <div className="h-80 overflow-hidden">
              <img
                src={event.image || `https://via.placeholder.com/1280x720/1A202C/FFFFFF?text=${encodeURIComponent(event.title)}`}
                alt={event.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/1280x720/1A202C/FFFFFF?text=${encodeURIComponent(event.title)}`;
                }}
              />
            </div>

            <div className="p-8">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 pr-4">{event.title}</h1>
                <span className={`${availabilityStatus.color} text-white px-3 py-1 rounded-md text-sm font-medium`}>
                  {availabilityStatus.text}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="flex items-center mb-4">
                    <FaCalendarAlt className="text-primary mr-3" size={20} />
                    <div>
                      <h3 className="font-semibold">Date</h3>
                      <p>{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <FaClock className="text-primary mr-3" size={20} />
                    <div>
                      <h3 className="font-semibold">Time</h3>
                      <p>{event.startTime} - {event.endTime}</p>
                      <p className="text-sm text-gray-400">Duration: {getEventDuration()}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <FaMapMarkerAlt className="text-primary mr-3" size={20} />
                    <div>
                      <h3 className="font-semibold">Location</h3>
                      <p>{event.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <FaTicketAlt className="text-primary mr-3" size={20} />
                    <div>
                      <h3 className="font-semibold">Ticket Price</h3>
                      <p>{typeof event.ticketPrice === 'number' ? `$${event.ticketPrice.toFixed(2)}` : event.ticketPrice || 'Free'}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <FaUsers className="text-primary mr-3" size={20} />
                    <div>
                      <h3 className="font-semibold">Capacity</h3>
                      <p>{event.attendees || 0} / {event.capacity} registered</p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${((event.attendees || 0) / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    {registrationSuccess ? (
                      <div className="bg-green-800 text-white p-4 rounded-md">
                        <p className="font-semibold">Registration Successful!</p>
                        <p className="text-sm mt-1">You have successfully registered for this event.</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleRegister}
                        disabled={isEventFull() || registering}
                        className={`w-full py-3 rounded-md font-semibold ${
                          isEventFull()
                            ? 'bg-gray-600 cursor-not-allowed'
                            : registering
                            ? 'bg-primary opacity-75 cursor-wait'
                            : 'bg-primary hover:bg-primary-dark'
                        } text-white flex items-center justify-center`}
                      >
                        {registering ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : isEventFull() ? (
                          'Sold Out'
                        ) : (
                          <>
                            <FaTicketAlt className="mr-2" /> Register Now
                          </>
                        )}
                      </button>
                    )}

                    {registrationError && (
                      <div className="bg-red-900 text-white p-3 rounded-md mt-3 text-sm">
                        {registrationError}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <div className="prose prose-invert max-w-none">
                  {event.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Social Share */}
              <div className="pt-6 border-t border-gray-700">
                <div className="flex items-center">
                  <span className="mr-4 font-medium">Share this event:</span>
                  <div className="flex space-x-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary"
                    >
                      <FaFacebook size={20} />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary"
                    >
                      <FaTwitter size={20} />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(event.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/events"
              className="btn btn-primary inline-flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to All Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
