# Movie Ticket Booking API - Postman Collection

This folder contains a Postman collection and environment for testing the Movie Ticket Booking API.

## Contents

- `Movie_Ticket_Booking_API.postman_collection.json`: The Postman collection file containing all API requests
- `Movie_Ticket_Booking_API.postman_environment.json`: The Postman environment file with variables for the collection

## Getting Started

### Prerequisites

- [Postman](https://www.postman.com/downloads/) installed on your machine

### Installation

1. Import the collection file (`Movie_Ticket_Booking_API.postman_collection.json`) into Postman:
   - Open Postman
   - Click on "Import" button
   - Select the collection file

2. Import the environment file (`Movie_Ticket_Booking_API.postman_environment.json`) into Postman:
   - Click on "Import" button again
   - Select the environment file

3. Select the "Movie Ticket Booking API Environment" from the environment dropdown in the top right corner of Postman

## Usage

### Authentication

To use endpoints that require authentication:

1. First, use the "Login User" request in the "Users" folder with valid credentials
2. The response will contain a token
3. Copy this token and set it as the value for the `userToken` environment variable

For admin endpoints:

1. Login with an admin account
2. Copy the token and set it as the value for the `adminToken` environment variable

### Testing Endpoints

The collection is organized into folders based on resource types:

- Health Check
- Movies
- Events
- News
- Users
- Theaters
- Showtimes
- Bookings
- Genres
- Payments
- Search

Each folder contains requests for different operations on that resource.

### Environment Variables

The following environment variables are used in the collection:

- `baseUrl`: The base URL of the API (default: https://movie-ticket-booking-api.vercel.app)
- `userToken`: JWT token for authenticated user requests
- `adminToken`: JWT token for admin requests
- `movieId`: ID of a movie for testing movie-related endpoints
- `eventId`: ID of an event for testing event-related endpoints
- `newsId`: ID of a news article for testing news-related endpoints
- `theaterId`: ID of a theater for testing theater-related endpoints
- `showtimeId`: ID of a showtime for testing showtime-related endpoints
- `bookingId`: ID of a booking for testing booking-related endpoints
- `paymentId`: ID of a payment for testing payment-related endpoints

## Testing Workflow

A typical testing workflow might look like:

1. Check API health using the "API Health Check" request
2. Register a new user or login with existing credentials
3. Browse movies, events, or news
4. Create a booking for a movie
5. Process payment for the booking
6. View and manage bookings
7. Test search functionality

## Troubleshooting

If you encounter any issues:

1. Ensure you're using the correct environment
2. Check that your authentication tokens are valid
3. Verify that the IDs you're using in requests exist in the database
4. Check the API server status using the health check endpoint

## Additional Notes

- Some endpoints require admin privileges. Make sure you're using an admin account for these requests.
- The collection includes examples of request bodies for POST and PUT requests.
- You can use the "Tests" tab in Postman to add test scripts that validate responses.
