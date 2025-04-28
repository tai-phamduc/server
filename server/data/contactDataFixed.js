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
    phone: '12025550179',
    subject: 'Booking Issue',
    message: 'I tried to book tickets for The Godfather showing tomorrow night, but the payment system gave me an error. My card was charged but I didn\'t receive a confirmation. Can you help?',
    status: 'new',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    user: '680d29841ad99532cd239b01' // Admin User
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '12025550180',
    subject: 'Lost Item',
    message: 'I believe I left my wallet in theater 3 during the 7 PM showing of Inception last night. It\'s a black leather wallet with my ID and credit cards. Has anyone turned it in?',
    status: 'read',
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    readAt: yesterday,
    user: '680d29841ad99532cd239b02'
  },
  {
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '12025550181',
    subject: 'Group Booking Inquiry',
    message: 'I\'m interested in booking a private screening for my company\'s team building event. We have about 30 people. What are your rates and available dates in the next month?',
    status: 'replied',
    ipAddress: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    readAt: threeDaysAgo,
    repliedAt: twoDaysAgo,
    repliedBy: '680d29841ad99532cd239b01',
    replySubject: 'RE: Group Booking Inquiry',
    replyMessage: 'Thank you for your interest in our private screening services. Our rates start at $299 for groups up to 30 people. We have availability on the following dates...',
    user: '680d29841ad99532cd239b03'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '12025550182',
    subject: 'Accessibility Question',
    message: 'I use a wheelchair and I\'m planning to visit your theater this weekend. I wanted to confirm that you have accessible seating and restrooms. Also, is there designated parking for disabled visitors?',
    status: 'replied',
    ipAddress: '192.168.1.4',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    readAt: fourDaysAgo,
    repliedAt: threeDaysAgo,
    repliedBy: '680d29841ad99532cd239b01',
    replySubject: 'RE: Accessibility Question',
    replyMessage: 'Yes, we have accessible seating in all our theaters, accessible restrooms on each floor, and designated parking spaces near the main entrance. Please let us know if you need any assistance during your visit.',
    user: '680d29841ad99532cd239b04'
  },
  {
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '12025550183',
    subject: 'Complaint about Noise',
    message: 'I attended the 9 PM showing of The Dark Knight last night and there was a group of teenagers making noise throughout the movie. The staff didn\'t do anything despite multiple complaints. This ruined the experience for me and other viewers.',
    status: 'new',
    ipAddress: '192.168.1.5',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    user: '680d29841ad99532cd239b05'
  },
  {
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    phone: '12025550184',
    subject: 'Job Application',
    message: 'I\'m interested in applying for the projectionist position advertised on your website. I have 5 years of experience in a similar role and I\'m available for an interview at your convenience. I\'ve attached my resume to this message.',
    status: 'read',
    ipAddress: '192.168.1.6',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    readAt: fiveDaysAgo,
    user: '680d29841ad99532cd239b06'
  },
  {
    name: 'David Miller',
    email: 'david.miller@example.com',
    phone: '12025550185',
    subject: 'Food Quality Feedback',
    message: 'I visited your theater yesterday and ordered nachos and a hot dog. The nachos were stale and the hot dog was cold. For the premium prices you charge for concessions, I expected better quality. Please improve your food service.',
    status: 'replied',
    ipAddress: '192.168.1.7',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    readAt: twoDaysAgo,
    repliedAt: yesterday,
    repliedBy: '680d29841ad99532cd239b01',
    replySubject: 'RE: Food Quality Feedback',
    replyMessage: 'We sincerely apologize for your negative experience with our concessions. We take food quality very seriously and have addressed this issue with our staff. We would like to offer you complimentary concessions on your next visit.',
    user: '680d29841ad99532cd239b07'
  },
  {
    name: 'Jennifer Taylor',
    email: 'jennifer.taylor@example.com',
    phone: '12025550186',
    subject: 'Birthday Party Booking',
    message: 'I\'d like to book a birthday party for my son who is turning 10 next month. He loves superhero movies. Do you offer any special packages for children\'s birthday parties? We\'re expecting about 15 kids.',
    status: 'new',
    ipAddress: '192.168.1.8',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    user: '680d29841ad99532cd239b08'
  },
  {
    name: 'Thomas Anderson',
    email: 'thomas.anderson@example.com',
    phone: '12025550187',
    subject: 'Website Feedback',
    message: 'I noticed that your website doesn\'t display correctly on mobile devices. The showtimes are cut off and the booking button doesn\'t work. I\'m using an iPhone 12 with Safari browser.',
    status: 'read',
    ipAddress: '192.168.1.9',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    readAt: yesterday,
    user: '680d29841ad99532cd239b09'
  },
  {
    name: 'Lisa Martinez',
    email: 'lisa.martinez@example.com',
    phone: '12025550188',
    subject: 'Special Screening Request',
    message: 'I\'m a teacher at Lincoln High School and I\'d like to arrange a special screening of a historical film for my history class. We have about 60 students. Are educational discounts available? We\'re flexible on dates in the coming month.',
    status: 'new',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    user: '680d29841ad99532cd239b01'
  }
];

module.exports = contacts;
