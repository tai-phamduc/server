const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const Booking = require('../models/Booking');
const twoFactorAuth = require('../utils/twoFactorAuth');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email with password included
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/users/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    console.log('getUserBookings called with user:', req.user);

    if (!req.user || !req.user._id) {
      console.error('No user found in request or user missing _id');
      return res.status(401).json({ message: 'User not authenticated properly' });
    }

    console.log('Attempting to find bookings for user ID:', req.user._id);

    try {
      const bookings = await Booking.find({ user: req.user._id })
        .populate('movie', 'title poster')
        .populate('screening', 'start_time cinema_id room_id')
        .sort({ createdAt: -1 });

      console.log(`Found ${bookings.length} bookings for user`);

      // If no bookings found, check if user exists
      if (bookings.length === 0) {
        const userExists = await User.findById(req.user._id);
        console.log('User exists in database:', userExists ? 'Yes' : 'No');

        // Check if there are any bookings at all in the system
        const totalBookings = await Booking.countDocuments();
        console.log('Total bookings in system:', totalBookings);
      }

      res.json(bookings);
    } catch (dbError) {
      console.error('Database error when finding bookings:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// @desc    Get user booking history
// @route   GET /api/users/booking-history
// @access  Private
const getUserBookingHistory = async (req, res) => {
  try {
    // Get user with populated booking history
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookingHistory',
        populate: [
          { path: 'movie', select: 'title poster slug' },
          { path: 'cinema', select: 'name location' }
        ],
        options: { sort: { bookingDate: -1 } }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user has booking history, return it
    if (user.bookingHistory && user.bookingHistory.length > 0) {
      return res.json(user.bookingHistory);
    }

    // If no booking history in user document, fetch from bookings collection
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster slug')
      .populate('cinema', 'name location')
      .sort({ bookingDate: -1 });

    // Update user's booking history
    if (bookings.length > 0) {
      user.bookingHistory = bookings.map(booking => booking._id);
      await user.save();
      console.log(`Updated user's booking history with ${bookings.length} bookings`);
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user booking history:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile picture
// @route   PUT /api/users/profile-picture
// @access  Private
const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Update profile picture
    user.profilePicture = `/${req.file.path}`;
    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/reset-password/${resetToken}`;

    // Create email content
    const html = `
      <h1>Password Reset</h1>
      <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
      <p>Please click on the following link to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        html,
      });

      res.json({ message: 'Email sent' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Setup two-factor authentication
// @route   POST /api/users/2fa/setup
// @access  Private
const setupTwoFactorAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Generate a new secret
    const secret = twoFactorAuth.generateSecret(user.email);

    // Generate QR code
    const qrCode = await twoFactorAuth.generateQRCode(secret.otpauth_url);

    // Save temp secret to user
    user.twoFactorAuth.tempSecret = secret.base32;
    await user.save();

    res.json({
      message: 'Two-factor authentication setup initiated',
      secret: secret.base32,
      qrCode,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify and enable two-factor authentication
// @route   POST /api/users/2fa/verify
// @access  Private
const verifyAndEnableTwoFactorAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.twoFactorAuth.tempSecret) {
      return res.status(400).json({ message: 'Two-factor authentication not set up' });
    }

    // Verify token
    const verified = twoFactorAuth.verifyToken(token, user.twoFactorAuth.tempSecret);

    if (!verified) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Generate backup codes
    const backupCodes = twoFactorAuth.generateBackupCodes();
    const hashedBackupCodes = twoFactorAuth.hashBackupCodes(backupCodes);

    // Enable 2FA
    user.twoFactorAuth.isEnabled = true;
    user.twoFactorAuth.secret = user.twoFactorAuth.tempSecret;
    user.twoFactorAuth.tempSecret = undefined;
    user.twoFactorAuth.backupCodes = hashedBackupCodes;

    await user.save();

    res.json({
      message: 'Two-factor authentication enabled',
      backupCodes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Disable two-factor authentication
// @route   POST /api/users/2fa/disable
// @access  Private
const disableTwoFactorAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.twoFactorAuth.isEnabled) {
      return res.status(400).json({ message: 'Two-factor authentication not enabled' });
    }

    // Verify token
    const verified = twoFactorAuth.verifyToken(token, user.twoFactorAuth.secret);

    if (!verified) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Disable 2FA
    user.twoFactorAuth.isEnabled = false;
    user.twoFactorAuth.secret = undefined;
    user.twoFactorAuth.backupCodes = undefined;

    await user.save();

    res.json({ message: 'Two-factor authentication disabled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify two-factor authentication token
// @route   POST /api/users/2fa/verify-token
// @access  Public
const verifyTwoFactorToken = async (req, res) => {
  try {
    const { email, token, backupCode } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorAuth.isEnabled) {
      return res.status(400).json({ message: 'Two-factor authentication not enabled' });
    }

    let verified = false;

    // Check if using token or backup code
    if (token) {
      verified = twoFactorAuth.verifyToken(token, user.twoFactorAuth.secret);
    } else if (backupCode) {
      verified = twoFactorAuth.verifyBackupCode(backupCode, user.twoFactorAuth.backupCodes);

      // If backup code is valid, remove it from the list
      if (verified) {
        user.twoFactorAuth.backupCodes = user.twoFactorAuth.backupCodes.filter(
          (code) => code !== twoFactorAuth.hashBackupCodes([backupCode])[0]
        );
        await user.save();
      }
    } else {
      return res.status(400).json({ message: 'Token or backup code is required' });
    }

    if (!verified) {
      return res.status(400).json({ message: 'Invalid token or backup code' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate new backup codes
// @route   POST /api/users/2fa/backup-codes
// @access  Private
const generateNewBackupCodes = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.twoFactorAuth.isEnabled) {
      return res.status(400).json({ message: 'Two-factor authentication not enabled' });
    }

    // Verify token
    const verified = twoFactorAuth.verifyToken(token, user.twoFactorAuth.secret);

    if (!verified) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Generate new backup codes
    const backupCodes = twoFactorAuth.generateBackupCodes();
    const hashedBackupCodes = twoFactorAuth.hashBackupCodes(backupCodes);

    // Update backup codes
    user.twoFactorAuth.backupCodes = hashedBackupCodes;
    await user.save();

    res.json({
      message: 'New backup codes generated',
      backupCodes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserBookings,
  getUserBookingHistory,
  updatePassword,
  uploadProfilePicture,
  forgotPassword,
  resetPassword,
  setupTwoFactorAuth,
  verifyAndEnableTwoFactorAuth,
  disableTwoFactorAuth,
  verifyTwoFactorToken,
  generateNewBackupCodes,
};
