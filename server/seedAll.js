const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const colors = require('colors');

// Load models
const User = require('./models/User');
const Movie = require('./models/Movie');
const Event = require('./models/Event');
const News = require('./models/News');
const Theater = require('./models/Theater');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Payment = require('./models/Payment');
const Genre = require('./models/Genre');
const Director = require('./models/Director');
const Actor = require('./models/Actor');
const Comment = require('./models/Comment');
const Feedback = require('./models/Feedback');
const FAQ = require('./models/FAQ');
const Contact = require('./models/Contact');
const Newsletter = require('./models/Newsletter');
const BlogCategory = require('./models/BlogCategory');
const Tag = require('./models/Tag');
const Page = require('./models/Page');
const Setting = require('./models/Setting');
const Format = require('./models/Format');
const SeatType = require('./models/SeatType');
const Analytics = require('./models/Analytics');
const Content = require('./models/Content');
const Notification = require('./models/Notification');

// Load data
const userData = require('./data/userData');
const movieData = require('./data/movieDataFixed');
const eventData = require('./data/eventDataFixed');
const newsData = require('./data/newsDataFixed');
const theaterData = require('./data/theaterDataFixed');
const reviewData = require('./data/reviewDataFixed');
const genreData = require('./data/genreData');
const directorData = require('./data/directorData');
const actorData = require('./data/actorData');
const faqData = require('./data/faqData');
const blogCategoryData = require('./data/blogCategoryData');
const tagData = require('./data/tagData');
const pageData = require('./data/pageDataFixed');
const formatData = require('./data/formatData');
const seatTypeData = require('./data/seatTypeData');

