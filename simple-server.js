const express = require('express');
const cors = require('cors');
const path = require('path');

// Sample data
const sampleMovies = [
  {
    _id: '1',
    title: 'Inception',
    director: 'Christopher Nolan',
    releaseDate: '2025-05-16',
    duration: 148,
    rating: 'PG-13',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
    poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    status: 'Now Playing',
    featured: true,
    showTimes: [
      { time: '10:00', theater: 'Theater 1', date: '2025-05-15' },
      { time: '13:30', theater: 'Theater 1', date: '2025-05-15' },
      { time: '17:00', theater: 'Theater 1', date: '2025-05-15' },
      { time: '20:30', theater: 'Theater 1', date: '2025-05-15' },
      { time: '10:00', theater: 'Theater 1', date: '2025-05-16' },
      { time: '13:30', theater: 'Theater 1', date: '2025-05-16' },
      { time: '17:00', theater: 'Theater 1', date: '2025-05-16' },
      { time: '20:30', theater: 'Theater 1', date: '2025-05-16' }
    ]
  },
  {
    _id: '2',
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    releaseDate: '2025-05-20',
    duration: 142,
    rating: 'R',
    genres: ['Drama'],
    synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton', 'William Sadler'],
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop',
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    status: 'Now Playing',
    featured: true,
    showTimes: [
      { time: '11:00', theater: 'Theater 2', date: '2025-05-15' },
      { time: '14:30', theater: 'Theater 2', date: '2025-05-15' },
      { time: '18:00', theater: 'Theater 2', date: '2025-05-15' },
      { time: '21:30', theater: 'Theater 2', date: '2025-05-15' },
      { time: '11:00', theater: 'Theater 2', date: '2025-05-16' },
      { time: '14:30', theater: 'Theater 2', date: '2025-05-16' },
      { time: '18:00', theater: 'Theater 2', date: '2025-05-16' },
      { time: '21:30', theater: 'Theater 2', date: '2025-05-16' }
    ]
  },
  {
    _id: '3',
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    releaseDate: '2025-05-25',
    duration: 152,
    rating: 'PG-13',
    genres: ['Action', 'Crime', 'Drama'],
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    poster: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1000&auto=format&fit=crop',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    status: 'Now Playing',
    featured: false,
    showTimes: [
      { time: '10:30', theater: 'Theater 3', date: '2025-05-15' },
      { time: '14:00', theater: 'Theater 3', date: '2025-05-15' },
      { time: '17:30', theater: 'Theater 3', date: '2025-05-15' },
      { time: '21:00', theater: 'Theater 3', date: '2025-05-15' },
      { time: '10:30', theater: 'Theater 3', date: '2025-05-16' },
      { time: '14:00', theater: 'Theater 3', date: '2025-05-16' },
      { time: '17:30', theater: 'Theater 3', date: '2025-05-16' },
      { time: '21:00', theater: 'Theater 3', date: '2025-05-16' }
    ]
  },
  {
    _id: '4',
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    releaseDate: '2025-06-01',
    duration: 154,
    rating: 'R',
    genres: ['Crime', 'Drama'],
    synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson', 'Bruce Willis'],
    poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop',
    trailer: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    status: 'Coming Soon',
    featured: true,
    showTimes: []
  }
];

