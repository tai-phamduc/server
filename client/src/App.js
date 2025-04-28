import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Load test runner in development mode
if (process.env.NODE_ENV === 'development') {
  import('./tests/testRunner').catch(err => console.error('Error loading test runner:', err));
}

// Loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-dark">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const MyTicketsPage = lazy(() => import('./pages/MyTicketsPage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const BookingDetailPage = lazy(() => import('./pages/BookingDetailPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailsPage = lazy(() => import('./pages/EventDetailPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailsPage = lazy(() => import('./pages/NewsDetailPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="movies/:id" element={<MovieDetailsPage />} />
          <Route path="booking/:id" element={<BookingPage />} />
          <Route path="my-tickets" element={<MyTicketsPage />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="bookings/:id" element={<BookingDetailPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsDetailsPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
