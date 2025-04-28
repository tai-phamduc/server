const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  // Validate required fields
  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }
  
  // Create contact data
  const contactData = {
    name,
    email,
    subject,
    message,
    status: 'new'
  };
  
  // Add optional fields if provided
  if (phone) contactData.phone = phone;
  
  // Add IP and user agent for tracking
  contactData.ipAddress = req.ip;
  contactData.userAgent = req.headers['user-agent'];
  
  // Add user reference if authenticated
  if (req.user) {
    contactData.user = req.user._id;
  }
  
  const contact = await Contact.create(contactData);
  
  res.status(201).json({
    success: true,
    message: 'Thank you for contacting us! We will get back to you soon.',
    contact
  });
});

// @desc    Get all contacts (admin)
// @route   GET /api/contact/admin
// @access  Private/Admin
const getAllContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const status = req.query.status;
  const email = req.query.email;
  
  let query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (email) {
    query.email = { $regex: email, $options: 'i' };
  }
  
  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate('repliedBy', 'name');
  
  const total = await Contact.countDocuments(query);
  
  res.json({
    contacts,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get contact by ID (admin)
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
    .populate('user', 'name email')
    .populate('repliedBy', 'name');
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  res.json(contact);
});

// @desc    Mark contact as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
const markAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  await contact.markAsRead(req.user._id);
  
  res.json({ message: 'Contact marked as read' });
});

// @desc    Mark contact as replied
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
const markAsReplied = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  
  if (!message) {
    res.status(400);
    throw new Error('Reply message is required');
  }
  
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  await contact.markAsReplied(req.user._id, subject || `Re: ${contact.subject}`, message);
  
  res.json({ message: 'Contact marked as replied' });
});

// @desc    Mark contact as spam
// @route   PUT /api/contact/:id/spam
// @access  Private/Admin
const markAsSpam = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  await contact.markAsSpam();
  
  res.json({ message: 'Contact marked as spam' });
});

// @desc    Archive contact
// @route   PUT /api/contact/:id/archive
// @access  Private/Admin
const archiveContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  await contact.archive();
  
  res.json({ message: 'Contact archived' });
});

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  await contact.remove();
  
  res.json({ message: 'Contact removed' });
});

module.exports = {
  submitContactForm,
  getAllContacts,
  getContactById,
  markAsRead,
  markAsReplied,
  markAsSpam,
  archiveContact,
  deleteContact
};
