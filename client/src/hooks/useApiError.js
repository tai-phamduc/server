import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for handling API errors in a consistent way
 * @returns {Object} - Error handling utilities
 */
const useApiError = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle API errors in a consistent way
   * @param {Error} error - The error object from the API call
   * @param {Object} options - Options for error handling
   * @param {boolean} options.showToast - Whether to show a toast notification
   * @param {string} options.fallbackMessage - Fallback message if error doesn't have a message
   * @param {Function} options.onError - Callback function to run on error
   */
  const handleApiError = useCallback((error, options = {}) => {
    const { 
      showToast = true, 
      fallbackMessage = 'An unexpected error occurred. Please try again.',
      onError = null
    } = options;

    // Set loading to false
    setLoading(false);

    // Extract error message
    let errorMessage = fallbackMessage;

    // Handle network errors (no response from server)
    if (!error.response) {
      errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      setError({ message: errorMessage, type: 'network' });
      
      if (showToast) {
        toast.error(errorMessage);
      }
      
      if (onError) {
        onError(errorMessage, 'network');
      }
      
      return;
    }

    // Handle API error responses
    if (error.response) {
      // Use the error message from the response if available
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      // Handle specific status codes
      switch (error.response.status) {
        case 400: // Bad Request
          setError({ message: errorMessage, type: 'validation', status: 400 });
          break;
        case 401: // Unauthorized
          errorMessage = 'Your session has expired. Please log in again.';
          setError({ message: errorMessage, type: 'auth', status: 401 });
          break;
        case 403: // Forbidden
          errorMessage = 'You do not have permission to perform this action.';
          setError({ message: errorMessage, type: 'permission', status: 403 });
          break;
        case 404: // Not Found
          errorMessage = 'The requested resource was not found.';
          setError({ message: errorMessage, type: 'notFound', status: 404 });
          break;
        case 422: // Validation Error
          setError({ message: errorMessage, type: 'validation', status: 422 });
          break;
        case 429: // Too Many Requests
          errorMessage = 'Too many requests. Please try again later.';
          setError({ message: errorMessage, type: 'rateLimit', status: 429 });
          break;
        case 500: // Server Error
          errorMessage = 'Server error. Please try again later or contact support.';
          setError({ message: errorMessage, type: 'server', status: 500 });
          break;
        default:
          setError({ 
            message: errorMessage, 
            type: 'unknown', 
            status: error.response.status 
          });
      }
    } else {
      // For other types of errors
      setError({ message: errorMessage, type: 'unknown' });
    }

    // Show toast notification if enabled
    if (showToast) {
      toast.error(errorMessage);
    }

    // Call onError callback if provided
    if (onError) {
      onError(errorMessage, error.response?.status);
    }

    // Log error to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error);
    }
  }, []);

  /**
   * Clear the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Execute an async function with error handling
   * @param {Function} asyncFn - The async function to execute
   * @param {Object} options - Options for error handling
   * @returns {Promise} - The result of the async function
   */
  const executeWithErrorHandling = useCallback(async (asyncFn, options = {}) => {
    try {
      setLoading(true);
      clearError();
      const result = await asyncFn();
      setLoading(false);
      return result;
    } catch (err) {
      handleApiError(err, options);
      return null;
    }
  }, [handleApiError, clearError]);

  return {
    error,
    loading,
    setLoading,
    handleApiError,
    clearError,
    executeWithErrorHandling
  };
};

export default useApiError;
