const Setting = require('../models/Setting');
const asyncHandler = require('express-async-handler');

// @desc    Get all public settings
// @route   GET /api/settings
// @access  Public
const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.getAllPublic();
  
  res.json(settings);
});

// @desc    Get settings by group
// @route   GET /api/settings/group/:group
// @access  Public
const getSettingsByGroup = asyncHandler(async (req, res) => {
  const { group } = req.params;
  const isPublicOnly = !req.user || req.user.role !== 'admin';
  
  const settings = await Setting.getByGroup(group, isPublicOnly);
  
  res.json(settings);
});

// @desc    Get setting by key
// @route   GET /api/settings/key/:key
// @access  Public/Admin
const getSettingByKey = asyncHandler(async (req, res) => {
  const { key } = req.params;
  
  const setting = await Setting.findOne({ key });
  
  if (!setting) {
    res.status(404);
    throw new Error('Setting not found');
  }
  
  // Check if setting is public or user is admin
  if (!setting.isPublic && (!req.user || req.user.role !== 'admin')) {
    res.status(403);
    throw new Error('Not authorized to access this setting');
  }
  
  res.json(setting);
});

// @desc    Update setting
// @route   PUT /api/settings/key/:key
// @access  Private/Admin
const updateSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  if (value === undefined) {
    res.status(400);
    throw new Error('Setting value is required');
  }
  
  try {
    const updatedSetting = await Setting.setByKey(key, value, req.user._id);
    res.json(updatedSetting);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Bulk update settings
// @route   PUT /api/settings
// @access  Private/Admin
const bulkUpdateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;
  
  if (!settings || typeof settings !== 'object') {
    res.status(400);
    throw new Error('Settings object is required');
  }
  
  try {
    await Setting.bulkUpdate(settings, req.user._id);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Get all settings (admin)
// @route   GET /api/settings/admin
// @access  Private/Admin
const getAllSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find()
    .sort({ group: 1, order: 1 })
    .populate('updatedBy', 'name');
  
  res.json(settings);
});

// @desc    Initialize default settings
// @route   POST /api/settings/init
// @access  Private/Admin
const initializeSettings = asyncHandler(async (req, res) => {
  await Setting.initDefaults();
  
  res.json({ message: 'Default settings initialized successfully' });
});

module.exports = {
  getPublicSettings,
  getSettingsByGroup,
  getSettingByKey,
  updateSetting,
  bulkUpdateSettings,
  getAllSettings,
  initializeSettings
};
