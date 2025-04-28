// Sample booking data for development
const bookingData = [
  {
    _id: '60d0fe4f5311236168a109cb',
    bookingNumber: 'BK-20250510-001',
    user: '60d0fe4f5311236168a109ca', // Test user ID
    movie: {
      _id: '60d0fe4f5311236168a109cc',
      title: 'Inception',
      poster: 'https://image.tmdb.org/t/p/original/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg'
    },
    movieTitle: 'Inception',
    moviePoster: 'https://image.tmdb.org/t/p/original/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
    showtime: {
      _id: '60d0fe4f5311236168a109cd',
      startTime: '2025-05-10T19:00:00Z',
      displayTime: '7:00 PM',
      hall: 'Hall 1',
      theater: {
        _id: '60d0fe4f5311236168a109ce',
        name: 'Cinema City'
      }
    },
    showtimeDate: '2025-05-10T19:00:00Z',
    showtimeDisplay: '7:00 PM',
    theaterName: 'Cinema City',
    hall: 'Hall 1',
    seats: ['A1', 'A2'],
    seatsDisplay: 'A1, A2',
    ticketPrice: 12.99,
    ticketPriceFormatted: '$12.99',
    tax: 2.60,
    taxFormatted: '$2.60',
    serviceFee: 3.00,
    serviceFeeFormatted: '$3.00',
    totalPrice: 31.58,
    totalPriceFormatted: '$31.58',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    bookingStatus: 'confirmed',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-20250510-001',
    createdAt: '2025-05-01T10:30:00Z',
    updatedAt: '2025-05-01T10:30:00Z'
  },
  {
    _id: '60d0fe4f5311236168a109cf',
    bookingNumber: 'BK-20250512-002',
    user: '60d0fe4f5311236168a109ca', // Test user ID
    movie: {
      _id: '60d0fe4f5311236168a109d0',
      title: 'The Dark Knight',
      poster: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
    },
    movieTitle: 'The Dark Knight',
    moviePoster: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    showtime: {
      _id: '60d0fe4f5311236168a109d1',
      startTime: '2025-05-12T20:30:00Z',
      displayTime: '8:30 PM',
      hall: 'Hall 2',
      theater: {
        _id: '60d0fe4f5311236168a109d2',
        name: 'Starlight Cinema'
      }
    },
    showtimeDate: '2025-05-12T20:30:00Z',
    showtimeDisplay: '8:30 PM',
    theaterName: 'Starlight Cinema',
    hall: 'Hall 2',
    seats: ['B5', 'B6', 'B7'],
    seatsDisplay: 'B5, B6, B7',
    ticketPrice: 14.99,
    ticketPriceFormatted: '$14.99',
    tax: 4.50,
    taxFormatted: '$4.50',
    serviceFee: 4.50,
    serviceFeeFormatted: '$4.50',
    totalPrice: 53.97,
    totalPriceFormatted: '$53.97',
    paymentMethod: 'PayPal',
    paymentStatus: 'Paid',
    bookingStatus: 'confirmed',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-20250512-002',
    createdAt: '2025-05-02T14:45:00Z',
    updatedAt: '2025-05-02T14:45:00Z'
  },
  {
    _id: '60d0fe4f5311236168a109d3',
    bookingNumber: 'BK-20250515-003',
    user: '60d0fe4f5311236168a109ca', // Test user ID
    movie: {
      _id: '60d0fe4f5311236168a109d4',
      title: 'Dune',
      poster: 'https://image.tmdb.org/t/p/original/d5NXSklXo0qyIYkgV94XAgMIckC.jpg'
    },
    movieTitle: 'Dune',
    moviePoster: 'https://image.tmdb.org/t/p/original/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    showtime: {
      _id: '60d0fe4f5311236168a109d5',
      startTime: '2025-05-15T18:15:00Z',
      displayTime: '6:15 PM',
      hall: 'IMAX',
      theater: {
        _id: '60d0fe4f5311236168a109d6',
        name: 'Royal Theater'
      }
    },
    showtimeDate: '2025-05-15T18:15:00Z',
    showtimeDisplay: '6:15 PM',
    theaterName: 'Royal Theater',
    hall: 'IMAX',
    seats: ['C10', 'C11'],
    seatsDisplay: 'C10, C11',
    ticketPrice: 17.99,
    ticketPriceFormatted: '$17.99',
    tax: 3.60,
    taxFormatted: '$3.60',
    serviceFee: 3.00,
    serviceFeeFormatted: '$3.00',
    totalPrice: 42.58,
    totalPriceFormatted: '$42.58',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    bookingStatus: 'cancelled',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-20250515-003',
    createdAt: '2025-05-03T09:20:00Z',
    updatedAt: '2025-05-04T16:30:00Z',
    notes: 'Cancelled by user. Reason: Schedule conflict.'
  },
  {
    _id: '60d0fe4f5311236168a109d7',
    bookingNumber: 'BK-20250520-004',
    user: '60d0fe4f5311236168a109ca', // Test user ID
    movie: {
      _id: '60d0fe4f5311236168a109d8',
      title: 'Avengers: Endgame',
      poster: 'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
    },
    movieTitle: 'Avengers: Endgame',
    moviePoster: 'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    showtime: {
      _id: '60d0fe4f5311236168a109d9',
      startTime: '2025-05-20T19:45:00Z',
      displayTime: '7:45 PM',
      hall: 'Hall 3',
      theater: {
        _id: '60d0fe4f5311236168a109da',
        name: 'Cinema City'
      }
    },
    showtimeDate: '2025-05-20T19:45:00Z',
    showtimeDisplay: '7:45 PM',
    theaterName: 'Cinema City',
    hall: 'Hall 3',
    seats: ['D3', 'D4'],
    seatsDisplay: 'D3, D4',
    ticketPrice: 13.99,
    ticketPriceFormatted: '$13.99',
    tax: 2.80,
    taxFormatted: '$2.80',
    serviceFee: 3.00,
    serviceFeeFormatted: '$3.00',
    totalPrice: 33.78,
    totalPriceFormatted: '$33.78',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    bookingStatus: 'confirmed',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-20250520-004',
    createdAt: '2025-05-05T11:15:00Z',
    updatedAt: '2025-05-05T11:15:00Z'
  }

];

module.exports = bookingData;
