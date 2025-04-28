const express = require('express');
const router = express.Router();
const { 
  submitContactForm,
  getAllContacts,
  getContactById,
  markAsRead,
  markAsReplied,
  markAsSpam,
  archiveContact,
  deleteContact
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', submitContactForm);

// Admin routes
router.get('/admin', protect, admin, getAllContacts);
router.get('/:id', protect, admin, getContactById);
router.put('/:id/read', protect, admin, markAsRead);
router.put('/:id/reply', protect, admin, markAsReplied);
router.put('/:id/spam', protect, admin, markAsSpam);
router.put('/:id/archive', protect, admin, archiveContact);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
