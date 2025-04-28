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
const sixDaysAgo = new Date(today);
sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

// Create newsletter data
const newsletters = [
  {
    email: 'john.doe@example.com',
    name: 'John Doe',
    status: 'subscribed',
    preferences: {
      newReleases: true,
      promotions: true,
      events: true,
      newsletters: true
    },
    subscribedAt: sevenDaysAgo,
    lastEmailSent: yesterday,
    unsubscribeToken: 'abc123def456',
    createdAt: sevenDaysAgo,
    updatedAt: yesterday
  },
  {
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    status: 'subscribed',
    preferences: {
      newReleases: true,
      promotions: false,
      events: true,
      newsletters: true
    },
    subscribedAt: sixDaysAgo,
    lastEmailSent: twoDaysAgo,
    unsubscribeToken: 'ghi789jkl012',
    createdAt: sixDaysAgo,
    updatedAt: twoDaysAgo
  },
  {
    email: 'michael.johnson@example.com',
    name: 'Michael Johnson',
    status: 'subscribed',
    preferences: {
      newReleases: true,
      promotions: true,
      events: false,
      newsletters: true
    },
    subscribedAt: fiveDaysAgo,
    lastEmailSent: threeDaysAgo,
    unsubscribeToken: 'mno345pqr678',
    createdAt: fiveDaysAgo,
    updatedAt: threeDaysAgo
  },
  {
    email: 'emily.davis@example.com',
    name: 'Emily Davis',
    status: 'subscribed',
    preferences: {
      newReleases: true,
      promotions: true,
      events: true,
      newsletters: false
    },
    subscribedAt: fourDaysAgo,
    lastEmailSent: twoDaysAgo,
    unsubscribeToken: 'stu901vwx234',
    createdAt: fourDaysAgo,
    updatedAt: twoDaysAgo
  },
  {
    email: 'robert.wilson@example.com',
    name: 'Robert Wilson',
    status: 'unsubscribed',
    preferences: {
      newReleases: false,
      promotions: false,
      events: false,
      newsletters: false
    },
    subscribedAt: sevenDaysAgo,
    lastEmailSent: fiveDaysAgo,
    unsubscribeToken: 'yza567bcd890',
    unsubscribedAt: threeDaysAgo,
    unsubscribeReason: 'Too many emails',
    createdAt: sevenDaysAgo,
    updatedAt: threeDaysAgo
  },
  {
    email: 'sarah.brown@example.com',
    name: 'Sarah Brown',
    status: 'subscribed',
    preferences: {
      newReleases: true,
      promotions: true,
      events: true,
      newsletters: true
    },
    subscribedAt: threeDaysAgo,
    lastEmailSent: yesterday,
    unsubscribeToken: 'efg123hij456',
    createdAt: threeDaysAgo,
    updatedAt: yesterday
  },
  {
    email: 'david.miller@example.com',
    name: 'David Miller',
    status: 'bounced',
    preferences: {
      newReleases: true,
      promotions: true,
      events: true,
      newsletters: true
    },
    subscribedAt: sixDaysAgo,
    lastEmailSent: fourDaysAgo,
    unsubscribeToken: 'klm789nop012',
    bounceReason: 'Invalid email address',
    createdAt: sixDaysAgo,
    updatedAt: fourDaysAgo
  },
  {
    email: 'jennifer.taylor@example.com',
    name: 'Jennifer Taylor',
    status: 'subscribed',
    preferences: {
      newReleases: true,
      promotions: false,
      events: false,
      newsletters: true
    },
    subscribedAt: twoDaysAgo,
    lastEmailSent: yesterday,
    unsubscribeToken: 'qrs345tuv678',
    createdAt: twoDaysAgo,
    updatedAt: yesterday
  },
  {
    email: 'thomas.anderson@example.com',
    name: 'Thomas Anderson',
    status: 'subscribed',
    preferences: {
      newReleases: true,
      promotions: true,
      events: true,
      newsletters: true
    },
    subscribedAt: yesterday,
    lastEmailSent: null,
    unsubscribeToken: 'wxy901zab234',
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
    email: 'lisa.martinez@example.com',
    name: 'Lisa Martinez',
    status: 'pending',
    preferences: {
      newReleases: true,
      promotions: true,
      events: true,
      newsletters: true
    },
    subscribedAt: today,
    lastEmailSent: null,
    unsubscribeToken: 'cde567fgh890',
    confirmationToken: 'ijk123lmn456',
    createdAt: today,
    updatedAt: today
  }
];

module.exports = newsletters;
