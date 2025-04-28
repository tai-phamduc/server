import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaClock, FaArrowLeft, FaShare, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { newsService } from '../services/api';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        setLoading(true);
        const newsData = await newsService.getNewsById(id);
        setNews(newsData);

        // Fetch related news by category
        if (newsData.category) {
          const categoryNews = await newsService.getNewsByCategory(newsData.category);
          // Filter out the current news article and limit to 3
          const filtered = categoryNews
            .filter(item => item._id !== id)
            .slice(0, 3);
          setRelatedNews(filtered);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching news details:', err);
        setError('Failed to load news details. Please try again later.');
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime === 0 ? 1 : readingTime;
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

  if (!news) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="container">
          <div className="bg-secondary text-white p-6 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-2">News Not Found</h2>
            <p>The news article you're looking for doesn't exist or has been removed.</p>
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

  return (
    <div className="bg-dark min-h-screen py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={goBack}
              className="flex items-center text-white hover:text-primary"
            >
              <FaArrowLeft className="mr-2" /> Back to News
            </button>
          </div>

          <article className="bg-secondary rounded-lg overflow-hidden shadow-lg mb-8">
            <div className="h-80 overflow-hidden">
              <img
                src={news.featuredImage || `https://via.placeholder.com/1280x720/1A202C/FFFFFF?text=${encodeURIComponent(news.title)}`}
                alt={news.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/1280x720/1A202C/FFFFFF?text=${encodeURIComponent(news.title)}`;
                }}
              />
            </div>

            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                <span className="bg-primary text-white px-3 py-1 rounded-md">
                  {news.category}
                </span>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>{formatDate(news.publishDate)}</span>
                </div>
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>{news.authorName || 'Staff Writer'}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <span>{getReadingTime(news.content)} min read</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6">{news.title}</h1>

              {news.excerpt && (
                <div className="text-lg text-gray-300 mb-6 italic border-l-4 border-primary pl-4">
                  {news.excerpt}
                </div>
              )}

              <div className="prose prose-lg prose-invert max-w-none">
                {news.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Social Share */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center">
                  <span className="mr-4 font-medium">Share this article:</span>
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
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary"
                    >
                      <FaTwitter size={20} />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(news.title)}`}
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
          </article>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Related News</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <div key={item._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
                    <div className="h-40 overflow-hidden">
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
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          {formatDate(item.publishDate)}
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
            </div>
          )}

          <div className="text-center">
            <Link
              to="/news"
              className="btn btn-primary inline-flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to All News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
