const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserBookings,
  updatePassword,
  uploadProfilePicture,
  forgotPassword,
  resetPassword,
  setupTwoFactorAuth,
  verifyAndEnableTwoFactorAuth,
  disableTwoFactorAuth,
  verifyTwoFactorToken,
  generateNewBackupCodes
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.post('/2fa/verify-token', verifyTwoFactorToken);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/bookings', protect, getUserBookings);
router.put('/password', protect, updatePassword);
router.put('/profile-picture', protect, upload.single('image'), uploadProfilePicture);

// Two-factor authentication routes
router.post('/2fa/setup', protect, setupTwoFactorAuth);
router.post('/2fa/verify', protect, verifyAndEnableTwoFactorAuth);
router.post('/2fa/disable', protect, disableTwoFactorAuth);
router.post('/2fa/backup-codes', protect, generateNewBackupCodes);

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
