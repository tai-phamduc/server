/**
 * Script to add 10 more documents to the comments collection
 * Run with: node scripts/add-more-comments.js
 */

const mongoose = require('mongoose');
const Comment = require('../models/Comment');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Movie IDs from the database
const movieIds = [
  '680f66dbefdceecc9e34aac1', // Interstellar
  '680f66dbefdceecc9e34aabd', // The Dark Knight
  '680f66dbefdceecc9e34aac5', // The Shawshank Redemption
  '680f66dbefdceecc9e34aac9', // Avengers: Endgame
  '680f66dbefdceecc9e34aab9'  // Inception
];

// User IDs from the database
const userIds = [
  '68121f940d88e642c839abd5', // Regular User
  '68121f940d88e642c839abd4', // Admin User
  '6812fd1871b297823a393c5a'  // Justin Pack
];

// Sample comments with varying likes
const commentData = [
  {
    movie: movieIds[0], // Interstellar
    user: userIds[0],
    content: "Interstellar is a masterpiece of science fiction. The visuals, the score, and the emotional depth all combine to create an unforgettable experience. Christopher Nolan has outdone himself.",
    likes: 45,
    dislikes: 3,
    likedBy: [userIds[0], userIds[1], userIds[2]],
    isApproved: true
  },
  {
    movie: movieIds[0], // Interstellar
    user: userIds[1],
    content: "The science in this movie is surprisingly accurate. The depiction of time dilation and black holes was consulted with actual physicists. Amazing attention to detail!",
    likes: 32,
    dislikes: 1,
    likedBy: [userIds[0], userIds[1]],
    isApproved: true
  },
  {
    movie: movieIds[1], // The Dark Knight
    user: userIds[2],
    content: "Heath Ledger's performance as the Joker is legendary. One of the greatest villain portrayals in cinema history. The movie still holds up perfectly after all these years.",
    likes: 67,
    dislikes: 2,
    likedBy: [userIds[0], userIds[1], userIds[2]],
    isApproved: true
  },
  {
    movie: movieIds[1], // The Dark Knight
    user: userIds[0],
    content: "The Dark Knight transcends the superhero genre. It's a crime thriller that happens to feature Batman. The moral dilemmas and character development are exceptional.",
    likes: 41,
    dislikes: 5,
    likedBy: [userIds[0], userIds[2]],
    isApproved: true
  },
  {
    movie: movieIds[2], // The Shawshank Redemption
    user: userIds[1],
    content: "A timeless classic about hope and redemption. The friendship between Andy and Red is one of the most beautiful relationships ever portrayed on screen.",
    likes: 53,
    dislikes: 1,
    likedBy: [userIds[0], userIds[1], userIds[2]],
    isApproved: true
  },
  {
    movie: movieIds[3], // Avengers: Endgame
    user: userIds[2],
    content: "The perfect culmination of 10+ years of storytelling. The way they wrapped up character arcs while delivering spectacular action was incredible. I cried multiple times!",
    likes: 38,
    dislikes: 7,
    likedBy: [userIds[1], userIds[2]],
    isApproved: true
  },
  {
    movie: movieIds[4], // Inception
    user: userIds[0],
    content: "The concept of dream-sharing and the rules of the dream world are so well thought out. The ending still has me debating with friends years later. Brilliant filmmaking.",
    likes: 72,
    dislikes: 4,
    likedBy: [userIds[0], userIds[1], userIds[2]],
    isApproved: true
  },
  {
    movie: movieIds[4], // Inception
    user: userIds[1],
    content: "The visual effects in Inception were groundbreaking and still look amazing today. The rotating hallway fight scene is one of the most innovative action sequences ever filmed.",
    likes: 56,
    dislikes: 2,
    likedBy: [userIds[0], userIds[1]],
    isApproved: true
  },
  {
    movie: movieIds[4], // Inception
    user: userIds[2],
    content: "Hans Zimmer's score for Inception is absolutely phenomenal. The way it builds tension and emotion throughout the film is masterful. One of my favorite movie soundtracks.",
    likes: 48,
    dislikes: 1,
    likedBy: [userIds[1], userIds[2]],
    isApproved: true
  },
  {
    movie: movieIds[3], // Avengers: Endgame
    user: userIds[0],
    content: "The final battle scene with everyone coming through the portals still gives me chills. When Cap finally says 'Avengers Assemble', it was the perfect payoff to years of buildup.",
    likes: 61,
    dislikes: 3,
    likedBy: [userIds[0], userIds[1], userIds[2]],
    isApproved: true
  }
];

// Function to add comments
const addComments = async () => {
  try {
    // Delete existing comments first (optional)
    // await Comment.deleteMany({});
    
    // Insert new comments
    const result = await Comment.insertMany(commentData);
    
    console.log(`Successfully added ${result.length} comments to the database`);
    console.log('Comment IDs:');
    result.forEach(comment => console.log(comment._id));
    
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error adding comments:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the function
addComments();