// Load new data
const showtimeData = require('./data/showtimeData');
const bookingData = require('./data/bookingData');
const commentData = require('./data/commentData');
const contactData = require('./data/contactDataFixed');
const notificationData = require('./data/notificationDataFixed');
const paymentData = require('./data/paymentData');
const analyticsData = require('./data/analyticsDataFixed');
const feedbackData = require('./data/feedbackDataFixed');
const newsletterData = require('./data/newsletterData');
const contentData = require('./data/contentDataFixed');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Movie.deleteMany();
    await Event.deleteMany();
    await News.deleteMany();
    await Theater.deleteMany();
    await Showtime.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await Payment.deleteMany();
    await Genre.deleteMany();
    await Director.deleteMany();
    await Actor.deleteMany();
    await Comment.deleteMany();
    await Feedback.deleteMany();
    await FAQ.deleteMany();
    await Contact.deleteMany();
    await Newsletter.deleteMany();
    await BlogCategory.deleteMany();
    await Tag.deleteMany();
    await Page.deleteMany();
    await Setting.deleteMany();
    await Format.deleteMany();
    await SeatType.deleteMany();
    await Analytics.deleteMany();
    await Content.deleteMany();
    await Notification.deleteMany();

    console.log('Data cleared from database'.red.inverse);

    // Import users first
    const createdUsers = await User.insertMany(userData);
    console.log(`${userData.length} users imported`.green.inverse);

    // Get admin user for reference
    const adminUser = createdUsers.find(user => user.role === 'admin');

    // Import formats
    const createdFormats = await Format.insertMany(
      formatData.map(format => ({
        ...format,
        createdBy: adminUser._id
      }))
    );
    console.log(`${formatData.length} formats imported`.green.inverse);

    // Import seat types
    const createdSeatTypes = await SeatType.insertMany(
      seatTypeData.map(seatType => ({
        ...seatType,
        createdBy: adminUser._id
      }))
    );
    console.log(`${seatTypeData.length} seat types imported`.green.inverse);

    // Import genres
    const createdGenres = await Genre.insertMany(
      genreData.map(genre => ({
        ...genre,
        createdBy: adminUser._id
      }))
    );
    console.log(`${genreData.length} genres imported`.green.inverse);

    // Import directors
    const createdDirectors = await Director.insertMany(
      directorData.map(director => ({
        ...director,
        createdBy: adminUser._id
      }))
    );
    console.log(`${directorData.length} directors imported`.green.inverse);

    // Import actors
    const createdActors = await Actor.insertMany(
      actorData.map(actor => ({
        ...actor,
        createdBy: adminUser._id
      }))
    );
    console.log(`${actorData.length} actors imported`.green.inverse);

    // Import tags
    const createdTags = await Tag.insertMany(
      tagData.map(tag => ({
        ...tag,
        createdBy: adminUser._id
      }))
    );
    console.log(`${tagData.length} tags imported`.green.inverse);

    // Import blog categories
    const createdBlogCategories = await BlogCategory.insertMany(
      blogCategoryData.map(category => ({
        ...category,
        createdBy: adminUser._id
      }))
    );
    console.log(`${blogCategoryData.length} blog categories imported`.green.inverse);

    // Import theaters
    const createdTheaters = await Theater.insertMany(
      theaterData.map(theater => ({
        ...theater,
        createdBy: adminUser._id
      }))
    );
    console.log(`${theaterData.length} theaters imported`.green.inverse);

    // Import movies with references
    const moviesWithRefs = movieData.map(movie => {
      // Assign random genres (2-3)
      const randomGenres = createdGenres
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 2);

      // Assign random director
      const randomDirector = createdDirectors[Math.floor(Math.random() * createdDirectors.length)];

      // Assign random actors (4-6)
      const randomActors = createdActors
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 4)
        .map((actor, index) => ({
          actor: actor._id,
          name: actor.name,
          character: `Character ${index + 1}`,
          photo: actor.photo,
          order: index + 1
        }));

      // Assign random tags (2-4)
      const randomTags = createdTags
        .filter(tag => tag.type === 'movie' || tag.type === 'general')
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);

      return {
        ...movie,
        genres: randomGenres.map(genre => genre._id),
        director: randomDirector._id,
        directorName: randomDirector.name,
        cast: randomActors,
        tags: randomTags.map(tag => tag._id),
        createdBy: adminUser._id
      };
    });

    const createdMovies = await Movie.insertMany(moviesWithRefs);
    console.log(`${movieData.length} movies imported`.green.inverse);

    // Import events with references
    const eventsWithRefs = eventData.map(event => {
      // Assign random theater
      const randomTheater = createdTheaters[Math.floor(Math.random() * createdTheaters.length)];

      // Assign random tags (2-4)
      const randomTags = createdTags
        .filter(tag => tag.type === 'event' || tag.type === 'general')
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);

      return {
        ...event,
        venue: randomTheater._id,
        tags: randomTags.map(tag => tag._id),
        createdBy: adminUser._id
      };
    });

    const createdEvents = await Event.insertMany(eventsWithRefs);
    console.log(`${eventData.length} events imported`.green.inverse);

    // Import news with references
    const newsWithRefs = newsData.map(news => {
      // Assign random blog category
      const randomCategory = createdBlogCategories[Math.floor(Math.random() * createdBlogCategories.length)];

      // Assign random tags (2-4)
      const randomTags = createdTags
        .filter(tag => tag.type === 'blog' || tag.type === 'general')
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);

      return {
        ...news,
        category: randomCategory._id,
        tags: randomTags.map(tag => tag._id),
        author: adminUser._id,
        createdBy: adminUser._id
      };
    });

    const createdNews = await News.insertMany(newsWithRefs);
    console.log(`${newsData.length} news articles imported`.green.inverse);

    // Import reviews with references
    const reviewsWithRefs = reviewData.map((review, index) => {
      // Assign a specific user for each review to avoid unique index conflicts
      // We have 9 non-admin users (index 1-9), so use modulo to cycle through them
      const userIndex = (index % 9) + 1; // +1 to skip admin user at index 0
      const user = createdUsers[userIndex];

      // Create base review object
      const reviewObj = {
        ...review,
        user: user._id,
        userName: user.name,
        userImage: user.profilePicture || ''
      };

      // Add movie or theater reference based on review type
      if (review.reviewType === 'movie') {
        // Assign a unique movie for each user to avoid unique index conflicts
        const movieIndex = index % createdMovies.length;
        reviewObj.movie = createdMovies[movieIndex]._id;
      } else if (review.reviewType === 'theater') {
        // Assign a unique theater for each user to avoid unique index conflicts
        const theaterIndex = index % createdTheaters.length;
        reviewObj.theater = createdTheaters[theaterIndex]._id;
      }

      return reviewObj;
    });

    const createdReviews = await Review.insertMany(reviewsWithRefs);
    console.log(`${reviewData.length} reviews imported`.green.inverse);

    // Import FAQs
    const createdFAQs = await FAQ.insertMany(
      faqData.map(faq => ({
        ...faq,
        createdBy: adminUser._id
      }))
    );
    console.log(`${faqData.length} FAQs imported`.green.inverse);

    // Import pages
    const createdPages = await Page.insertMany(
      pageData.map(page => ({
        ...page,
        createdBy: adminUser._id,
        publishedAt: page.status === 'published' ? new Date() : null
      }))
    );
    console.log(`${pageData.length} pages imported`.green.inverse);

    // Import showtimes with references
    const showtimesWithRefs = showtimeData.map(showtime => {
      return {
        ...showtime,
        createdBy: adminUser._id
      };
    });
    const createdShowtimes = await Showtime.insertMany(showtimesWithRefs);
    console.log(`${showtimeData.length} showtimes imported`.green.inverse);

    // Import bookings with references
    const bookingsWithRefs = bookingData.map((booking, index) => {
      // Assign a showtime to each booking
      const showtimeIndex = index % createdShowtimes.length;
      return {
        ...booking,
        showtime: createdShowtimes[showtimeIndex]._id,
        createdBy: adminUser._id
      };
    });
    const createdBookings = await Booking.insertMany(bookingsWithRefs);
    console.log(`${bookingData.length} bookings imported`.green.inverse);

    // Import payments with references
    const paymentsWithRefs = paymentData.map((payment, index) => {
      // Assign a booking to each payment
      const bookingIndex = index % createdBookings.length;
      return {
        ...payment,
        booking: createdBookings[bookingIndex]._id,
        createdBy: adminUser._id
      };
    });
    const createdPayments = await Payment.insertMany(paymentsWithRefs);
    console.log(`${paymentData.length} payments imported`.green.inverse);

    // Import comments with references
    const commentsWithRefs = commentData.map(comment => {
      return {
        ...comment,
        createdBy: adminUser._id
      };
    });

    // First pass to create all comments
    const createdComments = await Comment.insertMany(commentsWithRefs);
    console.log(`${commentData.length} comments imported`.green.inverse);

    // Second pass to update parent comments
    const commentsToUpdate = [];

    // Update parent for "Yes, there will be discounted tickets..." (index 2)
    createdComments[2].parent = createdComments[1]._id;
    commentsToUpdate.push(createdComments[2]);

    // Update parent for "I agree! Marlon Brando's performance..." (index 4)
    createdComments[4].parent = createdComments[3]._id;
    commentsToUpdate.push(createdComments[4]);

    // Update parent for "How long will the marathon last?..." (index 8)
    createdComments[8].parent = createdComments[7]._id;
    commentsToUpdate.push(createdComments[8]);

    // Update parent for "It will run from 10 AM to 10 PM..." (index 9)
    createdComments[9].parent = createdComments[8]._id;
    commentsToUpdate.push(createdComments[9]);

    // Update comments with parent references
    if (commentsToUpdate.length > 0) {
      for (const comment of commentsToUpdate) {
        await Comment.findByIdAndUpdate(comment._id, { parent: comment.parent });
      }
      console.log(`${commentsToUpdate.length} comments updated with parent references`.green.inverse);
    }

    // Import contacts
    const contactsWithRefs = contactData.map(contact => {
      return {
        ...contact,
        createdBy: adminUser._id
      };
    });
    const createdContacts = await Contact.insertMany(contactsWithRefs);
    console.log(`${contactData.length} contacts imported`.green.inverse);

    // Import notifications
    const notificationsWithRefs = notificationData.map(notification => {
      return {
        ...notification,
        createdBy: adminUser._id
      };
    });
    const createdNotifications = await Notification.insertMany(notificationsWithRefs);
    console.log(`${notificationData.length} notifications imported`.green.inverse);

    // Import analytics
    const analyticsWithRefs = analyticsData.map(analytic => {
      return {
        ...analytic,
        createdBy: adminUser._id
      };
    });
    const createdAnalytics = await Analytics.insertMany(analyticsWithRefs);
    console.log(`${analyticsData.length} analytics records imported`.green.inverse);

    // Import feedbacks
    const feedbacksWithRefs = feedbackData.map(feedback => {
      return {
        ...feedback,
        createdBy: adminUser._id
      };
    });
    const createdFeedbacks = await Feedback.insertMany(feedbacksWithRefs);
    console.log(`${feedbackData.length} feedbacks imported`.green.inverse);

    // Import newsletters
    const newslettersWithRefs = newsletterData.map(newsletter => {
      return {
        ...newsletter,
        createdBy: adminUser._id
      };
    });
    const createdNewsletters = await Newsletter.insertMany(newslettersWithRefs);
    console.log(`${newsletterData.length} newsletter subscriptions imported`.green.inverse);

    // Import contents
    const contentsWithRefs = contentData.map(content => {
      return {
        ...content,
        createdBy: adminUser._id
      };
    });
    const createdContents = await Content.insertMany(contentsWithRefs);
    console.log(`${contentData.length} content blocks imported`.green.inverse);

    // Initialize settings
    await Setting.initDefaults(adminUser._id);
    console.log('Default settings initialized'.green.inverse);

    console.log('All data imported successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run script
importData();
