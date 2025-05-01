# Movie Booking API Postman Collections

This directory contains Postman collections for testing the Movie Booking API.

## Overview

The Movie Booking API is a comprehensive RESTful API for a movie ticket booking system. It provides endpoints for managing movies, cinemas, screenings, bookings, payments, and more.

## Getting Started

### Prerequisites

- [Postman](https://www.postman.com/downloads/) installed on your machine
- Access to the Movie Booking API (deployed at https://movie-ticket-booking-api.vercel.app)

### Installation

1. Clone this repository
2. Import the collections into Postman:
   - Open Postman
   - Click on "Import" in the top left corner
   - Select "Folder" and navigate to the `postman` directory
   - Select all the collections you want to import

3. Import the environment file:
   - In Postman, click on "Import"
   - Select the `Movie_Booking_API_Environment.json` file
   - Once imported, select the "Movie Booking API Environment" from the environment dropdown in the top right corner

### Authentication

Most endpoints require authentication. To authenticate:

1. Use the "Login" request in the "Authentication" folder of any collection
2. Enter your credentials (email and password)
3. The response will contain a token
4. Copy the token and set it in the environment variables:
   - For regular users, set the `userToken` variable
   - For admin users, set the `adminToken` variable

## Collections

The following collections are available:

1. **User API Collection** (`users/User_API_Collection.json`)
   - Authentication endpoints
   - User profile management
   - User preferences
   - User activity tracking
   - User management (admin)
   - User statistics

2. **Movie API Collection** (`movies/Movie_API_Collection.json`)
   - Movie operations
   - Movie ratings
   - Movie recommendations
   - Movie favorites and watchlist
   - Movie statistics

3. **Cinema API Collection** (`cinemas/Cinema_API_Collection.json`)
   - Cinema operations
   - Cinema room management
   - Cinema screening management
   - Cinema schedule management
   - Cinema statistics

4. **Seat API Collection** (`seats/Seat_API_Collection.json`)
   - Seat operations
   - Seat layout operations
   - Seat reservation operations
   - Seat type management
   - Seat statistics

5. **Booking API Collection** (`bookings/Booking_API_Collection.json`)
   - Booking operations
   - Refund operations
   - Booking statistics

6. **Payment API Collection** (`payments/Payment_API_Collection.json`)
   - Payment operations
   - Payment method management
   - Refund operations
   - Payment statistics

7. **Review API Collection** (`reviews/Review_API_Collection.json`)
   - Review operations
   - Review comment management
   - Review statistics

8. **Genre API Collection** (`genres/Genre_API_Collection.json`)
   - Genre operations
   - Genre-movie associations
   - Genre statistics

9. **Showtime API Collection** (`showtimes/Showtime_API_Collection.json`)
   - Showtime operations
   - Showtime schedule management
   - Showtime statistics

10. **Theater API Collection** (`theaters/Theater_API_Collection.json`)
    - Theater operations
    - Theater room management
    - Theater statistics

11. **Room API Collection** (`rooms/Room_API_Collection.json`)
    - Room operations
    - Room seat management
    - Room statistics

12. **Product API Collection** (`products/Product_API_Collection.json`)
    - Product operations
    - Product category management
    - Product combo management
    - Product statistics

13. **Order API Collection** (`orders/Order_API_Collection.json`)
    - Order operations
    - Order item management
    - Order statistics

14. **Actor API Collection** (`actors/Actor_API_Collection.json`)
    - Actor operations
    - Actor-movie associations
    - Actor award management
    - Actor statistics

15. **Director API Collection** (`directors/Director_API_Collection.json`)
    - Director operations
    - Director-movie associations
    - Director award management
    - Director filmography management
    - Director statistics

16. **Event API Collection** (`events/Event_API_Collection.json`)
    - Event operations
    - Event registration management
    - Event category management
    - Event statistics

17. **News API Collection** (`news/News_API_Collection.json`)
    - News operations
    - News comment management
    - News category management
    - News statistics

## Environment Variables

The environment file (`Movie_Booking_API_Environment.json`) contains variables used across all collections. Here are the key variables:

- `baseUrl`: The base URL of the API (https://movie-ticket-booking-api.vercel.app)
- `userToken`: The authentication token for regular users
- `adminToken`: The authentication token for admin users
- Various ID variables (e.g., `movieId`, `cinemaId`, `roomId`, etc.) for testing specific endpoints

## Testing Workflow

1. **Authentication**:
   - Use the login endpoint to get a token
   - Set the token in the environment variables

2. **Basic Operations**:
   - Test GET endpoints to retrieve data
   - Test POST endpoints to create new resources
   - Test PUT endpoints to update existing resources
   - Test DELETE endpoints to remove resources

3. **Advanced Operations**:
   - Test complex workflows (e.g., booking a ticket, processing a payment)
   - Test statistics and reporting endpoints

## Best Practices

- Always set the authentication token before testing protected endpoints
- Use the pre-request scripts to set dynamic variables (e.g., current date)
- Use the tests scripts to validate responses
- Save responses for future reference

## Troubleshooting

If you encounter issues:

1. Check that you're using the correct environment
2. Verify that your authentication token is valid
3. Check the request parameters and body
4. Look for error messages in the response

## Contributing

If you find issues or want to improve the collections:

1. Make your changes
2. Test thoroughly
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
