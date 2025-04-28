import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsExpanded(false);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setSearchTerm('');
    }
  };

  return (
    <div className="relative">
      {isExpanded ? (
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movies, events..."
            className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none w-64"
            autoFocus
          />
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark"
            aria-label="Search"
          >
            <FaSearch />
          </button>
          <button
            type="button"
            onClick={toggleSearch}
            className="ml-2 text-gray-400 hover:text-white"
            aria-label="Close search"
          >
            <FaTimes />
          </button>
        </form>
      ) : (
        <button
          onClick={toggleSearch}
          className="text-white hover:text-primary p-2"
          aria-label="Open search"
        >
          <FaSearch />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
