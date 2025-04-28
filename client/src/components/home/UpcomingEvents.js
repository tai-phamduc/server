import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { eventService } from '../../services/api';

// Hardcoded events for testing
const HARDCODED_EVENTS = [
  {
    _id: '7',
    title: 'Summer Movie Marathon',
    description: 'Join us for a day-long marathon of summer blockbusters! We\'ll be showing five of the biggest hits from this summer back-to-back. Ticket includes all movies, popcorn, and a drink.',
    startDate: '2024-07-15T10:00:00Z',
    endDate: '2024-07-15T22:00:00Z',
    location: 'Starlight Cinema, 789 Beach Boulevard',
    category: 'Marathon',
    ticketPrice: 30,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop',
    featured: true,
    capacity: 200,
    registeredAttendees: 125
  },
  {
    _id: '8',
    title: 'Outdoor Movie Night: Under the Stars',
    description: 'Experience cinema under the open sky! Bring your blankets and chairs for a magical evening watching a classic film with the stars above. Food trucks will be available on site.',
    startDate: '2024-07-20T20:00:00Z',
    endDate: '2024-07-20T23:00:00Z',
    location: 'Central Park Meadow',
    category: 'Outdoor',
    ticketPrice: 12,
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1000&auto=format&fit=crop',
    featured: true,
    capacity: 300,
    registeredAttendees: 180
  }
];

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Use the getUpcomingEvents method
        const upcomingEvents = await eventService.getUpcomingEvents();
        console.log('Upcoming events from API:', upcomingEvents);

        // Get only the first 2 events (they're already sorted by date in the API)
        const limitedEvents = upcomingEvents.slice(0, 2);
        console.log('Limited events (first 2):', limitedEvents);

        setEvents(limitedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load upcoming events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((item) => (
          <div key={item} className="flex bg-dark rounded-lg overflow-hidden shadow-lg animate-pulse">
            <div className="w-1/3 bg-gray-700"></div>
            <div className="w-2/3 p-4">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
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

  if (events.length === 0) {
    return (
      <div className="bg-secondary text-white p-4 rounded-lg">
        <p>No upcoming events at the moment. Check back soon!</p>
      </div>
    );
  }

  console.log('Final events state:', events);
  console.log('Events length:', events.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events && events.length > 0 ? (
        events.map((event) => {
          console.log('Rendering event:', event);
          return (
            <div key={event._id} className="flex bg-dark rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
              <div className="w-1/3 bg-gray-700 relative">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {event.ticketPrice && (
                  <div className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                    <FaTicketAlt className="mr-1" />
                    ${event.ticketPrice}
                  </div>
                )}
              </div>
              <div className="w-2/3 p-4">
                <div className="flex items-center text-primary mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(event.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{event.title}</h3>
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <FaClock className="mr-2" />
                  <span>{new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{event.location || 'TBA'}</span>
                </div>
                <Link to={`/events/${event._id}`} className="text-primary hover:underline text-sm">
                  Read More
                </Link>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-2 bg-secondary text-white p-4 rounded-lg text-center">
          <p>No upcoming events at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
