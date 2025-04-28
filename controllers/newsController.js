const News = require('../models/News');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
  try {
    const news = await News.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get news article by ID
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res) => {
  try {
    const newsArticle = await News.findById(req.params.id).populate('author', 'name');
    if (!newsArticle) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(newsArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get news articles by category
// @route   GET /api/news/category/:category
// @access  Public
const getNewsByCategory = async (req, res) => {
  try {
    const news = await News.find({ category: req.params.category })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a news article
// @route   POST /api/news
// @access  Private/Admin
const createNews = async (req, res) => {
  try {
    const news = new News({
      ...req.body,
      author: req.user._id,
    });
    
    const createdNews = await news.save();
    res.status(201).json(createdNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a news article
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    await news.remove();
    res.json({ message: 'News article removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNews,
  getNewsById,
  getNewsByCategory,
  createNews,
  updateNews,
  deleteNews,
};
