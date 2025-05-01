# Movie Ticket Booking API - Postman Collections Guide

This guide provides instructions for importing and using the Postman collections for testing the Movie Ticket Booking API.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Importing Collections](#importing-collections)
  - [Setting Up Environments](#setting-up-environments)
- [Authentication](#authentication)
  - [User Authentication](#user-authentication)
  - [Admin Authentication](#admin-authentication)
- [Working with Movies](#working-with-movies)
  - [Getting Movie Data](#getting-movie-data)
  - [Creating and Updating Movies](#creating-and-updating-movies)
- [Working with Users](#working-with-users)
  - [User Registration and Login](#user-registration-and-login)
  - [User Profile Management](#user-profile-management)
- [Working with Cinemas](#working-with-cinemas)
  - [Getting Cinema Data](#getting-cinema-data)
  - [Managing Cinemas and Rooms](#managing-cinemas-and-rooms)
  - [Finding Cinemas by Movie and Date](#finding-cinemas-by-movie-and-date)
- [Working with Screenings](#working-with-screenings)
  - [Setting Up Date Variables](#setting-up-date-variables)
  - [Finding Screenings](#finding-screenings)
  - [Managing Screenings](#managing-screenings)
- [Working with Seats](#working-with-seats)
  - [Getting Available Seats](#getting-available-seats)
  - [Reserving and Releasing Seats](#reserving-and-releasing-seats)
- [Utility Scripts](#utility-scripts)
  - [Date Variables Script](#date-variables-script)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.

### Importing Collections

Each API domain has its own collection and environment files:

#### Movies API
1. Import `movies/Movie_API_Collection.json`
2. Import `movies/Movie_API_Environment.json`

#### Users API
1. Import `users/User_API_Collection.json`
2. Import `users/User_API_Environment.json`

#### Cinemas API
1. Import `cinemas/Cinema_API_Collection.json`
2. Import `cinemas/Cinema_API_Environment.json`

#### Screenings API
1. Import `screenings/Screening_API_Collection.json`
2. Import `screenings/Screening_API_Environment.json`

#### Seats API
1. Import `seats/Seats_API_Collection.json`
2. Import `seats/Seats_API_Environment.json`

To import a collection:
1. Open Postman
2. Click the "Import" button in the top left corner
3. Select the "Files" tab
4. Click "Upload Files" and select the collection JSON file
5. Click "Import"

### Setting Up Environments

After importing the environment files:
1. In the top right corner of Postman, click the environment dropdown
2. Select the appropriate environment (e.g., "Movie API Environment")

## Authentication

### User Authentication

1. Expand the "Authentication" folder in the User API collection
2. Click on the "Login" request
3. Modify the email and password in the request body if needed:
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
4. Click "Send" to execute the request
5. From the response, copy the token value
6. Click the "Environment quick look" button (eye icon) in the top right
7. Set the `userToken` environment variable to the copied token

### Admin Authentication

1. Expand the "Authentication" folder
2. Click on the "Login Admin" request
3. Modify the email and password in the request body if needed:
   ```json
   {
     "email": "admin@example.com",
     "password": "password123"
   }
   ```
4. Click "Send" to execute the request
5. From the response, copy the token value
6. Set the `adminToken` environment variable to the copied token

## Working with Movies

### Getting Movie Data

1. Expand the "Movies" folder in the Movie API collection
2. Click on "Get All Movies" or "Get Now Playing Movies"
3. Click "Send" to execute the request
4. From the response, copy a movie ID
5. Set the `movieId` environment variable to the copied ID

### Creating and Updating Movies

1. Authenticate as an admin (see [Admin Authentication](#admin-authentication))
2. Expand the "Movies" folder
3. Click on "Create Movie (Admin)"
4. Modify the request body as needed
5. Click "Send" to execute the request

## Working with Users

### User Registration and Login

1. Expand the "Authentication" folder in the User API collection
2. To register a new user, click on "Register User"
3. Modify the request body as needed:
   ```json
   {
     "name": "Test User",
     "email": "testuser@example.com",
     "password": "password123"
   }
   ```
4. Click "Send" to execute the request
5. To login, follow the steps in [User Authentication](#user-authentication)

### User Profile Management

1. Authenticate as a user (see [User Authentication](#user-authentication))
2. Expand the "Profile" folder
3. Click on "Get User Profile"
4. Click "Send" to execute the request
5. To update the profile, click on "Update User Profile"
6. Modify the request body as needed
7. Click "Send" to execute the request

## Working with Cinemas

### Getting Cinema Data

1. Expand the "Cinemas" folder in the Cinema API collection
2. Click on "Get All Cinemas"
3. Click "Send" to execute the request
4. From the response, copy a cinema ID
5. Set the `cinemaId` environment variable to the copied ID

### Managing Cinemas and Rooms

1. Authenticate as an admin (see [Admin Authentication](#admin-authentication))
2. Expand the "Cinemas" folder
3. To create a new cinema, click on "Create Cinema (Admin)"
4. Modify the request body as needed
5. Click "Send" to execute the request
6. To add a room to a cinema, click on "Add Room to Cinema (Admin)"
7. Modify the request body as needed
8. Click "Send" to execute the request

### Finding Cinemas by Movie and Date

1. Set the `movieId` environment variable (see [Getting Movie Data](#getting-movie-data))
2. Set the `date` environment variable to a date in YYYY-MM-DD format (e.g., "2023-12-01")
3. Expand the "Cinemas" folder
4. Click on "Get Cinemas by Movie and Date"
5. Click "Send" to execute the request

## Working with Screenings

### Setting Up Date Variables

You can set up date variables manually or using a script:

#### Manual Setup
1. Click the "Environment quick look" button (eye icon) in the top right
2. Set the `date` variable to today's date in YYYY-MM-DD format (e.g., "2023-12-01")
3. Set the `displayDate` variable to a human-readable date (e.g., "December 1, 2023")
4. Click outside the environment panel to close it

#### Using the Script
1. Click on the collection name "Screening API Collection" in the sidebar
2. Click on the "Pre-request Scripts" tab
3. Copy and paste the script from `utils/set_screening_date_variables.js`
4. Click "Save"
5. Run any request in the collection to trigger the script

### Finding Screenings

1. Set up the required variables:
   - `movieId` (see [Getting Movie Data](#getting-movie-data))
   - `cinemaId` (see [Getting Cinema Data](#getting-cinema-data))
   - `date` (see [Setting Up Date Variables](#setting-up-date-variables))
2. Expand the "Screenings" folder
3. Click on "Get Screenings by Movie, Cinema and Date"
4. Click "Send" to execute the request
5. From the response, copy a screening ID
6. Set the `screeningId` environment variable to the copied ID

### Managing Screenings

1. Authenticate as an admin (see [Admin Authentication](#admin-authentication))
2. Expand the "Screenings" folder
3. To create a new screening, click on "Create Screening (Admin)"
4. Modify the request body as needed
5. Click "Send" to execute the request

## Working with Seats

### Getting Available Seats

1. Set the `screeningId` environment variable (see [Finding Screenings](#finding-screenings))
2. Expand the "Seats" folder
3. Click on "Get Available Seats for Screening"
4. Click "Send" to execute the request

### Reserving and Releasing Seats

1. Set the `screeningId` environment variable (see [Finding Screenings](#finding-screenings))
2. Expand the "Seats" folder
3. Click on "Reserve Seats"
4. Modify the request body to include the seats you want to reserve:
   ```json
   {
     "seats": ["A1", "A2"]
   }
   ```
5. Click "Send" to execute the request
6. To release seats, click on "Release Seats"
7. Modify the request body to include the seats you want to release
8. Click "Send" to execute the request

## Utility Scripts

### Date Variables Script

The `utils/set_screening_date_variables.js` script helps set up date-related environment variables:

```javascript
// Get today's date in YYYY-MM-DD format
const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];

// Format display date (e.g., "December 25, 2023")
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const displayDate = today.toLocaleDateString('en-US', options);

// Get day of week
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayOfWeek = daysOfWeek[today.getDay()];

// Set environment variables
pm.environment.set('date', todayFormatted);
pm.environment.set('displayDate', displayDate);
pm.environment.set('dayOfWeek', dayOfWeek);
```

To use this script:
1. Copy it to the Pre-request Scripts tab of your collection
2. Run any request to trigger the script

## Troubleshooting

If you're experiencing issues with the API requests:

1. **Authentication Issues**
   - Make sure your token is valid and not expired
   - Check that you're using the correct token (user vs admin)

2. **No Results Found**
   - Try a different movie ID (some movies might not have any screenings)
   - Try a different date (the movie might not be showing on the selected date)
   - Check that the date format is correct (YYYY-MM-DD)

3. **API Connection Issues**
   - Verify that the API base URL is correct (default: https://movie-ticket-booking-api.vercel.app)
   - Check your internet connection

4. **Request Body Issues**
   - Ensure your JSON is valid
   - Check that all required fields are included
   - Verify that the data types are correct (strings, numbers, arrays, etc.)
