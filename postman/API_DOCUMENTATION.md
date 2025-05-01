# Movie Booking API Documentation

## Overview

This document provides comprehensive documentation for the Movie Booking API. The API is deployed at:

```
https://movie-ticket-booking-api.vercel.app
```

## Authentication

Most endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.

### Login

```
POST /api/users/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## Postman Collections

We've created comprehensive Postman collections to help you test and explore the API. These collections cover all the endpoints available in the API.

### How to Use the Collections

1. Import the collections into Postman
2. Import the environment file (`Movie_Booking_API_Environment.json`)
3. Set the environment variables:
   - `baseUrl`: Already set to `https://movie-ticket-booking-api.vercel.app`
   - `userToken`: Set this after logging in with a regular user
   - `adminToken`: Set this after logging in with an admin user

### Available Collections

1. **User API Collection**
   - Authentication endpoints
   - User profile management
   - User preferences
   - User activity tracking
   - User management (admin)
   - User statistics

2. **Movie API Collection**
   - Movie operations
   - Movie ratings
   - Movie recommendations
   - Movie favorites and watchlist
   - Movie statistics

3. **Cinema API Collection**
   - Cinema operations
   - Cinema room management
   - Cinema screening management
   - Cinema schedule management
   - Cinema statistics

4. **Seat API Collection**
   - Seat operations
   - Seat layout operations
   - Seat reservation operations
   - Seat type management
   - Seat statistics

5. **Booking API Collection**
   - Booking operations
   - Refund operations
   - Booking statistics

6. **Payment API Collection**
   - Payment operations
   - Payment method management
   - Refund operations
   - Payment statistics

7. **Review API Collection**
   - Review operations
   - Review comment management
   - Review statistics

8. **Genre API Collection**
   - Genre operations
   - Genre-movie associations
   - Genre statistics

9. **Showtime API Collection**
   - Showtime operations
   - Showtime schedule management
   - Showtime statistics

10. **Theater API Collection**
    - Theater operations
    - Theater room management
    - Theater statistics

11. **Room API Collection**
    - Room operations
    - Room seat management
    - Room statistics

12. **Product API Collection**
    - Product operations
    - Product category management
    - Product combo management
    - Product statistics

13. **Order API Collection**
    - Order operations
    - Order item management
    - Order statistics

14. **Actor API Collection**
    - Actor operations
    - Actor-movie associations
    - Actor award management
    - Actor statistics

15. **Director API Collection**
    - Director operations
    - Director-movie associations
    - Director award management
    - Director filmography management
    - Director statistics

16. **Event API Collection**
    - Event operations
    - Event registration management
    - Event category management
    - Event statistics

17. **News API Collection**
    - News operations
    - News comment management
    - News category management
    - News statistics

## Testing the API

### Prerequisites

- Postman application installed
- Basic understanding of REST APIs
- Authentication credentials (email and password)

### Steps to Test

1. **Set Up Environment**
   - Import the environment file
   - Set the required variables

2. **Authentication**
   - Use the login endpoint to get a token
   - Set the token in the environment variables

3. **Test Endpoints**
   - Use the collections to test various endpoints
   - Check the response status and data

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Best Practices

1. Always include authentication tokens for protected endpoints
2. Use appropriate HTTP methods (GET, POST, PUT, DELETE)
3. Include proper headers (Content-Type: application/json)
4. Handle errors gracefully in your application

## Support

For any issues or questions, please contact the API support team.

---

This documentation is maintained by the Movie Booking API team and is updated regularly to reflect changes in the API.
