const bcrypt = require('bcryptjs');

const userData = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    isActive: true,
    isVerified: true,
    avatar: 'https://example.com/avatars/admin.jpg',
    // phone: '+15551234567',
    address: {
      street: '123 Admin Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    bio: 'System administrator with full access to all features.',
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      language: 'en',
      theme: 'dark'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    isActive: true,
    isVerified: true,
    avatar: 'https://example.com/avatars/john.jpg',
    // phone: '+15552345678',
    address: {
      street: '456 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    bio: 'Movie enthusiast who loves action and sci-fi films.',
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      language: 'en',
      theme: 'light'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    isActive: true,
    isVerified: true,
    avatar: 'https://example.com/avatars/jane.jpg',
    // phone: '+15553456789',
    address: {
      street: '789 Oak Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    bio: 'Film critic and blogger with a passion for independent cinema.',
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      language: 'en',
      theme: 'light'
    }
  },
  {
    name: 'Robert Johnson',
    email: 'robert@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    isActive: true,
    isVerified: true,
    avatar: 'https://example.com/avatars/robert.jpg',
    // phone: '+15554567890',
    address: {
      street: '101 Pine Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    bio: 'Horror movie fan who never misses a midnight premiere.',
    preferences: {
      newsletter: false,
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      language: 'en',
      theme: 'dark'
    }
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    isActive: true,
    isVerified: true,
    avatar: 'https://example.com/avatars/emily.jpg',
    // phone: '+15555678901',
    address: {
      street: '202 Maple Drive',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA'
    },
    bio: 'Documentary filmmaker and avid moviegoer.',
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      language: 'en',
      theme: 'light'
    }
  },
  {
    name: 'Michael Wilson',
    email: 'michael@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    isActive: true,
    isVerified: false,
    avatar: 'https://example.com/avatars/michael.jpg',
    // phone: '+15556789012',
    address: {
      street: '303 Cedar Lane',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    bio: 'Comedy and animation fan who enjoys family movie nights.',
    preferences: {
      newsletter: false,
      notifications: {
        email: false,
        push: true,
        sms: false
      },
      language: 'en',
      theme: 'light'
    }
  },
  {
    name: 'Sarah Brown',
    email: 'sarah@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    isActive: false,
    isVerified: true,
    avatar: 'https://example.com/avatars/sarah.jpg',
    // phone: '+15557890123',
    address: {
      street: '404 Birch Road',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA'
    },
    bio: 'Classic film buff with a special interest in film noir and westerns.',
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      language: 'en',
      theme: 'dark'
    }
  },
  {
    name: 'David Miller',
    email: 'david@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'moderator',
    isActive: true,
    isVerified: true,
    avatar: 'https://example.com/avatars/david.jpg',
    // phone: '+15558901234',
    address: {
      street: '505 Elm Court',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'USA'
    },
    bio: 'Film studies professor and community moderator.',
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      language: 'en',
      theme: 'light'
    }
  },
  {
    name: 'Jennifer Taylor',
    email: 'jennifer@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    isActive: true,
    isVerified: true,
    avatar: 'https://example.com/avatars/jennifer.jpg',
    // phone: '+15559012345',
    address: {
      street: '606 Walnut Avenue',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA'
    },
    bio: 'International film festival attendee and foreign film enthusiast.',
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      language: 'en',
      theme: 'light'
    }
  },
  {
    name: 'James Anderson',
    email: 'james@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    isActive: true,
    isVerified: true,
    avatar: 'https://example.com/avatars/james.jpg',
    // phone: '+15550123456',
    address: {
      street: '707 Spruce Street',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19101',
      country: 'USA'
    },
    bio: 'Superhero movie collector and comic book fan.',
    preferences: {
      newsletter: false,
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      language: 'en',
      theme: 'dark'
    }
  }
];

module.exports = userData;
