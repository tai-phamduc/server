const Feedback = require('../models/Feedback');
const asyncHandler = require('express-async-handler');

// @desc    Get all displayed feedback/testimonials
// @route   GET /api/feedback
// @access  Public
const getDisplayedFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findDisplayed();
  
  res.json(feedback);
});

// @desc    Get top rated feedback
// @route   GET /api/feedback/top
// @access  Public
const getTopRatedFeedback = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const feedback = await Feedback.findTopRated(limit);
  
  res.json(feedback);
});

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Public
const createFeedback = asyncHandler(async (req, res) => {
  const { name, email, content, rating, photo, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !content || !rating) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }
  
  // Create feedback data
  const feedbackData = {
    name,
    email,
    content,
    rating,
    isApproved: false,
    isDisplayed: false
  };
  
  // Add optional fields if provided
  if (photo) feedbackData.photo = photo;
  if (role) feedbackData.role = role;
  
  // Add user reference if authenticated
  if (req.user) {
    feedbackData.user = req.user._id;
  }
  
  const feedback = await Feedback.create(feedbackData);
  
  res.status(201).json({
    success: true,
    message: 'Thank you for your feedback! It will be reviewed shortly.',
    feedback
  });
});

// @desc    Get all feedback (admin)
// @route   GET /api/feedback/admin
// @access  Private/Admin
const getAllFeedback = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const approved = req.query.approved === 'true' ? true : 
                  req.query.approved === 'false' ? false : null;
  
  const displayed = req.query.displayed === 'true' ? true : 
                   req.query.displayed === 'false' ? false : null;
  
  let query = {};
  
  if (approved !== null) {
    query.isApproved = approved;
  }
  
  if (displayed !== null) {
    query.isDisplayed = displayed;
  }
  
  const feedback = await Feedback.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');
  
  const total = await Feedback.countDocuments(query);
  
  res.json({
    feedback,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Approve feedback
// @route   PUT /api/feedback/:id/approve
// @access  Private/Admin
const approveFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }
  
  await feedback.approve();
  
  res.json({ message: 'Feedback approved successfully' });
});

// @desc    Display feedback
// @route   PUT /api/feedback/:id/display
// @access  Private/Admin
const displayFeedback = asyncHandler(async (req, res) => {
  const { order } = req.body;
  
  const feedback = await Feedback.findById(req.params.id);
  
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }
  
  // Ensure feedback is approved before displaying
  if (!feedback.isApproved) {
    res.status(400);
    throw new Error('Feedback must be approved before it can be displayed');
  }
  
  await feedback.display(order || 0);
  
  res.json({ message: 'Feedback set to display successfully' });
});

// @desc    Hide feedback
// @route   PUT /api/feedback/:id/hide
// @access  Private/Admin
const hideFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }
  
  await feedback.hide();
  
  res.json({ message: 'Feedback hidden successfully' });
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }
  
  await feedback.remove();
  
  res.json({ message: 'Feedback removed' });
});

module.exports = {
  getDisplayedFeedback,
  getTopRatedFeedback,
  createFeedback,
  getAllFeedback,
  approveFeedback,
  displayFeedback,
  hideFeedback,
  deleteFeedback
};