const sampleEvents = [
  {
    _id: '1',
    title: 'Exclusive Premiere: "The Last Horizon"',
    description: 'Join us for the exclusive premiere of "The Last Horizon," the highly anticipated sci-fi thriller directed by Christopher Nolan. The event will include a red carpet arrival, the film screening, and a Q&A session with the director and cast members.',
    startDate: '2025-05-25T19:00:00Z',
    endDate: '2025-05-25T23:00:00Z',
    location: 'Grand Cinema, 123 Main Street',
    category: 'Premiere',
    ticketPrice: 50,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000&auto=format&fit=crop',
    featured: true,
    capacity: 300,
    registeredAttendees: 275
  },
  {
    _id: '2',
    title: 'Film Workshop: Cinematography Basics',
    description: 'Learn the fundamentals of cinematography in this hands-on workshop led by award-winning cinematographer Michael Chen. Topics covered include camera movement, lighting techniques, composition, and visual storytelling. Suitable for beginners and intermediate filmmakers.',
    startDate: '2025-05-10T14:00:00Z',
    endDate: '2025-05-10T17:00:00Z',
    location: 'Film Academy, 456 Oak Avenue',
    category: 'Workshop',
    ticketPrice: 25,
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1000&auto=format&fit=crop',
    featured: false,
    capacity: 50,
    registeredAttendees: 42
  }
];

const sampleNews = [
  {
    _id: '1',
    title: 'New Marvel Movie Announced for 2024',
    content: 'Marvel Studios has announced a new superhero movie set to release in 2024. The film will introduce a new character to the Marvel Cinematic Universe. Kevin Feige, president of Marvel Studios, expressed excitement about the project during a press conference. "This character has been a fan favorite in the comics for decades, and we\'re thrilled to finally bring them to the big screen," he said. Production is expected to begin early next year with a tentative release date set for summer 2024. Casting announcements are expected in the coming months.',
    summary: 'Marvel Studios announces a new superhero film set to release in summer 2024.',
    category: 'Movie News',
    author: 'John Smith',
    publishedAt: '2023-09-15T10:30:00Z',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1000&auto=format&fit=crop'
  },
  {
    _id: '2',
    title: 'Classic Film Festival Returns This Fall',
    content: 'The International Classic Film Festival is returning this fall with a lineup of restored classics and rare screenings. The festival, now in its 15th year, will feature over 50 films spanning the golden age of cinema. Highlights include newly restored versions of Casablanca, Citizen Kane, and several films by Alfred Hitchcock. Special guests will include renowned film historians and relatives of classic Hollywood stars who will participate in Q&A sessions after select screenings. The festival will run from October 10-17 at various theaters throughout the city. Early bird tickets go on sale next week.',
    summary: 'The 15th annual International Classic Film Festival announces its return with over 50 restored classics.',
    category: 'Festivals',
    author: 'Emma Johnson',
    publishedAt: '2023-08-28T14:15:00Z',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop'
  }
];

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes for Movies
app.get('/api/movies', (req, res) => {
  res.json(sampleMovies);
});

app.get('/api/movies/featured', (req, res) => {
  const featuredMovies = sampleMovies.filter(m => m.featured);
  res.json(featuredMovies);
});

app.get('/api/movies/status/:status', (req, res) => {
  const filteredMovies = sampleMovies.filter(m => m.status === req.params.status);
  res.json(filteredMovies);
});

app.get('/api/movies/:id', (req, res) => {
  const movie = sampleMovies.find(m => m._id === req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

// API Routes for Events
app.get('/api/events', (req, res) => {
  res.json(sampleEvents);
});

app.get('/api/events/featured', (req, res) => {
  const featuredEvents = sampleEvents.filter(e => e.featured);
  res.json(featuredEvents);
});

app.get('/api/events/upcoming', (req, res) => {
  const now = new Date();
  const upcomingEvents = sampleEvents.filter(e => new Date(e.startDate) > now);
  res.json(upcomingEvents);
});

app.get('/api/events/:id', (req, res) => {
  const event = sampleEvents.find(e => e._id === req.params.id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// API Routes for News
app.get('/api/news', (req, res) => {
  res.json(sampleNews);
});

app.get('/api/news/:id', (req, res) => {
  const news = sampleNews.find(n => n._id === req.params.id);
  if (news) {
    res.json(news);
  } else {
    res.status(404).json({ message: 'News not found' });
  }
});

// Basic route for testing API
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Movie Booking API' });
});

// Set port and start server
const PORT = 5004; // Use a different port
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});
