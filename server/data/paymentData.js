const mongoose = require('mongoose');

// Get current date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

// Generate a unique transaction ID
const generateTransactionId = (prefix) => {
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${prefix}-${randomStr.toUpperCase()}`;
};

// Create payment data
const payments = [
  {
    user: '680d29841ad99532cd239b02', // Jane Smith
    booking: null, // Will be filled with actual booking ID
    amount: 56.97,
    currency: 'USD',
    paymentMethod: 'paypal',
    paymentStatus: 'completed',
    paymentDate: yesterday,
    transactionId: generateTransactionId('PAY'),
    receiptUrl: 'https://example.com/receipts/PAY-1AB23456CD789012EF34GHIJ',
    notes: 'Payment for 3 tickets to The Dark Knight',
    billingDetails: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    }
  },
  {
    user: '680d29841ad99532cd239b03', // Michael Johnson
    booking: null, // Will be filled with actual booking ID
    amount: 39.98,
    currency: 'USD',
    paymentMethod: 'credit_card',
    paymentStatus: 'completed',
    paymentDate: yesterday,
    transactionId: generateTransactionId('CH'),
    receiptUrl: 'https://example.com/receipts/ch_1AB23456CD789012EF34GHIJ',
    notes: 'Payment for 2 tickets to Inception',
    billingDetails: {
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com'
    },
    cardDetails: {
      brand: 'Visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2024'
    }
  },
  {
    user: '680d29841ad99532cd239b04', // Emily Davis
    booking: null, // Will be filled with actual booking ID
    amount: 71.96,
    currency: 'USD',
    paymentMethod: 'apple_pay',
    paymentStatus: 'completed',
    paymentDate: today,
    transactionId: generateTransactionId('AP'),
    receiptUrl: 'https://example.com/receipts/ap_1AB23456CD789012EF34GHIJ',
    notes: 'Payment for 4 tickets to Dune',
    billingDetails: {
      name: 'Emily Davis',
      email: 'emily.davis@example.com'
    }
  },
  {
    user: '680d29841ad99532cd239b05', // Robert Wilson
    booking: null, // Will be filled with actual booking ID
    amount: 31.98,
    currency: 'USD',
    paymentMethod: 'google_pay',
    paymentStatus: 'completed',
    paymentDate: today,
    transactionId: generateTransactionId('GP'),
    receiptUrl: 'https://example.com/receipts/gp_1AB23456CD789012EF34GHIJ',
    notes: 'Payment for 2 tickets to Pulp Fiction',
    billingDetails: {
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com'
    }
  },
  {
    user: '680d29841ad99532cd239b06', // Sarah Brown
    booking: null, // Will be filled with actual booking ID
    amount: 37.98,
    currency: 'USD',
    paymentMethod: 'credit_card',
    paymentStatus: 'completed',
    paymentDate: twoDaysAgo,
    transactionId: generateTransactionId('CH'),
    receiptUrl: 'https://example.com/receipts/ch_2AB23456CD789012EF34GHIJ',
    notes: 'Payment for 2 tickets to Interstellar',
    billingDetails: {
      name: 'Sarah Brown',
      email: 'sarah.brown@example.com'
    },
    cardDetails: {
      brand: 'Mastercard',
      last4: '5678',
      expiryMonth: '10',
      expiryYear: '2023'
    }
  },
  {
    user: '680d29841ad99532cd239b07', // David Miller
    booking: null, // Will be filled with actual booking ID
    amount: 25.98,
    currency: 'USD',
    paymentMethod: 'paypal',
    paymentStatus: 'failed',
    paymentDate: yesterday,
    transactionId: generateTransactionId('PAY'),
    receiptUrl: null,
    notes: 'Payment failed due to insufficient funds',
    billingDetails: {
      name: 'David Miller',
      email: 'david.miller@example.com'
    }
  },
  {
    user: '680d29841ad99532cd239b08', // Jennifer Taylor
    booking: null, // Will be filled with actual booking ID
    amount: 37.98,
    currency: 'USD',
    paymentMethod: 'credit_card',
    paymentStatus: 'refunded',
    paymentDate: today,
    transactionId: generateTransactionId('CH'),
    receiptUrl: 'https://example.com/receipts/ch_3AB23456CD789012EF34GHIJ',
    notes: 'Refund processed due to customer request',
    refundAmount: 37.98,
    refundDate: today,
    refundReason: 'Customer request',
    refundTransactionId: generateTransactionId('RE'),
    billingDetails: {
      name: 'Jennifer Taylor',
      email: 'jennifer.taylor@example.com'
    },
    cardDetails: {
      brand: 'Visa',
      last4: '9876',
      expiryMonth: '08',
      expiryYear: '2025'
    }
  },
  {
    user: '680d29841ad99532cd239b09', // Thomas Anderson
    booking: null, // Will be filled with actual booking ID
    amount: 39.98,
    currency: 'USD',
    paymentMethod: 'apple_pay',
    paymentStatus: 'completed',
    paymentDate: today,
    transactionId: generateTransactionId('AP'),
    receiptUrl: 'https://example.com/receipts/ap_2AB23456CD789012EF34GHIJ',
    notes: 'Payment for 2 tickets to Inception',
    billingDetails: {
      name: 'Thomas Anderson',
      email: 'thomas.anderson@example.com'
    }
  },
  {
    user: '680d29841ad99532cd239b01', // Admin User
    booking: null, // Will be filled with actual booking ID
    amount: 35.98,
    currency: 'USD',
    paymentMethod: 'credit_card',
    paymentStatus: 'pending',
    paymentDate: today,
    transactionId: generateTransactionId('CH'),
    receiptUrl: null,
    notes: 'Payment pending authorization',
    billingDetails: {
      name: 'Admin User',
      email: 'admin@example.com'
    },
    cardDetails: {
      brand: 'Amex',
      last4: '1234',
      expiryMonth: '05',
      expiryYear: '2024'
    }
  },
  {
    user: '680d29841ad99532cd239b02', // Jane Smith
    booking: null, // Will be filled with actual booking ID
    amount: 25.98,
    currency: 'USD',
    paymentMethod: 'credit_card',
    paymentStatus: 'completed',
    paymentDate: twoDaysAgo,
    transactionId: generateTransactionId('CH'),
    receiptUrl: 'https://example.com/receipts/ch_5AB23456CD789012EF34GHIJ',
    notes: 'Payment for 2 tickets to The Godfather',
    billingDetails: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    },
    cardDetails: {
      brand: 'Visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2024'
    }
  }
];

module.exports = payments;
