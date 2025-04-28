import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { eventService } from '../../services/api';

const EventsPreview = () => {
  console.log('EventsPreview component rendered');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const upcomingEvents = await eventService.getUpcomingEvents();
        // Get only the first 2 events
        setEvents(upcomingEvents.slice(0, 2));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load upcoming events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No upcoming events found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => (
        <div key={event._id} className="flex bg-dark rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
          <div className="w-1/3 bg-gray-700 relative">
            <img
              src={event.image || `https://via.placeholder.com/400x600/1A202C/FFFFFF?text=${encodeURIComponent(event.title)}`}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/400x600/1A202C/FFFFFF?text=${encodeURIComponent(event.title)}`;
              }}
            />
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
              <span>{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 line-clamp-1">{event.title}</h3>
            <div className="flex items-center text-gray-400 text-sm mb-2">
              <FaClock className="mr-2" />
              <span>{event.startTime}</span>
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
      ))}
    </div>
  );
};

export default EventsPreview;
