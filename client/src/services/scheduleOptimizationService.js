import * as tf from '@tensorflow/tfjs';
import { movieService } from './api';
import trendPredictionService from './trendPredictionService';

// Schedule Optimization Service
const scheduleOptimizationService = {
  // Optimize movie schedule for a theater
  optimizeSchedule: async (theaterId, date) => {
    try {
      // In a real implementation, this would use a trained model
      // For now, we'll use a rule-based approach
      
      // Get all movies
      const allMovies = await movieService.getMovies();
      
      // Filter to "Now Playing" movies
      const nowPlayingMovies = allMovies.filter(movie => movie.status === 'Now Playing');
      
      // Get popularity predictions for each movie
      const moviesWithPopularity = await Promise.all(
        nowPlayingMovies.map(async (movie) => {
          const popularity = await trendPredictionService.predictMoviePopularity(movie._id);
          return {
            ...movie,
            popularityScore: popularity ? popularity.popularityScore : 50,
            trendDirection: popularity ? popularity.trendDirection : 'stable'
          };
        })
      );
      
      // Sort movies by popularity score
      const sortedMovies = moviesWithPopularity.sort((a, b) => b.popularityScore - a.popularityScore);
      
      // Define theater halls (in a real app, this would come from the API)
      const halls = [
        { id: 'hall1', name: 'Hall 1', capacity: 200, premium: true },
        { id: 'hall2', name: 'Hall 2', capacity: 150, premium: false },
        { id: 'hall3', name: 'Hall 3', capacity: 150, premium: false },
        { id: 'hall4', name: 'Hall 4', capacity: 100, premium: false }
      ];
      
      // Define time slots (in a real app, this would be more dynamic)
      const timeSlots = [
        { id: 'morning', startTime: '10:00', endTime: '13:00', weight: 0.6 },
        { id: 'afternoon', startTime: '13:30', endTime: '16:30', weight: 0.8 },
        { id: 'evening', startTime: '17:00', endTime: '20:00', weight: 1.0 },
        { id: 'night', startTime: '20:30', endTime: '23:30', weight: 0.9 }
      ];
      
      // Generate optimized schedule
      const schedule = generateOptimizedSchedule(sortedMovies, halls, timeSlots, date);
      
      // Calculate expected revenue and attendance
      const metrics = calculateScheduleMetrics(schedule, sortedMovies);
      
      return {
        date,
        schedule,
        metrics,
        recommendations: generateScheduleRecommendations(schedule, sortedMovies, metrics)
      };
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      return null;
    }
  },
  
  // Predict attendance for a showtime
  predictAttendance: async (showtimeId, movieId, hallId, timeSlot, date) => {
    try {
      // Get movie details
      const movie = await movieService.getMovieById(movieId);
      if (!movie) throw new Error('Movie not found');
      
      // Get popularity prediction
      const popularity = await trendPredictionService.predictMoviePopularity(movieId);
      
      // In a real implementation, this would use a trained model
      // For now, we'll use a rule-based approach
      
      // Base attendance percentage based on popularity
      let attendancePercentage = (popularity ? popularity.popularityScore : 50) / 100;
      
      // Adjust for day of week
      const dayOfWeek = new Date(date).getDay();
      const dayFactor = getDayOfWeekFactor(dayOfWeek);
      attendancePercentage *= dayFactor;
      
      // Adjust for time slot
      const timeFactor = getTimeSlotFactor(timeSlot);
      attendancePercentage *= timeFactor;
      
      // Adjust for movie age (days since release)
      const releaseDate = new Date(movie.releaseDate);
      const showDate = new Date(date);
      const daysSinceRelease = Math.floor((showDate - releaseDate) / (1000 * 60 * 60 * 24));
      const ageFactor = getMovieAgeFactor(daysSinceRelease);
      attendancePercentage *= ageFactor;
      
      // Adjust for rating
      const rating = parseFloat(movie.rating) || 3;
      const ratingFactor = 0.7 + (rating / 5) * 0.6; // 0.7-1.3x
      attendancePercentage *= ratingFactor;
      
      // Cap at 100%
      attendancePercentage = Math.min(attendancePercentage, 1);
      
      // Get hall capacity (in a real app, this would come from the API)
      const hallCapacity = getHallCapacity(hallId);
      
      // Calculate expected attendance
      const expectedAttendance = Math.round(hallCapacity * attendancePercentage);
      
      // Calculate expected revenue
      const ticketPrice = getTicketPrice(hallId, timeSlot);
      const expectedRevenue = expectedAttendance * ticketPrice;
      
      return {
        movieId,
        title: movie.title,
        hallId,
        timeSlot,
        date,
        expectedAttendance,
        attendancePercentage: Math.round(attendancePercentage * 100),
        expectedRevenue,
        factors: {
          popularityScore: popularity ? popularity.popularityScore : 50,
          dayFactor,
          timeFactor,
          ageFactor,
          ratingFactor
        }
      };
    } catch (error) {
      console.error('Error predicting attendance:', error);
      return null;
    }
  },
  
  // Get optimal movie for a time slot
  getOptimalMovie: async (hallId, timeSlot, date, excludeMovieIds = []) => {
    try {
      // Get all movies
      const allMovies = await movieService.getMovies();
      
      // Filter to "Now Playing" movies and exclude specified movies
      const availableMovies = allMovies.filter(
        movie => movie.status === 'Now Playing' && !excludeMovieIds.includes(movie._id)
      );
      
      // Get popularity predictions for each movie
      const moviesWithPopularity = await Promise.all(
        availableMovies.map(async (movie) => {
          const popularity = await trendPredictionService.predictMoviePopularity(movie._id);
          return {
            ...movie,
            popularityScore: popularity ? popularity.popularityScore : 50,
            trendDirection: popularity ? popularity.trendDirection : 'stable'
          };
        })
      );
      
      // Predict attendance for each movie
      const moviesWithAttendance = await Promise.all(
        moviesWithPopularity.map(async (movie) => {
          const attendance = await scheduleOptimizationService.predictAttendance(
            null, movie._id, hallId, timeSlot, date
          );
          return {
            ...movie,
            attendance: attendance || {
              expectedAttendance: 0,
              attendancePercentage: 0,
              expectedRevenue: 0
            }
          };
        })
      );
      
      // Sort by expected revenue
      const sortedMovies = moviesWithAttendance.sort(
        (a, b) => b.attendance.expectedRevenue - a.attendance.expectedRevenue
      );
      
      // Return top movie
      return sortedMovies.length > 0 ? sortedMovies[0] : null;
    } catch (error) {
      console.error('Error finding optimal movie:', error);
      return null;
    }
  },
  
  // Generate schedule recommendations
  generateRecommendations: async (theaterId, date) => {
    try {
      // Get optimized schedule
      const optimizedSchedule = await scheduleOptimizationService.optimizeSchedule(theaterId, date);
      if (!optimizedSchedule) throw new Error('Failed to generate optimized schedule');
      
      // Return recommendations
      return optimizedSchedule.recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }
};

// Helper function to generate optimized schedule
const generateOptimizedSchedule = (movies, halls, timeSlots, date) => {
  const schedule = [];
  
  // Assign movies to halls and time slots based on popularity
  halls.forEach(hall => {
    timeSlots.forEach(timeSlot => {
      // Determine which movie to show in this slot
      let movieIndex = schedule.length % movies.length;
      
      // For premium halls, prioritize top movies
      if (hall.premium) {
        movieIndex = movieIndex % Math.min(3, movies.length);
      }
      
      const movie = movies[movieIndex];
      
      // Create showtime
      const showtime = {
        id: `${hall.id}-${timeSlot.id}-${date}`,
        movieId: movie._id,
        movie: {
          title: movie.title,
          poster: movie.poster,
          duration: movie.duration || 120,
          rating: movie.rating || 0,
          popularityScore: movie.popularityScore || 0
        },
        hallId: hall.id,
        hall: {
          name: hall.name,
          capacity: hall.capacity,
          premium: hall.premium
        },
        date,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        timeSlotId: timeSlot.id
      };
      
      schedule.push(showtime);
    });
  });
  
  return schedule;
};

// Helper function to calculate schedule metrics
const calculateScheduleMetrics = (schedule, movies) => {
  // Calculate total expected attendance and revenue
  let totalAttendance = 0;
  let totalRevenue = 0;
  let totalCapacity = 0;
  
  schedule.forEach(showtime => {
    // Get movie popularity
    const movie = movies.find(m => m._id === showtime.movieId);
    const popularityScore = movie ? movie.popularityScore : 50;
    
    // Calculate expected attendance
    const timeSlotWeight = getTimeSlotFactor(showtime.timeSlotId);
    const hallCapacity = showtime.hall.capacity;
    const attendancePercentage = (popularityScore / 100) * timeSlotWeight;
    const expectedAttendance = Math.round(hallCapacity * attendancePercentage);
    
    // Calculate expected revenue
    const ticketPrice = getTicketPrice(showtime.hallId, showtime.timeSlotId);
    const expectedRevenue = expectedAttendance * ticketPrice;
    
    // Add to totals
    totalAttendance += expectedAttendance;
    totalRevenue += expectedRevenue;
    totalCapacity += hallCapacity;
    
    // Add metrics to showtime
    showtime.metrics = {
      expectedAttendance,
      attendancePercentage: Math.round(attendancePercentage * 100),
      expectedRevenue,
      ticketPrice
    };
  });
  
  // Calculate overall metrics
  const overallAttendancePercentage = Math.round((totalAttendance / totalCapacity) * 100);
  
  return {
    totalAttendance,
    totalRevenue,
    totalCapacity,
    overallAttendancePercentage,
    revenueFormatted: formatCurrency(totalRevenue)
  };
};

// Helper function to generate schedule recommendations
const generateScheduleRecommendations = (schedule, movies, metrics) => {
  const recommendations = [];
  
  // Find low-performing showtimes
  const lowPerformingShowtimes = schedule.filter(
    showtime => showtime.metrics.attendancePercentage < 30
  );
  
  if (lowPerformingShowtimes.length > 0) {
    // Recommend replacing movies in low-performing showtimes
    lowPerformingShowtimes.forEach(showtime => {
      // Find a better movie (one with higher popularity that isn't already in this time slot)
      const betterMovies = movies.filter(
        movie => movie.popularityScore > (showtime.movie.popularityScore + 20) &&
                !schedule.some(s => 
                  s.timeSlotId === showtime.timeSlotId && 
                  s.hallId !== showtime.hallId && 
                  s.movieId === movie._id
                )
      );
      
      if (betterMovies.length > 0) {
        recommendations.push({
          type: 'replace_movie',
          showtime: {
            id: showtime.id,
            hallName: showtime.hall.name,
            timeSlot: showtime.startTime,
            movieTitle: showtime.movie.title,
            attendancePercentage: showtime.metrics.attendancePercentage
          },
          suggestion: {
            movieId: betterMovies[0]._id,
            movieTitle: betterMovies[0].title,
            expectedImprovement: Math.round((betterMovies[0].popularityScore - showtime.movie.popularityScore) / 2)
          },
          message: `Replace "${showtime.movie.title}" in ${showtime.hall.name} at ${showtime.startTime} with "${betterMovies[0].title}" to potentially increase attendance by ${Math.round((betterMovies[0].popularityScore - showtime.movie.popularityScore) / 2)}%.`
        });
      }
    });
  }
  
  // Check for time slot optimization
  const timeSlotCounts = {};
  schedule.forEach(showtime => {
    const movieId = showtime.movieId;
    if (!timeSlotCounts[movieId]) {
      timeSlotCounts[movieId] = {};
    }
    if (!timeSlotCounts[movieId][showtime.timeSlotId]) {
      timeSlotCounts[movieId][showtime.timeSlotId] = 0;
    }
    timeSlotCounts[movieId][showtime.timeSlotId]++;
  });
  
  // Find movies that are shown multiple times in less optimal time slots
  Object.entries(timeSlotCounts).forEach(([movieId, slots]) => {
    const movie = movies.find(m => m._id === movieId);
    if (!movie) return;
    
    // Check if movie is shown multiple times in morning/afternoon but not in evening
    if ((slots.morning || 0) + (slots.afternoon || 0) > 1 && !(slots.evening)) {
      recommendations.push({
        type: 'optimize_timeslot',
        movie: {
          id: movieId,
          title: movie.title,
          popularityScore: movie.popularityScore
        },
        message: `Consider showing "${movie.title}" during evening time slots for potentially higher attendance.`
      });
    }
  });
  
  // Overall schedule recommendation
  if (metrics.overallAttendancePercentage < 50) {
    recommendations.push({
      type: 'general',
      message: `The overall expected attendance is ${metrics.overallAttendancePercentage}%, which is below target. Consider featuring more popular movies or adjusting ticket prices.`
    });
  } else if (recommendations.length === 0) {
    recommendations.push({
      type: 'general',
      message: `This schedule is well-optimized with an expected attendance of ${metrics.overallAttendancePercentage}% and projected revenue of ${metrics.revenueFormatted}.`
    });
  }
  
  return recommendations;
};

// Helper function to get day of week factor
const getDayOfWeekFactor = (dayOfWeek) => {
  // Day factors (0-6 for Sunday-Saturday)
  const dayFactors = [
    0.8,  // Sunday
    0.6,  // Monday
    0.6,  // Tuesday
    0.7,  // Wednesday
    0.8,  // Thursday
    1.0,  // Friday
    1.0   // Saturday
  ];
  
  return dayFactors[dayOfWeek] || 0.8;
};

// Helper function to get time slot factor
const getTimeSlotFactor = (timeSlot) => {
  // Time slot factors
  const timeFactors = {
    'morning': 0.6,
    'afternoon': 0.8,
    'evening': 1.0,
    'night': 0.9
  };
  
  return timeFactors[timeSlot] || 0.8;
};

// Helper function to get movie age factor
const getMovieAgeFactor = (daysSinceRelease) => {
  if (daysSinceRelease < 0) {
    // Upcoming movie (pre-release screenings)
    return 0.9;
  } else if (daysSinceRelease < 7) {
    // First week
    return 1.0;
  } else if (daysSinceRelease < 14) {
    // Second week
    return 0.9;
  } else if (daysSinceRelease < 30) {
    // First month
    return 0.8;
  } else if (daysSinceRelease < 60) {
    // Second month
    return 0.7;
  } else {
    // Older
    return 0.6;
  }
};

// Helper function to get hall capacity
const getHallCapacity = (hallId) => {
  // Hall capacities
  const hallCapacities = {
    'hall1': 200,
    'hall2': 150,
    'hall3': 150,
    'hall4': 100
  };
  
  return hallCapacities[hallId] || 100;
};

// Helper function to get ticket price
const getTicketPrice = (hallId, timeSlot) => {
  // Base price
  let price = 10;
  
  // Premium hall
  if (hallId === 'hall1') {
    price += 3;
  }
  
  // Time slot adjustments
  if (timeSlot === 'evening' || timeSlot === 'night') {
    price += 2;
  } else if (timeSlot === 'morning') {
    price -= 1;
  }
  
  return price;
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default scheduleOptimizationService;
