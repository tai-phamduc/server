const mongoose = require('mongoose');
const Room = require('../models/Room');
const Cinema = require('../models/Cinema');

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to add room data
const addRoomData = async () => {
  try {
    const count = await Room.countDocuments();
    if (count > 0) {
      console.log(`Room collection already has ${count} documents. Skipping...`);
      return;
    }

    // Find cinemas to associate with rooms
    const cinemas = await Cinema.find();
    if (cinemas.length === 0) {
      console.log('No cinemas found. Skipping rooms...');
      return;
    }

    const roomData = [];

    // Create rooms for each cinema
    for (const cinema of cinemas) {
      // Standard rooms
      for (let i = 1; i <= 3; i++) {
        roomData.push({
          name: `Standard Room ${i}`,
          cinema: cinema._id,
          capacity: 120,
          roomType: 'standard',
          features: ['Digital Projection', 'Dolby Digital Sound'],
          seatMap: {
            rows: 10,
            seatsPerRow: 12,
            layout: [
              { row: 'A', seats: 12, seatType: 'standard' },
              { row: 'B', seats: 12, seatType: 'standard' },
              { row: 'C', seats: 12, seatType: 'standard' },
              { row: 'D', seats: 12, seatType: 'standard' },
              { row: 'E', seats: 12, seatType: 'standard' },
              { row: 'F', seats: 12, seatType: 'standard' },
              { row: 'G', seats: 12, seatType: 'standard' },
              { row: 'H', seats: 12, seatType: 'standard' },
              { row: 'I', seats: 12, seatType: 'standard' },
              { row: 'J', seats: 12, seatType: 'standard' }
            ]
          },
          status: 'active'
        });
      }

      // VIP room
      roomData.push({
        name: 'VIP Room',
        cinema: cinema._id,
        capacity: 80,
        roomType: 'vip',
        features: ['4K Projection', 'Dolby Atmos Sound', 'Reclining Seats', 'In-seat Service'],
        seatMap: {
          rows: 8,
          seatsPerRow: 10,
          layout: [
            { row: 'A', seats: 10, seatType: 'vip' },
            { row: 'B', seats: 10, seatType: 'vip' },
            { row: 'C', seats: 10, seatType: 'vip' },
            { row: 'D', seats: 10, seatType: 'vip' },
            { row: 'E', seats: 10, seatType: 'vip' },
            { row: 'F', seats: 10, seatType: 'vip' },
            { row: 'G', seats: 10, seatType: 'vip' },
            { row: 'H', seats: 10, seatType: 'vip' }
          ]
        },
        status: 'active'
      });

      // IMAX room
      roomData.push({
        name: 'IMAX Room',
        cinema: cinema._id,
        capacity: 200,
        roomType: 'imax',
        features: ['IMAX Projection', 'IMAX Sound System', 'Giant Screen', 'Stadium Seating'],
        seatMap: {
          rows: 10,
          seatsPerRow: 20,
          layout: [
            { row: 'A', seats: 20, seatType: 'standard' },
            { row: 'B', seats: 20, seatType: 'standard' },
            { row: 'C', seats: 20, seatType: 'standard' },
            { row: 'D', seats: 20, seatType: 'standard' },
            { row: 'E', seats: 20, seatType: 'standard' },
            { row: 'F', seats: 20, seatType: 'standard' },
            { row: 'G', seats: 20, seatType: 'standard' },
            { row: 'H', seats: 20, seatType: 'standard' },
            { row: 'I', seats: 20, seatType: 'standard' },
            { row: 'J', seats: 20, seatType: 'standard' }
          ]
        },
        status: 'active'
      });

      // 3D room
      roomData.push({
        name: '3D Room',
        cinema: cinema._id,
        capacity: 150,
        roomType: '3d',
        features: ['3D Projection', 'Surround Sound', 'Comfortable Seating'],
        seatMap: {
          rows: 10,
          seatsPerRow: 15,
          layout: [
            { row: 'A', seats: 15, seatType: 'standard' },
            { row: 'B', seats: 15, seatType: 'standard' },
            { row: 'C', seats: 15, seatType: 'standard' },
            { row: 'D', seats: 15, seatType: 'standard' },
            { row: 'E', seats: 15, seatType: 'standard' },
            { row: 'F', seats: 15, seatType: 'standard' },
            { row: 'G', seats: 15, seatType: 'standard' },
            { row: 'H', seats: 15, seatType: 'standard' },
            { row: 'I', seats: 15, seatType: 'standard' },
            { row: 'J', seats: 15, seatType: 'standard' }
          ]
        },
        status: 'active'
      });
    }

    await Room.insertMany(roomData);
    console.log(`Added ${roomData.length} room documents`);
  } catch (error) {
    console.error('Error adding room data:', error);
  }
};

// Run the function
addRoomData()
  .then(() => {
    console.log('Room data added successfully');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    mongoose.connection.close();
    process.exit(1);
  });
