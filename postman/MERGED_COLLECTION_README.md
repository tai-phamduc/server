# Merged Postman Collection

## Overview

This directory contains a merged Postman collection file that combines all the individual API collections into a single comprehensive collection. This makes it easier to import and use all the API endpoints in Postman.

## File

- **Movie_Booking_Complete_API_Collection.json**: Contains all API endpoints organized by domain (movies, users, bookings, etc.)

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
   - Authentication endpoints are included in each domain where applicable

## Structure

The merged collection maintains the original structure of each individual collection but organizes them into top-level folders by domain:

- Actors
- Bookings
- Cinemas
- Directors
- Events
- Genres
- Movies
- News
- Orders
- Payments
- Products
- Reviews
- Rooms
- Screenings
- Seats
- Showtimes
- Theaters
- Users

## Regenerating the Merged Collection

If you need to update the merged collection after making changes to individual collections, you can run the merge script:

```bash
node scripts/merge_postman_collections.js
```

This will regenerate the `Movie_Booking_Complete_API_Collection.json` file with the latest changes from all individual collections.

## Notes

- The merged collection preserves all request details, including headers, parameters, and example responses
- Authentication tokens and environment variables work the same way as in the individual collections
- This merged collection is intended to simplify testing and development by providing a single entry point for all API endpoints
