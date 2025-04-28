const theaterData = [
  {
    name: 'Grand Cinema',
    slug: 'grand-cinema',
    description: 'A luxurious cinema experience with state-of-the-art technology and premium seating.',
    location: {
      address: '123 Main Street, Downtown, New York',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9857, 40.7484]
      }
    },
    contactInfo: {
      phone: '+12125551234',
      email: 'info@grandcinema.com',
      website: 'https://www.grandcinema.com'
    },
    openingHours: {
      monday: { open: '10:00', close: '23:00' },
      tuesday: { open: '10:00', close: '23:00' },
      wednesday: { open: '10:00', close: '23:00' },
      thursday: { open: '10:00', close: '23:00' },
      friday: { open: '10:00', close: '01:00' },
      saturday: { open: '09:00', close: '01:00' },
      sunday: { open: '09:00', close: '23:00' }
    },
    displayHours: '10:00 AM - 11:00 PM',
    amenities: ['IMAX', 'Dolby Atmos', 'VIP Seating', 'Restaurant', 'Bar', 'Parking'],
    screens: 12,
    seatingCapacity: 2400,
    featuredImage: 'https://example.com/theaters/grand-cinema-1.jpg',
    images: [
      'https://example.com/theaters/grand-cinema-1.jpg',
      'https://example.com/theaters/grand-cinema-2.jpg'
    ],
    rating: 4.8,
    reviewCount: 245,
    totalRating: 1176,
    isActive: true,
    isFeatured: true,
    parkingAvailable: true,
    foodCourtAvailable: true,
    accessibilityFeatures: ['Wheelchair Access', 'Hearing Assistance', 'Accessible Restrooms'],
    chain: 'Independent',
    ticketPriceRange: {
      min: 12.99,
      max: 24.99
    },
    metaKeywords: ['Grand Cinema', 'IMAX', 'Luxury Cinema', 'New York']
  },
  {
    name: 'Starlight Multiplex',
    slug: 'starlight-multiplex',
    description: 'A family-friendly multiplex offering affordable entertainment for all ages.',
    location: {
      address: '456 Broadway Avenue, Los Angeles',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      coordinates: {
        type: 'Point',
        coordinates: [-118.2437, 34.0522]
      }
    },
    contactInfo: {
      phone: '+13235555678',
      email: 'info@starlightmultiplex.com',
      website: 'https://www.starlightmultiplex.com'
    },
    openingHours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '10:00', close: '00:00' },
      sunday: { open: '10:00', close: '22:00' }
    },
    displayHours: '11:00 AM - 10:00 PM',
    amenities: ['3D Screens', 'Arcade', 'Food Court', 'Free Parking', 'Birthday Packages'],
    screens: 16,
    seatingCapacity: 3200,
    featuredImage: 'https://example.com/theaters/starlight-multiplex-1.jpg',
    images: [
      'https://example.com/theaters/starlight-multiplex-1.jpg',
      'https://example.com/theaters/starlight-multiplex-2.jpg'
    ],
    rating: 4.5,
    reviewCount: 189,
    totalRating: 850.5,
    isActive: true,
    isFeatured: true,
    parkingAvailable: true,
    foodCourtAvailable: true,
    accessibilityFeatures: ['Wheelchair Access', 'Accessible Restrooms'],
    chain: 'Starlight Entertainment',
    ticketPriceRange: {
      min: 9.99,
      max: 15.99
    },
    metaKeywords: ['Starlight Multiplex', 'Family Cinema', 'Affordable', 'Los Angeles']
  },
  {
    name: 'Cineplex Odeon',
    slug: 'cineplex-odeon',
    description: 'A modern cinema complex featuring the latest blockbusters and independent films.',
    location: {
      address: '789 Michigan Avenue, Chicago',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      coordinates: {
        type: 'Point',
        coordinates: [-87.6298, 41.8781]
      }
    },
    contactInfo: {
      phone: '+13125559012',
      email: 'info@cineplexodeon.com',
      website: 'https://www.cineplexodeon.com'
    },
    openingHours: {
      monday: { open: '10:30', close: '22:30' },
      tuesday: { open: '10:30', close: '22:30' },
      wednesday: { open: '10:30', close: '22:30' },
      thursday: { open: '10:30', close: '22:30' },
      friday: { open: '10:30', close: '00:30' },
      saturday: { open: '10:00', close: '00:30' },
      sunday: { open: '10:00', close: '22:30' }
    },
    displayHours: '10:30 AM - 10:30 PM',
    amenities: ['4DX', 'ScreenX', 'Recliner Seats', 'Lounge', 'Concierge Service'],
    screens: 14,
    seatingCapacity: 2800,
    featuredImage: 'https://example.com/theaters/cineplex-odeon-1.jpg',
    images: [
      'https://example.com/theaters/cineplex-odeon-1.jpg',
      'https://example.com/theaters/cineplex-odeon-2.jpg'
    ],
    rating: 4.6,
    reviewCount: 210,
    totalRating: 966,
    isActive: true,
    isFeatured: true,
    parkingAvailable: true,
    foodCourtAvailable: true,
    accessibilityFeatures: ['Wheelchair Access', 'Hearing Assistance', 'Accessible Restrooms', 'Service Animal Friendly'],
    chain: 'Cineplex',
    ticketPriceRange: {
      min: 11.99,
      max: 19.99
    },
    metaKeywords: ['Cineplex Odeon', '4DX', 'ScreenX', 'Chicago']
  },
  {
    name: 'Landmark Theatres',
    slug: 'landmark-theatres',
    description: 'A boutique cinema specializing in independent and foreign films in a historic building.',
    location: {
      address: '101 Market Street, San Francisco',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      coordinates: {
        type: 'Point',
        coordinates: [-122.3959, 37.7937]
      }
    },
    contactInfo: {
      phone: '+14155553456',
      email: 'info@landmarktheatres.com',
      website: 'https://www.landmarktheatres.com'
    },
    openingHours: {
      monday: { open: '12:00', close: '22:00' },
      tuesday: { open: '12:00', close: '22:00' },
      wednesday: { open: '12:00', close: '22:00' },
      thursday: { open: '12:00', close: '22:00' },
      friday: { open: '12:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '22:00' }
    },
    displayHours: '12:00 PM - 10:00 PM',
    amenities: ['Art Gallery', 'Wine Bar', 'Organic Snacks', 'Film Festivals', 'Director Q&As'],
    screens: 6,
    seatingCapacity: 900,
    featuredImage: 'https://example.com/theaters/landmark-theatres-1.jpg',
    images: [
      'https://example.com/theaters/landmark-theatres-1.jpg',
      'https://example.com/theaters/landmark-theatres-2.jpg'
    ],
    rating: 4.7,
    reviewCount: 175,
    totalRating: 822.5,
    isActive: true,
    isFeatured: true,
    parkingAvailable: false,
    foodCourtAvailable: true,
    accessibilityFeatures: ['Wheelchair Access', 'Accessible Restrooms'],
    chain: 'Landmark',
    ticketPriceRange: {
      min: 13.99,
      max: 17.99
    },
    metaKeywords: ['Landmark Theatres', 'Independent Films', 'Foreign Cinema', 'San Francisco']
  },
  {
    name: 'AMC Southcenter 16',
    slug: 'amc-southcenter-16',
    description: 'A large multiplex with the latest technology and a wide variety of films.',
    location: {
      address: '2200 Southcenter Mall, Seattle',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98188',
      country: 'USA',
      coordinates: {
        type: 'Point',
        coordinates: [-122.2559, 47.4502]
      }
    },
    contactInfo: {
      phone: '+12065557890',
      email: 'info@amcsouthcenter.com',
      website: 'https://www.amctheatres.com/southcenter'
    },
    openingHours: {
      monday: { open: '10:00', close: '23:00' },
      tuesday: { open: '10:00', close: '23:00' },
      wednesday: { open: '10:00', close: '23:00' },
      thursday: { open: '10:00', close: '23:00' },
      friday: { open: '10:00', close: '00:00' },
      saturday: { open: '09:30', close: '00:00' },
      sunday: { open: '09:30', close: '23:00' }
    },
    displayHours: '10:00 AM - 11:00 PM',
    amenities: ['IMAX', 'Dolby Cinema', 'RealD 3D', 'MacGuffins Bar', 'Mobile Ordering'],
    screens: 16,
    seatingCapacity: 3400,
    featuredImage: 'https://example.com/theaters/amc-southcenter-1.jpg',
    images: [
      'https://example.com/theaters/amc-southcenter-1.jpg',
      'https://example.com/theaters/amc-southcenter-2.jpg'
    ],
    rating: 4.4,
    reviewCount: 230,
    totalRating: 1012,
    isActive: true,
    isFeatured: true,
    parkingAvailable: true,
    foodCourtAvailable: true,
    accessibilityFeatures: ['Wheelchair Access', 'Hearing Assistance', 'Accessible Restrooms', 'Closed Captioning Devices'],
    chain: 'AMC',
    ticketPriceRange: {
      min: 10.99,
      max: 21.99
    },
    metaKeywords: ['AMC', 'Multiplex', 'IMAX', 'Seattle']
  },
  {
    name: 'Alamo Drafthouse Cinema',
    slug: 'alamo-drafthouse-cinema',
    description: 'A unique cinema experience with in-theater dining and strict no-talking policy.',
    location: {
      address: '320 East 6th Street, Austin',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
      coordinates: {
        type: 'Point',
        coordinates: [-97.7431, 30.2672]
      }
    },
    contactInfo: {
      phone: '+15125552345',
      email: 'info@alamodrafthouse.com',
      website: 'https://www.alamodrafthouse.com'
    },
    openingHours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '01:00' },
      saturday: { open: '10:00', close: '01:00' },
      sunday: { open: '10:00', close: '23:00' }
    },
    displayHours: '11:00 AM - 11:00 PM',
    amenities: ['In-Theater Dining', 'Craft Beer Selection', 'Special Events', 'Movie-Themed Menus'],
    screens: 8,
    seatingCapacity: 960,
    featuredImage: 'https://example.com/theaters/alamo-drafthouse-1.jpg',
    images: [
      'https://example.com/theaters/alamo-drafthouse-1.jpg',
      'https://example.com/theaters/alamo-drafthouse-2.jpg'
    ],
    rating: 4.9,
    reviewCount: 320,
    totalRating: 1568,
    isActive: true,
    isFeatured: true,
    parkingAvailable: true,
    foodCourtAvailable: true,
    accessibilityFeatures: ['Wheelchair Access', 'Accessible Restrooms'],
    chain: 'Alamo Drafthouse',
    ticketPriceRange: {
      min: 12.99,
      max: 18.99
    },
    metaKeywords: ['Alamo Drafthouse', 'In-Theater Dining', 'Austin', 'Craft Beer']
  },
  {
    name: 'Regal Atlantic Station',
    slug: 'regal-atlantic-station',
    description: 'A modern cinema in a popular shopping district with premium viewing options.',
    location: {
      address: '261 19th Street NW, Atlanta',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30363',
      country: 'USA',
      coordinates: {
        type: 'Point',
        coordinates: [-84.3963, 33.7925]
      }
    },
    contactInfo: {
      phone: '+14045556789',
      email: 'info@regalatlantic.com',
      website: 'https://www.regmovies.com/atlanticstation'
    },
    openingHours: {
      monday: { open: '10:30', close: '22:30' },
      tuesday: { open: '10:30', close: '22:30' },
      wednesday: { open: '10:30', close: '22:30' },
      thursday: { open: '10:30', close: '22:30' },
      friday: { open: '10:30', close: '00:00' },
      saturday: { open: '10:00', close: '00:00' },
      sunday: { open: '10:00', close: '22:30' }
    },
    displayHours: '10:30 AM - 10:30 PM',
    amenities: ['RPX', 'ScreenX', 'VIP Lounge', 'Reserved Seating', 'Expanded Concessions'],
    screens: 18,
    seatingCapacity: 3600,
    featuredImage: 'https://example.com/theaters/regal-atlantic-1.jpg',
    images: [
      'https://example.com/theaters/regal-atlantic-1.jpg',
      'https://example.com/theaters/regal-atlantic-2.jpg'
    ],
    rating: 4.3,
    reviewCount: 280,
    totalRating: 1204,
    isActive: true,
    isFeatured: false,
    parkingAvailable: true,
    foodCourtAvailable: true,
    accessibilityFeatures: ['Wheelchair Access', 'Hearing Assistance', 'Accessible Restrooms'],
    chain: 'Regal',
    ticketPriceRange: {
      min: 11.99,
      max: 20.99
    },
    metaKeywords: ['Regal', 'RPX', 'Atlantic Station', 'Atlanta']
  },
  {
    name: 'Nitehawk Cinema',
    slug: 'nitehawk-cinema',
    description: 'A dine-in cinema with curated programming and themed food and drink menus.',
    location: {
      address: '136 Metropolitan Ave, Brooklyn',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11249',
      country: 'USA',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9626, 40.7164]
      }
    },
    contactInfo: {
      phone: '+17185550123',
      email: 'info@nitehawkcinema.com',
      website: 'https://www.nitehawkcinema.com'
    },
    openingHours: {
      monday: { open: '16:00', close: '23:00' },
      tuesday: { open: '16:00', close: '23:00' },
      wednesday: { open: '16:00', close: '23:00' },
      thursday: { open: '16:00', close: '23:00' },
      friday: { open: '16:00', close: '01:00' },
      saturday: { open: '11:00', close: '01:00' },
      sunday: { open: '11:00', close: '23:00' }
    },
    displayHours: '4:00 PM - 11:00 PM (Mon-Thu), 4:00 PM - 1:00 AM (Fri), 11:00 AM - 1:00 AM (Sat), 11:00 AM - 11:00 PM (Sun)',
    amenities: ['Dine-In Service', 'Craft Cocktails', 'Local Ingredients', 'Midnight Movies', 'Brunch Screenings'],
    screens: 3,
    seatingCapacity: 390,
    featuredImage: 'https://example.com/theaters/nitehawk-cinema-1.jpg',
    images: [
      'https://example.com/theaters/nitehawk-cinema-1.jpg',
      'https://example.com/theaters/nitehawk-cinema-2.jpg'
    ],
    rating: 4.8,
    reviewCount: 195,
    totalRating: 936,
    isActive: true,
    isFeatured: true,
    parkingAvailable: false,
    foodCourtAvailable: true,
    accessibilityFeatures: ['Wheelchair Access', 'Accessible Restrooms'],
    chain: 'Independent',
    ticketPriceRange: {
      min: 14.99,
      max: 18.99
    },
    metaKeywords: ['Nitehawk Cinema', 'Dine-In', 'Brooklyn', 'Independent Films']
  }
];

module.exports = theaterData;
