const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/upload
// @desc    Upload a file
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  try {
    res.json({
      message: 'File uploaded successfully',
      file: `/${req.file.path}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
