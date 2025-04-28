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
    user: '680d29841ad99532cd239b02', // Jane Smith
    type: 'movie_experience',
    rating: 5,
    title: 'Amazing Experience',
    comment: 'The Dark Knight in IMAX was absolutely breathtaking! The sound quality and picture clarity were exceptional. I felt completely immersed in the movie.',
    tags: ['IMAX', 'Sound Quality', 'Picture Quality'],
    status: 'published',
    isAnonymous: false,
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    user: '680d29841ad99532cd239b03', // Michael Johnson
    type: 'theater_facilities',
    rating: 4,
    title: 'Great Facilities, Minor Issues',
    comment: 'The Cineplex Odeon has excellent seating and a great concession stand. The only issue was that the restrooms could have been cleaner. Otherwise, a very good experience.',
    tags: ['Seating', 'Concessions', 'Cleanliness'],
    status: 'published',
    isAnonymous: false,
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo
  },
  {
    user: '680d29841ad99532cd239b04', // Emily Davis
    type: 'customer_service',
    rating: 5,
    title: 'Exceptional Service',
    comment: 'The staff at Landmark Theatres were incredibly helpful and friendly. I had an issue with my booking and they resolved it immediately with a smile. Top-notch customer service!',
    tags: ['Staff', 'Problem Resolution', 'Friendly Service'],
    status: 'published',
    isAnonymous: false,
    createdAt: threeDaysAgo,
    updatedAt: threeDaysAgo
  },
  {
    user: '680d29841ad99532cd239b05', // Robert Wilson
    type: 'food_quality',
    rating: 3,
    title: 'Average Food, High Prices',
    comment: 'The popcorn was fresh but the nachos were stale. Prices are quite high for what you get. I would recommend bringing your own snacks if possible.',
    tags: ['Popcorn', 'Nachos', 'Pricing'],
    status: 'published',
    isAnonymous: false,
    createdAt: fourDaysAgo,
    updatedAt: fourDaysAgo
  },
  {
    user: '680d29841ad99532cd239b06', // Sarah Brown
    type: 'website_app',
    rating: 2,
    title: 'Website Needs Improvement',
    comment: 'The booking process on the website is confusing and slow. I had to try multiple times to complete my booking. Please make it more user-friendly.',
    tags: ['Website', 'Booking Process', 'User Experience'],
    status: 'published',
    isAnonymous: false,
    createdAt: fiveDaysAgo,
    updatedAt: fiveDaysAgo
  },
  {
    user: '680d29841ad99532cd239b07', // David Miller
    type: 'movie_experience',
    rating: 1,
    title: 'Terrible Sound Quality',
    comment: 'The sound during the movie was terrible. It was either too loud or too quiet, and there was a constant buzzing noise. It completely ruined the experience.',
    tags: ['Sound Issues', 'Technical Problems'],
    status: 'published',
    isAnonymous: false,
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    user: '680d29841ad99532cd239b08', // Jennifer Taylor
    type: 'theater_facilities',
    rating: 5,
    title: 'Excellent Accessibility Features',
    comment: 'I was impressed by the accessibility features at Grand Cinema. The wheelchair access was excellent, and the staff were very accommodating. Thank you for making it inclusive for everyone.',
    tags: ['Accessibility', 'Wheelchair Access', 'Inclusive'],
    status: 'published',
    isAnonymous: false,
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo
  },
  {
    user: '680d29841ad99532cd239b09', // Thomas Anderson
    type: 'customer_service',
    rating: 4,
    title: 'Helpful Staff, Long Wait',
    comment: 'The staff were very helpful, but there was a long wait at the ticket counter. Consider adding more self-service kiosks to reduce waiting times during peak hours.',
    tags: ['Staff', 'Wait Times', 'Ticket Counter'],
    status: 'published',
    isAnonymous: false,
    createdAt: today,
    updatedAt: today
  },
  {
    user: null,
    type: 'movie_experience',
    rating: 5,
    title: 'Perfect Date Night',
    comment: 'My partner and I had a wonderful date night watching Inception. The VIP seating was worth every penny. Will definitely come back!',
    tags: ['Date Night', 'VIP Seating', 'Romantic'],
    status: 'published',
    isAnonymous: true,
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    user: null,
    type: 'food_quality',
    rating: 2,
    title: 'Overpriced and Underwhelming',
    comment: 'The food quality does not justify the high prices. $15 for a small popcorn and soda is excessive. Please reconsider your pricing strategy.',
    tags: ['Pricing', 'Value', 'Concessions'],
    status: 'pending',
    isAnonymous: true,
    createdAt: today,
    updatedAt: today
  }
];

module.exports = feedbacks;
