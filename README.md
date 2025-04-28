# Movie Booking Website

A full-stack movie booking website similar to Aovis, built with React, Node.js, and Express.

## Features

- Movie listings with details
- Movie filtering by category and status
- Movie trailers
- Event listings
- News/blog section
- User authentication
- Ticket booking system

## Tech Stack

### Frontend
- React (Vite)
- React Router for navigation
- Axios for API requests
- React Icons for icons
- Tailwind CSS for styling
- Swiper for carousels/sliders
- React Query for data fetching

### Backend
- Node.js
- Express.js for the server
- MongoDB with Mongoose for database
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

## Project Structure

```
group-project-react/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   │   ├── images/         # Image assets
│   │   ├── index.html      # HTML template
│   │   └── favicon.ico     # Favicon
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── assets/         # Assets (CSS, images)
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main App component
│   │   ├── index.js        # Entry point
│   │   └── routes.js       # Route definitions
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/                 # Backend Node.js/Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
├── .gitignore              # Git ignore file
├── package.json            # Root package.json for scripts
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd group-project-react
   ```

2. Install dependencies
   ```
   npm run install-all
   ```
   This will install dependencies for the root project, client, and server.

3. Set up environment variables
   - Create a `.env` file in the server directory based on `.env.example`

4. Start the development server
   ```
   npm run dev
   ```
   This will start both the frontend and backend servers concurrently.

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/status/:status` - Get movies by status (Now Playing, Coming Soon, Featured)
- `GET /api/movies/genre/:genre` - Get movies by genre

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/featured/list` - Get featured events

### News
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get news article by ID
- `GET /api/news/category/:category` - Get news articles by category

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

## License

This project is licensed under the MIT License.
# College-ReactJS-Project
