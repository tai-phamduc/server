const Content = require('../models/Content');
const slugify = require('slugify');

// Helper function to generate a unique slug
const generateUniqueSlug = async (title, existingId = null) => {
  let slug = slugify(title, { lower: true, strict: true });
  let isUnique = false;
  let counter = 1;
  let uniqueSlug = slug;

  while (!isUnique) {
    const existingContent = await Content.findOne({ slug: uniqueSlug });
    
    if (!existingContent || (existingId && existingContent._id.toString() === existingId.toString())) {
      isUnique = true;
    } else {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
  }

  return uniqueSlug;
};

// @desc    Create a new content
// @route   POST /api/content
// @access  Private/Admin
const createContent = async (req, res) => {
  try {
    const { type, title, content, summary, image, status, parent, order, metadata, settings } = req.body;

    // Generate a unique slug
    const slug = await generateUniqueSlug(title);

    const newContent = new Content({
      type,
      title,
      slug,
      content,
      summary,
      image,
      status,
      author: req.user._id,
      publishedAt: status === 'published' ? new Date() : null,
      parent,
      order,
      metadata,
      settings,
    });

    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all content
// @route   GET /api/content
// @access  Public
const getAllContent = async (req, res) => {
  try {
    const { type, status, parent } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (type) {
      filter.type = type;
    }
    
    if (status) {
      filter.status = status;
    } else {
      // By default, only return published content for public access
      filter.status = 'published';
    }
    
    if (parent) {
      filter.parent = parent;
    }
    
    const content = await Content.find(filter)
      .populate('author', 'name')
      .populate('parent', 'title slug')
      .sort({ order: 1, createdAt: -1 });
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get content by ID
// @route   GET /api/content/:id
// @access  Public
const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('author', 'name')
      .populate('parent', 'title slug');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // For non-admin users, only return published content
    if (content.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get content by slug
// @route   GET /api/content/slug/:slug
// @access  Public
const getContentBySlug = async (req, res) => {
  try {
    const content = await Content.findOne({ slug: req.params.slug })
      .populate('author', 'name')
      .populate('parent', 'title slug');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // For non-admin users, only return published content
    if (content.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private/Admin
const updateContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    const { type, title, content: contentBody, summary, image, status, parent, order, metadata, settings } = req.body;
    
    // Generate a new slug if title has changed
    let slug = content.slug;
    if (title && title !== content.title) {
      slug = await generateUniqueSlug(title, content._id);
    }
    
    // Update publishedAt if status is changing to published
    let publishedAt = content.publishedAt;
    if (status === 'published' && content.status !== 'published') {
      publishedAt = new Date();
    }
    
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      {
        type: type || content.type,
        title: title || content.title,
        slug,
        content: contentBody || content.content,
        summary: summary !== undefined ? summary : content.summary,
        image: image !== undefined ? image : content.image,
        status: status || content.status,
        publishedAt,
        parent: parent !== undefined ? parent : content.parent,
        order: order !== undefined ? order : content.order,
        metadata: metadata || content.metadata,
        settings: settings || content.settings,
      },
      { new: true }
    );
    
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private/Admin
const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check if content has children
    const hasChildren = await Content.exists({ parent: content._id });
    
    if (hasChildren) {
      return res.status(400).json({ message: 'Cannot delete content with children' });
    }
    
    await content.remove();
    
    res.json({ message: 'Content removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all content (admin)
// @route   GET /api/content/admin
// @access  Private/Admin
const getAllContentAdmin = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (type) {
      filter.type = type;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }
    
    const content = await Content.find(filter)
      .populate('author', 'name')
      .populate('parent', 'title slug')
      .sort({ type: 1, order: 1, createdAt: -1 });
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publish content
// @route   PUT /api/content/:id/publish
// @access  Private/Admin
const publishContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    content.status = 'published';
    content.publishedAt = new Date();
    
    await content.save();
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unpublish content
// @route   PUT /api/content/:id/unpublish
// @access  Private/Admin
const unpublishContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    content.status = 'draft';
    
    await content.save();
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Archive content
// @route   PUT /api/content/:id/archive
// @access  Private/Admin
const archiveContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    content.status = 'archived';
    
    await content.save();
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContent,
  getAllContent,
  getContentById,
  getContentBySlug,
  updateContent,
  deleteContent,
  getAllContentAdmin,
  publishContent,
  unpublishContent,
  archiveContent,
};
