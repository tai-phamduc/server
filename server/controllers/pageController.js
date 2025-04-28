const Page = require('../models/Page');
const asyncHandler = require('express-async-handler');

// @desc    Get all published pages
// @route   GET /api/pages
// @access  Public
const getPages = asyncHandler(async (req, res) => {
  const pages = await Page.findPublished();
  
  res.json(pages);
});

// @desc    Get menu pages
// @route   GET /api/pages/menu
// @access  Public
const getMenuPages = asyncHandler(async (req, res) => {
  const pages = await Page.findMenuPages();
  
  res.json(pages);
});

// @desc    Get footer pages
// @route   GET /api/pages/footer
// @access  Public
const getFooterPages = asyncHandler(async (req, res) => {
  const pages = await Page.findFooterPages();
  
  res.json(pages);
});

// @desc    Get page by ID
// @route   GET /api/pages/:id
// @access  Public
const getPageById = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id)
    .populate('children');
  
  if (!page || page.status !== 'published') {
    res.status(404);
    throw new Error('Page not found');
  }
  
  res.json(page);
});

// @desc    Get page by slug
// @route   GET /api/pages/slug/:slug
// @access  Public
const getPageBySlug = asyncHandler(async (req, res) => {
  const page = await Page.findBySlug(req.params.slug);
  
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }
  
  res.json(page);
});

// @desc    Create a page
// @route   POST /api/pages
// @access  Private/Admin
const createPage = asyncHandler(async (req, res) => {
  const { 
    title, 
    content, 
    excerpt, 
    featuredImage, 
    status,
    template,
    order,
    isInMenu,
    isInFooter,
    parent,
    metaTitle,
    metaDescription,
    metaKeywords
  } = req.body;
  
  // Check if page with same slug already exists
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const pageExists = await Page.findOne({ slug });
  
  if (pageExists) {
    res.status(400);
    throw new Error('A page with this title already exists');
  }
  
  // Check if parent exists if provided
  if (parent) {
    const parentPage = await Page.findById(parent);
    if (!parentPage) {
      res.status(404);
      throw new Error('Parent page not found');
    }
  }
  
  const page = await Page.create({
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    status: status || 'draft',
    template: template || 'default',
    order: order || 0,
    isInMenu: isInMenu || false,
    isInFooter: isInFooter || false,
    parent,
    metaTitle,
    metaDescription,
    metaKeywords,
    createdBy: req.user._id,
    publishedAt: status === 'published' ? Date.now() : null
  });
  
  res.status(201).json(page);
});

// @desc    Update a page
// @route   PUT /api/pages/:id
// @access  Private/Admin
const updatePage = asyncHandler(async (req, res) => {
  const { 
    title, 
    content, 
    excerpt, 
    featuredImage, 
    status,
    template,
    order,
    isInMenu,
    isInFooter,
    parent,
    metaTitle,
    metaDescription,
    metaKeywords
  } = req.body;
  
  const page = await Page.findById(req.params.id);
  
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }
  
  // Check if parent exists if provided
  if (parent) {
    // Prevent circular reference
    if (parent.toString() === req.params.id) {
      res.status(400);
      throw new Error('Page cannot be its own parent');
    }
    
    const parentPage = await Page.findById(parent);
    if (!parentPage) {
      res.status(404);
      throw new Error('Parent page not found');
    }
  }
  
  // Update fields
  if (title) {
    page.title = title;
    
    // Update slug if title changes
    page.slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  if (content) page.content = content;
  if (excerpt !== undefined) page.excerpt = excerpt;
  if (featuredImage !== undefined) page.featuredImage = featuredImage;
  if (status) {
    // If publishing for the first time, set publishedAt
    if (status === 'published' && page.status !== 'published') {
      page.publishedAt = Date.now();
    }
    page.status = status;
  }
  if (template) page.template = template;
  if (order !== undefined) page.order = order;
  if (isInMenu !== undefined) page.isInMenu = isInMenu;
  if (isInFooter !== undefined) page.isInFooter = isInFooter;
  if (parent !== undefined) page.parent = parent;
  if (metaTitle !== undefined) page.metaTitle = metaTitle;
  if (metaDescription !== undefined) page.metaDescription = metaDescription;
  if (metaKeywords !== undefined) page.metaKeywords = metaKeywords;
  
  page.updatedBy = req.user._id;
  
  const updatedPage = await page.save();
  
  res.json(updatedPage);
});

// @desc    Delete a page
// @route   DELETE /api/pages/:id
// @access  Private/Admin
const deletePage = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);
  
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }
  
  // Check if page has children
  const childrenCount = await Page.countDocuments({ parent: req.params.id });
  
  if (childrenCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete page. It has ${childrenCount} child pages.`);
  }
  
  await page.remove();
  
  res.json({ message: 'Page removed' });
});

// @desc    Get all pages (admin)
// @route   GET /api/pages/admin
// @access  Private/Admin
const getAllPages = asyncHandler(async (req, res) => {
  const status = req.query.status;
  
  let query = {};
  
  if (status) {
    query.status = status;
  }
  
  const pages = await Page.find(query)
    .sort({ updatedAt: -1 })
    .populate('parent', 'title')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');
  
  res.json(pages);
});

module.exports = {
  getPages,
  getMenuPages,
  getFooterPages,
  getPageById,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  getAllPages
};
