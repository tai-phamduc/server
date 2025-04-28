import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
import { newsService } from '../../services/api';

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await newsService.getNews();
        // Sort by date (most recent first) and get only the first 3
        const sortedNews = data
          .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
          .slice(0, 3);
        setNews(sortedNews);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load latest news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-secondary rounded-lg overflow-hidden shadow-lg animate-pulse">
            <div className="h-48 bg-gray-700"></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
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

  if (news.length === 0) {
    return (
      <div className="bg-secondary text-white p-4 rounded-lg">
        <p>No news articles available at the moment. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {news.map((item) => (
        <div key={item._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
          <div className="h-48 bg-gray-700 relative">
            <img
              src={item.featuredImage || `https://via.placeholder.com/800x450/1A202C/FFFFFF?text=${encodeURIComponent(item.title)}`}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/800x450/1A202C/FFFFFF?text=${encodeURIComponent(item.title)}`;
              }}
            />
            {item.category && (
              <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                <FaTag className="mr-1" />
                {item.category}
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between text-gray-400 mb-2 text-sm">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>{new Date(item.publishDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <FaUser className="mr-2" />
                <span>{item.authorName || 'Staff'}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.excerpt || item.content?.substring(0, 100) + '...'}</p>
            <Link to={`/news/${item._id}`} className="text-primary hover:underline text-sm">
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestNews;
