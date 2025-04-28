import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaEdit, FaTrash, FaUser } from 'react-icons/fa';

const ReviewList = ({ reviews, currentUser, onDelete, showControls = false }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-secondary p-6 rounded-lg text-center">
        <p className="text-gray-400">No reviews yet. Be the first to review this movie!</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h3>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-700 pb-6 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                {review.user?.avatar ? (
                  <img 
                    src={review.user.avatar} 
                    alt={review.user.name} 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-700 rounded-full mr-3 flex items-center justify-center">
                    <FaUser className="text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-semibold">{review.user?.name || 'Anonymous'}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              
              {showControls && currentUser && (currentUser._id === review.user?._id || currentUser.role === 'admin') && (
                <div className="flex space-x-2">
                  <Link
                    to={`/review/edit/${review._id}`}
                    className="text-blue-400 hover:text-blue-300"
                    title="Edit review"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => onDelete(review._id)}
                    className="text-red-400 hover:text-red-300"
                    title="Delete review"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`${
                      star <= Math.round(review.rating / 2) ? 'text-yellow-400' : 'text-gray-500'
                    }`}
                  />
                ))}
              </div>
              <span className="text-yellow-400 font-semibold">{review.rating}/10</span>
            </div>
            
            {review.title && (
              <h4 className="text-lg font-semibold mb-2">{review.title}</h4>
            )}
            
            <p className="text-gray-300 whitespace-pre-line">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
