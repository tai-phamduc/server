const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => {
    console.log('MongoDB Connected');
    // Run the main function after connection is established
    addSampleUsers();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Main function to add sample users
const addSampleUsers = async () => {
  try {
    // Check if there are already users in the database
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log(`Found ${userCount} users in the database`);

    // If there are already users, don't add more
    if (userCount > 2) {
      console.log('Users already exist in the database. Skipping sample data creation.');
      process.exit(0);
      return;
    }

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('password123', salt);
    const userPassword = await bcrypt.hash('password123', salt);

    // Create sample users
    const sampleUsers = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin",
        phone: "123-456-7890",
        address: "123 Admin St, Admin City, AC 12345",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Regular User",
        email: "user@example.com",
        password: userPassword,
        role: "user",
        phone: "987-654-3210",
        address: "456 User Ave, User Town, UT 67890",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: userPassword,
        role: "user",
        phone: "555-123-4567",
        address: "789 Main St, Anytown, AT 54321",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: userPassword,
        role: "user",
        phone: "555-987-6543",
        address: "321 Oak St, Somewhere, SW 98765",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert users into the database
    const result = await mongoose.connection.db.collection('users').insertMany(sampleUsers);
    console.log(`Inserted ${result.insertedCount} users`);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};
