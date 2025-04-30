const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load environment variables
dotenv.config();

// Import models
const Language = require('./models/Language');
const Country = require('./models/Country');
const Product = require('./models/Product');
const Cinema = require('./models/Cinema');
const User = require('./models/User');

// Import data
const languageData = require('./data/languageData');
const countryData = require('./data/countryData');
const productData = require('./data/productData');
const userData = require('./data/userData');

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Import all data
const importData = async () => {
  try {
    // Clear existing data
    await Language.deleteMany();
    await Country.deleteMany();
    await User.deleteMany();

    console.log('Data cleared...'.red.inverse);

    // Find a cinema for products
    let cinema = await Cinema.findOne();

    if (!cinema) {
      // Create a sample cinema if none exists
      cinema = await Cinema.create({
        name: 'Sample Cinema',
        location: {
          address: '123 Main St',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'USA',
          coordinates: {
            type: 'Point',
            coordinates: [-74.0060, 40.7128] // Example coordinates for New York City
          }
        },
        contactInfo: {
          phone: '+12345678901',
          email: 'info@samplecinema.com',
          website: 'https://www.samplecinema.com'
        },
        isActive: true
      });
      console.log('Sample cinema created...'.green.inverse);
    }

    // Add cinema_id to products
    const productsWithCinema = productData.map(product => ({
      ...product,
      cinema_id: cinema._id
    }));

    // Import data
    await Language.insertMany(languageData);
    await Country.insertMany(countryData);
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(productsWithCinema);
    await User.insertMany(userData);

    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await Language.deleteMany();
    await Country.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
