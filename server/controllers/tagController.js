const Tag = require('../models/Tag');
const Movie = require('../models/Movie');
const News = require('../models/News');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
const getTags = asyncHandler(async (req, res) => {
  const type = req.query.type;
  const featured = req.query.featured === 'true';
  const withCount = req.query.withCount === 'true';
  
  let query = { isActive: true };
  
  if (type) {
    query.type = type;
  }
  
  if (featured) {
    query.isFeatured = true;
  }
  
  let tags;
  
  if (withCount) {
    tags = await Tag.findWithCounts(type);
  } else {
    tags = await Tag.findActive(type);
  }
  
  res.json(tags);
});

// @desc    Get featured tags
// @route   GET /api/tags/featured
// @access  Public
const getFeaturedTags = asyncHandler(async (req, res) => {
  const type = req.query.type;
  
  const tags = await Tag.findFeatured(type);
  
  res.json(tags);
});

// @desc    Get tag by ID
// @route   GET /api/tags/:id
// @access  Public
const getTagById = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  
  if (!tag || !tag.isActive) {
    res.status(404);
    throw new Error('Tag not found');
  }
  
  res.json(tag);
});

// @desc    Get tag by slug
// @route   GET /api/tags/slug/:slug
// @access  Public
const getTagBySlug = asyncHandler(async (req, res) => {
  const tag = await Tag.findBySlug(req.params.slug);
  
  if (!tag) {
    res.status(404);
    throw new Error('Tag not found');
  }
  
  res.json(tag);
});

// @desc    Get content by tag
// @route   GET /api/tags/:id/content
// @access  Public
const getContentByTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  
  if (!tag || !tag.isActive) {
    res.status(404);
    throw new Error('Tag not found');
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  let content = [];
  let total = 0;
  
  // Get content based on tag type
  if (tag.type === 'movie' || tag.type === 'general') {
    const movies = await Movie.find({ 
      tags: req.params.id,
      isActive: true
    })
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('director', 'name')
      .populate('cast.actor', 'name');
    
    content = movies;
    total = await Movie.countDocuments({ 
      tags: req.params.id,
      isActive: true
    });
  } else if (tag.type === 'blog' || tag.type === 'general') {
    const news = await News.find({ 
      tags: req.params.id,
      status: 'published'
    })
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name profilePicture');
    
    content = news;
    total = await News.countDocuments({ 
      tags: req.params.id,
      status: 'published'
    });
  } else if (tag.type === 'event' || tag.type === 'general') {
    const events = await Event.find({ 
      tags: req.params.id,
      isActive: true
    })
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);
    
    content = events;
    total = await Event.countDocuments({ 
      tags: req.params.id,
      isActive: true
    });
  }
  
  res.json({
    tag,
    content,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create a tag
// @route   POST /api/tags
// @access  Private/Admin
const createTag = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    type, 
    color, 
    icon,
    isFeatured,
    order,
    metaTitle,
    metaDescription
  } = req.body;
  
  // Check if tag already exists
  const tagExists = await Tag.findOne({ name });
  
  if (tagExists) {
    res.status(400);
    throw new Error('Tag already exists');
  }
  
  const tag = await Tag.create({
    name,
    description,
    type: type || 'general',
    color,
    icon,
    isFeatured: isFeatured || false,
    order: order || 0,
    metaTitle,
    metaDescription,
    createdBy: req.user._id
  });
  
  res.status(201).json(tag);
});

// @desc    Update a tag
// @route   PUT /api/tags/:id
// @access  Private/Admin
const updateTag = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    type, 
    color, 
    icon,
    isFeatured,
    isActive,
    order,
    metaTitle,
    metaDescription
  } = req.body;
  
  const tag = await Tag.findById(req.params.id);
  
  if (!tag) {
    res.status(404);
    throw new Error('Tag not found');
  }
  
  // Update fields
  if (name) tag.name = name;
  if (description !== undefined) tag.description = description;
  if (type) tag.type = type;
  if (color !== undefined) tag.color = color;
  if (icon !== undefined) tag.icon = icon;
  if (isFeatured !== undefined) tag.isFeatured = isFeatured;
  if (isActive !== undefined) tag.isActive = isActive;
  if (order !== undefined) tag.order = order;
  if (metaTitle !== undefined) tag.metaTitle = metaTitle;
  if (metaDescription !== undefined) tag.metaDescription = metaDescription;
  
  tag.updatedBy = req.user._id;
  
  const updatedTag = await tag.save();
  
  res.json(updatedTag);
});

// @desc    Delete a tag
// @route   DELETE /api/tags/:id
// @access  Private/Admin
const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  
  if (!tag) {
    res.status(404);
    throw new Error('Tag not found');
  }
  
  // Check if tag is used in any content
  let usageCount = 0;
  
  if (tag.type === 'movie' || tag.type === 'general') {
    usageCount += await Movie.countDocuments({ tags: req.params.id });
  }
  
  if (tag.type === 'blog' || tag.type === 'general') {
    usageCount += await News.countDocuments({ tags: req.params.id });
  }
  
  if (tag.type === 'event' || tag.type === 'general') {
    usageCount += await Event.countDocuments({ tags: req.params.id });
  }
  
  if (usageCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete tag. It is used in ${usageCount} items.`);
  }
  
  await tag.remove();
  
  res.json({ message: 'Tag removed' });
});

// @desc    Reorder tags
// @route   PUT /api/tags/reorder
// @access  Private/Admin
const reorderTags = asyncHandler(async (req, res) => {
  const { orders } = req.body;
  
  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error('Invalid order data');
  }
  
  const updatePromises = orders.map(item => {
    return Tag.findByIdAndUpdate(
      item.id,
      { order: item.order },
      { new: true }
    );
  });
  
  await Promise.all(updatePromises);
  
  res.json({ message: 'Tags reordered successfully' });
});

module.exports = {
  getTags,
  getFeaturedTags,
  getTagById,
  getTagBySlug,
  getContentByTag,
  createTag,
  updateTag,
  deleteTag,
  reorderTags
};
