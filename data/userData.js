const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    isActive: true,
    phone: '+12345678901',
    avatar: 'https://via.placeholder.com/150',
    address: {
      street: '123 Admin St',
      city: 'Admin City',
      state: 'Admin State',
      zipCode: '12345',
      country: 'USA'
    }
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    isActive: true,
    phone: '+12345678902',
    avatar: 'https://via.placeholder.com/150',
    address: {
      street: '123 User St',
      city: 'User City',
      state: 'User State',
      zipCode: '12345',
      country: 'USA'
    }
  }
];

module.exports = users;
