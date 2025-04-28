const BlogCategory = require('../models/BlogCategory');
const News = require('../models/News');
const asyncHandler = require('express-async-handler');

// @desc    Get all blog categories
// @route   GET /api/blog-categories
// @access  Public
const getBlogCategories = asyncHandler(async (req, res) => {
  const featured = req.query.featured === 'true';
  const location = req.query.location || 'home';
  const withCount = req.query.withCount === 'true';
  
  let query = { isActive: true };
  
  if (featured) {
    if (location === 'home') {
      query.featuredInHome = true;
    } else if (location === 'menu') {
      query.featuredInMenu = true;
    }
  }
  
  let categories;
  
  if (withCount) {
    categories = await BlogCategory.find(query)
      .sort({ order: 1, name: 1 })
      .populate('postsCount')
      .lean();
  } else {
    categories = await BlogCategory.find(query)
      .sort({ order: 1, name: 1 });
  }
  
  res.json(categories);
});

// @desc    Get parent categories
// @route   GET /api/blog-categories/parents
// @access  Public
const getParentCategories = asyncHandler(async (req, res) => {
  const categories = await BlogCategory.findParents();
  
  res.json(categories);
});

// @desc    Get category by ID
// @route   GET /api/blog-categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await BlogCategory.findById(req.params.id)
    .populate('children');
  
  if (!category || !category.isActive) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  res.json(category);
});

// @desc    Get category by slug
// @route   GET /api/blog-categories/slug/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await BlogCategory.findBySlug(req.params.slug);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  res.json(category);
});

// @desc    Get news by category
// @route   GET /api/blog-categories/:id/news
// @access  Public
const getNewsByCategory = asyncHandler(async (req, res) => {
  const category = await BlogCategory.findById(req.params.id);
  
  if (!category || !category.isActive) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const news = await News.find({ 
    categories: req.params.id,
    status: 'published'
  })
    .sort({ publishDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'name profilePicture');
  
  const total = await News.countDocuments({ 
    categories: req.params.id,
    status: 'published'
  });
  
  res.json({
    category,
    news,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create a blog category
// @route   POST /api/blog-categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    image, 
    icon, 
    color, 
    parent,
    order,
    featuredInHome,
    featuredInMenu,
    metaTitle,
    metaDescription,
    metaKeywords
  } = req.body;
  
  // Check if category already exists
  const categoryExists = await BlogCategory.findOne({ name });
  
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }
  
  // Check if parent exists if provided
  if (parent) {
    const parentCategory = await BlogCategory.findById(parent);
    if (!parentCategory) {
      res.status(404);
      throw new Error('Parent category not found');
    }
  }
  
  const category = await BlogCategory.create({
    name,
    description,
    image,
    icon,
    color,
    parent,
    order: order || 0,
    featuredInHome: featuredInHome || false,
    featuredInMenu: featuredInMenu || false,
    metaTitle,
    metaDescription,
    metaKeywords,
    createdBy: req.user._id
  });
  
  res.status(201).json(category);
});

// @desc    Update a blog category
// @route   PUT /api/blog-categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    image, 
    icon, 
    color, 
    parent,
    order,
    isActive,
    featuredInHome,
    featuredInMenu,
    metaTitle,
    metaDescription,
    metaKeywords
  } = req.body;
  
  const category = await BlogCategory.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  // Check if parent exists if provided
  if (parent) {
    // Prevent circular reference
    if (parent.toString() === req.params.id) {
      res.status(400);
      throw new Error('Category cannot be its own parent');
    }
    
    const parentCategory = await BlogCategory.findById(parent);
    if (!parentCategory) {
      res.status(404);
      throw new Error('Parent category not found');
    }
  }
  
  // Update fields
  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  if (icon !== undefined) category.icon = icon;
  if (color !== undefined) category.color = color;
  if (parent !== undefined) category.parent = parent;
  if (order !== undefined) category.order = order;
  if (isActive !== undefined) category.isActive = isActive;
  if (featuredInHome !== undefined) category.featuredInHome = featuredInHome;
  if (featuredInMenu !== undefined) category.featuredInMenu = featuredInMenu;
  if (metaTitle !== undefined) category.metaTitle = metaTitle;
  if (metaDescription !== undefined) category.metaDescription = metaDescription;
  if (metaKeywords !== undefined) category.metaKeywords = metaKeywords;
  
  category.updatedBy = req.user._id;
  
  const updatedCategory = await category.save();
  
  res.json(updatedCategory);
});

// @desc    Delete a blog category
// @route   DELETE /api/blog-categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await BlogCategory.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  // Check if category has children
  const childrenCount = await BlogCategory.countDocuments({ parent: req.params.id });
  
  if (childrenCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category. It has ${childrenCount} child categories.`);
  }
  
  // Check if category is used in any news
  const newsCount = await News.countDocuments({ categories: req.params.id });
  
  if (newsCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category. It is used in ${newsCount} news articles.`);
  }
  
  await category.remove();
  
  res.json({ message: 'Category removed' });
});

// @desc    Reorder categories
// @route   PUT /api/blog-categories/reorder
// @access  Private/Admin
const reorderCategories = asyncHandler(async (req, res) => {
  const { orders } = req.body;
  
  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error('Invalid order data');
  }
  
  const updatePromises = orders.map(item => {
    return BlogCategory.findByIdAndUpdate(
      item.id,
      { order: item.order },
      { new: true }
    );
  });
  
  await Promise.all(updatePromises);
  
  res.json({ message: 'Categories reordered successfully' });
});

module.exports = {
  getBlogCategories,
  getParentCategories,
  getCategoryById,
  getCategoryBySlug,
  getNewsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
};
