const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const { getCacheStats, clearCache } = require('../middleware/cacheMiddleware');
const { getMetrics, resetMetrics } = require('../middleware/performanceMiddleware');
const { getRateLimitMetrics } = require('../middleware/rateLimitMiddleware');
const logger = require('../utils/logger');
const { getCollections, getCollectionData, getDashboardStats } = require('../controllers/adminController');

// Import controllers for admin routes
const genreController = require('../controllers/genreController');
const directorController = require('../controllers/directorController');
const actorController = require('../controllers/actorController');
const commentController = require('../controllers/commentController');
const feedbackController = require('../controllers/feedbackController');
const faqController = require('../controllers/faqController');
const contactController = require('../controllers/contactController');
const newsletterController = require('../controllers/newsletterController');
const blogCategoryController = require('../controllers/blogCategoryController');
const tagController = require('../controllers/tagController');
const pageController = require('../controllers/pageController');
const settingController = require('../controllers/settingController');

// Get cache statistics
router.get('/cache/stats', protect, admin, (req, res) => {
  const stats = getCacheStats();
  res.json(stats);
});

// Clear cache
router.post('/cache/clear', protect, admin, (req, res) => {
  clearCache();
  res.json({ message: 'Cache cleared successfully' });
});

// Get performance metrics
router.get('/metrics', protect, admin, (req, res) => {
  const metrics = getMetrics();
  const rateLimitMetrics = getRateLimitMetrics();

  res.json({
    ...metrics,
    ...rateLimitMetrics
  });
});

// Reset performance metrics
router.post('/metrics/reset', protect, admin, (req, res) => {
  resetMetrics();
  res.json({ message: 'Metrics reset successfully' });
});

// Get logs
router.get('/logs', protect, admin, (req, res) => {
  const logType = req.query.type || 'combined';
  const lines = parseInt(req.query.lines) || 100;

  // Validate log type
  const validLogTypes = ['combined', 'error', 'access', 'exceptions', 'rejections'];
  if (!validLogTypes.includes(logType)) {
    return res.status(400).json({ message: 'Invalid log type' });
  }

  // Get log file path
  const logFile = path.join(__dirname, '../logs', `${logType}.log`);

  // Check if log file exists
  if (!fs.existsSync(logFile)) {
    return res.status(404).json({ message: 'Log file not found' });
  }

  try {
    // Read log file
    const data = fs.readFileSync(logFile, 'utf8');

    // Split into lines and get the last N lines
    const logLines = data.split('\n').filter(Boolean);
    const lastLines = logLines.slice(-lines);

    // Parse JSON logs
    const parsedLogs = lastLines.map(line => {
      try {
        return JSON.parse(line);
      } catch (err) {
        return { message: line };
      }
    });

    res.json({
      type: logType,
      count: parsedLogs.length,
      logs: parsedLogs
    });
  } catch (err) {
    logger.error('Error reading log file', { error: err.message, stack: err.stack });
    res.status(500).json({ message: 'Error reading log file' });
  }
});

// Clear logs
router.post('/logs/clear', protect, admin, (req, res) => {
  const logType = req.query.type || 'all';

  try {
    if (logType === 'all') {
      // Clear all log files
      const logDir = path.join(__dirname, '../logs');
      const logFiles = fs.readdirSync(logDir).filter(file => file.endsWith('.log'));

      logFiles.forEach(file => {
        fs.writeFileSync(path.join(logDir, file), '', 'utf8');
      });

      logger.info('All log files cleared', { userId: req.user._id });
      res.json({ message: 'All log files cleared successfully' });
    } else {
      // Clear specific log file
      const validLogTypes = ['combined', 'error', 'access', 'exceptions', 'rejections'];
      if (!validLogTypes.includes(logType)) {
        return res.status(400).json({ message: 'Invalid log type' });
      }

      const logFile = path.join(__dirname, '../logs', `${logType}.log`);

      if (!fs.existsSync(logFile)) {
        return res.status(404).json({ message: 'Log file not found' });
      }

      fs.writeFileSync(logFile, '', 'utf8');

      logger.info(`Log file ${logType} cleared`, { userId: req.user._id });
      res.json({ message: `Log file ${logType} cleared successfully` });
    }
  } catch (err) {
    logger.error('Error clearing log files', { error: err.message, stack: err.stack });
    res.status(500).json({ message: 'Error clearing log files' });
  }
});

// Admin routes for content management
// Genres
router.post('/genres', genreController.createGenre);
router.put('/genres/:id', genreController.updateGenre);
router.delete('/genres/:id', genreController.deleteGenre);

// Directors
router.post('/directors', directorController.createDirector);
router.put('/directors/:id', directorController.updateDirector);
router.delete('/directors/:id', directorController.deleteDirector);

// Actors
router.post('/actors', actorController.createActor);
router.put('/actors/:id', actorController.updateActor);
router.delete('/actors/:id', actorController.deleteActor);

// Comments
router.get('/comments/reported', commentController.getReportedComments);
router.put('/comments/:id/approve', commentController.approveComment);
router.put('/comments/:id/reject', commentController.rejectComment);

// Feedback
router.get('/feedback', feedbackController.getAllFeedback);
router.put('/feedback/:id/approve', feedbackController.approveFeedback);
router.put('/feedback/:id/display', feedbackController.displayFeedback);
router.put('/feedback/:id/hide', feedbackController.hideFeedback);
router.delete('/feedback/:id', feedbackController.deleteFeedback);

// FAQs
router.post('/faqs', faqController.createFAQ);
router.put('/faqs/:id', faqController.updateFAQ);
router.delete('/faqs/:id', faqController.deleteFAQ);
router.put('/faqs/reorder', faqController.reorderFAQs);

// Contact
router.get('/contacts', contactController.getAllContacts);
router.get('/contacts/:id', contactController.getContactById);
router.put('/contacts/:id/read', contactController.markAsRead);
router.put('/contacts/:id/reply', contactController.markAsReplied);
router.put('/contacts/:id/spam', contactController.markAsSpam);
router.put('/contacts/:id/archive', contactController.archiveContact);
router.delete('/contacts/:id', contactController.deleteContact);

// Newsletter
router.get('/newsletter', newsletterController.getAllSubscriptions);
router.get('/newsletter/export', newsletterController.exportSubscribers);
router.delete('/newsletter/:id', newsletterController.deleteSubscription);

// Blog Categories
router.post('/blog-categories', blogCategoryController.createCategory);
router.put('/blog-categories/:id', blogCategoryController.updateCategory);
router.delete('/blog-categories/:id', blogCategoryController.deleteCategory);
router.put('/blog-categories/reorder', blogCategoryController.reorderCategories);

// Tags
router.post('/tags', tagController.createTag);
router.put('/tags/:id', tagController.updateTag);
router.delete('/tags/:id', tagController.deleteTag);
router.put('/tags/reorder', tagController.reorderTags);

// Pages
router.get('/pages', pageController.getAllPages);
router.post('/pages', pageController.createPage);
router.put('/pages/:id', pageController.updatePage);
router.delete('/pages/:id', pageController.deletePage);

// Settings
router.get('/settings', settingController.getAllSettings);
router.put('/settings/key/:key', settingController.updateSetting);
router.put('/settings', settingController.bulkUpdateSettings);
router.post('/settings/init', settingController.initializeSettings);

// Database Explorer Routes
router.get('/collections', protect, admin, getCollections);
router.get('/collections/:collectionName', protect, admin, getCollectionData);
router.get('/dashboard', protect, admin, getDashboardStats);

module.exports = router;
