const eventData = [
  {
    title: 'Marvel Movie Marathon',
    description: 'Experience the entire Marvel Cinematic Universe in one epic weekend! Join us for a back-to-back screening of all Marvel films, with special themed food, costume contests, and exclusive merchandise.',
    startDate: '2023-07-15T10:00:00.000Z',
    endDate: '2023-07-16T23:00:00.000Z',
    location: 'Grand Cinema',
    address: '123 Main Street, Downtown, New York, NY 10001',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    venue: null, // Will be populated with actual theater ID
    featuredImage: 'https://example.com/events/marvel-marathon.jpg',
    gallery: [
      'https://example.com/events/marvel-marathon-1.jpg',
      'https://example.com/events/marvel-marathon-2.jpg',
      'https://example.com/events/marvel-marathon-3.jpg'
    ],
    ticketPrice: 49.99,
    ticketUrl: 'https://example.com/tickets/marvel-marathon',
    capacity: 200,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Marvel', 'Movie Marathon', 'MCU', 'Avengers', 'Special Event'],
    status: 'upcoming',
    type: 'screening'
  },
  {
    title: 'Director\'s Talk: Christopher Nolan',
    description: 'Join us for an exclusive evening with acclaimed director Christopher Nolan as he discusses his filmmaking process, creative vision, and answers audience questions about his iconic works.',
    startDate: '2023-08-05T19:00:00.000Z',
    endDate: '2023-08-05T21:30:00.000Z',
    location: 'Landmark Theatres',
    address: '101 Market Street, San Francisco, CA 94105',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    venue: null, // Will be populated with actual theater ID
    featuredImage: 'https://example.com/events/nolan-talk.jpg',
    gallery: [
      'https://example.com/events/nolan-talk-1.jpg',
      'https://example.com/events/nolan-talk-2.jpg'
    ],
    ticketPrice: 75.00,
    ticketUrl: 'https://example.com/tickets/nolan-talk',
    capacity: 150,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Christopher Nolan', 'Director Talk', 'Filmmaking', 'Q&A', 'Special Event'],
    status: 'upcoming',
    type: 'talk'
  },
  {
    title: 'Oscar Nominees Showcase',
    description: 'Catch up on all the Best Picture nominees before the Academy Awards! This week-long event features screenings of each nominated film, panel discussions with film critics, and Oscar prediction contests.',
    startDate: '2023-02-20T12:00:00.000Z',
    endDate: '2023-02-26T23:00:00.000Z',
    location: 'AMC Southcenter 16',
    address: '2200 Southcenter Mall, Seattle, WA 98188',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98188',
    country: 'USA',
    venue: null, // Will be populated with actual theater ID
    featuredImage: 'https://example.com/events/oscar-nominees.jpg',
    gallery: [
      'https://example.com/events/oscar-nominees-1.jpg',
      'https://example.com/events/oscar-nominees-2.jpg',
      'https://example.com/events/oscar-nominees-3.jpg'
    ],
    ticketPrice: 39.99,
    ticketUrl: 'https://example.com/tickets/oscar-nominees',
    capacity: 300,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Oscars', 'Academy Awards', 'Best Picture', 'Film Festival', 'Special Event'],
    status: 'past',
    type: 'festival'
  },
  {
    title: 'Horror Night: Classic Monsters',
    description: 'A spine-tingling night of classic horror films featuring the Universal Monsters. Dress up as your favorite monster for our costume contest and enjoy themed cocktails and snacks.',
    startDate: '2023-10-28T18:00:00.000Z',
    endDate: '2023-10-29T02:00:00.000Z',
    location: 'Alamo Drafthouse Cinema',
    address: '320 East 6th Street, Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    country: 'USA',
    venue: null, // Will be populated with actual theater ID
    featuredImage: 'https://example.com/events/horror-night.jpg',
    gallery: [
      'https://example.com/events/horror-night-1.jpg',
      'https://example.com/events/horror-night-2.jpg'
    ],
    ticketPrice: 29.99,
    ticketUrl: 'https://example.com/tickets/horror-night',
    capacity: 120,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Horror', 'Classic Monsters', 'Halloween', 'Costume Contest', 'Special Event'],
    status: 'upcoming',
    type: 'screening'
  },
  {
    title: 'Film Scoring Workshop with Hans Zimmer',
    description: 'Learn the art of film scoring from legendary composer Hans Zimmer in this interactive workshop. Participants will gain insights into creating emotional impact through music and have the opportunity to score a short film clip.',
    startDate: '2023-09-10T14:00:00.000Z',
    endDate: '2023-09-10T18:00:00.000Z',
    location: 'Starlight Multiplex',
    address: '456 Broadway Avenue, Los Angeles, CA 90001',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    venue: null, // Will be populated with actual theater ID
    featuredImage: 'https://example.com/events/film-scoring-workshop.jpg',
    gallery: [
      'https://example.com/events/film-scoring-workshop-1.jpg',
      'https://example.com/events/film-scoring-workshop-2.jpg'
    ],
    ticketPrice: 149.99,
    ticketUrl: 'https://example.com/tickets/film-scoring-workshop',
    capacity: 50,
    isActive: true,
    isFeatured: false,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Hans Zimmer', 'Film Scoring', 'Workshop', 'Music', 'Composition', 'Special Event'],
    status: 'upcoming',
    type: 'workshop'
  },
  {
    title: 'International Film Festival',
    description: 'Celebrate global cinema with our annual International Film Festival, featuring award-winning films from around the world, Q&A sessions with international filmmakers, and cultural food experiences.',
    startDate: '2023-11-01T09:00:00.000Z',
    endDate: '2023-11-07T23:00:00.000Z',
    location: 'Multiple Venues',
    address: 'Various locations across Chicago',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    venue: null, // Will be populated with actual theater ID
    featuredImage: 'https://example.com/events/international-film-festival.jpg',
    gallery: [
      'https://example.com/events/international-film-festival-1.jpg',
      'https://example.com/events/international-film-festival-2.jpg',
      'https://example.com/events/international-film-festival-3.jpg'
    ],
    ticketPrice: 89.99,
    ticketUrl: 'https://example.com/tickets/international-film-festival',
    capacity: 1000,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['International Film', 'Film Festival', 'Global Cinema', 'Foreign Films', 'Special Event'],
    status: 'upcoming',
    type: 'festival'
  },
  {
    title: 'Kids Movie Day: Animation Celebration',
    description: 'A fun-filled day for young movie fans featuring the best animated films, character meet-and-greets, face painting, and interactive activities. Perfect for families with children of all ages.',
    startDate: '2023-06-10T10:00:00.000Z',
    endDate: '2023-06-10T16:00:00.000Z',
    location: 'Regal Atlantic Station',
    address: '261 19th Street NW, Atlanta, GA 30363',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30363',
    country: 'USA',
    venue: null, // Will be populated with actual theater ID
    featuredImage: 'https://example.com/events/kids-movie-day.jpg',
    gallery: [
      'https://example.com/events/kids-movie-day-1.jpg',
      'https://example.com/events/kids-movie-day-2.jpg'
    ],
    ticketPrice: 19.99,
    ticketUrl: 'https://example.com/tickets/kids-movie-day',
    capacity: 250,
    isActive: true,
    isFeatured: false,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Kids', 'Animation', 'Family Event', 'Children', 'Special Event'],
    status: 'past',
    type: 'family'
  },
  {
    title: 'Midnight Movie Madness',
    description: 'Stay up late for our monthly midnight screening series featuring cult classics, B-movies, and underground favorites. Each screening includes themed surprises and a lively audience experience.',
    startDate: '2023-07-29T23:30:00.000Z',
    endDate: '2023-07-30T02:30:00.000Z',
    location: 'Nitehawk Cinema',
    address: '136 Metropolitan Ave, Brooklyn, NY 11249',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11249',
    country: 'USA',
    venue: null, // Will be populated with actual theater ID
    featuredImage: 'https://example.com/events/midnight-movie-madness.jpg',
    gallery: [
      'https://example.com/events/midnight-movie-madness-1.jpg',
      'https://example.com/events/midnight-movie-madness-2.jpg'
    ],
    ticketPrice: 15.99,
    ticketUrl: 'https://example.com/tickets/midnight-movie-madness',
    capacity: 100,
    isActive: true,
    isFeatured: false,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Midnight Movie', 'Cult Films', 'Late Night', 'B-Movies', 'Special Event'],
    status: 'upcoming',
    type: 'screening'
  }
];

module.exports = eventData;
