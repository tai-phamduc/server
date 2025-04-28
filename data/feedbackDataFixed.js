const mongoose = require('mongoose');

// Get current date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const fourDaysAgo = new Date(today);
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
const fiveDaysAgo = new Date(today);
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

// Create feedback data
const feedbacks = [
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    role: 'Customer',
    content: 'The Dark Knight in IMAX was absolutely breathtaking! The sound quality and picture clarity were exceptional. I felt completely immersed in the movie.',
    rating: 5,
    isApproved: true,
    isDisplayed: true,
    displayOrder: 1,
    user: '680d29841ad99532cd239b02' // Jane Smith
  },
  {
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    role: 'Customer',
    content: 'The Cineplex Odeon has excellent seating and a great concession stand. The only issue was that the restrooms could have been cleaner. Otherwise, a very good experience.',
    rating: 4,
    isApproved: true,
    isDisplayed: true,
    displayOrder: 2,
    user: '680d29841ad99532cd239b03' // Michael Johnson
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
    role: 'Customer',
    content: 'The staff at Landmark Theatres were incredibly helpful and friendly. I had an issue with my booking and they resolved it immediately with a smile. Top-notch customer service!',
    rating: 5,
    isApproved: true,
    isDisplayed: true,
    displayOrder: 3,
    user: '680d29841ad99532cd239b04' // Emily Davis
  },
  {
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    role: 'Customer',
    content: 'The popcorn was fresh but the nachos were stale. Prices are quite high for what you get. I would recommend bringing your own snacks if possible.',
    rating: 3,
    isApproved: true,
    isDisplayed: false,
    displayOrder: 0,
    user: '680d29841ad99532cd239b05' // Robert Wilson
  },
  {
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    photo: 'https://randomuser.me/api/portraits/women/6.jpg',
    role: 'Customer',
    content: 'The booking process on the website is confusing and slow. I had to try multiple times to complete my booking. Please make it more user-friendly.',
    rating: 2,
    isApproved: true,
    isDisplayed: false,
    displayOrder: 0,
    user: '680d29841ad99532cd239b06' // Sarah Brown
  },
  {
    name: 'David Miller',
    email: 'david.miller@example.com',
    photo: 'https://randomuser.me/api/portraits/men/7.jpg',
    role: 'Customer',
    content: 'The sound during the movie was terrible. It was either too loud or too quiet, and there was a constant buzzing noise. It completely ruined the experience.',
    rating: 1,
    isApproved: true,
    isDisplayed: false,
    displayOrder: 0,
    user: '680d29841ad99532cd239b07' // David Miller
  },
  {
    name: 'Jennifer Taylor',
    email: 'jennifer.taylor@example.com',
    photo: 'https://randomuser.me/api/portraits/women/8.jpg',
    role: 'Customer',
    content: 'I was impressed by the accessibility features at Grand Cinema. The wheelchair access was excellent, and the staff were very accommodating. Thank you for making it inclusive for everyone.',
    rating: 5,
    isApproved: true,
    isDisplayed: true,
    displayOrder: 4,
    user: '680d29841ad99532cd239b08' // Jennifer Taylor
  },
  {
    name: 'Thomas Anderson',
    email: 'thomas.anderson@example.com',
    photo: 'https://randomuser.me/api/portraits/men/9.jpg',
    role: 'Customer',
    content: 'The staff were very helpful, but there was a long wait at the ticket counter. Consider adding more self-service kiosks to reduce waiting times during peak hours.',
    rating: 4,
    isApproved: true,
    isDisplayed: true,
    displayOrder: 5,
    user: '680d29841ad99532cd239b09' // Thomas Anderson
  },
  {
    name: 'Anonymous User',
    email: 'anonymous1@example.com',
    photo: '',
    role: 'Customer',
    content: 'My partner and I had a wonderful date night watching Inception. The VIP seating was worth every penny. Will definitely come back!',
    rating: 5,
    isApproved: true,
    isDisplayed: false,
    displayOrder: 0,
    user: null
  },
  {
    name: 'Anonymous User',
    email: 'anonymous2@example.com',
    photo: '',
    role: 'Customer',
    content: 'The food quality does not justify the high prices. $15 for a small popcorn and soda is excessive. Please reconsider your pricing strategy.',
    rating: 2,
    isApproved: false,
    isDisplayed: false,
    displayOrder: 0,
    user: null
  }
];

module.exports = feedbacks;
