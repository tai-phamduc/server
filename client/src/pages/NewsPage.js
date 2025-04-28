import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaSearch, FaFilter } from 'react-icons/fa';
import { newsService } from '../services/api';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredNews, setFilteredNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching news...');
        const newsData = await newsService.getNews();
        console.log('News data:', newsData);
        setNews(newsData);
        setFilteredNews(newsData);

        // Extract unique categories
        const uniqueCategories = [...new Set(newsData.map(item => item.category))];
        console.log('Unique categories:', uniqueCategories);
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    // Filter news based on search query and selected category
    let filtered = news;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredNews(filtered);
  }, [searchQuery, selectedCategory, news]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-dark min-h-screen">
      <div className="container">
        <h1 className="text-4xl font-bold mb-6 text-center">Latest News</h1>
        <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          Stay updated with the latest news, announcements, and stories from the world of cinema.
        </p>

        {/* Search and Filter */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search news..."
                className="w-full bg-gray-800 text-white px-4 py-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={handleSearch}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="bg-gray-800 text-white px-4 py-3 pl-10 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <div key={item._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform hover:transform hover:scale-105">
                <div className="h-48 overflow-hidden">
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
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaCalendarAlt className="mr-1" />
                      <span>{new Date(item.publishDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mb-3 line-clamp-2">{item.title}</h2>

                  <p className="text-gray-400 mb-4 line-clamp-3">{item.excerpt || item.content.substring(0, 150)}...</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaUser className="mr-1" />
                      <span>{item.authorName || 'Staff Writer'}</span>
                    </div>
                    <Link
                      to={`/news/${item._id}`}
                      className="text-primary hover:text-primary-light font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl mb-4">No news articles found</h3>
            <p className="text-gray-400">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back later for updates.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
