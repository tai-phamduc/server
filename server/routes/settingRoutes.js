const express = require('express');
const router = express.Router();
const { 
  getPublicSettings,
  getSettingsByGroup,
  getSettingByKey,
  updateSetting,
  bulkUpdateSettings,
  getAllSettings,
  initializeSettings
} = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPublicSettings);
router.get('/group/:group', getSettingsByGroup);
router.get('/key/:key', getSettingByKey);

// Admin routes
router.get('/admin', protect, admin, getAllSettings);
router.put('/key/:key', protect, admin, updateSetting);
router.put('/', protect, admin, bulkUpdateSettings);
router.post('/init', protect, admin, initializeSettings);

module.exports = router;
