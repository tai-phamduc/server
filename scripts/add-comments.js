/**
 * Script to add 10 more documents to the comments collection
 * Run with: node scripts/add-comments.js
 */

const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Movie = require('../models/Movie');
const News = require('../models/News');
const Event = require('../models/Event');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to get a random item from an array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Function to create comments
const createComments = async () => {
  try {
    // Get all users, movies, news, and events
    const users = await User.find().select('_id');
    const movies = await Movie.find().select('_id title');
    const news = await News.find().select('_id title');
    const events = await Event.find().select('_id title');

    if (users.length === 0) {
      console.error('No users found in the database');
      return;
    }

    if (movies.length === 0 && news.length === 0 && events.length === 0) {
      console.error('No movies, news, or events found in the database');
      return;
    }

    // Sample comment content for movies
    const movieComments = [
      "I absolutely loved this movie! The cinematography was breathtaking and the acting was superb.",
      "The plot was a bit confusing at first, but it all came together beautifully in the end.",
      "This film deserves all the awards it received. A true masterpiece of modern cinema.",
      "The special effects were incredible, but I felt the character development was lacking.",
      "I've watched this three times already and notice new details each time. Definitely worth multiple viewings.",
      "The soundtrack perfectly complemented the emotional scenes. I got goosebumps several times.",
      "While the concept was interesting, the execution fell short of my expectations.",
      "The director's vision really shines through in every frame. You can tell this was a passion project.",
      "I appreciated the subtle references to classic films throughout. A love letter to cinema.",
      "The ending left me speechless. I'm still processing everything that happened."
    ];

    // Sample comment content for news
    const newsComments = [
      "This is such exciting news! I can't wait to see how this develops.",
      "I've been following this story for a while, and I'm glad to see it getting coverage.",
      "The article provided great insights, but I wish there was more information about the background.",
      "As a long-time fan, this announcement made my day. Looking forward to updates!",
      "I'm skeptical about how this will turn out, but I'm keeping an open mind.",
      "The industry is definitely heading in an interesting direction with this development.",
      "Thanks for sharing this news! I hadn't heard about it anywhere else.",
      "I wonder how this will affect the upcoming releases we've been anticipating.",
      "The quotes from the director in this article really shed light on the creative process.",
      "This is a game-changer for the industry. I'm excited to see the ripple effects."
    ];

    // Sample comment content for events
    const eventComments = [
      "I attended this event last year and it was phenomenal. Highly recommend!",
      "The lineup for this event looks amazing. Already bought my tickets!",
      "Does anyone know if there will be merchandise available at the venue?",
      "I'm traveling from out of town for this. Any recommendations for nearby accommodations?",
      "The Q&A sessions at these events are always the highlight for me.",
      "Last year's event had some organizational issues. Hoping they've improved this time.",
      "The venue is perfect for this type of event. Great acoustics and seating.",
      "Will there be any surprise guests this year? The rumors are getting me excited!",
      "The workshops at last year's event were incredibly informative. Hope they bring those back.",
      "This is becoming my annual tradition. Haven't missed one in five years!"
    ];

    // Create 10 new comments
    const commentPromises = [];
    for (let i = 0; i < 10; i++) {
      // Randomly decide if this will be a movie, news, or event comment
      const commentType = getRandomItem(['movie', 'news', 'event']);
      
      // Randomly decide if this will be a reply to another comment (20% chance)
      const isReply = Math.random() < 0.2;
      
      // Create the comment object
      const commentData = {
        user: getRandomItem(users)._id,
        content: '',
        isApproved: true,
        likes: getRandomInt(0, 25),
        dislikes: getRandomInt(0, 5)
      };

      // Add likedBy and dislikedBy arrays with random users
      commentData.likedBy = [];
      commentData.dislikedBy = [];
      
      // Add random users to likedBy (up to the likes count)
      for (let j = 0; j < commentData.likes; j++) {
        const randomUser = getRandomItem(users)._id;
        if (!commentData.likedBy.includes(randomUser)) {
          commentData.likedBy.push(randomUser);
        }
      }
      
      // Add random users to dislikedBy (up to the dislikes count)
      for (let j = 0; j < commentData.dislikes; j++) {
        const randomUser = getRandomItem(users)._id;
        if (!commentData.dislikedBy.includes(randomUser) && !commentData.likedBy.includes(randomUser)) {
          commentData.dislikedBy.push(randomUser);
        }
      }

      // Set the content and reference based on the comment type
      if (commentType === 'movie' && movies.length > 0) {
        const movie = getRandomItem(movies);
        commentData.movie = movie._id;
        commentData.content = getRandomItem(movieComments) + ` (${movie.title})`;
      } else if (commentType === 'news' && news.length > 0) {
        const newsItem = getRandomItem(news);
        commentData.news = newsItem._id;
        commentData.content = getRandomItem(newsComments) + ` (${newsItem.title})`;
      } else if (commentType === 'event' && events.length > 0) {
        const event = getRandomItem(events);
        commentData.event = event._id;
        commentData.content = getRandomItem(eventComments) + ` (${event.title})`;
      } else {
        // Fallback to movie comment if the selected type has no items
        if (movies.length > 0) {
          const movie = getRandomItem(movies);
          commentData.movie = movie._id;
          commentData.content = getRandomItem(movieComments) + ` (${movie.title})`;
        } else if (news.length > 0) {
          const newsItem = getRandomItem(news);
          commentData.news = newsItem._id;
          commentData.content = getRandomItem(newsComments) + ` (${newsItem.title})`;
        } else {
          const event = getRandomItem(events);
          commentData.event = event._id;
          commentData.content = getRandomItem(eventComments) + ` (${event.title})`;
        }
      }

      // If this is a reply, find a parent comment
      if (isReply) {
        try {
          // Find a random comment that could be a parent (not already a reply)
          const potentialParents = await Comment.find({ parent: null }).limit(10);
          if (potentialParents.length > 0) {
            const parent = getRandomItem(potentialParents);
            commentData.parent = parent._id;
            
            // If it's a reply, make sure it references the same entity as the parent
            if (parent.movie) commentData.movie = parent.movie;
            else if (parent.news) commentData.news = parent.news;
            else if (parent.event) commentData.event = parent.event;
            
            // Adjust the content to sound like a reply
            commentData.content = `I agree with your point about ${commentData.content.split(' ').slice(0, 3).join(' ')}...`;
          }
        } catch (error) {
          console.error('Error finding parent comment:', error);
          // Continue without making it a reply
        }
      }

      // Create the comment
      commentPromises.push(Comment.create(commentData));
    }

    // Wait for all comments to be created
    const createdComments = await Promise.all(commentPromises);
    
    console.log(`Successfully added ${createdComments.length} new comments to the database`);
    console.log('Sample of added comments:');
    createdComments.slice(0, 3).forEach(comment => {
      console.log(`- ${comment.content.substring(0, 50)}...`);
    });

    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating comments:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the function
createComments();
