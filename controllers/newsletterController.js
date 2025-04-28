const Newsletter = require('../models/Newsletter');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email, name, preferences } = req.body;
  
  // Validate email
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }
  
  // Check if already subscribed
  const existingSubscription = await Newsletter.findOne({ email });
  
  if (existingSubscription) {
    // If already active, return success
    if (existingSubscription.isActive) {
      return res.json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    }
    
    // If inactive, reactivate
    existingSubscription.isActive = true;
    
    // Generate new verification token if not verified
    if (!existingSubscription.isVerified) {
      const token = crypto.randomBytes(32).toString('hex');
      existingSubscription.verificationToken = token;
      existingSubscription.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
    
    // Update preferences if provided
    if (preferences) {
      existingSubscription.preferences = {
        ...existingSubscription.preferences,
        ...preferences
      };
    }
    
    // Update name if provided
    if (name) {
      existingSubscription.name = name;
    }
    
    // Update tracking info
    existingSubscription.ipAddress = req.ip;
    existingSubscription.userAgent = req.headers['user-agent'];
    
    // Add user reference if authenticated
    if (req.user) {
      existingSubscription.user = req.user._id;
    }
    
    await existingSubscription.save();
    
    return res.json({
      success: true,
      message: 'Your subscription has been reactivated! Please check your email to verify your subscription.',
      verificationRequired: !existingSubscription.isVerified
    });
  }
  
  // Create new subscription
  const subscriptionData = {
    email,
    isActive: true,
    isVerified: false,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  };
  
  // Add optional fields if provided
  if (name) subscriptionData.name = name;
  if (preferences) subscriptionData.preferences = preferences;
  
  // Add user reference if authenticated
  if (req.user) {
    subscriptionData.user = req.user._id;
  }
  
  const subscription = await Newsletter.create(subscriptionData);
  
  res.status(201).json({
    success: true,
    message: 'Thank you for subscribing to our newsletter! Please check your email to verify your subscription.',
    verificationRequired: true
  });
});

// @desc    Verify newsletter subscription
// @route   GET /api/newsletter/verify/:token
// @access  Public
const verifyNewsletter = asyncHandler(async (req, res) => {
  const { token } = req.params;
  
  const subscription = await Newsletter.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
    isActive: true
  });
  
  if (!subscription) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }
  
  await subscription.verify();
  
  res.json({
    success: true,
    message: 'Your subscription has been verified successfully!'
  });
});

// @desc    Unsubscribe from newsletter
// @route   GET /api/newsletter/unsubscribe/:token
// @access  Public
const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  const { token } = req.params;
  
  const subscription = await Newsletter.findOne({
    unsubscribeToken: token,
    isActive: true
  });
  
  if (!subscription) {
    res.status(400);
    throw new Error('Invalid unsubscribe token');
  }
  
  await subscription.unsubscribe();
  
  res.json({
    success: true,
    message: 'You have been unsubscribed successfully!'
  });
});

// @desc    Update newsletter preferences
// @route   PUT /api/newsletter/preferences
// @access  Private
const updatePreferences = asyncHandler(async (req, res) => {
  const { preferences } = req.body;
  
  if (!preferences) {
    res.status(400);
    throw new Error('Preferences are required');
  }
  
  // Find subscription by user or email
  let subscription;
  
  if (req.user) {
    subscription = await Newsletter.findOne({ user: req.user._id, isActive: true });
    
    if (!subscription) {
      // Try to find by email
      subscription = await Newsletter.findOne({ email: req.user.email, isActive: true });
    }
  }
  
  if (!subscription) {
    res.status(404);
    throw new Error('Subscription not found');
  }
  
  // Update preferences
  subscription.preferences = {
    ...subscription.preferences,
    ...preferences
  };
  
  await subscription.save();
  
  res.json({
    success: true,
    message: 'Your preferences have been updated successfully!',
    preferences: subscription.preferences
  });
});

// @desc    Get all newsletter subscriptions (admin)
// @route   GET /api/newsletter/admin
// @access  Private/Admin
const getAllSubscriptions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const active = req.query.active === 'true' ? true : 
                req.query.active === 'false' ? false : null;
  
  const verified = req.query.verified === 'true' ? true : 
                  req.query.verified === 'false' ? false : null;
  
  let query = {};
  
  if (active !== null) {
    query.isActive = active;
  }
  
  if (verified !== null) {
    query.isVerified = verified;
  }
  
  const subscriptions = await Newsletter.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');
  
  const total = await Newsletter.countDocuments(query);
  
  res.json({
    subscriptions,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Delete newsletter subscription (admin)
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
const deleteSubscription = asyncHandler(async (req, res) => {
  const subscription = await Newsletter.findById(req.params.id);
  
  if (!subscription) {
    res.status(404);
    throw new Error('Subscription not found');
  }
  
  await subscription.remove();
  
  res.json({ message: 'Subscription removed' });
});

// @desc    Export newsletter subscribers (admin)
// @route   GET /api/newsletter/export
// @access  Private/Admin
const exportSubscribers = asyncHandler(async (req, res) => {
  const active = req.query.active === 'true' ? true : 
                req.query.active === 'false' ? false : true;
  
  const verified = req.query.verified === 'true' ? true : 
                  req.query.verified === 'false' ? false : true;
  
  const subscriptions = await Newsletter.find({
    isActive: active,
    isVerified: verified
  })
    .select('email name preferences createdAt')
    .sort({ createdAt: -1 });
  
  // Format data for export
  const exportData = subscriptions.map(sub => ({
    email: sub.email,
    name: sub.name || '',
    movies: sub.preferences.movies ? 'Yes' : 'No',
    events: sub.preferences.events ? 'Yes' : 'No',
    news: sub.preferences.news ? 'Yes' : 'No',
    promotions: sub.preferences.promotions ? 'Yes' : 'No',
    subscribedOn: sub.createdAt.toISOString().split('T')[0]
  }));
  
  res.json(exportData);
});

module.exports = {
  subscribeNewsletter,
  verifyNewsletter,
  unsubscribeNewsletter,
  updatePreferences,
  getAllSubscriptions,
  deleteSubscription,
  exportSubscribers
};
