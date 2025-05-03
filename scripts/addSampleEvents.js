const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => {
    console.log('MongoDB Connected');
    // Run the main function after connection is established
    addSampleEvents();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Main function to add sample events
const addSampleEvents = async () => {
  try {
    // Check if there are already events in the database
    const eventCount = await mongoose.connection.db.collection('events').countDocuments();
    console.log(`Found ${eventCount} events in the database`);

    // If there are already events, don't add more
    if (eventCount > 0) {
      console.log('Events already exist in the database. Skipping sample data creation.');
      
      // Update existing events to fix any issues
      const result = await mongoose.connection.db.collection('events').updateMany(
        {},
        {
          $set: {
            isActive: true,
            startTime: '18:00',
            endTime: '21:00',
            location: 'Cinema City Multiplex'
          }
        }
      );
      
      console.log(`Updated ${result.modifiedCount} events`);
      process.exit(0);
      return;
    }

    // Create sample events
    const sampleEvents = [
      {
        title: 'Film Festival 2023',
        slug: 'film-festival-2023',
        description: 'Join us for a celebration of independent cinema featuring award-winning films from around the world.',
        shortDescription: 'A celebration of independent cinema.',
        date: new Date('2023-12-15'),
        endDate: new Date('2023-12-20'),
        displayDate: 'December 15-20, 2023',
        month: 'December',
        day: 15,
        year: 2023,
        startTime: '18:00',
        endTime: '22:00',
        displayTime: '6:00 PM - 10:00 PM',
        timezone: 'America/New_York',
        location: 'Cinema City Multiplex',
        venue: 'Main Theater',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26',
        gallery: [
          'https://images.unsplash.com/photo-1485095329183-d0797cdc5676',
          'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c'
        ],
        featured: true,
        category: 'Film Festival',
        categories: ['Film Festival', 'Independent Cinema'],
        isActive: true,
        status: 'past',
        organizer: 'Cinema City Film Society',
        ticketPrice: 25,
        ticketUrl: 'https://example.com/tickets',
        capacity: 500,
        attendees: 450,
        schedule: [
          {
            title: 'Opening Ceremony',
            description: 'Welcome address and opening film screening',
            startTime: new Date('2023-12-15T18:00:00'),
            endTime: new Date('2023-12-15T20:00:00'),
            location: 'Main Theater',
            type: 'screening',
            isHighlighted: true
          },
          {
            title: 'Director\'s Panel',
            description: 'Q&A with award-winning directors',
            startTime: new Date('2023-12-16T14:00:00'),
            endTime: new Date('2023-12-16T16:00:00'),
            location: 'Conference Room A',
            type: 'panel',
            isHighlighted: false
          }
        ],
        createdAt: new Date('2023-11-01'),
        updatedAt: new Date('2023-11-15')
      },
      {
        title: 'Premiere: The Last Journey',
        slug: 'premiere-the-last-journey',
        description: 'Be among the first to see this year\'s most anticipated drama, followed by a Q&A with the director and cast.',
        shortDescription: 'Exclusive premiere of The Last Journey.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        displayDate: 'Next Week',
        month: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'long' }),
        day: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getDate(),
        year: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getFullYear(),
        startTime: '19:00',
        endTime: '22:00',
        displayTime: '7:00 PM - 10:00 PM',
        timezone: 'America/New_York',
        location: 'Cinema City Multiplex',
        venue: 'IMAX Theater',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
        gallery: [
          'https://images.unsplash.com/photo-1542204165-65bf26472b9b',
          'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4'
        ],
        featured: true,
        category: 'Premiere',
        categories: ['Premiere', 'Drama'],
        isActive: true,
        status: 'upcoming',
        organizer: 'Universal Pictures',
        ticketPrice: 35,
        ticketUrl: 'https://example.com/tickets',
        capacity: 300,
        attendees: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Documentary Showcase',
        slug: 'documentary-showcase',
        description: 'A showcase of the year\'s best documentary films, highlighting important social issues and extraordinary stories.',
        shortDescription: 'Showcasing the best documentaries of the year.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
        displayDate: 'In Two Weeks',
        month: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'long' }),
        day: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).getDate(),
        year: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).getFullYear(),
        startTime: '10:00',
        endTime: '20:00',
        displayTime: '10:00 AM - 8:00 PM',
        timezone: 'America/New_York',
        location: 'Cinema City Multiplex',
        venue: 'Screening Rooms 1-3',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        image: 'https://images.unsplash.com/photo-1493804714600-6edb1cd93080',
        gallery: [
          'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca',
          'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5'
        ],
        featured: false,
        category: 'Documentary',
        categories: ['Documentary', 'Film Festival'],
        isActive: true,
        status: 'upcoming',
        organizer: 'Documentary Film Association',
        ticketPrice: 20,
        ticketUrl: 'https://example.com/tickets',
        capacity: 200,
        attendees: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert events into the database
    const result = await mongoose.connection.db.collection('events').insertMany(sampleEvents);
    console.log(`Inserted ${result.insertedCount} events`);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};
