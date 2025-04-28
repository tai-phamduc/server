const mongoose = require('mongoose');

// Get current date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const fourDaysAgo = new Date(today);
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
const fiveDaysAgo = new Date(today);
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
const sixDaysAgo = new Date(today);
sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

// Format dates
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const todayStr = formatDate(today);
const yesterdayStr = formatDate(yesterday);
const twoDaysAgoStr = formatDate(twoDaysAgo);
const threeDaysAgoStr = formatDate(threeDaysAgo);
const fourDaysAgoStr = formatDate(fourDaysAgo);
const fiveDaysAgoStr = formatDate(fiveDaysAgo);
const sixDaysAgoStr = formatDate(sixDaysAgo);
const sevenDaysAgoStr = formatDate(sevenDaysAgo);

// Create analytics data
const analytics = [
  // Daily visitor analytics
  {
    type: 'visitor',
    date: todayStr,
    data: {
      totalVisitors: 1245,
      uniqueVisitors: 876,
      newVisitors: 321,
      returningVisitors: 555,
      avgSessionDuration: 8.5, // in minutes
      bounceRate: 32.5, // percentage
      pageViews: 4532,
      peakHours: [
        { hour: '18:00', visitors: 145 },
        { hour: '19:00', visitors: 178 },
        { hour: '20:00', visitors: 156 }
      ],
      trafficSources: [
        { source: 'direct', count: 425 },
        { source: 'google', count: 312 },
        { source: 'facebook', count: 98 },
        { source: 'instagram', count: 76 },
        { source: 'twitter', count: 45 },
        { source: 'other', count: 41 }
      ],
      deviceTypes: [
        { type: 'mobile', count: 645 },
        { type: 'desktop', count: 412 },
        { type: 'tablet', count: 188 }
      ]
    },
    createdAt: today,
    updatedAt: today
  },
  {
    type: 'visitor',
    date: yesterdayStr,
    data: {
      totalVisitors: 1356,
      uniqueVisitors: 945,
      newVisitors: 356,
      returningVisitors: 589,
      avgSessionDuration: 7.8, // in minutes
      bounceRate: 30.2, // percentage
      pageViews: 4876,
      peakHours: [
        { hour: '18:00', visitors: 156 },
        { hour: '19:00', visitors: 189 },
        { hour: '20:00', visitors: 167 }
      ],
      trafficSources: [
        { source: 'direct', count: 456 },
        { source: 'google', count: 345 },
        { source: 'facebook', count: 112 },
        { source: 'instagram', count: 89 },
        { source: 'twitter', count: 52 },
        { source: 'other', count: 45 }
      ],
      deviceTypes: [
        { type: 'mobile', count: 698 },
        { type: 'desktop', count: 456 },
        { type: 'tablet', count: 202 }
      ]
    },
    createdAt: yesterday,
    updatedAt: yesterday
  },
  
  // Sales analytics
  {
    type: 'sales',
    date: todayStr,
    data: {
      totalRevenue: 12567.89,
      ticketSales: 9876.54,
      concessionSales: 2691.35,
      totalTransactions: 345,
      avgTransactionValue: 36.43,
      topSellingMovies: [
        { movie: '680d29841ad99532cd239bb6', title: 'The Dark Knight', sales: 3456.78 },
        { movie: '680d29841ad99532cd239baa', title: 'Inception', sales: 2345.67 },
        { movie: '680d29841ad99532cd239be0', title: 'Dune', sales: 1987.45 }
      ],
      topSellingConcessions: [
        { item: 'Popcorn (Large)', sales: 876.54 },
        { item: 'Soda (Medium)', sales: 654.32 },
        { item: 'Nachos', sales: 432.10 }
      ],
      salesByHour: [
        { hour: '10:00', sales: 456.78 },
        { hour: '12:00', sales: 678.90 },
        { hour: '14:00', sales: 890.12 },
        { hour: '16:00', sales: 1234.56 },
        { hour: '18:00', sales: 2345.67 },
        { hour: '20:00', sales: 3456.78 },
        { hour: '22:00', sales: 1234.56 }
      ],
      paymentMethods: [
        { method: 'Credit Card', count: 187, amount: 6789.01 },
        { method: 'PayPal', count: 76, amount: 2345.67 },
        { method: 'Apple Pay', count: 45, amount: 1678.90 },
        { method: 'Google Pay', count: 37, amount: 1234.56 }
      ]
    },
    createdAt: today,
    updatedAt: today
  },
  {
    type: 'sales',
    date: yesterdayStr,
    data: {
      totalRevenue: 13456.78,
      ticketSales: 10567.89,
      concessionSales: 2888.89,
      totalTransactions: 367,
      avgTransactionValue: 36.67,
      topSellingMovies: [
        { movie: '680d29841ad99532cd239bb6', title: 'The Dark Knight', sales: 3678.90 },
        { movie: '680d29841ad99532cd239baa', title: 'Inception', sales: 2567.89 },
        { movie: '680d29841ad99532cd239bc9', title: 'The Godfather', sales: 2123.45 }
      ],
      topSellingConcessions: [
        { item: 'Popcorn (Large)', sales: 945.67 },
        { item: 'Soda (Medium)', sales: 723.45 },
        { item: 'Nachos', sales: 456.78 }
      ],
      salesByHour: [
        { hour: '10:00', sales: 567.89 },
        { hour: '12:00', sales: 789.01 },
        { hour: '14:00', sales: 901.23 },
        { hour: '16:00', sales: 1345.67 },
        { hour: '18:00', sales: 2456.78 },
        { hour: '20:00', sales: 3567.89 },
        { hour: '22:00', sales: 1345.67 }
      ],
      paymentMethods: [
        { method: 'Credit Card', count: 198, amount: 7234.56 },
        { method: 'PayPal', count: 82, amount: 2567.89 },
        { method: 'Apple Pay', count: 49, amount: 1789.01 },
        { method: 'Google Pay', count: 38, amount: 1345.67 }
      ]
    },
    createdAt: yesterday,
    updatedAt: yesterday
  },
  
  // Movie performance analytics
  {
    type: 'movie_performance',
    date: todayStr,
    data: {
      totalMovies: 10,
      totalScreenings: 20,
      avgOccupancyRate: 68.5, // percentage
      movieRankings: [
        { movie: '680d29841ad99532cd239bb6', title: 'The Dark Knight', occupancyRate: 92.3, revenue: 3456.78 },
        { movie: '680d29841ad99532cd239baa', title: 'Inception', occupancyRate: 85.7, revenue: 2345.67 },
        { movie: '680d29841ad99532cd239be0', title: 'Dune', occupancyRate: 78.2, revenue: 1987.45 },
        { movie: '680d29841ad99532cd239bc9', title: 'The Godfather', occupancyRate: 65.4, revenue: 1456.78 },
        { movie: '680d29841ad99532cd239bce', title: 'Pulp Fiction', occupancyRate: 62.8, revenue: 1234.56 }
      ],
      screeningPerformance: [
        { time: 'Morning (10:00-12:00)', occupancyRate: 45.6 },
        { time: 'Afternoon (12:00-17:00)', occupancyRate: 58.7 },
        { time: 'Evening (17:00-20:00)', occupancyRate: 87.3 },
        { time: 'Night (20:00-23:00)', occupancyRate: 76.5 }
      ],
      formatPerformance: [
        { format: '2D', occupancyRate: 65.4, revenue: 5678.90 },
        { format: 'IMAX', occupancyRate: 89.7, revenue: 4567.89 },
        { format: '4DX', occupancyRate: 78.3, revenue: 2345.67 }
      ]
    },
    createdAt: today,
    updatedAt: today
  },
  
  // Weekly summary
  {
    type: 'weekly_summary',
    date: todayStr,
    data: {
      period: `${sevenDaysAgoStr} to ${todayStr}`,
      totalRevenue: 78945.67,
      totalVisitors: 8765,
      totalTicketsSold: 6543,
      avgOccupancyRate: 72.4,
      revenueByDay: [
        { date: sevenDaysAgoStr, revenue: 9876.54 },
        { date: sixDaysAgoStr, revenue: 10234.56 },
        { date: fiveDaysAgoStr, revenue: 11456.78 },
        { date: fourDaysAgoStr, revenue: 12345.67 },
        { date: threeDaysAgoStr, revenue: 11234.56 },
        { date: twoDaysAgoStr, revenue: 13456.78 },
        { date: yesterdayStr, revenue: 12567.89 },
        { date: todayStr, revenue: 10234.56 }
      ],
      visitorsByDay: [
        { date: sevenDaysAgoStr, visitors: 1123 },
        { date: sixDaysAgoStr, visitors: 1234 },
        { date: fiveDaysAgoStr, visitors: 1345 },
        { date: fourDaysAgoStr, visitors: 1456 },
        { date: threeDaysAgoStr, visitors: 1234 },
        { date: twoDaysAgoStr, visitors: 1356 },
        { date: yesterdayStr, visitors: 1245 },
        { date: todayStr, visitors: 1098 }
      ],
      topPerformingMovies: [
        { movie: '680d29841ad99532cd239bb6', title: 'The Dark Knight', revenue: 18765.43, tickets: 987 },
        { movie: '680d29841ad99532cd239baa', title: 'Inception', revenue: 15678.90, tickets: 823 },
        { movie: '680d29841ad99532cd239be0', title: 'Dune', revenue: 12345.67, tickets: 648 }
      ],
      topPerformingTheaters: [
        { theater: '680d29841ad99532cd239ba2', name: 'Starlight Multiplex', revenue: 25678.90, visitors: 1345 },
        { theater: '680d29841ad99532cd239ba3', name: 'Cineplex Odeon', revenue: 21345.67, visitors: 1123 },
        { theater: '680d29841ad99532cd239ba1', name: 'Grand Cinema', revenue: 18765.43, visitors: 987 }
      ]
    },
    createdAt: today,
    updatedAt: today
  },
  
  // Monthly summary
  {
    type: 'monthly_summary',
    date: todayStr,
    data: {
      month: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalRevenue: 345678.90,
      totalVisitors: 34567,
      totalTicketsSold: 28765,
      avgOccupancyRate: 75.6,
      comparisonToPreviousMonth: {
        revenue: 8.5, // percentage increase
        visitors: 6.7, // percentage increase
        tickets: 7.2 // percentage increase
      },
      topPerformingMovies: [
        { movie: '680d29841ad99532cd239bb6', title: 'The Dark Knight', revenue: 76543.21, tickets: 4023 },
        { movie: '680d29841ad99532cd239baa', title: 'Inception', revenue: 65432.10, tickets: 3456 },
        { movie: '680d29841ad99532cd239be0', title: 'Dune', revenue: 54321.09, tickets: 2876 },
        { movie: '680d29841ad99532cd239bc9', title: 'The Godfather', revenue: 43210.98, tickets: 2345 },
        { movie: '680d29841ad99532cd239bce', title: 'Pulp Fiction', revenue: 32109.87, tickets: 1765 }
      ],
      topPerformingTheaters: [
        { theater: '680d29841ad99532cd239ba2', name: 'Starlight Multiplex', revenue: 98765.43, visitors: 5678 },
        { theater: '680d29841ad99532cd239ba3', name: 'Cineplex Odeon', revenue: 87654.32, visitors: 4567 },
        { theater: '680d29841ad99532cd239ba1', name: 'Grand Cinema', revenue: 76543.21, visitors: 3456 }
      ],
      customerDemographics: {
        ageGroups: [
          { group: '18-24', percentage: 28.5 },
          { group: '25-34', percentage: 35.7 },
          { group: '35-44', percentage: 18.3 },
          { group: '45-54', percentage: 10.2 },
          { group: '55+', percentage: 7.3 }
        ],
        gender: [
          { type: 'Male', percentage: 52.3 },
          { type: 'Female', percentage: 47.1 },
          { type: 'Other', percentage: 0.6 }
        ]
      }
    },
    createdAt: today,
    updatedAt: today
  }
];

module.exports = analytics;
