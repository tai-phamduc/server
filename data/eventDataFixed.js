const eventData = [
  {
    title: 'Marvel Movie Marathon',
    description: 'Experience the entire Marvel Cinematic Universe in one epic weekend! Join us for a back-to-back screening of all Marvel films, with special themed food, costume contests, and exclusive merchandise.',
    shortDescription: 'A weekend-long celebration of the Marvel Cinematic Universe with all your favorite superhero films.',
    date: '2023-07-15',
    displayDate: 'July 15-16, 2023',
    month: 'July',
    day: 15,
    year: 2023,
    startTime: '10:00 AM',
    endTime: '11:00 PM',
    displayTime: '10:00 AM - 11:00 PM',
    location: 'Grand Cinema',
    venue: 'Main Theater',
    address: '123 Main Street, Downtown',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    image: 'https://example.com/events/marvel-marathon.jpg',
    gallery: [
      'https://example.com/events/marvel-marathon-1.jpg',
      'https://example.com/events/marvel-marathon-2.jpg',
      'https://example.com/events/marvel-marathon-3.jpg'
    ],
    featured: true,
    category: 'Film Festival',
    categories: ['Film Festival', 'Special Screening', 'Fan Event'],
    tags: [], // Will be populated with actual tag IDs
    registrationUrl: 'https://example.com/register/marvel-marathon',
    isActive: true,
    organizer: 'Grand Cinema Events Team',
    sponsors: ['Marvel Studios', 'Disney+', 'Local Comic Shop'],
    ticketPrice: 49.99,
    ticketUrl: 'https://example.com/tickets/marvel-marathon',
    capacity: 200,
    attendees: 180,
    relatedMovies: [], // Will be populated with actual movie IDs
    socialMedia: {
      facebook: 'https://facebook.com/events/marvel-marathon',
      twitter: 'https://twitter.com/grandcinema',
      instagram: 'https://instagram.com/grandcinema'
    }
  },
  {
    title: 'Director\'s Talk: Christopher Nolan',
    description: 'Join us for an exclusive evening with acclaimed director Christopher Nolan as he discusses his filmmaking process, creative vision, and answers audience questions about his iconic works.',
    shortDescription: 'An intimate conversation with one of cinema\'s most visionary directors.',
    date: '2023-08-05',
    displayDate: 'August 5, 2023',
    month: 'August',
    day: 5,
    year: 2023,
    startTime: '7:00 PM',
    endTime: '9:30 PM',
    displayTime: '7:00 PM - 9:30 PM',
    location: 'Landmark Theatres',
    venue: 'Screening Room A',
    address: '101 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    image: 'https://example.com/events/nolan-talk.jpg',
    gallery: [
      'https://example.com/events/nolan-talk-1.jpg',
      'https://example.com/events/nolan-talk-2.jpg'
    ],
    featured: true,
    category: 'Director Talk',
    categories: ['Director Talk', 'Q&A', 'Special Event'],
    tags: [], // Will be populated with actual tag IDs
    registrationUrl: 'https://example.com/register/nolan-talk',
    isActive: true,
    organizer: 'Landmark Theatres',
    sponsors: ['Warner Bros.', 'Film Society'],
    ticketPrice: 75.00,
    ticketUrl: 'https://example.com/tickets/nolan-talk',
    capacity: 150,
    attendees: 145,
    relatedMovies: [], // Will be populated with actual movie IDs
    socialMedia: {
      facebook: 'https://facebook.com/events/nolan-talk',
      twitter: 'https://twitter.com/landmarktheatres',
      instagram: 'https://instagram.com/landmarktheatres'
    }
  },
  {
    title: 'Oscar Nominees Showcase',
    description: 'Catch up on all the Best Picture nominees before the Academy Awards! This week-long event features screenings of each nominated film, panel discussions with film critics, and Oscar prediction contests.',
    shortDescription: 'See all the Best Picture nominees and join discussions about this year\'s Academy Awards contenders.',
    date: '2023-02-20',
    displayDate: 'February 20-26, 2023',
    month: 'February',
    day: 20,
    year: 2023,
    startTime: '12:00 PM',
    endTime: '11:00 PM',
    displayTime: '12:00 PM - 11:00 PM (Daily)',
    location: 'AMC Southcenter 16',
    venue: 'Multiple Screens',
    address: '2200 Southcenter Mall',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98188',
    country: 'USA',
    image: 'https://example.com/events/oscar-nominees.jpg',
    gallery: [
      'https://example.com/events/oscar-nominees-1.jpg',
      'https://example.com/events/oscar-nominees-2.jpg',
      'https://example.com/events/oscar-nominees-3.jpg'
    ],
    featured: true,
    category: 'Film Festival',
    categories: ['Film Festival', 'Awards Season', 'Special Screening'],
    tags: [], // Will be populated with actual tag IDs
    registrationUrl: 'https://example.com/register/oscar-nominees',
    isActive: true,
    organizer: 'AMC Theatres',
    sponsors: ['Academy of Motion Picture Arts and Sciences', 'Local Film Critics Association'],
    ticketPrice: 39.99,
    ticketUrl: 'https://example.com/tickets/oscar-nominees',
    capacity: 300,
    attendees: 275,
    relatedMovies: [], // Will be populated with actual movie IDs
    socialMedia: {
      facebook: 'https://facebook.com/events/oscar-nominees',
      twitter: 'https://twitter.com/amctheatres',
      instagram: 'https://instagram.com/amctheatres'
    }
  },
  {
    title: 'Horror Night: Classic Monsters',
    description: 'A spine-tingling night of classic horror films featuring the Universal Monsters. Dress up as your favorite monster for our costume contest and enjoy themed cocktails and snacks.',
    shortDescription: 'Celebrate the golden age of horror with classic monster films, costumes, and themed refreshments.',
    date: '2023-10-28',
    displayDate: 'October 28, 2023',
    month: 'October',
    day: 28,
    year: 2023,
    startTime: '6:00 PM',
    endTime: '2:00 AM',
    displayTime: '6:00 PM - 2:00 AM',
    location: 'Alamo Drafthouse Cinema',
    venue: 'Main Theater',
    address: '320 East 6th Street',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    country: 'USA',
    image: 'https://example.com/events/horror-night.jpg',
    gallery: [
      'https://example.com/events/horror-night-1.jpg',
      'https://example.com/events/horror-night-2.jpg'
    ],
    featured: true,
    category: 'Special Screening',
    categories: ['Special Screening', 'Horror', 'Costume Event'],
    tags: [], // Will be populated with actual tag IDs
    registrationUrl: 'https://example.com/register/horror-night',
    isActive: true,
    organizer: 'Alamo Drafthouse',
    sponsors: ['Universal Pictures', 'Local Brewery'],
    ticketPrice: 29.99,
    ticketUrl: 'https://example.com/tickets/horror-night',
    capacity: 120,
    attendees: 110,
    relatedMovies: [], // Will be populated with actual movie IDs
    socialMedia: {
      facebook: 'https://facebook.com/events/horror-night',
      twitter: 'https://twitter.com/alamodrafthouse',
      instagram: 'https://instagram.com/alamodrafthouse'
    }
  },
  {
    title: 'Film Scoring Workshop with Hans Zimmer',
    description: 'Learn the art of film scoring from legendary composer Hans Zimmer in this interactive workshop. Participants will gain insights into creating emotional impact through music and have the opportunity to score a short film clip.',
    shortDescription: 'A hands-on workshop with acclaimed composer Hans Zimmer on the art of film scoring.',
    date: '2023-09-10',
    displayDate: 'September 10, 2023',
    month: 'September',
    day: 10,
    year: 2023,
    startTime: '2:00 PM',
    endTime: '6:00 PM',
    displayTime: '2:00 PM - 6:00 PM',
    location: 'Starlight Multiplex',
    venue: 'Conference Room',
    address: '456 Broadway Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    image: 'https://example.com/events/film-scoring-workshop.jpg',
    gallery: [
      'https://example.com/events/film-scoring-workshop-1.jpg',
      'https://example.com/events/film-scoring-workshop-2.jpg'
    ],
    featured: false,
    category: 'Workshop',
    categories: ['Workshop', 'Music', 'Film Production'],
    tags: [], // Will be populated with actual tag IDs
    registrationUrl: 'https://example.com/register/film-scoring-workshop',
    isActive: true,
    organizer: 'Film Music Institute',
    sponsors: ['Remote Control Productions', 'Music Software Company'],
    ticketPrice: 149.99,
    ticketUrl: 'https://example.com/tickets/film-scoring-workshop',
    capacity: 50,
    attendees: 48,
    relatedMovies: [], // Will be populated with actual movie IDs
    socialMedia: {
      facebook: 'https://facebook.com/events/film-scoring-workshop',
      twitter: 'https://twitter.com/filmmusicinstitute',
      instagram: 'https://instagram.com/filmmusicinstitute'
    }
  }
];

module.exports = eventData;
