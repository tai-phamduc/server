# Movie Booking API

Backend API for the Movie Booking Website, built with Node.js, Express, and MongoDB. This API provides endpoints for managing movies, events, news, users, bookings, and more.

## Tech Stack

- Node.js
- Express.js for the server
- MongoDB with Mongoose for database
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Swagger for API documentation

## Project Structure

```
server/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── models/             # Database models
├── routes/             # API routes
├── middleware/         # Custom middleware
│   └── validation/     # Request validation
├── utils/              # Utility functions
├── docs/               # API documentation
├── tests/              # Test files
│   ├── integration/    # Integration tests
│   └── unit/           # Unit tests
├── logs/               # Log files
├── public/             # Static files
├── postman/            # Postman collection for API testing
├── server.js           # Express server
├── package.json        # Dependencies
└── README.md           # Documentation
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/status/:status` - Get movies by status (Now Playing, Coming Soon, Featured)
- `GET /api/movies/genre/:genre` - Get movies by genre
- `POST /api/movies` - Create a new movie (Admin)
- `PUT /api/movies/:id` - Update a movie (Admin)
- `DELETE /api/movies/:id` - Delete a movie (Admin)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/featured` - Get featured events
- `GET /api/events/upcoming` - Get upcoming events
- `POST /api/events` - Create a new event (Admin)
- `PUT /api/events/:id` - Update an event (Admin)
- `DELETE /api/events/:id` - Delete an event (Admin)

### News
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get news article by ID
- `GET /api/news/category/:category` - Get news articles by category
- `POST /api/news` - Create a news article (Admin)
- `PUT /api/news/:id` - Update a news article (Admin)
- `DELETE /api/news/:id` - Delete a news article (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/users/booking-history` - Get user booking history

### Showtimes
- `GET /api/showtimes` - Get all showtimes
- `GET /api/showtimes/movie/:movieId` - Get showtimes for a movie
- `GET /api/showtimes/:id/seats` - Get available seats for a showtime
- `POST /api/showtimes` - Create a new showtime (Admin)
- `PUT /api/showtimes/:id` - Update a showtime (Admin)
- `DELETE /api/showtimes/:id` - Delete a showtime (Admin)

### Theaters
- `GET /api/theaters` - Get all theaters
- `GET /api/theaters/:id` - Get theater by ID
- `POST /api/theaters` - Create a new theater (Admin)
- `PUT /api/theaters/:id` - Update a theater (Admin)
- `DELETE /api/theaters/:id` - Delete a theater (Admin)

### Payments
- `GET /api/payments` - Get user payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments/stripe/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/stripe/confirm` - Confirm Stripe payment
- `POST /api/payments/paypal/create-order` - Create PayPal order
- `POST /api/payments/paypal/capture-order` - Capture PayPal order
- `POST /api/payments/:id/refund` - Refund payment (Admin)
- `GET /api/payments/admin` - Get all payments (Admin)
- `GET /api/payments/stats` - Get payment statistics (Admin)

### Additional Endpoints
- `GET /api/genres` - Get all genres
- `GET /api/tags` - Get all tags
- `GET /api/faqs` - Get all FAQs
- `GET /api/settings` - Get application settings
- `GET /api/search` - Global search across collections

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/tai-phamduc/server.git
   cd server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file with the following variables:
     ```
     NODE_ENV=development
     PORT=5010
     MONGODB_URI=mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking?retryWrites=true&w=majority&appName=movie-booking
     JWT_SECRET=movie_booking_secret_key_2024
     JWT_EXPIRE=30d
     ```

4. Start the development server
   ```bash
   npm run dev
   ```
   The server will run at http://localhost:5010

## Deployment

The API is deployed on Vercel at https://movie-ticket-booking-api.vercel.app

### Deployment Steps

1. Set up Vercel CLI:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   vercel --prod
   ```

3. Configure environment variables in Vercel dashboard.

## Testing

To run tests:
```bash
npm test
```

To run specific test suites:
```bash
npm run test:unit
npm run test:integration
```

## Postman Collection

The repository includes a Postman collection for testing the API endpoints. The collection is located in the `postman` folder.

### Using the Postman Collection

1. Import the collection file (`postman/Movie_Ticket_Booking_API.postman_collection.json`) into Postman:
   - Open Postman
   - Click on "Import" button
   - Select the collection file

2. Import the environment file (`postman/Movie_Ticket_Booking_API.postman_environment.json`) into Postman:
   - Click on "Import" button again
   - Select the environment file

3. Select the "Movie Ticket Booking API Environment" from the environment dropdown in the top right corner of Postman

### Authentication in Postman

To use endpoints that require authentication:

1. First, use the "Login User" request in the "Users" folder with valid credentials
2. The response will contain a token
3. Copy this token and set it as the value for the `userToken` environment variable

For admin endpoints:

1. Login with an admin account
2. Copy the token and set it as the value for the `adminToken` environment variable

### Testing Workflow

A typical testing workflow might look like:

1. Check API health using the "API Health Check" request
2. Register a new user or login with existing credentials
3. Browse movies, events, or news
4. Create a booking for a movie
5. Process payment for the booking
6. View and manage bookings
7. Test search functionality

## Database

The application uses MongoDB Atlas as the database. The database contains the following collections:
- users
- movies
- events
- news
- theaters
- showtimes
- bookings
- genres
- tags
- reviews
- comments
- faqs
- settings
- payments

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses include a message field with details about the error.

## License

This project is licensed under the MIT License.
