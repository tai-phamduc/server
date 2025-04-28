import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaCalendarAlt, FaNewspaper, FaEnvelope, FaRobot } from 'react-icons/fa';

// Components for Home Page
import HeroSlider from '../components/home/HeroSlider';
import FeaturedMovies from '../components/home/FeaturedMovies';
import NowPlayingMovies from '../components/home/NowPlayingMovies';
import ComingSoonMovies from '../components/home/ComingSoonMovies';
import EventsPreview from '../components/home/EventsPreview';
import LatestNews from '../components/home/LatestNews';
import MovieRecommendations from '../components/recommendations/MovieRecommendations';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  // Debug log
  console.log('HomePage component rendered');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    // Here you would normally call an API to subscribe the user
    setSubscribeStatus('success');
    setEmail('');

    // Reset status after 3 seconds
    setTimeout(() => {
      setSubscribeStatus(null);
    }, 3000);
  };

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative">
        <HeroSlider />
      </section>

      {/* Now Playing Movies */}
      <section className="py-12 bg-dark">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Now Playing</h2>
            <Link to="/movies?status=Now Playing" className="text-primary hover:underline">
              View All
            </Link>
          </div>

          <NowPlayingMovies />
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-12 bg-gradient-to-b from-dark to-secondary">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Featured Movies</h2>

          <FeaturedMovies />
        </div>
      </section>

      {/* Coming Soon Movies */}
      <section className="py-12 bg-dark">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Coming Soon</h2>
            <Link to="/movies?status=Coming Soon" className="text-primary hover:underline">
              View All
            </Link>
          </div>

          <ComingSoonMovies />
        </div>
      </section>

      {/* AI-Powered Recommendations */}
      <section className="py-12 bg-gradient-to-b from-secondary to-dark">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <h2 className="text-2xl md:text-3xl font-bold mr-2">Recommended For You</h2>
              <FaRobot className="text-primary" />
              <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">AI Powered</span>
            </div>
          </div>

          <MovieRecommendations limit={4} />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 bg-secondary">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
            <Link to="/events" className="text-primary hover:underline">
              View All
            </Link>
          </div>

          {/* Use the new EventsPreview component */}
          <EventsPreview />
        </div>
      </section>

      {/* Latest News */}
      <section className="py-12 bg-dark">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Latest News</h2>
            <Link to="/news" className="text-primary hover:underline">
              View All
            </Link>
          </div>

          <LatestNews />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-primary">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-200 mb-6">
              Get the latest updates on new movies, events, and exclusive offers.
            </p>

            {subscribeStatus === 'success' && (
              <div className="bg-green-600 text-white p-3 rounded-md mb-4 flex items-center justify-center">
                <FaEnvelope className="mr-2" />
                Thank you for subscribing!
              </div>
            )}

            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-md focus:outline-none text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn bg-secondary hover:bg-gray-700">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
