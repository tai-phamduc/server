const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const colors = require('colors');

// Load models
const Movie = require('./models/Movie');
const Event = require('./models/Event');
const User = require('./models/User');
const News = require('./models/News');
const Genre = require('./models/Genre');
const Director = require('./models/Director');
const Actor = require('./models/Actor');
const Tag = require('./models/Tag');
const BlogCategory = require('./models/BlogCategory');
const FAQ = require('./models/FAQ');
const Page = require('./models/Page');
const Setting = require('./models/Setting');
const Theater = require('./models/Theater');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking');

// Load data
const movies = require('./data/movies');
const events = require('./data/events');
const users = require('./data/users');
const genreData = require('./data/genreData');
const tagData = require('./data/tagData');
const blogCategoryData = require('./data/blogCategoryData');
const faqData = require('./data/faqData');
const pageData = require('./data/pageData');
const theaterData = require('./data/theaterData');
const showtimeData = require('./data/showtimeData');
const bookingData = require('./data/bookingData');

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
    await Movie.deleteMany();
    await Event.deleteMany();
    await User.deleteMany();
    await News.deleteMany();
    await Genre.deleteMany();
    await Director.deleteMany();
    await Actor.deleteMany();
    await Tag.deleteMany();
    await BlogCategory.deleteMany();
    await FAQ.deleteMany();
    await Page.deleteMany();
    await Setting.deleteMany();
    await Theater.deleteMany();
    await Showtime.deleteMany();
    await Booking.deleteMany();

    console.log('Data cleared from database'.red.inverse);

    // Import users first to get user IDs for news
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Import genres
    const createdGenres = await Genre.insertMany(
      genreData.map(genre => ({
        ...genre,
        createdBy: adminUser
      }))
    );
    console.log(`${createdGenres.length} genres imported`.green.inverse);

    // Import tags
    const createdTags = await Tag.insertMany(
      tagData.map(tag => ({
        ...tag,
        createdBy: adminUser
      }))
    );
    console.log(`${createdTags.length} tags imported`.green.inverse);

    // Import blog categories
    const createdBlogCategories = await BlogCategory.insertMany(
      blogCategoryData.map(category => ({
        ...category,
        createdBy: adminUser
      }))
    );
    console.log(`${createdBlogCategories.length} blog categories imported`.green.inverse);

    // Import FAQs
    const createdFAQs = await FAQ.insertMany(
      faqData.map(faq => ({
        ...faq,
        createdBy: adminUser
      }))
    );
    console.log(`${createdFAQs.length} FAQs imported`.green.inverse);

    // Import pages
    try {
      const createdPages = await Page.insertMany(
        pageData.map(page => ({
          ...page,
          createdBy: adminUser,
          publishedAt: page.status === 'published' ? new Date() : null
        }))
      );
      console.log(`${createdPages.length} pages imported`.green.inverse);
    } catch (error) {
      console.error(`Error importing pages: ${error.message}`.red.inverse);
    }

    // Import movies
    try {
      const createdMovies = await Movie.insertMany(movies);
      console.log(`${movies.length} movies imported`.green.inverse);
    } catch (error) {
      console.error(`Error importing movies: ${error.message}`.red.inverse);
    }

    // Import events
    try {
      await Event.insertMany(events);
      console.log(`${events.length} events imported`.green.inverse);
    } catch (error) {
      console.error(`Error importing events: ${error.message}`.red.inverse);
    }

    // Import theaters
    try {
      const theatersWithUser = theaterData.map(theater => ({
        ...theater,
        createdBy: adminUser
      }));
      const createdTheaters = await Theater.insertMany(theatersWithUser);
      console.log(`${createdTheaters.length} theaters imported`.green.inverse);

      // Import showtimes
      try {
        const showtimesWithRefs = showtimeData.map(showtime => {
          // Find a random movie and theater
          const randomMovie = createdMovies && createdMovies.length > 0
            ? createdMovies[Math.floor(Math.random() * createdMovies.length)]
            : { _id: new mongoose.Types.ObjectId() };

          return {
            ...showtime,
            movie: randomMovie._id,
            theater: createdTheaters[Math.floor(Math.random() * createdTheaters.length)]._id,
            createdBy: adminUser
          };
        });

        const createdShowtimes = await Showtime.insertMany(showtimesWithRefs);
        console.log(`${createdShowtimes.length} showtimes imported`.green.inverse);

        // Import bookings
        try {
          const bookingsWithRefs = bookingData.map(booking => {
            // Find a random user, movie, theater, and showtime
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const randomMovie = createdMovies && createdMovies.length > 0
              ? createdMovies[Math.floor(Math.random() * createdMovies.length)]
              : { _id: new mongoose.Types.ObjectId(), title: 'Sample Movie' };
            const randomTheater = createdTheaters[Math.floor(Math.random() * createdTheaters.length)];
            const randomShowtime = createdShowtimes[Math.floor(Math.random() * createdShowtimes.length)];

            return {
              ...booking,
              user: randomUser._id,
              movie: randomMovie._id,
              theater: randomTheater._id,
              showtime: randomShowtime._id,
              movieTitle: randomMovie.title || 'Sample Movie',
              theaterName: randomTheater.name,
              hall: randomShowtime.hall || 'Hall 1',
              showtimeDate: randomShowtime.startTime,
              showtimeDisplay: randomShowtime.displayTime || '7:00 PM'
            };
          });

          const createdBookings = await Booking.insertMany(bookingsWithRefs);
          console.log(`${createdBookings.length} bookings imported`.green.inverse);
        } catch (error) {
          console.error(`Error importing bookings: ${error.message}`.red.inverse);
        }
      } catch (error) {
        console.error(`Error importing showtimes: ${error.message}`.red.inverse);
      }
    } catch (error) {
      console.error(`Error importing theaters: ${error.message}`.red.inverse);
    }

    // Create sample news
    const sampleNews = [
      {
        title: 'See Meila enjoyable capturing moment',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nisl nisl aliquam nisl, vel tincidunt nisl nisl sit amet nisl.',
        author: adminUser,
        image: '/uploads/blog-4.jpg',
        category: 'Movies',
        tags: ['Movies', 'Entertainment'],
        blogCategories: [createdBlogCategories[0]._id],
        blogTags: [createdTags[8]._id, createdTags[9]._id]
      },
      {
        title: 'The Foreign Oscar Nominations 2023',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nisl nisl aliquam nisl, vel tincidunt nisl nisl sit amet nisl.',
        author: adminUser,
        image: '/uploads/blog-5.jpg',
        category: 'Awards',
        tags: ['Awards', 'Oscars'],
        blogCategories: [createdBlogCategories[6]._id],
        blogTags: [createdTags[0]._id, createdTags[9]._id]
      },
      {
        title: 'Upcoming New Season 5 Just Flow in!',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nisl nisl aliquam nisl, vel tincidunt nisl nisl sit amet nisl.',
        author: adminUser,
        image: '/uploads/blog-6.jpg',
        category: 'TV Shows',
        tags: ['TV Shows', 'Entertainment'],
        blogCategories: [createdBlogCategories[8]._id],
        blogTags: [createdTags[9]._id, createdTags[12]._id]
      },
    ];

    await News.insertMany(sampleNews);
    console.log(`${sampleNews.length} news articles imported`.green.inverse);

    // Initialize settings
    await Setting.initDefaults(adminUser);
    console.log('Default settings initialized'.green.inverse);

    console.log('Data imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await Movie.deleteMany();
    await Event.deleteMany();
    await User.deleteMany();
    await News.deleteMany();
    await Genre.deleteMany();
    await Director.deleteMany();
    await Actor.deleteMany();
    await Tag.deleteMany();
    await BlogCategory.deleteMany();
    await FAQ.deleteMany();
    await Page.deleteMany();
    await Setting.deleteMany();
    await Theater.deleteMany();
    await Showtime.deleteMany();
    await Booking.deleteMany();

    console.log('Data destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Run script
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
