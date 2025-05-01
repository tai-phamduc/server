const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');
const Page = require('../models/Page');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');
const Payment = require('../models/Payment');
const BlogCategory = require('../models/BlogCategory');
const Content = require('../models/Content');
const Room = require('../models/Room');
const User = require('../models/User');

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to create a slug from a title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Function to add analytics data
const addAnalyticsData = async () => {
  try {
    const count = await Analytics.countDocuments();
    if (count > 0) {
      console.log(`Analytics collection already has ${count} documents. Skipping...`);
      return;
    }

    const analyticsData = [
      {
        date: new Date(),
        pageViews: {
          home: 1250,
          movies: 980,
          events: 450,
          news: 320,
          booking: 780
        },
        userActivity: {
          registrations: 45,
          logins: 320,
          bookings: 180
        },
        popularMovies: [
          { movieId: null, title: "Dune: Part Two", views: 450 },
          { movieId: null, title: "Godzilla x Kong: The New Empire", views: 380 },
          { movieId: null, title: "Deadpool & Wolverine", views: 320 }
        ],
        bookingStats: {
          totalBookings: 180,
          totalRevenue: 2700,
          averageTicketPrice: 15
        },
        deviceStats: {
          desktop: 45,
          mobile: 40,
          tablet: 15
        }
      },
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        pageViews: {
          home: 1100,
          movies: 850,
          events: 400,
          news: 280,
          booking: 720
        },
        userActivity: {
          registrations: 38,
          logins: 290,
          bookings: 160
        },
        popularMovies: [
          { movieId: null, title: "Dune: Part Two", views: 420 },
          { movieId: null, title: "Godzilla x Kong: The New Empire", views: 350 },
          { movieId: null, title: "Deadpool & Wolverine", views: 300 }
        ],
        bookingStats: {
          totalBookings: 160,
          totalRevenue: 2400,
          averageTicketPrice: 15
        },
        deviceStats: {
          desktop: 48,
          mobile: 38,
          tablet: 14
        }
      }
    ];

    await Analytics.insertMany(analyticsData);
    console.log(`Added ${analyticsData.length} analytics documents`);
  } catch (error) {
    console.error('Error adding analytics data:', error);
  }
};

