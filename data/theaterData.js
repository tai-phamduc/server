const theaterData = [
  {
    name: 'Grand Cinema',
    description: 'A luxurious cinema experience with state-of-the-art technology and premium seating.',
    address: '123 Main Street, Downtown, New York, NY 10001',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    phone: '+1 (212) 555-1234',
    email: 'info@grandcinema.com',
    website: 'https://www.grandcinema.com',
    location: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484]
    },
    images: [
      'https://example.com/theaters/grand-cinema-1.jpg',
      'https://example.com/theaters/grand-cinema-2.jpg'
    ],
    amenities: ['IMAX', 'Dolby Atmos', 'VIP Seating', 'Restaurant', 'Bar', 'Parking'],
    openingHours: {
      monday: '10:00 AM - 11:00 PM',
      tuesday: '10:00 AM - 11:00 PM',
      wednesday: '10:00 AM - 11:00 PM',
      thursday: '10:00 AM - 11:00 PM',
      friday: '10:00 AM - 1:00 AM',
      saturday: '9:00 AM - 1:00 AM',
      sunday: '9:00 AM - 11:00 PM'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    totalScreens: 12,
    totalSeats: 2400,
    metaKeywords: ['Grand Cinema', 'IMAX', 'Luxury Cinema', 'New York']
  },
  {
    name: 'Starlight Multiplex',
    description: 'A family-friendly multiplex offering affordable entertainment for all ages.',
    address: '456 Broadway Avenue, Los Angeles, CA 90001',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    phone: '+1 (323) 555-5678',
    email: 'info@starlightmultiplex.com',
    website: 'https://www.starlightmultiplex.com',
    location: {
      type: 'Point',
      coordinates: [-118.2437, 34.0522]
    },
    images: [
      'https://example.com/theaters/starlight-multiplex-1.jpg',
      'https://example.com/theaters/starlight-multiplex-2.jpg'
    ],
    amenities: ['3D Screens', 'Arcade', 'Food Court', 'Free Parking', 'Birthday Packages'],
    openingHours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 12:00 AM',
      saturday: '10:00 AM - 12:00 AM',
      sunday: '10:00 AM - 10:00 PM'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    totalScreens: 16,
    totalSeats: 3200,
    metaKeywords: ['Starlight Multiplex', 'Family Cinema', 'Affordable', 'Los Angeles']
  },
  {
    name: 'Cineplex Odeon',
    description: 'A modern cinema complex featuring the latest blockbusters and independent films.',
    address: '789 Michigan Avenue, Chicago, IL 60601',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    phone: '+1 (312) 555-9012',
    email: 'info@cineplexodeon.com',
    website: 'https://www.cineplexodeon.com',
    location: {
      type: 'Point',
      coordinates: [-87.6298, 41.8781]
    },
    images: [
      'https://example.com/theaters/cineplex-odeon-1.jpg',
      'https://example.com/theaters/cineplex-odeon-2.jpg'
    ],
    amenities: ['4DX', 'ScreenX', 'Recliner Seats', 'Lounge', 'Concierge Service'],
    openingHours: {
      monday: '10:30 AM - 10:30 PM',
      tuesday: '10:30 AM - 10:30 PM',
      wednesday: '10:30 AM - 10:30 PM',
      thursday: '10:30 AM - 10:30 PM',
      friday: '10:30 AM - 12:30 AM',
      saturday: '10:00 AM - 12:30 AM',
      sunday: '10:00 AM - 10:30 PM'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    totalScreens: 14,
    totalSeats: 2800,
    metaKeywords: ['Cineplex Odeon', '4DX', 'ScreenX', 'Chicago']
  },
  {
    name: 'Landmark Theatres',
    description: 'A boutique cinema specializing in independent and foreign films in a historic building.',
    address: '101 Market Street, San Francisco, CA 94105',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    phone: '+1 (415) 555-3456',
    email: 'info@landmarktheatres.com',
    website: 'https://www.landmarktheatres.com',
    location: {
      type: 'Point',
      coordinates: [-122.3959, 37.7937]
    },
    images: [
      'https://example.com/theaters/landmark-theatres-1.jpg',
      'https://example.com/theaters/landmark-theatres-2.jpg'
    ],
    amenities: ['Art Gallery', 'Wine Bar', 'Organic Snacks', 'Film Festivals', 'Director Q&As'],
    openingHours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 11:00 PM',
      saturday: '11:00 AM - 11:00 PM',
      sunday: '11:00 AM - 10:00 PM'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    totalScreens: 6,
    totalSeats: 900,
    metaKeywords: ['Landmark Theatres', 'Independent Films', 'Foreign Cinema', 'San Francisco']
  },
  {
    name: 'AMC Southcenter 16',
    description: 'A large multiplex with the latest technology and a wide variety of films.',
    address: '2200 Southcenter Mall, Seattle, WA 98188',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98188',
    country: 'USA',
    phone: '+1 (206) 555-7890',
    email: 'info@amcsouthcenter.com',
    website: 'https://www.amctheatres.com/southcenter',
    location: {
      type: 'Point',
      coordinates: [-122.2559, 47.4502]
    },
    images: [
      'https://example.com/theaters/amc-southcenter-1.jpg',
      'https://example.com/theaters/amc-southcenter-2.jpg'
    ],
    amenities: ['IMAX', 'Dolby Cinema', 'RealD 3D', 'MacGuffins Bar', 'Mobile Ordering'],
    openingHours: {
      monday: '10:00 AM - 11:00 PM',
      tuesday: '10:00 AM - 11:00 PM',
      wednesday: '10:00 AM - 11:00 PM',
      thursday: '10:00 AM - 11:00 PM',
      friday: '10:00 AM - 12:00 AM',
      saturday: '9:30 AM - 12:00 AM',
      sunday: '9:30 AM - 11:00 PM'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.4,
    totalScreens: 16,
    totalSeats: 3400,
    metaKeywords: ['AMC', 'Multiplex', 'IMAX', 'Seattle']
  },
  {
    name: 'Alamo Drafthouse Cinema',
    description: 'A unique cinema experience with in-theater dining and strict no-talking policy.',
    address: '320 East 6th Street, Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    country: 'USA',
    phone: '+1 (512) 555-2345',
    email: 'info@alamodrafthouse.com',
    website: 'https://www.alamodrafthouse.com',
    location: {
      type: 'Point',
      coordinates: [-97.7431, 30.2672]
    },
    images: [
      'https://example.com/theaters/alamo-drafthouse-1.jpg',
      'https://example.com/theaters/alamo-drafthouse-2.jpg'
    ],
    amenities: ['In-Theater Dining', 'Craft Beer Selection', 'Special Events', 'Movie-Themed Menus'],
    openingHours: {
      monday: '11:00 AM - 11:00 PM',
      tuesday: '11:00 AM - 11:00 PM',
      wednesday: '11:00 AM - 11:00 PM',
      thursday: '11:00 AM - 11:00 PM',
      friday: '11:00 AM - 1:00 AM',
      saturday: '10:00 AM - 1:00 AM',
      sunday: '10:00 AM - 11:00 PM'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    totalScreens: 8,
    totalSeats: 960,
    metaKeywords: ['Alamo Drafthouse', 'In-Theater Dining', 'Austin', 'Craft Beer']
  },
  {
    name: 'Regal Atlantic Station',
    description: 'A modern cinema in a popular shopping district with premium viewing options.',
    address: '261 19th Street NW, Atlanta, GA 30363',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30363',
    country: 'USA',
    phone: '+1 (404) 555-6789',
    email: 'info@regalatlantic.com',
    website: 'https://www.regmovies.com/atlanticstation',
    location: {
      type: 'Point',
      coordinates: [-84.3963, 33.7925]
    },
    images: [
      'https://example.com/theaters/regal-atlantic-1.jpg',
      'https://example.com/theaters/regal-atlantic-2.jpg'
    ],
    amenities: ['RPX', 'ScreenX', 'VIP Lounge', 'Reserved Seating', 'Expanded Concessions'],
    openingHours: {
      monday: '10:30 AM - 10:30 PM',
      tuesday: '10:30 AM - 10:30 PM',
      wednesday: '10:30 AM - 10:30 PM',
      thursday: '10:30 AM - 10:30 PM',
      friday: '10:30 AM - 12:00 AM',
      saturday: '10:00 AM - 12:00 AM',
      sunday: '10:00 AM - 10:30 PM'
    },
    isActive: true,
    isFeatured: false,
    rating: 4.3,
    totalScreens: 18,
    totalSeats: 3600,
    metaKeywords: ['Regal', 'RPX', 'Atlantic Station', 'Atlanta']
  },
  {
    name: 'Nitehawk Cinema',
    description: 'A dine-in cinema with curated programming and themed food and drink menus.',
    address: '136 Metropolitan Ave, Brooklyn, NY 11249',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11249',
    country: 'USA',
    phone: '+1 (718) 555-0123',
    email: 'info@nitehawkcinema.com',
    website: 'https://www.nitehawkcinema.com',
    location: {
      type: 'Point',
      coordinates: [-73.9626, 40.7164]
    },
    images: [
      'https://example.com/theaters/nitehawk-cinema-1.jpg',
      'https://example.com/theaters/nitehawk-cinema-2.jpg'
    ],
    amenities: ['Dine-In Service', 'Craft Cocktails', 'Local Ingredients', 'Midnight Movies', 'Brunch Screenings'],
    openingHours: {
      monday: '4:00 PM - 11:00 PM',
      tuesday: '4:00 PM - 11:00 PM',
      wednesday: '4:00 PM - 11:00 PM',
      thursday: '4:00 PM - 11:00 PM',
      friday: '4:00 PM - 1:00 AM',
      saturday: '11:00 AM - 1:00 AM',
      sunday: '11:00 AM - 11:00 PM'
    },
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    totalScreens: 3,
    totalSeats: 390,
    metaKeywords: ['Nitehawk Cinema', 'Dine-In', 'Brooklyn', 'Independent Films']
  }
];

module.exports = theaterData;
