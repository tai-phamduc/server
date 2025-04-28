const FAQ = require('../models/FAQ');
const asyncHandler = require('express-async-handler');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
const getFAQs = asyncHandler(async (req, res) => {
  const category = req.query.category;
  
  let faqs;
  
  if (category) {
    faqs = await FAQ.findByCategory(category);
  } else {
    faqs = await FAQ.findActive();
  }
  
  res.json(faqs);
});

// @desc    Get FAQ categories
// @route   GET /api/faqs/categories
// @access  Public
const getFAQCategories = asyncHandler(async (req, res) => {
  const categories = await FAQ.findCategories();
  
  res.json(categories);
});

// @desc    Get FAQ by ID
// @route   GET /api/faqs/:id
// @access  Public
const getFAQById = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  
  if (!faq || !faq.isActive) {
    res.status(404);
    throw new Error('FAQ not found');
  }
  
  res.json(faq);
});

// @desc    Create a FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer, category, order } = req.body;
  
  const faq = await FAQ.create({
    question,
    answer,
    category: category || 'General',
    order: order || 0,
    createdBy: req.user._id
  });
  
  res.status(201).json(faq);
});

// @desc    Update a FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFAQ = asyncHandler(async (req, res) => {
  const { question, answer, category, order, isActive } = req.body;
  
  const faq = await FAQ.findById(req.params.id);
  
  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }
  
  // Update fields
  if (question) faq.question = question;
  if (answer) faq.answer = answer;
  if (category) faq.category = category;
  if (order !== undefined) faq.order = order;
  if (isActive !== undefined) faq.isActive = isActive;
  
  faq.updatedBy = req.user._id;
  
  const updatedFAQ = await faq.save();
  
  res.json(updatedFAQ);
});

// @desc    Delete a FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  
  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }
  
  await faq.remove();
  
  res.json({ message: 'FAQ removed' });
});

// @desc    Reorder FAQs
// @route   PUT /api/faqs/reorder
// @access  Private/Admin
const reorderFAQs = asyncHandler(async (req, res) => {
  const { orders } = req.body;
  
  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error('Invalid order data');
  }
  
  const updatePromises = orders.map(item => {
    return FAQ.findByIdAndUpdate(
      item.id,
      { order: item.order },
      { new: true }
    );
  });
  
  await Promise.all(updatePromises);
  
  res.json({ message: 'FAQs reordered successfully' });
});

module.exports = {
  getFAQs,
  getFAQCategories,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  reorderFAQs
};
