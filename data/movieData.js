const movieData = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseDate: '2010-07-16',
    duration: 148,
    genre: ['Action', 'Adventure', 'Sci-Fi', 'Thriller'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Christopher Nolan',
    cast: [
      {
        name: 'Leonardo DiCaprio',
        character: 'Cobb',
        photo: 'https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
        order: 1
      },
      {
        name: 'Joseph Gordon-Levitt',
        character: 'Arthur',
        photo: 'https://image.tmdb.org/t/p/w500/zSuJ3r5zr5T26tTxyygH3Qe4eYG.jpg',
        order: 2
      },
      {
        name: 'Ellen Page',
        character: 'Ariadne',
        photo: 'https://image.tmdb.org/t/p/w500/vDZQzFxKNZ4DsEPwQx5dHlpQW1Z.jpg',
        order: 3
      },
      {
        name: 'Tom Hardy',
        character: 'Eames',
        photo: 'https://image.tmdb.org/t/p/w500/yVGF9FvDxTDPhGimTbZNfghpllA.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    rating: 8.8,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Inception', 'Christopher Nolan', 'Leonardo DiCaprio', 'Dream Heist'],
    mpaaRating: 'PG-13',
    language: 'English',
    country: 'USA',
    awards: 'Won 4 Oscars. 157 wins & 220 nominations total',
    boxOffice: 836800000,
    status: 'Now Playing'
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    releaseDate: '1994-10-14',
    duration: 142,
    genre: ['Drama'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Frank Darabont',
    cast: [
      {
        name: 'Tim Robbins',
        character: 'Andy Dufresne',
        photo: 'https://image.tmdb.org/t/p/w500/A4fMRuZDlb5zCWGGNYr3vRYdQm3.jpg',
        order: 1
      },
      {
        name: 'Morgan Freeman',
        character: 'Ellis Boyd "Red" Redding',
        photo: 'https://image.tmdb.org/t/p/w500/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg',
        order: 2
      },
      {
        name: 'Bob Gunton',
        character: 'Warden Norton',
        photo: 'https://image.tmdb.org/t/p/w500/bOlYWhVW8uzmfGhrnPFTerMpFqy.jpg',
        order: 3
      },
      {
        name: 'William Sadler',
        character: 'Heywood',
        photo: 'https://image.tmdb.org/t/p/w500/8ks6QUzWDfQ9SZU5Xm3yjvGYVjL.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    rating: 9.3,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Shawshank Redemption', 'Stephen King', 'Morgan Freeman', 'Prison'],
    mpaaRating: 'R',
    language: 'English',
    country: 'USA',
    awards: 'Nominated for 7 Oscars. 21 wins & 43 nominations total',
    boxOffice: 28341469,
    status: 'Now Playing'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseDate: '2008-07-18',
    duration: 152,
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Christopher Nolan',
    cast: [
      {
        name: 'Christian Bale',
        character: 'Bruce Wayne / Batman',
        photo: 'https://image.tmdb.org/t/p/w500/qCpZn2e3dimwbryLnqxZuI88PTi.jpg',
        order: 1
      },
      {
        name: 'Heath Ledger',
        character: 'Joker',
        photo: 'https://image.tmdb.org/t/p/w500/5Y9HnYYa9jF4NunY9lSgJGjSe8Z.jpg',
        order: 2
      },
      {
        name: 'Aaron Eckhart',
        character: 'Harvey Dent',
        photo: 'https://image.tmdb.org/t/p/w500/rQxaU0eAzAJTTDgHfJ4UNdQjLPu.jpg',
        order: 3
      },
      {
        name: 'Michael Caine',
        character: 'Alfred',
        photo: 'https://image.tmdb.org/t/p/w500/hZruclwEPCKw3e83rnQenC9spzB.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    rating: 9.0,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Dark Knight', 'Batman', 'Joker', 'Christopher Nolan', 'Heath Ledger'],
    mpaaRating: 'PG-13',
    language: 'English',
    country: 'USA',
    awards: 'Won 2 Oscars. 159 wins & 163 nominations total',
    boxOffice: 1005973645,
    status: 'Now Playing'
  },
  {
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    releaseDate: '2019-11-08',
    duration: 132,
    genre: ['Comedy', 'Drama', 'Thriller'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Bong Joon-ho',
    cast: [
      {
        name: 'Song Kang-ho',
        character: 'Kim Ki-taek',
        photo: 'https://image.tmdb.org/t/p/w500/eKiSMUSQkLKPvwrRDiucIyMXCW4.jpg',
        order: 1
      },
      {
        name: 'Lee Sun-kyun',
        character: 'Park Dong-ik',
        photo: 'https://image.tmdb.org/t/p/w500/dOl3PgaEfSHqyW5dYEjXNyySTcZ.jpg',
        order: 2
      },
      {
        name: 'Cho Yeo-jeong',
        character: 'Park Yeon-kyo',
        photo: 'https://image.tmdb.org/t/p/w500/kyzuQTJ3pCl4VOCFUQkYvJ7KJxn.jpg',
        order: 3
      },
      {
        name: 'Choi Woo-shik',
        character: 'Kim Ki-woo',
        photo: 'https://image.tmdb.org/t/p/w500/uVEJPEGBEQJ4lG8Qy7oEs9QhTX6.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
    trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    rating: 8.6,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Parasite', 'Bong Joon-ho', 'Korean Film', 'Social Thriller'],
    mpaaRating: 'R',
    language: 'Korean',
    country: 'South Korea',
    awards: 'Won 4 Oscars. 306 wins & 271 nominations total',
    boxOffice: 258773556,
    status: 'Now Playing'
  },
  {
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    releaseDate: '2019-04-26',
    duration: 181,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Anthony Russo, Joe Russo',
    cast: [
      {
        name: 'Robert Downey Jr.',
        character: 'Tony Stark / Iron Man',
        photo: 'https://image.tmdb.org/t/p/w500/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg',
        order: 1
      },
      {
        name: 'Chris Evans',
        character: 'Steve Rogers / Captain America',
        photo: 'https://image.tmdb.org/t/p/w500/3bOGNsHlrswhyW79uvIHH1V43JI.jpg',
        order: 2
      },
      {
        name: 'Mark Ruffalo',
        character: 'Bruce Banner / Hulk',
        photo: 'https://image.tmdb.org/t/p/w500/z3dvKqMNDQWk3QLxzumloQVR0pv.jpg',
        order: 3
      },
      {
        name: 'Chris Hemsworth',
        character: 'Thor',
        photo: 'https://image.tmdb.org/t/p/w500/xkHHiKUQIIk3gqzXyL04VhHEpK5.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    rating: 8.4,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Avengers', 'Endgame', 'Marvel', 'Superhero', 'Iron Man', 'Captain America'],
    mpaaRating: 'PG-13',
    language: 'English',
    country: 'USA',
    awards: 'Nominated for 1 Oscar. 70 wins & 131 nominations total',
    boxOffice: 2797800564,
    status: 'Now Playing'
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    releaseDate: '1972-03-24',
    duration: 175,
    genre: ['Crime', 'Drama'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Francis Ford Coppola',
    cast: [
      {
        name: 'Marlon Brando',
        character: 'Don Vito Corleone',
        photo: 'https://image.tmdb.org/t/p/w500/fuTEPMsBtV1zE98ujPONbKiYDc2.jpg',
        order: 1
      },
      {
        name: 'Al Pacino',
        character: 'Michael Corleone',
        photo: 'https://image.tmdb.org/t/p/w500/9TzJ2CX9KUYrYVEuX3zPBTLKMdW.jpg',
        order: 2
      },
      {
        name: 'James Caan',
        character: 'Sonny Corleone',
        photo: 'https://image.tmdb.org/t/p/w500/fIjLS6RAafEUOeReG5Z82kMwYJq.jpg',
        order: 3
      },
      {
        name: 'Robert Duvall',
        character: 'Tom Hagen',
        photo: 'https://image.tmdb.org/t/p/w500/1aBC7NxPy10ofng7mHKWOOZl3zX.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    trailer: 'https://www.youtube.com/watch?v=sY1S34973zA',
    rating: 9.2,
    isActive: true,
    isFeatured: false,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Godfather', 'Mafia', 'Francis Ford Coppola', 'Marlon Brando', 'Al Pacino'],
    mpaaRating: 'R',
    language: 'English',
    country: 'USA',
    awards: 'Won 3 Oscars. 31 wins & 30 nominations total',
    boxOffice: 246120986,
    status: 'Now Playing'
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    releaseDate: '1994-10-14',
    duration: 154,
    genre: ['Crime', 'Drama'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Quentin Tarantino',
    cast: [
      {
        name: 'John Travolta',
        character: 'Vincent Vega',
        photo: 'https://image.tmdb.org/t/p/w500/ns8uZHmXFS56gzRq7wT3bcjjUfH.jpg',
        order: 1
      },
      {
        name: 'Samuel L. Jackson',
        character: 'Jules Winnfield',
        photo: 'https://image.tmdb.org/t/p/w500/nCJJ3NVksYNxIzEHcyC1XziwPVj.jpg',
        order: 2
      },
      {
        name: 'Uma Thurman',
        character: 'Mia Wallace',
        photo: 'https://image.tmdb.org/t/p/w500/6KxiEWyIDpz1ikmD7nv3GTX4Uoj.jpg',
        order: 3
      },
      {
        name: 'Bruce Willis',
        character: 'Butch Coolidge',
        photo: 'https://image.tmdb.org/t/p/w500/A1KJdQ7x4jRwU6z0NWIV7Kk77jr.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    trailer: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    rating: 8.9,
    isActive: true,
    isFeatured: false,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Pulp Fiction', 'Quentin Tarantino', 'John Travolta', 'Samuel L. Jackson', 'Uma Thurman'],
    mpaaRating: 'R',
    language: 'English',
    country: 'USA',
    awards: 'Won 1 Oscar. 70 wins & 75 nominations total',
    boxOffice: 213928762,
    status: 'Now Playing'
  },
  {
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    releaseDate: '1999-03-31',
    duration: 136,
    genre: ['Action', 'Sci-Fi'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Lana Wachowski, Lilly Wachowski',
    cast: [
      {
        name: 'Keanu Reeves',
        character: 'Neo',
        photo: 'https://image.tmdb.org/t/p/w500/rRdru6REr9i3WIHv2mntpcgxnoY.jpg',
        order: 1
      },
      {
        name: 'Laurence Fishburne',
        character: 'Morpheus',
        photo: 'https://image.tmdb.org/t/p/w500/8NhA6VrpZZcJVEgmNiU5UmQXVsj.jpg',
        order: 2
      },
      {
        name: 'Carrie-Anne Moss',
        character: 'Trinity',
        photo: 'https://image.tmdb.org/t/p/w500/xD4jTA3KmVp5Rq3aHcymL9DUGjD.jpg',
        order: 3
      },
      {
        name: 'Hugo Weaving',
        character: 'Agent Smith',
        photo: 'https://image.tmdb.org/t/p/w500/wh4OzCCDJ1GbULHdrJ2qIiP8TJu.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
    trailer: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    rating: 8.7,
    isActive: true,
    isFeatured: false,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Matrix', 'Wachowski', 'Keanu Reeves', 'Sci-Fi', 'Action'],
    mpaaRating: 'R',
    language: 'English',
    country: 'USA',
    awards: 'Won 4 Oscars. 42 wins & 51 nominations total',
    boxOffice: 466364682,
    status: 'Now Playing'
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    releaseDate: '2014-11-07',
    duration: 169,
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Christopher Nolan',
    cast: [
      {
        name: 'Matthew McConaughey',
        character: 'Cooper',
        photo: 'https://image.tmdb.org/t/p/w500/e9ZHRY5toiL8EQ1RFcGxzBZFPgY.jpg',
        order: 1
      },
      {
        name: 'Anne Hathaway',
        character: 'Brand',
        photo: 'https://image.tmdb.org/t/p/w500/tLelKoPNiyJCSEtQTz1FGv4TLGc.jpg',
        order: 2
      },
      {
        name: 'Jessica Chastain',
        character: 'Murph',
        photo: 'https://image.tmdb.org/t/p/w500/lodMzLKSdrPcBry6TdoDsMN3Vge.jpg',
        order: 3
      },
      {
        name: 'Michael Caine',
        character: 'Professor Brand',
        photo: 'https://image.tmdb.org/t/p/w500/hZruclwEPCKw3e83rnQenC9spzB.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    rating: 8.6,
    isActive: true,
    isFeatured: false,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Interstellar', 'Christopher Nolan', 'Matthew McConaughey', 'Space', 'Time Travel'],
    mpaaRating: 'PG-13',
    language: 'English',
    country: 'USA',
    awards: 'Won 1 Oscar. 44 wins & 148 nominations total',
    boxOffice: 701729206,
    status: 'Now Playing'
  },
  {
    title: 'Dune',
    description: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
    releaseDate: '2021-10-22',
    duration: 155,
    genre: ['Adventure', 'Sci-Fi'],
    genres: [], // Will be populated with actual genre IDs
    director: null, // Will be populated with actual director ID
    directorName: 'Denis Villeneuve',
    cast: [
      {
        name: 'Timothée Chalamet',
        character: 'Paul Atreides',
        photo: 'https://image.tmdb.org/t/p/w500/BE2sdjpgsa2rNTFa66f7upkaOP.jpg',
        order: 1
      },
      {
        name: 'Rebecca Ferguson',
        character: 'Lady Jessica',
        photo: 'https://image.tmdb.org/t/p/w500/lJloTOheuQSirSLJQgA4F1R6kJi.jpg',
        order: 2
      },
      {
        name: 'Oscar Isaac',
        character: 'Duke Leto Atreides',
        photo: 'https://image.tmdb.org/t/p/w500/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg',
        order: 3
      },
      {
        name: 'Zendaya',
        character: 'Chani',
        photo: 'https://image.tmdb.org/t/p/w500/r3A7ev7QkjOGocVn3kQrJ0eOouk.jpg',
        order: 4
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg',
    trailer: 'https://www.youtube.com/watch?v=8g18jFHCLXk',
    rating: 8.0,
    isActive: true,
    isFeatured: true,
    tags: [], // Will be populated with actual tag IDs
    metaKeywords: ['Dune', 'Denis Villeneuve', 'Timothée Chalamet', 'Sci-Fi', 'Adaptation'],
    mpaaRating: 'PG-13',
    language: 'English',
    country: 'USA',
    awards: 'Won 6 Oscars. 171 wins & 281 nominations total',
    boxOffice: 401847042,
    status: 'Coming Soon'
  }
];

module.exports = movieData;
