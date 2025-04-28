const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const colors = require('colors');

// Load models
const Genre = require('./models/Genre');
const Tag = require('./models/Tag');
const BlogCategory = require('./models/BlogCategory');
const FAQ = require('./models/FAQ');
const Page = require('./models/Page');
const Setting = require('./models/Setting');
const User = require('./models/User');

// Load data
const genreData = require('./data/genreData');
const tagData = require('./data/tagData');
const blogCategoryData = require('./data/blogCategoryData');
const faqData = require('./data/faqData');
const pageData = require('./data/pageData');

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
    // Get admin user
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Please run the main seeder first.'.red);
      process.exit(1);
    }
    
    // Clear existing data
    await Genre.deleteMany();
    await Tag.deleteMany();
    await BlogCategory.deleteMany();
    await FAQ.deleteMany();
    await Page.deleteMany();
    await Setting.deleteMany();
    
    console.log('Data cleared from database'.red.inverse);
    
    // Import genres one by one
    for (const genre of genreData) {
      await Genre.create({
        ...genre,
        createdBy: adminUser._id
      });
    }
    console.log(`${genreData.length} genres imported`.green.inverse);
    
    // Import tags one by one
    for (const tag of tagData) {
      await Tag.create({
        ...tag,
        createdBy: adminUser._id
      });
    }
    console.log(`${tagData.length} tags imported`.green.inverse);
    
    // Import blog categories one by one
    for (const category of blogCategoryData) {
      await BlogCategory.create({
        ...category,
        createdBy: adminUser._id
      });
    }
    console.log(`${blogCategoryData.length} blog categories imported`.green.inverse);
    
    // Import FAQs one by one
    for (const faq of faqData) {
      await FAQ.create({
        ...faq,
        createdBy: adminUser._id
      });
    }
    console.log(`${faqData.length} FAQs imported`.green.inverse);
    
    // Import pages one by one
    for (const page of pageData) {
      await Page.create({
        ...page,
        createdBy: adminUser._id,
        publishedAt: page.status === 'published' ? new Date() : null
      });
    }
    console.log(`${pageData.length} pages imported`.green.inverse);
    
    // Initialize settings
    await Setting.initDefaults(adminUser._id);
    console.log('Default settings initialized'.green.inverse);
    
    console.log('Data imported successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Run script
importData();
