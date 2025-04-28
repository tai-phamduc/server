const mongoose = require('mongoose');

// Get current date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

// Create notification data
const notifications = [
  // Admin notifications
  {
    recipient: '680d29841ad99532cd239b01', // Admin User
    type: 'system',
    title: 'New User Registration',
    message: 'A new user has registered on the platform.',
    isRead: true,
    link: '/admin/users',
    createdAt: threeDaysAgo,
    updatedAt: threeDaysAgo
  },
  {
    recipient: '680d29841ad99532cd239b01', // Admin User
    type: 'system',
    title: 'Payment System Alert',
    message: 'The payment gateway reported a temporary outage. Some transactions may be affected.',
    isRead: true,
    link: '/admin/payments',
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo
  },
  {
    recipient: '680d29841ad99532cd239b01', // Admin User
    type: 'system',
    title: 'New Contact Form Submission',
    message: 'A new high-priority contact form has been submitted.',
    isRead: false,
    link: '/admin/contacts',
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    recipient: '680d29841ad99532cd239b01', // Admin User
    type: 'system',
    title: 'Low Ticket Inventory',
    message: 'The Dark Knight IMAX showing for tonight is almost sold out (85% capacity).',
    isRead: false,
    link: '/admin/showtimes',
    createdAt: today,
    updatedAt: today
  },
  
  // User notifications - User 2
  {
    recipient: '680d29841ad99532cd239b02', // Jane Smith
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for The Dark Knight has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    recipient: '680d29841ad99532cd239b02', // Jane Smith
    type: 'reminder',
    title: 'Upcoming Movie Reminder',
    message: 'Your movie The Dark Knight starts in 2 hours. Don\'t forget your tickets!',
    isRead: false,
    link: '/my-bookings',
    createdAt: today,
    updatedAt: today
  },
  
  // User notifications - User 3
  {
    recipient: '680d29841ad99532cd239b03', // Michael Johnson
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Inception has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    recipient: '680d29841ad99532cd239b03', // Michael Johnson
    type: 'promo',
    title: 'Special Offer',
    message: 'Get 20% off on your next booking with promo code MOVIE20.',
    isRead: false,
    link: '/promotions',
    createdAt: today,
    updatedAt: today
  },
  
  // User notifications - User 4
  {
    recipient: '680d29841ad99532cd239b04', // Emily Davis
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Dune has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    recipient: '680d29841ad99532cd239b04', // Emily Davis
    type: 'system',
    title: 'Account Update',
    message: 'Your account information has been successfully updated.',
    isRead: false,
    link: '/profile',
    createdAt: today,
    updatedAt: today
  },
  
  // User notifications - User 5
  {
    recipient: '680d29841ad99532cd239b05', // Robert Wilson
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Pulp Fiction has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo
  },
  {
    recipient: '680d29841ad99532cd239b05', // Robert Wilson
    type: 'reminder',
    title: 'Rate Your Experience',
    message: 'How was your experience watching Pulp Fiction? Leave a review!',
    isRead: false,
    link: '/movies/pulp-fiction',
    createdAt: yesterday,
    updatedAt: yesterday
  },
  
  // User notifications - User 6
  {
    recipient: '680d29841ad99532cd239b06', // Sarah Brown
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Interstellar has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    createdAt: threeDaysAgo,
    updatedAt: threeDaysAgo
  },
  {
    recipient: '680d29841ad99532cd239b06', // Sarah Brown
    type: 'promo',
    title: 'New Movies Added',
    message: 'Check out the latest movies added to our catalog this week!',
    isRead: false,
    link: '/movies',
    createdAt: today,
    updatedAt: today
  },
  
  // User notifications - User 7
  {
    recipient: '680d29841ad99532cd239b07', // David Miller
    type: 'system',
    title: 'Payment Failed',
    message: 'Your payment for The Godfather booking could not be processed. Please update your payment method.',
    isRead: true,
    link: '/payment-methods',
    createdAt: yesterday,
    updatedAt: yesterday
  },
  
  // User notifications - User 8
  {
    recipient: '680d29841ad99532cd239b08', // Jennifer Taylor
    type: 'booking',
    title: 'Booking Refunded',
    message: 'Your booking for The Dark Knight has been refunded. The amount will be credited to your original payment method within 3-5 business days.',
    isRead: false,
    link: '/my-bookings',
    createdAt: today,
    updatedAt: today
  },
  
  // User notifications - User 9
  {
    recipient: '680d29841ad99532cd239b09', // Thomas Anderson
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Inception has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    createdAt: today,
    updatedAt: today
  },
  
  // User notifications - User 1 (Admin also gets user notifications)
  {
    recipient: '680d29841ad99532cd239b01', // Admin User
    type: 'booking',
    title: 'Booking Pending',
    message: 'Your booking for Dune is pending payment confirmation.',
    isRead: false,
    link: '/my-bookings',
    createdAt: today,
    updatedAt: today
  }
];

module.exports = notifications;
