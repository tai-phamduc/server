const mongoose = require('mongoose');

// Get current date
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

// Helper function to create a date with specific time
const createDateTime = (baseDate, timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Helper function to create seat map
const createSeatMap = (totalSeats) => {
  const seatMap = new Map();
  const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let seatsPerRow = Math.ceil(Math.sqrt(totalSeats));
  let rowCount = Math.ceil(totalSeats / seatsPerRow);

  for (let i = 0; i < rowCount; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      if ((i * seatsPerRow) + j <= totalSeats) {
        seatMap.set(`${rows[i]}${j}`, 'available');
      }
    }
  }

  return seatMap;
};

// Create showtime data
const showtimes = [
  // The Godfather - Today
  {
    movie: '680d29841ad99532cd239bc9', // The Godfather
    theater: '680d29841ad99532cd239ba1', // Grand Cinema
    hall: 'Hall 1',
    date: today,
    startTime: createDateTime(today, '10:00'),
    endTime: createDateTime(today, '12:55'),
    format: '2D',
    language: 'English',
    subtitles: 'None',
    price: 12.99,
    seatsAvailable: 120,
    totalSeats: 120,
    seatMap: createSeatMap(120),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239bc9', // The Godfather
    theater: '680d29841ad99532cd239ba1', // Grand Cinema
    hall: 'Hall 1',
    date: today,
    startTime: createDateTime(today, '14:00'),
    endTime: createDateTime(today, '16:55'),
    format: '2D',
    language: 'English',
    subtitles: 'None',
    price: 14.99,
    seatsAvailable: 120,
    totalSeats: 120,
    seatMap: createSeatMap(120),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239bc9', // The Godfather
    theater: '680d29841ad99532cd239ba1', // Grand Cinema
    hall: 'Hall 1',
    date: today,
    startTime: createDateTime(today, '18:00'),
    endTime: createDateTime(today, '20:55'),
    format: '2D',
    language: 'English',
    subtitles: 'None',
    price: 16.99,
    seatsAvailable: 120,
    totalSeats: 120,
    seatMap: createSeatMap(120),
    isActive: true,
    isFeatured: true,
    specialEvent: false,
    eventDetails: null
  },

  // The Dark Knight - Today
  {
    movie: '680d29841ad99532cd239bb6', // The Dark Knight
    theater: '680d29841ad99532cd239ba2', // Starlight Multiplex
    hall: 'Hall 2',
    date: today,
    startTime: createDateTime(today, '11:30'),
    endTime: createDateTime(today, '14:02'),
    format: 'IMAX',
    language: 'English',
    subtitles: 'None',
    price: 18.99,
    seatsAvailable: 150,
    totalSeats: 150,
    seatMap: createSeatMap(150),
    isActive: true,
    isFeatured: true,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239bb6', // The Dark Knight
    theater: '680d29841ad99532cd239ba2', // Starlight Multiplex
    hall: 'Hall 2',
    date: today,
    startTime: createDateTime(today, '15:30'),
    endTime: createDateTime(today, '18:02'),
    format: 'IMAX',
    language: 'English',
    subtitles: 'None',
    price: 18.99,
    seatsAvailable: 150,
    totalSeats: 150,
    seatMap: createSeatMap(150),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239bb6', // The Dark Knight
    theater: '680d29841ad99532cd239ba2', // Starlight Multiplex
    hall: 'Hall 2',
    date: today,
    startTime: createDateTime(today, '19:30'),
    endTime: createDateTime(today, '22:02'),
    format: 'IMAX',
    language: 'English',
    subtitles: 'None',
    price: 20.99,
    seatsAvailable: 150,
    totalSeats: 150,
    seatMap: createSeatMap(150),
    isActive: true,
    isFeatured: true,
    specialEvent: false,
    eventDetails: null
  },

  // Inception - Today
  {
    movie: '680d29841ad99532cd239baa', // Inception
    theater: '680d29841ad99532cd239ba3', // Cineplex Odeon
    hall: 'Hall 3',
    date: today,
    startTime: createDateTime(today, '12:00'),
    endTime: createDateTime(today, '14:28'),
    format: '4DX',
    language: 'English',
    subtitles: 'None',
    price: 19.99,
    seatsAvailable: 100,
    totalSeats: 100,
    seatMap: createSeatMap(100),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239baa', // Inception
    theater: '680d29841ad99532cd239ba3', // Cineplex Odeon
    hall: 'Hall 3',
    date: today,
    startTime: createDateTime(today, '16:00'),
    endTime: createDateTime(today, '18:28'),
    format: '4DX',
    language: 'English',
    subtitles: 'None',
    price: 19.99,
    seatsAvailable: 100,
    totalSeats: 100,
    seatMap: createSeatMap(100),
    isActive: true,
    isFeatured: true,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239baa', // Inception
    theater: '680d29841ad99532cd239ba3', // Cineplex Odeon
    hall: 'Hall 3',
    date: today,
    startTime: createDateTime(today, '20:00'),
    endTime: createDateTime(today, '22:28'),
    format: '4DX',
    language: 'English',
    subtitles: 'None',
    price: 21.99,
    seatsAvailable: 100,
    totalSeats: 100,
    seatMap: createSeatMap(100),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },

  // The Godfather - Tomorrow
  {
    movie: '680d29841ad99532cd239bc9', // The Godfather
    theater: '680d29841ad99532cd239ba1', // Grand Cinema
    hall: 'Hall 1',
    date: tomorrow,
    startTime: createDateTime(tomorrow, '10:00'),
    endTime: createDateTime(tomorrow, '12:55'),
    format: '2D',
    language: 'English',
    subtitles: 'None',
    price: 12.99,
    seatsAvailable: 120,
    totalSeats: 120,
    seatMap: createSeatMap(120),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239bc9', // The Godfather
    theater: '680d29841ad99532cd239ba1', // Grand Cinema
    hall: 'Hall 1',
    date: tomorrow,
    startTime: createDateTime(tomorrow, '14:00'),
    endTime: createDateTime(tomorrow, '16:55'),
    format: '2D',
    language: 'English',
    subtitles: 'None',
    price: 14.99,
    seatsAvailable: 120,
    totalSeats: 120,
    seatMap: createSeatMap(120),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239bc9', // The Godfather
    theater: '680d29841ad99532cd239ba1', // Grand Cinema
    hall: 'Hall 1',
    date: tomorrow,
    startTime: createDateTime(tomorrow, '18:00'),
    endTime: createDateTime(tomorrow, '20:55'),
    format: '2D',
    language: 'English',
    subtitles: 'None',
    price: 16.99,
    seatsAvailable: 120,
    totalSeats: 120,
    seatMap: createSeatMap(120),
    isActive: true,
    isFeatured: true,
    specialEvent: false,
    eventDetails: null
  },

  // Dune - Tomorrow
  {
    movie: '680d29841ad99532cd239be0', // Dune
    theater: '680d29841ad99532cd239ba4', // Landmark Theatres
    hall: 'Hall 4',
    date: tomorrow,
    startTime: createDateTime(tomorrow, '13:00'),
    endTime: createDateTime(tomorrow, '15:35'),
    format: 'IMAX',
    language: 'English',
    subtitles: 'None',
    price: 17.99,
    seatsAvailable: 80,
    totalSeats: 80,
    seatMap: createSeatMap(80),
    isActive: true,
    isFeatured: true,
    specialEvent: true,
    eventDetails: 'Premiere Screening: Be among the first to watch this epic sci-fi adventure! Includes Exclusive Poster and Commemorative Ticket.'
  },
  {
    movie: '680d29841ad99532cd239be0', // Dune
    theater: '680d29841ad99532cd239ba4', // Landmark Theatres
    hall: 'Hall 4',
    date: tomorrow,
    startTime: createDateTime(tomorrow, '17:00'),
    endTime: createDateTime(tomorrow, '19:35'),
    format: 'IMAX',
    language: 'English',
    subtitles: 'None',
    price: 17.99,
    seatsAvailable: 80,
    totalSeats: 80,
    seatMap: createSeatMap(80),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239be0', // Dune
    theater: '680d29841ad99532cd239ba4', // Landmark Theatres
    hall: 'Hall 4',
    date: tomorrow,
    startTime: createDateTime(tomorrow, '21:00'),
    endTime: createDateTime(tomorrow, '23:35'),
    format: 'IMAX',
    language: 'English',
    subtitles: 'None',
    price: 17.99,
    seatsAvailable: 80,
    totalSeats: 80,
    seatMap: createSeatMap(80),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },

  // Pulp Fiction - Day After Tomorrow
  {
    movie: '680d29841ad99532cd239bce', // Pulp Fiction
    theater: '680d29841ad99532cd239ba6', // Alamo Drafthouse Cinema
    hall: 'Hall 5',
    date: dayAfterTomorrow,
    startTime: createDateTime(dayAfterTomorrow, '14:30'),
    endTime: createDateTime(dayAfterTomorrow, '17:04'),
    format: '2D',
    language: 'English',
    subtitles: 'None',
    price: 15.99,
    seatsAvailable: 90,
    totalSeats: 90,
    seatMap: createSeatMap(90),
    isActive: true,
    isFeatured: false,
    specialEvent: true,
    eventDetails: 'Tarantino Retrospective: Part of our Quentin Tarantino film series. Includes Themed Cocktail and Film Discussion After Screening.'
  },
  {
    movie: '680d29841ad99532cd239bce', // Pulp Fiction
    theater: '680d29841ad99532cd239ba6', // Alamo Drafthouse Cinema
    hall: 'Hall 5',
    date: dayAfterTomorrow,
    startTime: createDateTime(dayAfterTomorrow, '19:00'),
    endTime: createDateTime(dayAfterTomorrow, '21:34'),
    format: '2D',
    language: 'English',
    subtitles: 'None',
    price: 15.99,
    seatsAvailable: 90,
    totalSeats: 90,
    seatMap: createSeatMap(90),
    isActive: true,
    isFeatured: true,
    specialEvent: false,
    eventDetails: null
  },

  // Interstellar - Day After Tomorrow
  {
    movie: '680d29841ad99532cd239bda', // Interstellar
    theater: '680d29841ad99532cd239ba5', // AMC Southcenter 16
    hall: 'Hall 6',
    date: dayAfterTomorrow,
    startTime: createDateTime(dayAfterTomorrow, '13:00'),
    endTime: createDateTime(dayAfterTomorrow, '15:49'),
    format: 'IMAX',
    language: 'English',
    subtitles: 'None',
    price: 18.99,
    seatsAvailable: 200,
    totalSeats: 200,
    seatMap: createSeatMap(200),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239bda', // Interstellar
    theater: '680d29841ad99532cd239ba5', // AMC Southcenter 16
    hall: 'Hall 6',
    date: dayAfterTomorrow,
    startTime: createDateTime(dayAfterTomorrow, '17:00'),
    endTime: createDateTime(dayAfterTomorrow, '19:49'),
    format: 'IMAX',
    language: 'English',
    subtitles: 'None',
    price: 18.99,
    seatsAvailable: 200,
    totalSeats: 200,
    seatMap: createSeatMap(200),
    isActive: true,
    isFeatured: true,
    specialEvent: false,
    eventDetails: null
  },
  {
    movie: '680d29841ad99532cd239bda', // Interstellar
    theater: '680d29841ad99532cd239ba5', // AMC Southcenter 16
    hall: 'Hall 6',
    date: dayAfterTomorrow,
    startTime: createDateTime(dayAfterTomorrow, '21:00'),
    endTime: createDateTime(dayAfterTomorrow, '23:49'),
    format: 'IMAX',
    language: 'English',
    subtitles: 'None',
    price: 20.99,
    seatsAvailable: 200,
    totalSeats: 200,
    seatMap: createSeatMap(200),
    isActive: true,
    isFeatured: false,
    specialEvent: false,
    eventDetails: null
  }
];

module.exports = showtimes;