// Function to add page data
const addPageData = async () => {
  try {
    const count = await Page.countDocuments();
    if (count > 0) {
      console.log(`Page collection already has ${count} documents. Skipping...`);
      return;
    }

    const pageData = [
      {
        title: "About Us",
        slug: "about-us",
        content: "<h1>About Our Cinema</h1><p>Welcome to our cinema chain, where we strive to provide the best movie-going experience for all our customers. With state-of-the-art technology, comfortable seating, and a wide selection of films, we aim to make every visit memorable.</p><p>Our cinemas are equipped with the latest projection and sound systems, ensuring that you enjoy films the way they were meant to be experienced. From blockbuster action movies to indie art films, we showcase a diverse range of cinema from around the world.</p><h2>Our History</h2><p>Founded in 2010, our cinema chain has grown from a single screen to multiple locations across the country. We've maintained our commitment to quality and customer satisfaction throughout our expansion.</p><h2>Our Mission</h2><p>Our mission is to create a space where film lovers can come together to enjoy the magic of cinema. We believe in the power of storytelling and the unique experience of watching a film on the big screen.</p>",
        metaTitle: "About Us | Our Cinema Chain",
        metaDescription: "Learn about our cinema chain's history, mission, and commitment to providing the best movie-going experience.",
        status: "published",
        featured: false,
        author: null, // Will be populated later
        authorName: "Admin"
      },
      {
        title: "Terms and Conditions",
        slug: "terms-and-conditions",
        content: "<h1>Terms and Conditions</h1><p>Please read these terms and conditions carefully before using our website or services.</p><h2>1. Acceptance of Terms</h2><p>By accessing or using our website, booking tickets, or using any of our services, you agree to be bound by these Terms and Conditions.</p><h2>2. Booking and Payments</h2><p>All bookings are final and non-transferable. Payment must be made at the time of booking. We accept major credit cards and digital payment methods.</p><h2>3. Cancellations and Refunds</h2><p>Tickets may be refunded or exchanged up to 2 hours before the scheduled screening time. After this time, no refunds or exchanges will be provided except in cases of technical failures or cancellations by the cinema.</p><h2>4. Code of Conduct</h2><p>We reserve the right to refuse admission or ask customers to leave if they engage in disruptive behavior, including but not limited to: talking during the film, using mobile phones, recording the film, or any behavior that disturbs other patrons.</p><h2>5. Privacy Policy</h2><p>We collect and process personal data in accordance with our Privacy Policy, which can be found on our website.</p>",
        metaTitle: "Terms and Conditions | Our Cinema Chain",
        metaDescription: "Read our terms and conditions for using our cinema services, including booking, refunds, and code of conduct.",
        status: "published",
        featured: false,
        author: null, // Will be populated later
        authorName: "Admin"
      },
      {
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: "<h1>Privacy Policy</h1><p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our website or services.</p><h2>1. Information We Collect</h2><p>We collect information that you provide directly to us, such as your name, email address, phone number, and payment information when you create an account, book tickets, or contact customer service.</p><p>We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, pages visited, and time spent on the site.</p><h2>2. How We Use Your Information</h2><p>We use your information to process bookings, provide customer service, send you updates and marketing communications (if you've opted in), improve our services, and ensure the security of our website.</p><h2>3. Information Sharing</h2><p>We do not sell your personal information to third parties. We may share your information with service providers who help us operate our business, such as payment processors and email service providers.</p><h2>4. Your Rights</h2><p>You have the right to access, correct, or delete your personal information. You can also object to processing or request restriction of processing in certain circumstances.</p><h2>5. Security</h2><p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>",
        metaTitle: "Privacy Policy | Our Cinema Chain",
        metaDescription: "Learn how we collect, use, and protect your personal information when you use our cinema services.",
        status: "published",
        featured: false,
        author: null, // Will be populated later
        authorName: "Admin"
      },
      {
        title: "Contact Us",
        slug: "contact-us",
        content: "<h1>Contact Us</h1><p>We'd love to hear from you! Whether you have a question, feedback, or need assistance, our team is here to help.</p><h2>Customer Service</h2><p>For general inquiries and assistance with bookings:</p><p>Email: customer.service@ourcinema.com<br>Phone: (555) 123-4567<br>Hours: 9am - 10pm, 7 days a week</p><h2>Corporate Office</h2><p>For business inquiries and partnerships:</p><p>Email: business@ourcinema.com<br>Phone: (555) 987-6543<br>Address: 123 Cinema Street, Movie City, MC 12345</p><h2>Technical Support</h2><p>For website or app issues:</p><p>Email: tech.support@ourcinema.com<br>Hours: 24/7</p><h2>Send Us a Message</h2><p>Use the form below to send us a message, and we'll get back to you as soon as possible.</p>",
        metaTitle: "Contact Us | Our Cinema Chain",
        metaDescription: "Get in touch with our cinema chain for customer service, business inquiries, or technical support.",
        status: "published",
        featured: false,
        author: null, // Will be populated later
        authorName: "Admin"
      },
      {
        title: "FAQ",
        slug: "faq",
        content: "<h1>Frequently Asked Questions</h1><h2>Booking Tickets</h2><h3>How do I book tickets online?</h3><p>You can book tickets through our website or mobile app. Simply select the movie, date, time, and seats, then proceed to payment.</p><h3>Can I choose my seats?</h3><p>Yes, our booking system allows you to select specific seats for all screenings.</p><h3>What payment methods do you accept?</h3><p>We accept all major credit and debit cards, as well as digital payment methods like Apple Pay and Google Pay.</p><h2>At the Cinema</h2><h3>Do I need to print my tickets?</h3><p>No, you can show your e-ticket on your mobile device. We'll scan the QR code at the entrance.</p><h3>Are outside food and drinks allowed?</h3><p>Small snacks and non-alcoholic beverages in plastic containers are permitted. We also offer a variety of food and drinks at our concession stands.</p><h3>Do you offer wheelchair accessibility?</h3><p>Yes, all our cinemas are wheelchair accessible with designated seating areas.</p><h2>Membership & Loyalty</h2><h3>How does your loyalty program work?</h3><p>Our loyalty program lets you earn points for every purchase. These points can be redeemed for free tickets, concessions, and exclusive offers.</p><h3>How do I sign up for the loyalty program?</h3><p>You can sign up through our website, mobile app, or at any of our cinema locations.</p>",
        metaTitle: "Frequently Asked Questions | Our Cinema Chain",
        metaDescription: "Find answers to common questions about booking tickets, cinema facilities, and our loyalty program.",
        status: "published",
        featured: false,
        author: null, // Will be populated later
        authorName: "Admin"
      }
    ];

    // Find an admin user to set as author
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      pageData.forEach(page => {
        page.author = adminUser._id;
      });
    }

    await Page.insertMany(pageData);
    console.log(`Added ${pageData.length} page documents`);
  } catch (error) {
    console.error('Error adding page data:', error);
  }
};

