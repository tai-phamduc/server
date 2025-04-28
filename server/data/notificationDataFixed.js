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
    user: '680d29841ad99532cd239b01', // Admin User
    type: 'system',
    title: 'New User Registration',
    message: 'A new user has registered on the platform.',
    isRead: true,
    link: '/admin/users',
    icon: 'user-plus',
    isActionable: true,
    actionUrl: '/admin/users',
    actionText: 'View Users'
  },
  {
    user: '680d29841ad99532cd239b01', // Admin User
    type: 'system',
    title: 'Payment System Alert',
    message: 'The payment gateway reported a temporary outage. Some transactions may be affected.',
    isRead: true,
    link: '/admin/payments',
    icon: 'credit-card',
    isActionable: true,
    actionUrl: '/admin/payments',
    actionText: 'View Payments'
  },
  {
    user: '680d29841ad99532cd239b01', // Admin User
    type: 'system',
    title: 'New Contact Form Submission',
    message: 'A new high-priority contact form has been submitted.',
    isRead: false,
    link: '/admin/contacts',
    icon: 'envelope',
    isActionable: true,
    actionUrl: '/admin/contacts',
    actionText: 'View Contacts'
  },
  {
    user: '680d29841ad99532cd239b01', // Admin User
    type: 'system',
    title: 'Low Ticket Inventory',
    message: 'The Dark Knight IMAX showing for tonight is almost sold out (85% capacity).',
    isRead: false,
    link: '/admin/showtimes',
    icon: 'ticket',
    isActionable: true,
    actionUrl: '/admin/showtimes',
    actionText: 'View Showtimes'
  },
  
  // User notifications - User 2
  {
    user: '680d29841ad99532cd239b02', // Jane Smith
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for The Dark Knight has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    icon: 'check-circle',
    isActionable: true,
    actionUrl: '/my-bookings',
    actionText: 'View Booking'
  },
  {
    user: '680d29841ad99532cd239b02', // Jane Smith
    type: 'reminder',
    title: 'Upcoming Movie Reminder',
    message: 'Your movie The Dark Knight starts in 2 hours. Don\'t forget your tickets!',
    isRead: false,
    link: '/my-bookings',
    icon: 'clock',
    isActionable: true,
    actionUrl: '/my-bookings',
    actionText: 'View Booking'
  },
  
  // User notifications - User 3
  {
    user: '680d29841ad99532cd239b03', // Michael Johnson
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Inception has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    icon: 'check-circle',
    isActionable: true,
    actionUrl: '/my-bookings',
    actionText: 'View Booking'
  },
  {
    user: '680d29841ad99532cd239b03', // Michael Johnson
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off on your next booking with promo code MOVIE20.',
    isRead: false,
    link: '/promotions',
    icon: 'tag',
    isActionable: true,
    actionUrl: '/promotions',
    actionText: 'View Offer'
  },
  
  // User notifications - User 4
  {
    user: '680d29841ad99532cd239b04', // Emily Davis
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Dune has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    icon: 'check-circle',
    isActionable: true,
    actionUrl: '/my-bookings',
    actionText: 'View Booking'
  },
  {
    user: '680d29841ad99532cd239b04', // Emily Davis
    type: 'system',
    title: 'Account Update',
    message: 'Your account information has been successfully updated.',
    isRead: false,
    link: '/profile',
    icon: 'user',
    isActionable: true,
    actionUrl: '/profile',
    actionText: 'View Profile'
  },
  
  // User notifications - User 5
  {
    user: '680d29841ad99532cd239b05', // Robert Wilson
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Pulp Fiction has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    icon: 'check-circle',
    isActionable: true,
    actionUrl: '/my-bookings',
    actionText: 'View Booking'
  },
  {
    user: '680d29841ad99532cd239b05', // Robert Wilson
    type: 'reminder',
    title: 'Rate Your Experience',
    message: 'How was your experience watching Pulp Fiction? Leave a review!',
    isRead: false,
    link: '/movies/pulp-fiction',
    icon: 'star',
    isActionable: true,
    actionUrl: '/movies/pulp-fiction',
    actionText: 'Leave Review'
  },
  
  // User notifications - User 6
  {
    user: '680d29841ad99532cd239b06', // Sarah Brown
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Interstellar has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    icon: 'check-circle',
    isActionable: true,
    actionUrl: '/my-bookings',
    actionText: 'View Booking'
  },
  {
    user: '680d29841ad99532cd239b06', // Sarah Brown
    type: 'promotion',
    title: 'New Movies Added',
    message: 'Check out the latest movies added to our catalog this week!',
    isRead: false,
    link: '/movies',
    icon: 'film',
    isActionable: true,
    actionUrl: '/movies',
    actionText: 'View Movies'
  },
  
  // User notifications - User 7
  {
    user: '680d29841ad99532cd239b07', // David Miller
    type: 'system',
    title: 'Payment Failed',
    message: 'Your payment for The Godfather booking could not be processed. Please update your payment method.',
    isRead: true,
    link: '/payment-methods',
    icon: 'exclamation-circle',
    isActionable: true,
    actionUrl: '/payment-methods',
    actionText: 'Update Payment'
  },
  
  // User notifications - User 8
  {
    user: '680d29841ad99532cd239b08', // Jennifer Taylor
    type: 'booking',
    title: 'Booking Refunded',
    message: 'Your booking for The Dark Knight has been refunded. The amount will be credited to your original payment method within 3-5 business days.',
    isRead: false,
    link: '/my-bookings',
    icon: 'undo',
    isActionable: true,
    actionUrl: '/my-bookings',
    actionText: 'View Refund'
  },
  
  // User notifications - User 9
  {
    user: '680d29841ad99532cd239b09', // Thomas Anderson
    type: 'booking',
    title: 'Booking Confirmation',
    message: 'Your booking for Inception has been confirmed. Enjoy the show!',
    isRead: true,
    link: '/my-bookings',
    icon: 'check-circle',
    isActionable: true,
    actionUrl: '/my-bookings',
    actionText: 'View Booking'
  },
  
  // User notifications - User 1 (Admin also gets user notifications)
  {
    user: '680d29841ad99532cd239b01', // Admin User
    type: 'booking',
    title: 'Booking Pending',
    message: 'Your booking for Dune is pending payment confirmation.',
    isRead: false,
    link: '/my-bookings',
    icon: 'clock',
    isActionable: true,
    actionUrl: '/my-bookings',
    actionText: 'View Booking'
  }
];

module.exports = notifications;
