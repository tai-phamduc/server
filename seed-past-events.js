const mongoose = require('mongoose');
const colors = require('colors');
const Event = require('./models/Event');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/movie-booking')
  .then(() => console.log('MongoDB Connected'.green.bold))
  .catch(err => {
    console.error(`Error: ${err.message}`.red.bold);
    process.exit(1);
  });

// Create past events
const createPastEvents = async () => {
  try {
    console.log('Creating past events...'.yellow);

    // Get current date
    const currentDate = new Date();
    
    // Create past events (events that occurred before today)
    const pastEvents = [
      {
        title: 'Classic Film Retrospective',
        description: 'A weekend-long retrospective celebrating the golden age of cinema with screenings of classic films from the 1940s and 1950s, including panel discussions with film historians and critics.',
        shortDescription: 'A celebration of classic cinema from the golden age.',
        date: new Date(currentDate.getFullYear() - 1, 5, 15), // Last year, June 15
        startTime: '10:00 AM',
        endTime: '8:00 PM',
        location: 'Cinema City',
        venue: 'Main Hall',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        image: 'https://via.placeholder.com/800x600?text=Classic+Film+Retrospective',
        gallery: [],
        featured: false,
        category: 'Retrospective',
        categories: [],
        tags: [],
        registrationUrl: '',
        isActive: true,
        organizer: 'Cinema City',
        sponsors: [],
        ticketPrice: 19.99,
        ticketUrl: '',
        capacity: 300,
        attendees: 275,
        relatedMovies: [],
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          pinterest: ''
        }
      },
      {
        title: 'Oscar Winners Showcase',
        description: 'A special event showcasing the best films from the most recent Academy Awards, including screenings of Best Picture nominees and winners, with discussions about the art of filmmaking.',
        shortDescription: 'Celebrating the best films from the Academy Awards.',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 10), // 3 months ago
        startTime: '1:00 PM',
        endTime: '11:00 PM',
        location: 'Starlight Multiplex',
        venue: 'VIP Theater',
        address: '456 Broadway Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        image: 'https://via.placeholder.com/800x600?text=Oscar+Winners+Showcase',
        gallery: [],
        featured: false,
        category: 'Showcase',
        categories: [],
        tags: [],
        registrationUrl: '',
        isActive: true,
        organizer: 'Starlight Multiplex',
        sponsors: [],
        ticketPrice: 24.99,
        ticketUrl: '',
        capacity: 200,
        attendees: 185,
        relatedMovies: [],
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          pinterest: ''
        }
      },
      {
        title: 'International Film Festival',
        description: 'A week-long celebration of international cinema featuring films from over 20 countries, with special appearances by directors and actors from around the world.',
        shortDescription: 'Celebrating cinema from around the world.',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 5), // 1 month ago
        startTime: '9:00 AM',
        endTime: '11:30 PM',
        location: 'Cinema City',
        venue: 'All Theaters',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        image: 'https://via.placeholder.com/800x600?text=International+Film+Festival',
        gallery: [],
        featured: false,
        category: 'Festival',
        categories: [],
        tags: [],
        registrationUrl: '',
        isActive: true,
        organizer: 'Cinema City',
        sponsors: [],
        ticketPrice: 39.99,
        ticketUrl: '',
        capacity: 1000,
        attendees: 950,
        relatedMovies: [],
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          pinterest: ''
        }
      },
      {
        title: 'Documentary Film Night',
        description: 'An evening dedicated to thought-provoking documentaries that explore important social issues, followed by Q&A sessions with filmmakers and subject matter experts.',
        shortDescription: 'An evening of thought-provoking documentaries.',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 20), // 2 months ago
        startTime: '6:00 PM',
        endTime: '10:00 PM',
        location: 'Starlight Multiplex',
        venue: 'Screen 3',
        address: '456 Broadway Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        image: 'https://via.placeholder.com/800x600?text=Documentary+Film+Night',
        gallery: [],
        featured: false,
        category: 'Documentary',
        categories: [],
        tags: [],
        registrationUrl: '',
        isActive: true,
        organizer: 'Starlight Multiplex',
        sponsors: [],
        ticketPrice: 12.99,
        ticketUrl: '',
        capacity: 150,
        attendees: 130,
        relatedMovies: [],
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          pinterest: ''
        }
      },
      {
        title: 'Animation Celebration',
        description: 'A family-friendly event celebrating the art of animation, featuring screenings of classic and contemporary animated films, workshops on animation techniques, and activities for children.',
        shortDescription: 'Celebrating the art of animation for all ages.',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 5), // 2 months ago
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        location: 'Cinema City',
        venue: 'Family Theater',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        image: 'https://via.placeholder.com/800x600?text=Animation+Celebration',
        gallery: [],
        featured: false,
        category: 'Family',
        categories: [],
        tags: [],
        registrationUrl: '',
        isActive: true,
        organizer: 'Cinema City',
        sponsors: [],
        ticketPrice: 15.99,
        ticketUrl: '',
        capacity: 250,
        attendees: 240,
        relatedMovies: [],
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          pinterest: ''
        }
      }
    ];

    // Insert past events into database
    await Event.insertMany(pastEvents);
    console.log(`${pastEvents.length} past events created`.green);

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB Disconnected'.yellow);
    console.log('Past events creation completed successfully'.green.bold);

  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the function
createPastEvents();
