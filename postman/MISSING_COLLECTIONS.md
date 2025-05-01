# Missing Postman Collections

This document lists the models that don't have dedicated Postman collections for testing. Each model should have a collection that tests its API endpoints.

## Core Models

### Actor
- Test endpoints for creating, reading, updating, and deleting actors
- Test endpoints for associating actors with movies
- Test endpoints for searching actors

### Director
- Test endpoints for creating, reading, updating, and deleting directors
- Test endpoints for associating directors with movies
- Test endpoints for searching directors

### Genre
- Test endpoints for creating, reading, updating, and deleting genres
- Test endpoints for associating genres with movies
- Test endpoints for filtering movies by genre

### Language
- Test endpoints for creating, reading, updating, and deleting languages
- Test endpoints for associating languages with movies
- Test endpoints for filtering movies by language

### Country
- Test endpoints for creating, reading, updating, and deleting countries
- Test endpoints for associating countries with movies
- Test endpoints for filtering movies by country

## Content Models

### News
- Test endpoints for creating, reading, updating, and deleting news articles
- Test endpoints for categorizing news articles
- Test endpoints for searching and filtering news

### Event
- Test endpoints for creating, reading, updating, and deleting events
- Test endpoints for searching and filtering events
- Test endpoints for registering for events

### Page
- Test endpoints for creating, reading, updating, and deleting static pages
- Test endpoints for retrieving page content

### Content
- Test endpoints for creating, reading, updating, and deleting content blocks
- Test endpoints for retrieving content by key

### BlogCategory
- Test endpoints for creating, reading, updating, and deleting blog categories
- Test endpoints for associating categories with news articles

### Tag
- Test endpoints for creating, reading, updating, and deleting tags
- Test endpoints for associating tags with movies, news, etc.

## User Interaction Models

### Review
- Test endpoints for creating, reading, updating, and deleting reviews
- Test endpoints for retrieving reviews by movie
- Test endpoints for rating reviews

### Comment
- Test endpoints for creating, reading, updating, and deleting comments
- Test endpoints for retrieving comments by content type (movie, news, etc.)
- Test endpoints for moderating comments

### Feedback
- Test endpoints for submitting feedback
- Test endpoints for retrieving and responding to feedback

### Contact
- Test endpoints for submitting contact form data
- Test endpoints for retrieving and responding to contact submissions

### Newsletter
- Test endpoints for subscribing to newsletters
- Test endpoints for unsubscribing from newsletters
- Test endpoints for sending newsletters

### FAQ
- Test endpoints for creating, reading, updating, and deleting FAQs
- Test endpoints for categorizing FAQs
- Test endpoints for searching FAQs

## Booking and Payment Models

### Booking
- Test endpoints for creating, reading, updating, and deleting bookings
- Test endpoints for retrieving bookings by user
- Test endpoints for retrieving bookings by movie or screening
- Test endpoints for canceling bookings

### Payment
- Test endpoints for processing payments
- Test endpoints for retrieving payment history
- Test endpoints for refunding payments

### Order
- Test endpoints for creating, reading, updating, and deleting food/merchandise orders
- Test endpoints for adding products to orders
- Test endpoints for processing order payments

### Product
- Test endpoints for creating, reading, updating, and deleting products
- Test endpoints for categorizing products
- Test endpoints for searching and filtering products

### Promotion
- Test endpoints for creating, reading, updating, and deleting promotions
- Test endpoints for applying promotions to bookings or orders
- Test endpoints for validating promotion codes

## Theater Management Models

### Theater
- Test endpoints for creating, reading, updating, and deleting theaters
- Test endpoints for associating theaters with cinemas
- Test endpoints for searching theaters by location

### Room
- Test endpoints for creating, reading, updating, and deleting rooms
- Test endpoints for associating rooms with theaters
- Test endpoints for retrieving room configurations

### Showtime
- Test endpoints for creating, reading, updating, and deleting showtimes
- Test endpoints for retrieving showtimes by movie, theater, or date
- Test endpoints for checking showtime availability

## Analytics and System Models

### Analytics
- Test endpoints for retrieving user behavior data
- Test endpoints for retrieving system performance metrics
- Test endpoints for generating reports

### Statistics
- Test endpoints for retrieving movie statistics
- Test endpoints for retrieving booking statistics
- Test endpoints for retrieving revenue statistics

### UserActivity
- Test endpoints for tracking user activities
- Test endpoints for retrieving user activity history
- Test endpoints for analyzing user behavior

### Notification
- Test endpoints for creating, reading, updating, and deleting notifications
- Test endpoints for sending notifications to users
- Test endpoints for retrieving notifications by user

### Recommendation
- Test endpoints for generating movie recommendations
- Test endpoints for retrieving recommendations by user
- Test endpoints for providing feedback on recommendations

### Setting
- Test endpoints for retrieving system settings
- Test endpoints for updating system settings
- Test endpoints for managing feature flags

## Priority Order for Implementation

Based on the importance to the core functionality of the movie booking system, here's a suggested priority order for implementing these missing collections:

### High Priority
1. Booking
2. Payment
3. Review
4. Genre
5. Showtime
6. Theater
7. Room
8. Product
9. Order
10. Promotion

### Medium Priority
11. News
12. Event
13. Comment
14. Actor
15. Director
16. Language
17. Country
18. Recommendation
19. Notification
20. UserActivity

### Lower Priority
21. Analytics
22. Statistics
23. Page
24. Content
25. BlogCategory
26. Tag
27. Feedback
28. Contact
29. Newsletter
30. FAQ
31. Setting
