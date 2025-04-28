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

// Create contact data
const contacts = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    subject: 'Booking Issue',
    message: 'I tried to book tickets for The Godfather showing tomorrow night, but the payment system gave me an error. My card was charged but I didn\'t receive a confirmation. Can you help?',
    status: 'open',
    priority: 'high',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Customer called again. Need to check payment system logs.',
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    subject: 'Lost Item',
    message: 'I believe I left my wallet in theater 3 during the 7 PM showing of Inception last night. It\'s a black leather wallet with my ID and credit cards. Has anyone turned it in?',
    status: 'closed',
    priority: 'medium',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Wallet found and returned to customer.',
    createdAt: twoDaysAgo,
    updatedAt: yesterday
  },
  {
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '555-456-7890',
    subject: 'Group Booking Inquiry',
    message: 'I\'m interested in booking a private screening for my company\'s team building event. We have about 30 people. What are your rates and available dates in the next month?',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Sent pricing information. Waiting for customer to confirm date.',
    createdAt: threeDaysAgo,
    updatedAt: yesterday
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '555-789-0123',
    subject: 'Accessibility Question',
    message: 'I use a wheelchair and I\'m planning to visit your theater this weekend. I wanted to confirm that you have accessible seating and restrooms. Also, is there designated parking for disabled visitors?',
    status: 'closed',
    priority: 'medium',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Confirmed accessibility features and sent detailed information to customer.',
    createdAt: fourDaysAgo,
    updatedAt: twoDaysAgo
  },
  {
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '555-321-6547',
    subject: 'Complaint about Noise',
    message: 'I attended the 9 PM showing of The Dark Knight last night and there was a group of teenagers making noise throughout the movie. The staff didn\'t do anything despite multiple complaints. This ruined the experience for me and other viewers.',
    status: 'open',
    priority: 'high',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Need to follow up with evening staff and review procedures.',
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    phone: '555-654-9870',
    subject: 'Job Application',
    message: 'I\'m interested in applying for the projectionist position advertised on your website. I have 5 years of experience in a similar role and I\'m available for an interview at your convenience. I\'ve attached my resume to this message.',
    status: 'in-progress',
    priority: 'low',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Forwarded to HR department.',
    createdAt: fiveDaysAgo,
    updatedAt: threeDaysAgo
  },
  {
    name: 'David Miller',
    email: 'david.miller@example.com',
    phone: '555-147-2583',
    subject: 'Food Quality Feedback',
    message: 'I visited your theater yesterday and ordered nachos and a hot dog. The nachos were stale and the hot dog was cold. For the premium prices you charge for concessions, I expected better quality. Please improve your food service.',
    status: 'closed',
    priority: 'medium',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Apologized to customer and offered free concessions on next visit. Spoke with food service manager about quality control.',
    createdAt: twoDaysAgo,
    updatedAt: yesterday
  },
  {
    name: 'Jennifer Taylor',
    email: 'jennifer.taylor@example.com',
    phone: '555-369-1478',
    subject: 'Birthday Party Booking',
    message: 'I\'d like to book a birthday party for my son who is turning 10 next month. He loves superhero movies. Do you offer any special packages for children\'s birthday parties? We\'re expecting about 15 kids.',
    status: 'open',
    priority: 'medium',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Need to check availability for the requested date.',
    createdAt: today,
    updatedAt: today
  },
  {
    name: 'Thomas Anderson',
    email: 'thomas.anderson@example.com',
    phone: '555-258-3697',
    subject: 'Website Feedback',
    message: 'I noticed that your website doesn\'t display correctly on mobile devices. The showtimes are cut off and the booking button doesn\'t work. I\'m using an iPhone 12 with Safari browser.',
    status: 'in-progress',
    priority: 'high',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Forwarded to web development team. They\'re working on a fix.',
    createdAt: yesterday,
    updatedAt: today
  },
  {
    name: 'Lisa Martinez',
    email: 'lisa.martinez@example.com',
    phone: '555-741-8520',
    subject: 'Special Screening Request',
    message: 'I\'m a teacher at Lincoln High School and I\'d like to arrange a special screening of a historical film for my history class. We have about 60 students. Are educational discounts available? We\'re flexible on dates in the coming month.',
    status: 'open',
    priority: 'low',
    assignedTo: '680d29841ad99532cd239b01', // Admin User
    notes: 'Need to check available films and prepare a quote.',
    createdAt: today,
    updatedAt: today
  }
];

module.exports = contacts;
