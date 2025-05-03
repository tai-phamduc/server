# Movie Booking API Collection

## Overview

This directory contains a simplified Postman collection file that includes only the essential business-related API endpoints for the Movie Booking System. This makes it easier to import and use the most important API endpoints in Postman.

## File

- **Movie_Booking_Complete_API_Collection.json**: Contains essential API endpoints organized by domain (movies, users, bookings, etc.)

## How to Use

1. **Import into Postman**:
   - Open Postman
   - Click on "Import" button in the top left
   - Select the `Movie_Booking_Complete_API_Collection.json` file
   - Click "Import"

2. **Set Up Environment**:
   - Import the `Movie_Booking_API_Environment.json` file as well
   - Select the environment from the dropdown in the top right corner

3. **Using the Collection**:
   - All endpoints are organized into folders by domain (Movies, Users, Bookings, etc.)
   - Each domain contains its relevant API endpoints

## Structure

The collection is organized into top-level folders by domain:

- Authentication
- Users
- Movies
- Cinemas
- Screenings
- Bookings
- Seats
- Genres
- Reviews
- Events
- News

## Notes

- This collection focuses only on the most important business-related API endpoints
- Authentication tokens and environment variables work as expected
- This collection is intended to simplify testing and development by providing a clean, focused set of API endpoints
