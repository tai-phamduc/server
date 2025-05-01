# API Test Results

This document contains the results of testing the existing API endpoints for the Movie Ticket Booking API.

## Test Date: May 1, 2025

## Base URL
```
https://movie-ticket-booking-api.vercel.app
```

## Database Connection
```
mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/
```

## Test Results

### Movies API

| Endpoint | Method | Status | Response | Notes |
|----------|--------|--------|----------|-------|
| `/api/movies` | GET | ✅ Working | Returns a list of movies | Successfully returns movie data |
| `/api/movies/:id` | GET | ✅ Working | Returns movie details | Tested with ID: 680f66dbefdceecc9e34aab9 (Inception) |

### Users API

| Endpoint | Method | Status | Response | Notes |
|----------|--------|--------|----------|-------|
| `/api/users/profile` | GET | ✅ Working | Returns user profile | Requires authentication token |
| `/api/users/login` | POST | ✅ Working | Returns user data with token | Tested with admin@example.com/password123 |
| `/api/users/register` | POST | ❓ Not Tested | - | Need to test with new user data |

### Cinemas API

| Endpoint | Method | Status | Response | Notes |
|----------|--------|--------|----------|-------|
| `/api/cinemas` | GET | ✅ Working | Returns a list of cinemas | Successfully returns cinema data |
| `/api/cinemas/:id` | GET | ❌ Error | Server error | Returns "FUNCTION_INVOCATION_FAILED" with ID: 68121d9d5e6e61cab67ae98f |

### Screenings API

| Endpoint | Method | Status | Response | Notes |
|----------|--------|--------|----------|-------|
| `/api/screenings` | GET | ❌ Error | Server error | Returns "FUNCTION_INVOCATION_FAILED" |
| `/api/screenings/:id` | GET | ❓ Not Tested | - | No screenings found in database |
| `/api/screenings/:id/seats` | GET | ✅ Working | `{"message":"Screening not found"}` | Correctly handles invalid screening ID |

## Issues Identified

1. **Server Errors**: Several endpoints return server errors:
   - The `/api/screenings` endpoint returns "FUNCTION_INVOCATION_FAILED"
   - The `/api/cinemas/:id` endpoint returns "FUNCTION_INVOCATION_FAILED"

2. **Missing Data**: Some collections in the database are empty:
   - The screenings collection is empty, making it impossible to test screening-related endpoints
   - Other collections may also be empty or have incomplete data

3. **Authentication Working**: The authentication flow is working correctly:
   - Login endpoint returns a valid JWT token
   - Protected endpoints correctly validate the token

## Database Findings

After connecting to the MongoDB database, we found:

1. **Collections Present**: The database has all the necessary collections (actors, analytics, blogcategories, bookings, cinemas, comments, contacts, contents, countries, directors, events, faqs, feedbacks, genres, languages, movies, news, newsletters, notifications, pages, payments, products, reviews, screenings, settings, showtimes, tags, theaters, users)

2. **Sample Data**: There is sample data in some collections:
   - Movies collection has data for movies like Inception, The Dark Knight, etc.
   - Cinemas collection has a sample cinema
   - Users collection has an admin user (admin@example.com)

3. **Missing Data**: The screenings collection is empty, which explains why the screenings API is not working correctly

## Next Steps

1. **Fix Server Errors**: Investigate and fix the server errors in the screenings and cinema detail endpoints.

2. **Add Missing Data**: Add sample data to the empty collections, especially the screenings collection.

3. **Update Postman Collections**: Update the existing Postman collections with:
   - Valid IDs extracted from the database
   - Authentication token handling
   - Tests for all endpoints

4. **Create Missing Collections**: Create Postman collections for the models that don't have them yet (as listed in MISSING_COLLECTIONS.md).

5. **Complete Testing**: Test all endpoints in the existing and new Postman collections to ensure they work as expected.

## Conclusion

The API is partially working, with some endpoints functioning correctly and others returning errors. The main issues are server errors and missing data in some collections. These issues need to be addressed before proceeding with creating new Postman collections for the missing models.
