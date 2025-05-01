# Testing Guide for Movie Booking API

This guide provides step-by-step instructions for testing the Movie Booking API using the Postman collections.

## Prerequisites

- [Postman](https://www.postman.com/downloads/) installed on your machine
- Access to the Movie Booking API (deployed at https://movie-ticket-booking-api.vercel.app)
- Basic understanding of REST APIs

## Setup

1. **Import Collections and Environment**
   - Import all collections from the `postman` directory
   - Import the environment file (`Movie_Booking_API_Environment.json`)
   - Select the "Movie Booking API Environment" from the environment dropdown

2. **Authentication**
   - Open any collection and navigate to the "Authentication" folder
   - Select the "Login" request
   - Use the following credentials:
     ```json
     {
       "email": "admin@example.com",
       "password": "password123"
     }
     ```
   - Send the request
   - Copy the token from the response
   - Click on the environment dropdown in the top right corner
   - Click on "Edit" next to "Movie Booking API Environment"
   - Set the `adminToken` variable to the copied token
   - Save the environment

## Testing Workflow

Follow this workflow to test the API comprehensively:

### 1. User Management

1. **Get All Users** (Admin only)
   - Collection: User API Collection
   - Request: Get All Users (Admin)
   - Expected: List of users

2. **Register a New User**
   - Collection: User API Collection
   - Request: Register User
   - Body:
     ```json
     {
       "firstName": "Test",
       "lastName": "User",
       "email": "testuser@example.com",
       "password": "password123",
       "confirmPassword": "password123",
       "phoneNumber": "+1234567890",
       "dateOfBirth": "1990-01-01"
     }
     ```
   - Expected: User created successfully

3. **Login as the New User**
   - Collection: User API Collection
   - Request: Login
   - Body:
     ```json
     {
       "email": "testuser@example.com",
       "password": "password123"
     }
     ```
   - Expected: Login successful, token received
   - Set the `userToken` environment variable to the received token

4. **Get User Profile**
   - Collection: User API Collection
   - Request: Get My Profile
   - Expected: User profile details

### 2. Movie Management

1. **Get All Movies**
   - Collection: Movie API Collection
   - Request: Get All Movies
   - Expected: List of movies

2. **Get Movie by ID**
   - Collection: Movie API Collection
   - Request: Get Movie by ID
   - Expected: Details of a specific movie
   - Note: The `movieId` environment variable should be set to a valid movie ID

3. **Create a New Movie** (Admin only)
   - Collection: Movie API Collection
   - Request: Create Movie (Admin)
   - Expected: Movie created successfully
   - Note: This will only work with the admin token

4. **Update a Movie** (Admin only)
   - Collection: Movie API Collection
   - Request: Update Movie (Admin)
   - Expected: Movie updated successfully

### 3. Cinema Management

1. **Get All Cinemas**
   - Collection: Cinema API Collection
   - Request: Get All Cinemas
   - Expected: List of cinemas

2. **Get Cinema by ID**
   - Collection: Cinema API Collection
   - Request: Get Cinema by ID
   - Expected: Details of a specific cinema
   - Note: The `cinemaId` environment variable should be set to a valid cinema ID

3. **Create a New Cinema** (Admin only)
   - Collection: Cinema API Collection
   - Request: Create Cinema (Admin)
   - Expected: Cinema created successfully

### 4. Booking Workflow

1. **Get Movies**
   - Collection: Movie API Collection
   - Request: Get Now Playing Movies
   - Expected: List of currently playing movies
   - Note: Select a movie and set its ID to the `movieId` environment variable

2. **Get Cinemas Showing the Movie**
   - Collection: Cinema API Collection
   - Request: Get Cinemas by Movie
   - Expected: List of cinemas showing the selected movie
   - Note: Select a cinema and set its ID to the `cinemaId` environment variable

3. **Get Screenings for the Movie at the Cinema**
   - Collection: Cinema API Collection
   - Request: Get Screenings by Movie
   - Expected: List of screenings for the selected movie at the selected cinema
   - Note: Select a screening and set its ID to the `screeningId` environment variable

4. **Get Available Seats for the Screening**
   - Collection: Seat API Collection
   - Request: Get Available Seats for Screening
   - Expected: List of available seats for the selected screening
   - Note: Select seats and set their IDs to the `seatId1` and `seatId2` environment variables

5. **Create a Booking**
   - Collection: Booking API Collection
   - Request: Create Booking
   - Body:
     ```json
     {
       "screeningId": "{{screeningId}}",
       "seats": ["{{seatId1}}", "{{seatId2}}"],
       "totalAmount": 25.00
     }
     ```
   - Expected: Booking created successfully
   - Note: Set the booking ID from the response to the `bookingId` environment variable

6. **Process Payment**
   - Collection: Payment API Collection
   - Request: Process Payment
   - Body:
     ```json
     {
       "bookingId": "{{bookingId}}",
       "paymentMethod": "credit_card",
       "amount": 25.00,
       "cardDetails": {
         "cardNumber": "**** **** **** 1234",
         "cardHolder": "Test User",
         "expiryDate": "12/25",
         "cvv": "***"
       }
     }
     ```
   - Expected: Payment processed successfully

7. **Get Booking Details**
   - Collection: Booking API Collection
   - Request: Get Booking by ID
   - Expected: Details of the created booking

### 5. Review and Rating

1. **Rate a Movie**
   - Collection: Movie API Collection
   - Request: Rate Movie
   - Body:
     ```json
     {
       "rating": 8.5,
       "comment": "Great movie with an amazing concept and execution."
     }
     ```
   - Expected: Rating submitted successfully

2. **Get Movie Ratings**
   - Collection: Movie API Collection
   - Request: Get Movie Ratings
   - Expected: List of ratings for the movie

### 6. Product and Order Management

1. **Get All Products**
   - Collection: Product API Collection
   - Request: Get All Products
   - Expected: List of products
   - Note: Select products and set their IDs to the `productId`, `productId2`, and `productId3` environment variables

2. **Create an Order**
   - Collection: Order API Collection
   - Request: Create Order
   - Body:
     ```json
     {
       "items": [
         {
           "productId": "{{productId}}",
           "quantity": 2,
           "price": 8.99
         },
         {
           "productId": "{{productId2}}",
           "quantity": 1,
           "price": 4.99
         }
       ],
       "totalAmount": 22.97,
       "bookingId": "{{bookingId}}",
       "pickupTime": "2023-12-25T19:00:00Z",
       "specialInstructions": "Extra butter on popcorn"
     }
     ```
   - Expected: Order created successfully
   - Note: Set the order ID from the response to the `orderId` environment variable

3. **Get Order Details**
   - Collection: Order API Collection
   - Request: Get Order by ID
   - Expected: Details of the created order

## Advanced Testing

### 1. Statistics (Admin only)

1. **Get User Statistics**
   - Collection: User API Collection
   - Request: Get User Statistics (Admin)
   - Expected: User statistics data

2. **Get Movie Statistics**
   - Collection: Movie API Collection
   - Request: Get Movie Statistics (Admin)
   - Expected: Movie statistics data

3. **Get Booking Statistics**
   - Collection: Booking API Collection
   - Request: Get Booking Statistics (Admin)
   - Expected: Booking statistics data

### 2. Search and Filtering

1. **Search Movies**
   - Collection: Movie API Collection
   - Request: Search Movies
   - Expected: Movies matching the search criteria

2. **Filter Movies by Genre**
   - Collection: Movie API Collection
   - Request: Get Movies by Genre
   - Expected: Movies in the specified genre

3. **Advanced Search Movies**
   - Collection: Movie API Collection
   - Request: Advanced Search Movies
   - Expected: Movies matching multiple criteria

## Troubleshooting

If you encounter issues during testing:

1. **Authentication Issues**
   - Ensure your token is valid and correctly set in the environment
   - Try logging in again to get a fresh token

2. **404 Not Found**
   - Check that the resource ID is valid
   - Verify the endpoint URL is correct

3. **400 Bad Request**
   - Check the request body for missing or invalid fields
   - Ensure all required fields are provided

4. **500 Internal Server Error**
   - This indicates a server-side issue
   - Check the server logs for more information

## Conclusion

This guide covers the basic testing workflow for the Movie Booking API. For more detailed testing, refer to the individual collection documentation and the API documentation.

If you have any questions or issues, please contact the API support team.
