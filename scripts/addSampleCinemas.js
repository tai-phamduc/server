const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => {
    console.log('MongoDB Connected');
    // Run the main function after connection is established
    addSampleCinemas();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Main function to add sample cinemas
const addSampleCinemas = async () => {
  try {
    // Check if there are already cinemas in the database
    const cinemaCount = await mongoose.connection.db.collection('cinemas').countDocuments();
    console.log(`Found ${cinemaCount} cinemas in the database`);

    // If there are already cinemas, don't add more
    if (cinemaCount > 2) {
      console.log('Cinemas already exist in the database. Skipping sample data creation.');
      process.exit(0);
      return;
    }

    // Create sample cinemas
    const sampleCinemas = [
      {
        name: "Cinema City Downtown",
        slug: "cinema-city-downtown",
        description: "Our flagship location in the heart of downtown, featuring state-of-the-art projection and sound systems, luxury seating, and a full-service bar and restaurant.",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        phone: "212-555-1234",
        email: "downtown@cinemacity.com",
        website: "https://cinemacity.com/downtown",
        location: {
          type: "Point",
          coordinates: [-73.9857, 40.7484]
        },
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
        gallery: [
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
          "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"
        ],
        amenities: ["IMAX", "Dolby Atmos", "4K Projection", "VIP Seating", "Restaurant", "Bar", "Parking"],
        openingHours: {
          monday: "10:00 AM - 12:00 AM",
          tuesday: "10:00 AM - 12:00 AM",
          wednesday: "10:00 AM - 12:00 AM",
          thursday: "10:00 AM - 12:00 AM",
          friday: "10:00 AM - 1:00 AM",
          saturday: "9:00 AM - 1:00 AM",
          sunday: "9:00 AM - 12:00 AM"
        },
        isActive: true,
        featured: true,
        rooms: [
          {
            name: "IMAX Theater",
            number: 1,
            capacity: 300,
            type: "IMAX",
            features: ["IMAX Projection", "IMAX Sound", "Stadium Seating", "Recliner Seats"],
            seatingLayout: {
              rows: 15,
              seatsPerRow: 20,
              aisleSeats: [5, 15]
            },
            isActive: true
          },
          {
            name: "Dolby Cinema",
            number: 2,
            capacity: 200,
            type: "Dolby Cinema",
            features: ["Dolby Vision", "Dolby Atmos", "Recliner Seats"],
            seatingLayout: {
              rows: 10,
              seatsPerRow: 20,
              aisleSeats: [5, 15]
            },
            isActive: true
          },
          {
            name: "VIP Screening Room",
            number: 3,
            capacity: 50,
            type: "VIP",
            features: ["4K Projection", "Premium Sound", "Luxury Recliners", "In-seat Dining"],
            seatingLayout: {
              rows: 5,
              seatsPerRow: 10,
              aisleSeats: [5]
            },
            isActive: true
          },
          {
            name: "Standard Theater 1",
            number: 4,
            capacity: 150,
            type: "Standard",
            features: ["Digital Projection", "Surround Sound", "Stadium Seating"],
            seatingLayout: {
              rows: 10,
              seatsPerRow: 15,
              aisleSeats: [7]
            },
            isActive: true
          },
          {
            name: "Standard Theater 2",
            number: 5,
            capacity: 150,
            type: "Standard",
            features: ["Digital Projection", "Surround Sound", "Stadium Seating"],
            seatingLayout: {
              rows: 10,
              seatsPerRow: 15,
              aisleSeats: [7]
            },
            isActive: true
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cinema City Uptown",
        slug: "cinema-city-uptown",
        description: "Our uptown location offers a boutique cinema experience with intimate screening rooms, artisanal concessions, and curated film selections including independent and foreign films.",
        address: "456 Park Avenue",
        city: "New York",
        state: "NY",
        zipCode: "10022",
        country: "USA",
        phone: "212-555-5678",
        email: "uptown@cinemacity.com",
        website: "https://cinemacity.com/uptown",
        location: {
          type: "Point",
          coordinates: [-73.9654, 40.7662]
        },
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
        gallery: [
          "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"
        ],
        amenities: ["4K Projection", "Artisanal Concessions", "Wine Bar", "Reserved Seating", "Parking"],
        openingHours: {
          monday: "12:00 PM - 11:00 PM",
          tuesday: "12:00 PM - 11:00 PM",
          wednesday: "12:00 PM - 11:00 PM",
          thursday: "12:00 PM - 11:00 PM",
          friday: "12:00 PM - 12:00 AM",
          saturday: "11:00 AM - 12:00 AM",
          sunday: "11:00 AM - 11:00 PM"
        },
        isActive: true,
        featured: false,
        rooms: [
          {
            name: "Screening Room 1",
            number: 1,
            capacity: 80,
            type: "Premium",
            features: ["4K Projection", "Dolby Sound", "Leather Seats"],
            seatingLayout: {
              rows: 8,
              seatsPerRow: 10,
              aisleSeats: [5]
            },
            isActive: true
          },
          {
            name: "Screening Room 2",
            number: 2,
            capacity: 80,
            type: "Premium",
            features: ["4K Projection", "Dolby Sound", "Leather Seats"],
            seatingLayout: {
              rows: 8,
              seatsPerRow: 10,
              aisleSeats: [5]
            },
            isActive: true
          },
          {
            name: "Indie Theater",
            number: 3,
            capacity: 60,
            type: "Standard",
            features: ["Digital Projection", "Surround Sound", "Comfortable Seating"],
            seatingLayout: {
              rows: 6,
              seatsPerRow: 10,
              aisleSeats: [5]
            },
            isActive: true
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cinema City Riverside",
        slug: "cinema-city-riverside",
        description: "Located in the scenic Riverside district, this modern multiplex features 10 screens, including a premium large format theater and 4DX experience.",
        address: "789 River Road",
        city: "New York",
        state: "NY",
        zipCode: "10044",
        country: "USA",
        phone: "212-555-9012",
        email: "riverside@cinemacity.com",
        website: "https://cinemacity.com/riverside",
        location: {
          type: "Point",
          coordinates: [-73.9509, 40.7623]
        },
        image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
        gallery: [
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
          "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
        ],
        amenities: ["4DX", "Premium Large Format", "Arcade", "Concessions", "Parking"],
        openingHours: {
          monday: "11:00 AM - 11:00 PM",
          tuesday: "11:00 AM - 11:00 PM",
          wednesday: "11:00 AM - 11:00 PM",
          thursday: "11:00 AM - 11:00 PM",
          friday: "11:00 AM - 12:00 AM",
          saturday: "10:00 AM - 12:00 AM",
          sunday: "10:00 AM - 11:00 PM"
        },
        isActive: true,
        featured: true,
        rooms: [
          {
            name: "4DX Experience",
            number: 1,
            capacity: 120,
            type: "4DX",
            features: ["4DX Motion Seats", "Environmental Effects", "3D Capability"],
            seatingLayout: {
              rows: 10,
              seatsPerRow: 12,
              aisleSeats: [6]
            },
            isActive: true
          },
          {
            name: "PLF Theater",
            number: 2,
            capacity: 200,
            type: "Premium Large Format",
            features: ["Oversized Screen", "Enhanced Sound", "Premium Seating"],
            seatingLayout: {
              rows: 10,
              seatsPerRow: 20,
              aisleSeats: [10]
            },
            isActive: true
          },
          {
            name: "Standard Theater 1",
            number: 3,
            capacity: 120,
            type: "Standard",
            features: ["Digital Projection", "Surround Sound", "Stadium Seating"],
            seatingLayout: {
              rows: 10,
              seatsPerRow: 12,
              aisleSeats: [6]
            },
            isActive: true
          },
          {
            name: "Standard Theater 2",
            number: 4,
            capacity: 120,
            type: "Standard",
            features: ["Digital Projection", "Surround Sound", "Stadium Seating"],
            seatingLayout: {
              rows: 10,
              seatsPerRow: 12,
              aisleSeats: [6]
            },
            isActive: true
          },
          {
            name: "Standard Theater 3",
            number: 5,
            capacity: 120,
            type: "Standard",
            features: ["Digital Projection", "Surround Sound", "Stadium Seating"],
            seatingLayout: {
              rows: 10,
              seatsPerRow: 12,
              aisleSeats: [6]
            },
            isActive: true
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert cinemas into the database
    const result = await mongoose.connection.db.collection('cinemas').insertMany(sampleCinemas);
    console.log(`Inserted ${result.insertedCount} cinemas`);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};
