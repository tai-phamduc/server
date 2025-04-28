import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 bg-dark">
      <div className="container text-center">
        <h1 className="text-6xl md:text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-6">Page Not Found</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
