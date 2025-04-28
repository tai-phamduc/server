/**
 * Utility functions for validation
 */

const validator = require('validator');

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
const isValidUrl = (url) => {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
const isValidPhone = (phone) => {
  return validator.isMobilePhone(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePasswordStrength = (password) => {
  const result = {
    isValid: false,
    errors: []
  };
  
  // Check length
  if (password.length < 8) {
    result.errors.push('Password must be at least 8 characters long');
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    result.errors.push('Password must contain at least one uppercase letter');
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    result.errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check for number
  if (!/[0-9]/.test(password)) {
    result.errors.push('Password must contain at least one number');
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.errors.push('Password must contain at least one special character');
  }
  
  // Set isValid if no errors
  result.isValid = result.errors.length === 0;
  
  return result;
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
const sanitizeHtml = (html) => {
  return validator.escape(html);
};

/**
 * Validate date
 * @param {string} date - Date string to validate
 * @returns {boolean} Is valid date
 */
const isValidDate = (date) => {
  return validator.isDate(date);
};

/**
 * Validate ISO date
 * @param {string} date - ISO date string to validate
 * @returns {boolean} Is valid ISO date
 */
const isValidISODate = (date) => {
  return validator.isISO8601(date);
};

/**
 * Validate numeric value
 * @param {string} value - Value to validate
 * @returns {boolean} Is numeric
 */
const isNumeric = (value) => {
  return validator.isNumeric(value);
};

/**
 * Validate decimal value
 * @param {string} value - Value to validate
 * @returns {boolean} Is decimal
 */
const isDecimal = (value) => {
  return validator.isDecimal(value);
};

/**
 * Validate integer value
 * @param {string} value - Value to validate
 * @returns {boolean} Is integer
 */
const isInteger = (value) => {
  return validator.isInt(value);
};

/**
 * Validate boolean value
 * @param {string} value - Value to validate
 * @returns {boolean} Is boolean
 */
const isBoolean = (value) => {
  return validator.isBoolean(value);
};

/**
 * Validate JSON string
 * @param {string} value - Value to validate
 * @returns {boolean} Is valid JSON
 */
const isValidJson = (value) => {
  return validator.isJSON(value);
};

/**
 * Validate MongoDB ObjectId
 * @param {string} value - Value to validate
 * @returns {boolean} Is valid ObjectId
 */
const isValidObjectId = (value) => {
  return validator.isMongoId(value);
};

module.exports = {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  validatePasswordStrength,
  sanitizeHtml,
  isValidDate,
  isValidISODate,
  isNumeric,
  isDecimal,
  isInteger,
  isBoolean,
  isValidJson,
  isValidObjectId
};
