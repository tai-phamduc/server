const mongoose = require('mongoose');

// Get current date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

// Create comment data
const comments = [
  // Comments on news
  {
    content: "This is really exciting news! I can't wait to see the new IMAX screen.",
    user: '680d29841ad99532cd239b02',
    news: '680d29841ad99532cd239c01', // News ID
    parent: null,
    isApproved: true,
    likes: 5,
    likedBy: ['680d29841ad99532cd239b03', '680d29841ad99532cd239b04', '680d29841ad99532cd239b05', '680d29841ad99532cd239b06', '680d29841ad99532cd239b07']
  },
  {
    content: "Will there be any special opening day promotions?",
    user: '680d29841ad99532cd239b03',
    news: '680d29841ad99532cd239c01', // News ID
    parent: null,
    isApproved: true,
    likes: 2,
    likedBy: ['680d29841ad99532cd239b01', '680d29841ad99532cd239b02']
  },
  {
    content: "Yes, there will be discounted tickets and free popcorn for the first 100 customers!",
    user: '680d29841ad99532cd239b01',
    news: '680d29841ad99532cd239c01', // News ID
    parent: null, // Will be updated after insertion
    isApproved: true,
    likes: 3,
    likedBy: ['680d29841ad99532cd239b02', '680d29841ad99532cd239b03', '680d29841ad99532cd239b04']
  },

  // Comments on movies
  {
    content: "The Godfather is my all-time favorite movie. The acting is superb!",
    user: '680d29841ad99532cd239b04',
    movie: '680d29841ad99532cd239bc9', // The Godfather
    parent: null,
    isApproved: true,
    likes: 8,
    likedBy: ['680d29841ad99532cd239b01', '680d29841ad99532cd239b02', '680d29841ad99532cd239b03', '680d29841ad99532cd239b05', '680d29841ad99532cd239b06', '680d29841ad99532cd239b07', '680d29841ad99532cd239b08', '680d29841ad99532cd239b09']
  },
  {
    content: "I agree! Marlon Brando's performance was legendary.",
    user: '680d29841ad99532cd239b05',
    movie: '680d29841ad99532cd239bc9', // The Godfather
    parent: null, // Will be updated after insertion
    isApproved: true,
    likes: 4,
    likedBy: ['680d29841ad99532cd239b01', '680d29841ad99532cd239b02', '680d29841ad99532cd239b04', '680d29841ad99532cd239b06']
  },
  {
    content: "The Dark Knight changed superhero movies forever. Heath Ledger's Joker was incredible.",
    user: '680d29841ad99532cd239b06',
    movie: '680d29841ad99532cd239bb6', // The Dark Knight
    parent: null,
    isApproved: true,
    likes: 12,
    likedBy: ['680d29841ad99532cd239b01', '680d29841ad99532cd239b02', '680d29841ad99532cd239b03', '680d29841ad99532cd239b04', '680d29841ad99532cd239b05', '680d29841ad99532cd239b07', '680d29841ad99532cd239b08', '680d29841ad99532cd239b09', '680d29841ad99532cd239b01', '680d29841ad99532cd239b02', '680d29841ad99532cd239b03']
  },
  {
    content: "Inception's dream sequences were mind-blowing. Christopher Nolan is a genius.",
    user: '680d29841ad99532cd239b07',
    movie: '680d29841ad99532cd239baa', // Inception
    parent: null,
    isApproved: true,
    likes: 6,
    likedBy: ['680d29841ad99532cd239b01', '680d29841ad99532cd239b02', '680d29841ad99532cd239b03', '680d29841ad99532cd239b04', '680d29841ad99532cd239b05', '680d29841ad99532cd239b06']
  },

  // Comments on events
  {
    content: "I'm so excited for the Marvel Movie Marathon! Will be there for sure.",
    user: '680d29841ad99532cd239b03',
    event: '680d29841ad99532cd239e01', // Event ID
    parent: null,
    isApproved: true,
    likes: 7,
    likedBy: ['680d29841ad99532cd239b01', '680d29841ad99532cd239b02', '680d29841ad99532cd239b04', '680d29841ad99532cd239b05', '680d29841ad99532cd239b06', '680d29841ad99532cd239b08', '680d29841ad99532cd239b09']
  },
  {
    content: "How long will the marathon last? Need to plan my day.",
    user: '680d29841ad99532cd239b04',
    event: '680d29841ad99532cd239e01', // Event ID
    parent: null, // Will be updated after insertion
    isApproved: true,
    likes: 1,
    likedBy: ['680d29841ad99532cd239b01']
  },
  {
    content: "It will run from 10 AM to 10 PM with breaks in between movies.",
    user: '680d29841ad99532cd239b01',
    event: '680d29841ad99532cd239e01', // Event ID
    parent: null, // Will be updated after insertion
    isApproved: true,
    likes: 2,
    likedBy: ['680d29841ad99532cd239b03', '680d29841ad99532cd239b04']
  },

  // Pending and rejected comments
  {
    content: "This movie was terrible! Complete waste of money.",
    user: '680d29841ad99532cd239b05',
    movie: '680d29841ad99532cd239be0', // Dune
    parent: null,
    isApproved: false,
    likes: 0,
    likedBy: []
  },
  {
    content: "This comment contains inappropriate language that violates our community guidelines.",
    user: '680d29841ad99532cd239b06',
    movie: '680d29841ad99532cd239bce', // Pulp Fiction
    parent: null,
    isApproved: false,
    likes: 0,
    likedBy: []
  }
];

module.exports = comments;
