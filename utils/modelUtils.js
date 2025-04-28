/**
 * Utility functions for working with models
 */

const mongoose = require('mongoose');
const { clearRelatedCache } = require('../middleware/cacheMiddleware');

/**
 * Generate a slug from a string
 * @param {string} text - Text to generate slug from
 * @returns {string} Slug
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Generate a unique slug for a model
 * @param {mongoose.Model} model - Mongoose model
 * @param {string} slug - Base slug
 * @param {string} field - Field name for the slug (default: 'slug')
 * @param {mongoose.ObjectId} excludeId - ID to exclude from uniqueness check
 * @returns {Promise<string>} Unique slug
 */
const generateUniqueSlug = async (model, slug, field = 'slug', excludeId = null) => {
  let uniqueSlug = slug;
  let counter = 1;
  let exists = true;
  
  // Check if slug exists
  while (exists) {
    const query = { [field]: uniqueSlug };
    
    // Exclude the current document if ID is provided
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const doc = await model.findOne(query);
    
    if (!doc) {
      exists = false;
    } else {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
  }
  
  return uniqueSlug;
};

/**
 * Format a date to a display string
 * @param {Date} date - Date to format
 * @param {Object} options - Format options
 * @returns {string} Formatted date string
 */
const formatDate = (date, options = {}) => {
  const {
    format = 'medium', // 'short', 'medium', 'long', 'full'
    locale = 'en-US'
  } = options;
  
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  // Format options
  const formatOptions = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  };
  
  return dateObj.toLocaleDateString(locale, formatOptions[format]);
};

/**
 * Handle model updates with cache invalidation
 * @param {mongoose.Model} model - Mongoose model
 * @param {string} modelName - Model name for cache invalidation
 * @param {mongoose.ObjectId} id - Document ID
 * @param {Object} updates - Update object
 * @param {Object} options - Options
 * @returns {Promise<mongoose.Document>} Updated document
 */
const updateModelWithCache = async (model, modelName, id, updates, options = {}) => {
  const { 
    new: returnNew = true,
    runValidators = true,
    session = null
  } = options;
  
  const updatedDoc = await model.findByIdAndUpdate(
    id,
    updates,
    { new: returnNew, runValidators, session }
  );
  
  // Clear related cache
  clearRelatedCache(modelName);
  
  return updatedDoc;
};

/**
 * Delete a model document with cache invalidation
 * @param {mongoose.Model} model - Mongoose model
 * @param {string} modelName - Model name for cache invalidation
 * @param {mongoose.ObjectId} id - Document ID
 * @param {Object} options - Options
 * @returns {Promise<mongoose.Document>} Deleted document
 */
const deleteModelWithCache = async (model, modelName, id, options = {}) => {
  const { session = null } = options;
  
  const deletedDoc = await model.findByIdAndDelete(id, { session });
  
  // Clear related cache
  clearRelatedCache(modelName);
  
  return deletedDoc;
};

/**
 * Get model references for a document
 * @param {Object} models - Object containing Mongoose models
 * @param {string} modelName - Model name
 * @param {mongoose.ObjectId} id - Document ID
 * @returns {Promise<Object>} References object
 */
const getModelReferences = async (models, modelName, id) => {
  const references = {};
  
  // Define reference mappings
  const referenceMap = {
    'Genre': {
      'Movie': { field: 'genres', countField: 'moviesCount' }
    },
    'Director': {
      'Movie': { field: 'director', countField: 'moviesCount' }
    },
    'Actor': {
      'Movie': { field: 'cast.actor', countField: 'moviesCount' }
    },
    'Tag': {
      'Movie': { field: 'tags', countField: 'moviesCount' },
      'News': { field: 'blogTags', countField: 'newsCount' },
      'Event': { field: 'tags', countField: 'eventsCount' }
    },
    'BlogCategory': {
      'News': { field: 'blogCategories', countField: 'newsCount' }
    }
  };
  
  // Get references for the model
  const modelReferences = referenceMap[modelName] || {};
  
  // Check each reference model
  for (const refModelName in modelReferences) {
    const { field, countField } = modelReferences[refModelName];
    const refModel = models[refModelName];
    
    if (refModel) {
      // Count references
      const count = await refModel.countDocuments({ [field]: id });
      
      if (count > 0) {
        references[refModelName.toLowerCase()] = { count };
      }
    }
  }
  
  return references;
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
  formatDate,
  updateModelWithCache,
  deleteModelWithCache,
  getModelReferences
};
