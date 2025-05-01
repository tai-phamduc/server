# Movie Ticket Booking API - Postman Collections

This directory contains Postman collections for testing the Movie Ticket Booking API.

## Directory Structure

- **movies/** - Collections for movie-related API endpoints
- **users/** - Collections for user-related API endpoints
- **cinemas/** - Collections for cinema-related API endpoints
- **screenings/** - Collections for screening-related API endpoints
- **seats/** - Collections for seat-related API endpoints
- **instructions/** - HTML instructions for importing and using the collections
- **utils/** - Utility scripts for the collections

## Collections Overview

### Movies
- Test endpoints for creating, reading, updating, and deleting movies
- Test endpoints for filtering movies by various criteria

### Users
- Test endpoints for user registration, authentication, and profile management
- Test endpoints for user roles and permissions

### Cinemas
- Test endpoints for cinema management
- Test endpoints for finding cinemas by movie and date

### Screenings
- Test endpoints for managing movie screenings
- Test endpoints for finding screenings by movie, cinema, and date

### Seats
- Test endpoints for managing seats
- Test endpoints for checking seat availability

## Environment Variables

The collections use the following common environment variables:

- `baseUrl`: The base URL of the API (default: https://movie-ticket-booking-api.vercel.app)
- `userToken`: JWT token for authenticated user requests
- `adminToken`: JWT token for admin requests

Each collection may have additional specific variables. Check the respective README files for details.

## Authentication

To use authenticated endpoints:

1. Run the "Login" request in the User API collection
2. The response will contain a JWT token
3. Copy the token value
4. Set the environment variable:
   - For regular user: Set `userToken` to the copied token
   - For admin user: Set `adminToken` to the copied token (use admin credentials)

## How to Use

1. Import the desired collection and environment files into Postman
2. Set up the environment variables
3. Run the collection or individual requests

For detailed instructions, see the HTML files in the `instructions/` directory.
