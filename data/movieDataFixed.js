const movieData = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    storyLine: 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb\'s rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible, inception.',
    releaseDate: '2010-07-16',
    duration: 148,
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Christopher Nolan',
    writer: 'Christopher Nolan',
    writers: ['Christopher Nolan'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/inception-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    trailerThumbnail: 'https://example.com/movies/inception-trailer-thumbnail.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 8.8,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    isFeatured: true,
    reviewCount: 245,
    totalRating: 2156,
    images: [
      'https://example.com/movies/inception-1.jpg',
      'https://example.com/movies/inception-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    storyLine: 'Andy Dufresne, a successful banker, is arrested for the murders of his wife and her lover, and is sentenced to life imprisonment at the Shawshank prison. He becomes the most unconventional prisoner.',
    releaseDate: '1994-10-14',
    duration: 142,
    genre: ['Drama', 'Crime'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Frank Darabont',
    writer: 'Frank Darabont',
    writers: ['Frank Darabont', 'Stephen King'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/shawshank-redemption-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    trailerThumbnail: 'https://example.com/movies/shawshank-redemption-trailer-thumbnail.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 9.3,
    language: 'English',
    country: 'USA',
    ageRating: 'R',
    isActive: true,
    isFeatured: true,
    reviewCount: 320,
    totalRating: 2976,
    images: [
      'https://example.com/movies/shawshank-redemption-1.jpg',
      'https://example.com/movies/shawshank-redemption-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    storyLine: 'With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman has been able to keep a tight lid on crime in Gotham City. But when a vile young criminal calling himself the Joker suddenly throws the town into chaos, the caped Crusader begins to tread a fine line between heroism and vigilantism.',
    releaseDate: '2008-07-18',
    duration: 152,
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Christopher Nolan',
    writer: 'Christopher Nolan',
    writers: ['Christopher Nolan', 'Jonathan Nolan', 'David S. Goyer'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/dark-knight-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    trailerThumbnail: 'https://example.com/movies/dark-knight-trailer-thumbnail.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 9.0,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    isFeatured: true,
    reviewCount: 280,
    totalRating: 2520,
    images: [
      'https://example.com/movies/dark-knight-1.jpg',
      'https://example.com/movies/dark-knight-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  },
  {
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    storyLine: 'The struggling Kim family sees an opportunity when the son starts working for the wealthy Park family. Soon, all of them find a way to work within the same household and start living a parasitic life.',
    releaseDate: '2019-11-08',
    duration: 132,
    genre: ['Comedy', 'Drama', 'Thriller'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Bong Joon-ho',
    writer: 'Bong Joon-ho',
    writers: ['Bong Joon-ho', 'Han Jin-won'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/parasite-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    trailerThumbnail: 'https://example.com/movies/parasite-trailer-thumbnail.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 8.6,
    language: 'English',
    country: 'South Korea',
    ageRating: 'R',
    isActive: true,
    isFeatured: true,
    reviewCount: 210,
    totalRating: 1806,
    images: [
      'https://example.com/movies/parasite-1.jpg',
      'https://example.com/movies/parasite-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  },
  {
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    storyLine: 'After half of all life is snapped away by Thanos, the Avengers are left scattered and divided. Now with a way to reverse the damage, the Avengers and their allies must assemble once more and learn to put differences aside in order to work together and set things right.',
    releaseDate: '2019-04-26',
    duration: 181,
    genre: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Anthony Russo, Joe Russo',
    writer: 'Christopher Markus',
    writers: ['Christopher Markus', 'Stephen McFeely'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/avengers-endgame-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    trailerThumbnail: 'https://example.com/movies/avengers-endgame-trailer-thumbnail.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 8.4,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    isFeatured: true,
    reviewCount: 350,
    totalRating: 2940,
    images: [
      'https://example.com/movies/avengers-endgame-1.jpg',
      'https://example.com/movies/avengers-endgame-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    storyLine: 'The story begins as Don Vito Corleone, the head of a New York Mafia family, oversees his daughter\'s wedding. His beloved son Michael has just come home from the war, but does not intend to become part of his father\'s business. Through Michael\'s life the nature of the family business becomes clear. The business of the family is just like the head of the family, kind and benevolent to those who give respect, but given to ruthless violence whenever anything stands against the good of the family.',
    releaseDate: '1972-03-24',
    duration: 175,
    genre: ['Crime', 'Drama'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Francis Ford Coppola',
    writer: 'Mario Puzo',
    writers: ['Mario Puzo', 'Francis Ford Coppola'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/godfather-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=sY1S34973zA',
    trailerThumbnail: 'https://example.com/movies/godfather-trailer-thumbnail.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 9.2,
    language: 'English',
    country: 'USA',
    ageRating: 'R',
    isActive: true,
    isFeatured: false,
    reviewCount: 290,
    totalRating: 2668,
    images: [
      'https://example.com/movies/godfather-1.jpg',
      'https://example.com/movies/godfather-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    storyLine: 'Jules Winnfield and Vincent Vega are two hitmen who are out to retrieve a suitcase stolen from their employer, mob boss Marsellus Wallace. Wallace has also asked Vincent to take his wife Mia out a few days later when Wallace himself will be out of town. Butch Coolidge is an aging boxer who is paid by Wallace to lose his next fight. The lives of these seemingly unrelated people are woven together comprising of a series of funny, bizarre and uncalled-for incidents.',
    releaseDate: '1994-10-14',
    duration: 154,
    genre: ['Crime', 'Drama'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Quentin Tarantino',
    writer: 'Quentin Tarantino',
    writers: ['Quentin Tarantino', 'Roger Avary'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/pulp-fiction-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    trailerThumbnail: 'https://example.com/movies/pulp-fiction-trailer-thumbnail.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 8.9,
    language: 'English',
    country: 'USA',
    ageRating: 'R',
    isActive: true,
    isFeatured: false,
    reviewCount: 270,
    totalRating: 2403,
    images: [
      'https://example.com/movies/pulp-fiction-1.jpg',
      'https://example.com/movies/pulp-fiction-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  },
  {
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    storyLine: 'Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination. Neo finds himself targeted by the police when he is contacted by Morpheus, a legendary computer hacker branded a terrorist by the government. Morpheus awakens Neo to the real world, a ravaged wasteland where most of humanity have been captured by a race of machines that live off of the humans\' body heat and electrochemical energy and who imprison their minds within an artificial reality known as the Matrix. As a rebel against the machines, Neo must return to the Matrix and confront the agents: super-powerful computer programs devoted to snuffing out Neo and the entire human rebellion.',
    releaseDate: '1999-03-31',
    duration: 136,
    genre: ['Action', 'Sci-Fi'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Lana Wachowski, Lilly Wachowski',
    writer: 'Lana Wachowski',
    writers: ['Lana Wachowski', 'Lilly Wachowski'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/matrix-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    trailerThumbnail: 'https://example.com/movies/matrix-trailer-thumbnail.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 8.7,
    language: 'English',
    country: 'USA',
    ageRating: 'R',
    isActive: true,
    isFeatured: false,
    reviewCount: 260,
    totalRating: 2262,
    images: [
      'https://example.com/movies/matrix-1.jpg',
      'https://example.com/movies/matrix-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    storyLine: 'Earth\'s future has been riddled by disasters, famines, and droughts. There is only one way to ensure mankind\'s survival: Interstellar travel. A newly discovered wormhole in the far reaches of our solar system allows a team of astronauts to go where no man has gone before, a planet that may have the right environment to sustain human life.',
    releaseDate: '2014-11-07',
    duration: 169,
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Christopher Nolan',
    writer: 'Christopher Nolan',
    writers: ['Christopher Nolan', 'Jonathan Nolan'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/interstellar-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    trailerThumbnail: 'https://example.com/movies/interstellar-trailer-thumbnail.jpg',
    status: 'Now Playing',
    displayStatus: 'In theater',
    rating: 8.6,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    isFeatured: false,
    reviewCount: 240,
    totalRating: 2064,
    images: [
      'https://example.com/movies/interstellar-1.jpg',
      'https://example.com/movies/interstellar-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  },
  {
    title: 'Dune',
    description: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
    storyLine: 'A mythic and emotionally charged hero\'s journey, "Dune" tells the story of Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, who must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet\'s exclusive supply of the most precious resource in existence-a commodity capable of unlocking humanity\'s greatest potential-only those who can conquer their fear will survive.',
    releaseDate: '2021-10-22',
    duration: 155,
    genre: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Denis Villeneuve',
    writer: 'Jon Spaihts',
    writers: ['Jon Spaihts', 'Denis Villeneuve', 'Eric Roth'],
    cast: [], // Will be populated with actual actor IDs
    poster: 'https://example.com/movies/dune-poster.jpg',
    trailer: 'https://www.youtube.com/watch?v=8g18jFHCLXk',
    trailerThumbnail: 'https://example.com/movies/dune-trailer-thumbnail.jpg',
    status: 'Coming Soon',
    displayStatus: 'Coming soon',
    rating: 8.0,
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13',
    isActive: true,
    isFeatured: true,
    reviewCount: 220,
    totalRating: 1760,
    images: [
      'https://example.com/movies/dune-1.jpg',
      'https://example.com/movies/dune-2.jpg'
    ],
    tags: [] // Will be populated with actual tag IDs
  }
];

module.exports = movieData;
