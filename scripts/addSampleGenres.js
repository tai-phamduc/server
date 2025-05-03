const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => {
    console.log('MongoDB Connected');
    // Run the main function after connection is established
    addSampleGenres();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Main function to add sample genres
const addSampleGenres = async () => {
  try {
    // Check if there are already genres in the database
    const genreCount = await mongoose.connection.db.collection('genres').countDocuments();
    console.log(`Found ${genreCount} genres in the database`);

    // If there are already genres, don't add more
    if (genreCount > 5) {
      console.log('Genres already exist in the database. Skipping sample data creation.');
      process.exit(0);
      return;
    }

    // Create sample genres
    const sampleGenres = [
      {
        name: "Action",
        slug: "action",
        description: "Action films are characterized by high energy, big-budget physical stunts and chases, possibly with rescues, battles, fights, escapes, destructive crises, and non-stop motion.",
        image: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Adventure",
        slug: "adventure",
        description: "Adventure films are exciting stories, with new experiences or exotic locales, often closely related to the action film genre.",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Animation",
        slug: "animation",
        description: "Animation is a method in which pictures are manipulated to appear as moving images. Often aimed at children, they can be enjoyed by all ages.",
        image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Comedy",
        slug: "comedy",
        description: "Comedy films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.",
        image: "https://images.unsplash.com/photo-1543584756-31dc82a0f83b",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Crime",
        slug: "crime",
        description: "Crime films focus on the sinister actions of criminals or mobsters, particularly bankrobbers, underworld figures, or ruthless hoodlums.",
        image: "https://images.unsplash.com/photo-1453873623425-04e3561289aa",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Documentary",
        slug: "documentary",
        description: "Documentary films are non-fictional motion pictures intended to document reality, primarily for the purposes of instruction, education, or maintaining a historical record.",
        image: "https://images.unsplash.com/photo-1527443195645-1133f7f28990",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Drama",
        slug: "drama",
        description: "Drama films are serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature.",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Family",
        slug: "family",
        description: "Family films are made for a wider audience, with content generally suitable for all age groups and families.",
        image: "https://images.unsplash.com/photo-1478071735433-5d8f9a54c5c8",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Fantasy",
        slug: "fantasy",
        description: "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "History",
        slug: "history",
        description: "Historical films are based upon historical events and famous people. Some historical dramas are documentaries, but many are based on written fiction that is rewritten by screenwriters.",
        image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Horror",
        slug: "horror",
        description: "Horror films are designed to frighten and to invoke our hidden worst fears, often in a terrifying, shocking finale, while captivating and entertaining us at the same time.",
        image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Music",
        slug: "music",
        description: "Music films are focused on music and musicians, such as documentaries, biopics, concert films, and musicals.",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Mystery",
        slug: "mystery",
        description: "Mystery films are a genre of film that revolves around the solution of a problem or a crime. They focus on the efforts of the detective, private investigator or amateur sleuth to solve the mysterious circumstances.",
        image: "https://images.unsplash.com/photo-1588497859490-85d1c17db96d",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Romance",
        slug: "romance",
        description: "Romance films are romantic love stories recorded in visual media for broadcast in theaters and on TV that focus on passion, emotion, and the affectionate romantic involvement of the main characters.",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Science Fiction",
        slug: "sci-fi",
        description: "Science fiction films are films that use speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, alien worlds, extrasensory perception and time travel.",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Thriller",
        slug: "thriller",
        description: "Thriller films are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety.",
        image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "War",
        slug: "war",
        description: "War films are concerned with warfare, typically about naval, air, or land battles, with combat scenes central to the drama.",
        image: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Western",
        slug: "western",
        description: "Western films are those set in the American West that embody the spirit, the struggle, and the demise of the new frontier.",
        image: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert genres into the database
    const result = await mongoose.connection.db.collection('genres').insertMany(sampleGenres);
    console.log(`Inserted ${result.insertedCount} genres`);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};
