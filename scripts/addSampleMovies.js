const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => {
    console.log('MongoDB Connected');
    // Run the main function after connection is established
    addSampleMovies();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Main function to add sample movies
const addSampleMovies = async () => {
  try {
    // Check if there are already movies in the database
    const movieCount = await mongoose.connection.db.collection('movies').countDocuments();
    console.log(`Found ${movieCount} movies in the database`);

    // If there are already movies, don't add more
    if (movieCount > 10) {
      console.log('Movies already exist in the database. Skipping sample data creation.');
      process.exit(0);
      return;
    }

    // Create sample movies
    const sampleMovies = [
      {
        title: "Dune: Part Two",
        slug: "dune-part-two",
        description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
        shortDescription: "Paul Atreides unites with the Fremen to seek revenge and prevent a terrible future.",
        releaseDate: new Date("2024-03-01"),
        endDate: new Date("2024-05-01"),
        duration: 166,
        trailer: "https://www.youtube.com/watch?v=Way9Dexny3w",
        poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/jZIYaISP3GBSrVOPfrp98AMa8Ng.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
          "https://image.tmdb.org/t/p/original/jZIYaISP3GBSrVOPfrp98AMa8Ng.jpg"
        ],
        genres: ["Action", "Adventure", "Sci-Fi"],
        cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
        director: "Denis Villeneuve",
        writer: "Jon Spaihts, Denis Villeneuve, Frank Herbert",
        language: "English",
        country: "United States",
        rating: 4.8,
        status: "Now Playing",
        featured: true,
        isActive: true,
        price: 12.99,
        ageRating: "PG-13",
        format: ["2D", "3D", "IMAX"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Godzilla x Kong: The New Empire",
        slug: "godzilla-x-kong-the-new-empire",
        description: "Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island's mysteries.",
        shortDescription: "Godzilla and Kong clash in an epic battle as humans unravel their origins.",
        releaseDate: new Date("2024-03-29"),
        endDate: new Date("2024-05-29"),
        duration: 115,
        trailer: "https://www.youtube.com/watch?v=odM92ap8_c0",
        poster: "https://image.tmdb.org/t/p/w500/kUsW0BnBwZpuTyIRYVcN3gUlIsA.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/mDeUmPe4MF35WWlAqj4QFX5UauJ.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/kUsW0BnBwZpuTyIRYVcN3gUlIsA.jpg",
          "https://image.tmdb.org/t/p/original/mDeUmPe4MF35WWlAqj4QFX5UauJ.jpg"
        ],
        genres: ["Action", "Adventure", "Sci-Fi"],
        cast: ["Rebecca Hall", "Brian Tyree Henry", "Dan Stevens", "Kaylee Hottle"],
        director: "Adam Wingard",
        writer: "Terry Rossio, Simon Barrett, Jeremy Slater",
        language: "English",
        country: "United States",
        rating: 4.5,
        status: "Now Playing",
        featured: true,
        isActive: true,
        price: 12.99,
        ageRating: "PG-13",
        format: ["2D", "3D", "IMAX"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Kung Fu Panda 4",
        slug: "kung-fu-panda-4",
        description: "Po is called upon to become the Spiritual Leader of the Valley of Peace. However, he needs to find and train a new Dragon Warrior while facing a new villain called the Chameleon.",
        shortDescription: "Po must find a new Dragon Warrior while facing a new villain.",
        releaseDate: new Date("2024-03-08"),
        endDate: new Date("2024-05-08"),
        duration: 94,
        trailer: "https://www.youtube.com/watch?v=_inKs4eeHiI",
        poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/7Bd4EUOqQDKZXA6Od5gkfnhQ7zu.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
          "https://image.tmdb.org/t/p/original/7Bd4EUOqQDKZXA6Od5gkfnhQ7zu.jpg"
        ],
        genres: ["Animation", "Action", "Adventure", "Comedy", "Family"],
        cast: ["Jack Black", "Awkwafina", "Viola Davis", "Bryan Cranston"],
        director: "Mike Mitchell",
        writer: "Jonathan Aibel, Glenn Berger",
        language: "English",
        country: "United States",
        rating: 4.3,
        status: "Now Playing",
        featured: false,
        isActive: true,
        price: 10.99,
        ageRating: "PG",
        format: ["2D", "3D"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Ghostbusters: Frozen Empire",
        slug: "ghostbusters-frozen-empire",
        description: "The Spengler family returns to where it all started – the iconic New York City firehouse – to team up with the original Ghostbusters, who've developed a top-secret research lab to take busting ghosts to the next level.",
        shortDescription: "The Spengler family teams up with the original Ghostbusters in New York City.",
        releaseDate: new Date("2024-03-22"),
        endDate: new Date("2024-05-22"),
        duration: 115,
        trailer: "https://www.youtube.com/watch?v=gN3KLL_hvLs",
        poster: "https://image.tmdb.org/t/p/w500/5MpUoQz67pzO1T3Isid0EwF9zxH.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/gg4zZoTggZmpAQ32qIrP5dtnkEZ.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/5MpUoQz67pzO1T3Isid0EwF9zxH.jpg",
          "https://image.tmdb.org/t/p/original/gg4zZoTggZmpAQ32qIrP5dtnkEZ.jpg"
        ],
        genres: ["Comedy", "Fantasy", "Adventure"],
        cast: ["Paul Rudd", "Carrie Coon", "Finn Wolfhard", "Mckenna Grace"],
        director: "Gil Kenan",
        writer: "Gil Kenan, Jason Reitman",
        language: "English",
        country: "United States",
        rating: 4.0,
        status: "Now Playing",
        featured: false,
        isActive: true,
        price: 11.99,
        ageRating: "PG-13",
        format: ["2D"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Furiosa: A Mad Max Saga",
        slug: "furiosa-a-mad-max-saga",
        description: "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus. Sweeping through the Wasteland, they come across the Citadel presided over by The Immortan Joe.",
        shortDescription: "The origin story of the fierce warrior Furiosa before she teamed up with Mad Max.",
        releaseDate: new Date("2024-05-24"),
        endDate: new Date("2024-07-24"),
        duration: 150,
        trailer: "https://www.youtube.com/watch?v=XdKzUbAiswE",
        poster: "https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/uLtVbjvS1O7cvnZPdSuN3nwVaiZ.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg",
          "https://image.tmdb.org/t/p/original/uLtVbjvS1O7cvnZPdSuN3nwVaiZ.jpg"
        ],
        genres: ["Action", "Adventure", "Sci-Fi"],
        cast: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke", "Yahya Abdul-Mateen II"],
        director: "George Miller",
        writer: "George Miller, Nico Lathouris",
        language: "English",
        country: "Australia",
        rating: 4.7,
        status: "Coming Soon",
        featured: true,
        isActive: true,
        price: 14.99,
        ageRating: "R",
        format: ["2D", "IMAX"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Kingdom of the Planet of the Apes",
        slug: "kingdom-of-the-planet-of-the-apes",
        description: "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught about the past and make choices that will define a future for apes and humans alike.",
        shortDescription: "A young ape's journey challenges everything he knows about apes and humans.",
        releaseDate: new Date("2024-05-10"),
        endDate: new Date("2024-07-10"),
        duration: 145,
        trailer: "https://www.youtube.com/watch?v=6V-5mJxrCd8",
        poster: "https://image.tmdb.org/t/p/w500/5uDfS0sQbVqHQgYZWt5Y9qnFrD7.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/mDeUmPe4MF35WWlAqj4QFX5UauJ.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/5uDfS0sQbVqHQgYZWt5Y9qnFrD7.jpg",
          "https://image.tmdb.org/t/p/original/mDeUmPe4MF35WWlAqj4QFX5UauJ.jpg"
        ],
        genres: ["Action", "Adventure", "Sci-Fi"],
        cast: ["Owen Teague", "Freya Allan", "Kevin Durand", "Peter Macon"],
        director: "Wes Ball",
        writer: "Josh Friedman, Rick Jaffa, Amanda Silver",
        language: "English",
        country: "United States",
        rating: 4.5,
        status: "Coming Soon",
        featured: true,
        isActive: true,
        price: 13.99,
        ageRating: "PG-13",
        format: ["2D", "3D", "IMAX"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Inside Out 2",
        slug: "inside-out-2",
        description: "Follow Riley in her teenage years as new emotions join the mix, including Anxiety, Envy, Ennui, and Embarrassment, causing chaos in Headquarters.",
        shortDescription: "Riley's teenage years bring new emotions to Headquarters.",
        releaseDate: new Date("2024-06-14"),
        endDate: new Date("2024-08-14"),
        duration: 110,
        trailer: "https://www.youtube.com/watch?v=VrQu-NHQqK4",
        poster: "https://image.tmdb.org/t/p/w500/4KHchYHMB3zJsIUJkWzmsGyd9jE.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/aQPeznSu7XDr9Tp5SsHHPuqzl9J.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/4KHchYHMB3zJsIUJkWzmsGyd9jE.jpg",
          "https://image.tmdb.org/t/p/original/aQPeznSu7XDr9Tp5SsHHPuqzl9J.jpg"
        ],
        genres: ["Animation", "Adventure", "Comedy", "Family"],
        cast: ["Amy Poehler", "Phyllis Smith", "Lewis Black", "Maya Hawke"],
        director: "Kelsey Mann",
        writer: "Meg LeFauve, Dave Holstein",
        language: "English",
        country: "United States",
        rating: 4.6,
        status: "Coming Soon",
        featured: false,
        isActive: true,
        price: 11.99,
        ageRating: "PG",
        format: ["2D", "3D"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Deadpool & Wolverine",
        slug: "deadpool-and-wolverine",
        description: "Deadpool teams up with Wolverine for an adventure that will change both of their lives forever, as they navigate the multiverse and face threats from across time and space.",
        shortDescription: "Deadpool and Wolverine team up for a multiverse adventure.",
        releaseDate: new Date("2024-07-26"),
        endDate: new Date("2024-09-26"),
        duration: 135,
        trailer: "https://www.youtube.com/watch?v=Yd47Z8HYf0Y",
        poster: "https://image.tmdb.org/t/p/w500/bkpPTZUdq31UGDovmszsg2CchiI.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/yQvjqIvOwpawVZje41Wno2RR0Ui.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/bkpPTZUdq31UGDovmszsg2CchiI.jpg",
          "https://image.tmdb.org/t/p/original/yQvjqIvOwpawVZje41Wno2RR0Ui.jpg"
        ],
        genres: ["Action", "Comedy", "Adventure", "Sci-Fi"],
        cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Morena Baccarin"],
        director: "Shawn Levy",
        writer: "Rhett Reese, Paul Wernick, Ryan Reynolds",
        language: "English",
        country: "United States",
        rating: 4.9,
        status: "Coming Soon",
        featured: true,
        isActive: true,
        price: 14.99,
        ageRating: "R",
        format: ["2D", "IMAX"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Alien: Romulus",
        slug: "alien-romulus",
        description: "A group of young space colonizers come face to face with the most terrifying life form in the universe while scavenging the deep ends of a derelict space station.",
        shortDescription: "Young space colonizers face the most terrifying life form in the universe.",
        releaseDate: new Date("2024-08-16"),
        endDate: new Date("2024-10-16"),
        duration: 125,
        trailer: "https://www.youtube.com/watch?v=osC8RbQ0_1U",
        poster: "https://image.tmdb.org/t/p/w500/dCIzxdQS4AT7vUQGmxTz3CQmCl1.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/uULxWb5CKGBh7jYnBXv0WFLaZmC.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/dCIzxdQS4AT7vUQGmxTz3CQmCl1.jpg",
          "https://image.tmdb.org/t/p/original/uULxWb5CKGBh7jYnBXv0WFLaZmC.jpg"
        ],
        genres: ["Horror", "Sci-Fi", "Thriller"],
        cast: ["Cailee Spaeny", "David Jonsson", "Archie Renaux", "Isabela Merced"],
        director: "Fede Alvarez",
        writer: "Fede Alvarez, Rodo Sayagues",
        language: "English",
        country: "United States",
        rating: 4.4,
        status: "Coming Soon",
        featured: false,
        isActive: true,
        price: 13.99,
        ageRating: "R",
        format: ["2D", "IMAX"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Joker: Folie à Deux",
        slug: "joker-folie-a-deux",
        description: "Arthur Fleck, now institutionalized at Arkham, finds an unexpected connection with another inmate, as his Joker persona continues to influence Gotham City.",
        shortDescription: "Arthur Fleck finds an unexpected connection while institutionalized at Arkham.",
        releaseDate: new Date("2024-10-04"),
        endDate: new Date("2024-12-04"),
        duration: 140,
        trailer: "https://www.youtube.com/watch?v=03ymBj144ng",
        poster: "https://image.tmdb.org/t/p/w500/gTFGr8q5YzYYiRyDYaEBF2DAXqn.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/nxmfH8Kho4Wp0hLkwcxWLQkJbZz.jpg",
        images: [
          "https://image.tmdb.org/t/p/w500/gTFGr8q5YzYYiRyDYaEBF2DAXqn.jpg",
          "https://image.tmdb.org/t/p/original/nxmfH8Kho4Wp0hLkwcxWLQkJbZz.jpg"
        ],
        genres: ["Crime", "Drama", "Thriller", "Musical"],
        cast: ["Joaquin Phoenix", "Lady Gaga", "Zazie Beetz", "Brendan Gleeson"],
        director: "Todd Phillips",
        writer: "Todd Phillips, Scott Silver",
        language: "English",
        country: "United States",
        rating: 4.7,
        status: "Coming Soon",
        featured: true,
        isActive: true,
        price: 14.99,
        ageRating: "R",
        format: ["2D"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert movies into the database
    const result = await mongoose.connection.db.collection('movies').insertMany(sampleMovies);
    console.log(`Inserted ${result.insertedCount} movies`);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};