// Function to add notification data
const addNotificationData = async () => {
  try {
    const count = await Notification.countDocuments();
    if (count > 0) {
      console.log(`Notification collection already has ${count} documents. Skipping...`);
      return;
    }

    // Find users to associate with notifications
    const users = await User.find().limit(3);
    if (users.length === 0) {
      console.log('No users found. Skipping notifications...');
      return;
    }

    const notificationData = [
      {
        user: users[0]._id,
        title: "Booking Confirmation",
        message: "Your booking for Dune: Part Two has been confirmed. Enjoy the movie!",
        type: "booking",
        read: false,
        createdAt: new Date()
      },
      {
        user: users[0]._id,
        title: "New Movie Release",
        message: "Deadpool & Wolverine is now available for booking. Get your tickets now!",
        type: "movie",
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        user: users[1]._id,
        title: "Special Offer",
        message: "Buy one ticket, get one free for all screenings this weekend!",
        type: "promotion",
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        user: users[1]._id,
        title: "Booking Reminder",
        message: "Your screening of Godzilla x Kong: The New Empire starts in 2 hours.",
        type: "reminder",
        read: false,
        createdAt: new Date()
      },
      {
        user: users[2]._id,
        title: "Account Update",
        message: "Your profile information has been updated successfully.",
        type: "account",
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];

    await Notification.insertMany(notificationData);
    console.log(`Added ${notificationData.length} notification documents`);
  } catch (error) {
    console.error('Error adding notification data:', error);
  }
};

// Function to add feedback data
const addFeedbackData = async () => {
  try {
    const count = await Feedback.countDocuments();
    if (count > 0) {
      console.log(`Feedback collection already has ${count} documents. Skipping...`);
      return;
    }

    // Find users to associate with feedback
    const users = await User.find().limit(3);

    const feedbackData = [
      {
        user: users.length > 0 ? users[0]._id : null,
        userName: users.length > 0 ? `${users[0].firstName} ${users[0].lastName}` : "John Doe",
        email: users.length > 0 ? users[0].email : "john.doe@example.com",
        subject: "Great Experience",
        message: "I had a wonderful time at your cinema. The staff was friendly and the facilities were clean. The sound and picture quality were excellent. I'll definitely be coming back!",
        rating: 5,
        category: "General",
        status: "published",
        createdAt: new Date()
      },
      {
        user: users.length > 1 ? users[1]._id : null,
        userName: users.length > 1 ? `${users[1].firstName} ${users[1].lastName}` : "Jane Smith",
        email: users.length > 1 ? users[1].email : "jane.smith@example.com",
        subject: "Booking System Suggestion",
        message: "I love your cinema, but I think the booking system could be improved. It would be great if we could modify our bookings after they're made, like changing seats or adding more tickets. Otherwise, everything is perfect!",
        rating: 4,
        category: "Website",
        status: "published",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        user: users.length > 2 ? users[2]._id : null,
        userName: users.length > 2 ? `${users[2].firstName} ${users[2].lastName}` : "Michael Johnson",
        email: users.length > 2 ? users[2].email : "michael.johnson@example.com",
        subject: "Concession Stand Prices",
        message: "While I enjoy watching movies at your cinema, I find the concession stand prices to be quite high. It would be nice to have some more affordable options or perhaps a loyalty program for frequent visitors.",
        rating: 3,
        category: "Facilities",
        status: "published",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        userName: "Guest User",
        email: "guest@example.com",
        subject: "Technical Issue",
        message: "During my visit yesterday, there was an issue with the sound during the first 10 minutes of the movie. The staff resolved it quickly, but it did disrupt the experience a bit.",
        rating: 3,
        category: "Technical",
        status: "published",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userName: "Guest User",
        email: "another.guest@example.com",
        subject: "Movie Selection",
        message: "I appreciate the diverse selection of movies you offer. It's great to see both mainstream blockbusters and independent films. Keep up the good work!",
        rating: 5,
        category: "Programming",
        status: "published",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];

    await Feedback.insertMany(feedbackData);
    console.log(`Added ${feedbackData.length} feedback documents`);
  } catch (error) {
    console.error('Error adding feedback data:', error);
  }
};

// Function to add payment data
const addPaymentData = async () => {
  try {
    const count = await Payment.countDocuments();
    if (count > 0) {
      console.log(`Payment collection already has ${count} documents. Skipping...`);
      return;
    }

    // Find users and bookings to associate with payments
    const users = await User.find().limit(3);
    if (users.length === 0) {
      console.log('No users found. Skipping payments...');
      return;
    }

    const paymentData = [
      {
        user: users[0]._id,
        booking: null, // Will be populated if bookings exist
        amount: 25.99,
        currency: "USD",
        paymentMethod: "credit_card",
        paymentDetails: {
          cardType: "Visa",
          last4: "4242",
          expiryMonth: 12,
          expiryYear: 2025
        },
        status: "completed",
        transactionId: "txn_" + Math.random().toString(36).substring(2, 15),
        createdAt: new Date()
      },
      {
        user: users[1]._id,
        booking: null, // Will be populated if bookings exist
        amount: 32.50,
        currency: "USD",
        paymentMethod: "paypal",
        paymentDetails: {
          email: "user@example.com"
        },
        status: "completed",
        transactionId: "txn_" + Math.random().toString(36).substring(2, 15),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        user: users[2]._id,
        booking: null, // Will be populated if bookings exist
        amount: 18.75,
        currency: "USD",
        paymentMethod: "credit_card",
        paymentDetails: {
          cardType: "Mastercard",
          last4: "5678",
          expiryMonth: 10,
          expiryYear: 2024
        },
        status: "completed",
        transactionId: "txn_" + Math.random().toString(36).substring(2, 15),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        user: users[0]._id,
        booking: null, // Will be populated if bookings exist
        amount: 45.00,
        currency: "USD",
        paymentMethod: "apple_pay",
        paymentDetails: {},
        status: "completed",
        transactionId: "txn_" + Math.random().toString(36).substring(2, 15),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        user: users[1]._id,
        booking: null, // Will be populated if bookings exist
        amount: 22.50,
        currency: "USD",
        paymentMethod: "credit_card",
        paymentDetails: {
          cardType: "Amex",
          last4: "9876",
          expiryMonth: 8,
          expiryYear: 2026
        },
        status: "refunded",
        transactionId: "txn_" + Math.random().toString(36).substring(2, 15),
        refundId: "ref_" + Math.random().toString(36).substring(2, 15),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      }
    ];

    await Payment.insertMany(paymentData);
    console.log(`Added ${paymentData.length} payment documents`);
  } catch (error) {
    console.error('Error adding payment data:', error);
  }
};

// Function to add blog category data
const addBlogCategoryData = async () => {
  try {
    const count = await BlogCategory.countDocuments();
    if (count > 0) {
      console.log(`BlogCategory collection already has ${count} documents. Skipping...`);
      return;
    }

    const blogCategoryData = [
      {
        name: "Movie Reviews",
        slug: "movie-reviews",
        description: "In-depth reviews of the latest film releases, from blockbusters to independent cinema.",
        featured: true,
        order: 1
      },
      {
        name: "Industry News",
        slug: "industry-news",
        description: "The latest updates and developments from the film industry, including production announcements, studio news, and box office reports.",
        featured: true,
        order: 2
      },
      {
        name: "Behind the Scenes",
        slug: "behind-the-scenes",
        description: "Exclusive looks at the filmmaking process, including interviews with directors, actors, and crew members.",
        featured: true,
        order: 3
      },
      {
        name: "Film Analysis",
        slug: "film-analysis",
        description: "Deep dives into film theory, cinematography, narrative structure, and thematic elements of notable films.",
        featured: false,
        order: 4
      },
      {
        name: "Interviews",
        slug: "interviews",
        description: "Conversations with filmmakers, actors, and other industry professionals about their work and creative process.",
        featured: false,
        order: 5
      },
      {
        name: "Film History",
        slug: "film-history",
        description: "Explorations of cinema's rich history, from the silent era to modern classics, highlighting influential movements and filmmakers.",
        featured: false,
        order: 6
      },
      {
        name: "Technology",
        slug: "technology",
        description: "Coverage of the latest advancements in filmmaking technology, from cameras and special effects to projection and sound systems.",
        featured: false,
        order: 7
      },
      {
        name: "Events & Festivals",
        slug: "events-festivals",
        description: "Reports and coverage from film festivals, premieres, and industry events around the world.",
        featured: true,
        order: 8
      }
    ];

    await BlogCategory.insertMany(blogCategoryData);
    console.log(`Added ${blogCategoryData.length} blog category documents`);
  } catch (error) {
    console.error('Error adding blog category data:', error);
  }
};

// Function to add content data
const addContentData = async () => {
  try {
    const count = await Content.countDocuments();
    if (count > 0) {
      console.log(`Content collection already has ${count} documents. Skipping...`);
      return;
    }

    const contentData = [
      {
        key: "home_hero",
        title: "Welcome to Our Cinema",
        content: "<h1>Experience Movies Like Never Before</h1><p>Immerse yourself in the magic of cinema with state-of-the-art technology and unparalleled comfort.</p>",
        type: "html",
        status: "published",
        location: "home",
        priority: 1
      },
      {
        key: "home_about",
        title: "About Our Cinema",
        content: "<h2>The Ultimate Movie Experience</h2><p>Our cinema combines cutting-edge technology with luxurious comfort to create the perfect environment for enjoying the latest blockbusters and timeless classics. With crystal-clear projection, immersive sound systems, and spacious seating, we're committed to making every visit memorable.</p><p>From family-friendly animations to thrilling action films, we showcase a diverse range of movies to cater to all tastes and preferences. Our concession stands offer a variety of snacks and beverages to enhance your movie-watching experience.</p>",
        type: "html",
        status: "published",
        location: "home",
        priority: 2
      },
      {
        key: "footer_about",
        title: "About Us",
        content: "<p>Our cinema chain has been providing exceptional movie experiences since 2010. With multiple locations across the country, we're dedicated to bringing the magic of cinema to audiences everywhere.</p>",
        type: "html",
        status: "published",
        location: "footer",
        priority: 1
      },
      {
        key: "footer_contact",
        title: "Contact Information",
        content: "<p>Email: info@ourcinema.com<br>Phone: (555) 123-4567<br>Address: 123 Movie Lane, Cinema City, CC 12345</p>",
        type: "html",
        status: "published",
        location: "footer",
        priority: 2
      },
      {
        key: "footer_social",
        title: "Follow Us",
        content: JSON.stringify({
          facebook: "https://facebook.com/ourcinema",
          twitter: "https://twitter.com/ourcinema",
          instagram: "https://instagram.com/ourcinema",
          youtube: "https://youtube.com/ourcinema"
        }),
        type: "json",
        status: "published",
        location: "footer",
        priority: 3
      },
      {
        key: "booking_instructions",
        title: "How to Book",
        content: "<h2>Booking Your Tickets</h2><ol><li>Select your movie</li><li>Choose your preferred date and time</li><li>Select your seats</li><li>Complete payment</li><li>Receive your e-ticket via email</li></ol><p>Present your e-ticket at the cinema for entry. No printing required!</p>",
        type: "html",
        status: "published",
        location: "booking",
        priority: 1
      },
      {
        key: "booking_policies",
        title: "Booking Policies",
        content: "<h3>Important Information</h3><ul><li>Bookings can be canceled or modified up to 2 hours before the screening</li><li>Children under 3 years old enter free but must sit on a parent's lap</li><li>Special seating is available for wheelchair users</li><li>Please arrive at least 15 minutes before the screening</li></ul>",
        type: "html",
        status: "published",
        location: "booking",
        priority: 2
      },
      {
        key: "seo_metadata",
        title: "SEO Metadata",
        content: JSON.stringify({
          home: {
            title: "Our Cinema | The Ultimate Movie Experience",
            description: "Experience the magic of cinema with state-of-the-art technology and unparalleled comfort at Our Cinema. Book your tickets online today!",
            keywords: "cinema, movies, film, tickets, booking"
          },
          movies: {
            title: "Movies | Our Cinema",
            description: "Browse the latest releases and upcoming films at Our Cinema. From blockbusters to indie gems, find the perfect movie for your next visit.",
            keywords: "movies, films, cinema, new releases, upcoming movies"
          },
          booking: {
            title: "Book Tickets | Our Cinema",
            description: "Book your movie tickets online at Our Cinema. Quick, easy, and secure booking for all the latest films.",
            keywords: "movie tickets, book online, cinema booking, film tickets"
          }
        }),
        type: "json",
        status: "published",
        location: "global",
        priority: 1
      }
    ];

    await Content.insertMany(contentData);
    console.log(`Added ${contentData.length} content documents`);
  } catch (error) {
    console.error('Error adding content data:', error);
  }
};

// Main function to add all missing data
const addMissingData = async () => {
  try {
    console.log('Starting to add missing data...');
    
    await addAnalyticsData();
    await addPageData();
    await addNotificationData();
    await addFeedbackData();
    await addPaymentData();
    await addBlogCategoryData();
    await addContentData();
    
    console.log('All missing data added successfully');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding missing data:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the function
addMissingData();
