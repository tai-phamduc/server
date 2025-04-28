const reviewData = [
  {
    movie: null, // Will be populated with actual movie ID (Inception)
    user: null, // Will be populated with actual user ID
    reviewType: 'movie',
    rating: 5,
    title: 'A Mind-Bending Masterpiece',
    comment: 'Christopher Nolan\'s "Inception" is a stunning achievement in filmmaking. The concept is brilliantly executed, with layers of dreams within dreams creating a puzzle that keeps you engaged throughout. The visual effects are spectacular, especially considering how many were done practically rather than with CGI. Leonardo DiCaprio delivers a powerful performance as a man haunted by his past. The supporting cast is equally strong, particularly Marion Cotillard as his wife. Hans Zimmer\'s score perfectly complements the tension and emotion of the story. This is a film that rewards multiple viewings and continues to spark discussion about its ambiguous ending. A true modern classic.',
    isApproved: true,
    isVerified: true,
    isPublished: true,
    publishDate: new Date('2023-01-15T14:30:00.000Z'),
    displayDate: 'January 15, 2023',
    likes: 245,
    dislikes: 12,
    likedBy: [], // Will be populated with random user IDs
    dislikedBy: [], // Will be populated with random user IDs
    isEdited: false,
    spoiler: false,
    watchedInTheater: true,
    watchDate: new Date('2023-01-10T00:00:00.000Z'),
    images: [],
    tags: ['Masterpiece', 'Mind-Bending', 'Visual Effects'],
    featured: true
  },
  {
    movie: null, // Will be populated with actual movie ID (Inception)
    user: null, // Will be populated with actual user ID
    reviewType: 'movie',
    rating: 4,
    title: 'Complex but Rewarding',
    comment: 'Inception requires your full attention, but it\'s worth the mental effort. The dream-within-a-dream concept could have been confusing, but Nolan guides the audience through the layers with skill. The action sequences are thrilling, especially the zero-gravity hotel corridor fight. My only criticism is that some of the exposition feels heavy-handed, with characters explaining the rules of the dreamworld a bit too explicitly. Still, the emotional core of DiCaprio\'s character seeking redemption grounds the high-concept premise in something relatable. The ending is perfectly ambiguous, leaving you to draw your own conclusions. Visually stunning and intellectually stimulating.',
    isApproved: true,
    isVerified: true,
    isPublished: true,
    publishDate: new Date('2023-02-03T09:45:00.000Z'),
    displayDate: 'February 3, 2023',
    likes: 187,
    dislikes: 23,
    likedBy: [], // Will be populated with random user IDs
    dislikedBy: [], // Will be populated with random user IDs
    isEdited: false,
    spoiler: false,
    watchedInTheater: true,
    watchDate: new Date('2023-01-28T00:00:00.000Z'),
    images: [],
    tags: ['Complex', 'Action', 'Ambiguous Ending'],
    featured: false
  },
  {
    movie: null, // Will be populated with actual movie ID (The Shawshank Redemption)
    user: null, // Will be populated with actual user ID
    reviewType: 'movie',
    rating: 5,
    title: 'The Definition of a Perfect Film',
    comment: 'The Shawshank Redemption is storytelling at its finest. Every element works in perfect harmony - the pacing, the performances, the script, the score. Morgan Freeman and Tim Robbins create two of cinema\'s most memorable characters in Red and Andy. The film deals with heavy themes of institutionalization, hope, and redemption, but never feels preachy or manipulative. The friendship that develops between the main characters feels authentic and earned. Director Frank Darabont captures both the oppressive atmosphere of the prison and the humanity of those within its walls. The ending is one of the most satisfying in film history, delivering an emotional payoff that feels both surprising and inevitable. If you haven\'t seen this film, you\'re missing out on a true masterpiece.',
    isApproved: true,
    isVerified: true,
    isPublished: true,
    publishDate: new Date('2023-01-20T16:15:00.000Z'),
    displayDate: 'January 20, 2023',
    likes: 312,
    dislikes: 5,
    likedBy: [], // Will be populated with random user IDs
    dislikedBy: [], // Will be populated with random user IDs
    isEdited: false,
    spoiler: false,
    watchedInTheater: false,
    watchDate: new Date('2023-01-15T00:00:00.000Z'),
    images: [],
    tags: ['Masterpiece', 'Emotional', 'Perfect Ending'],
    featured: true
  },
  {
    movie: null, // Will be populated with actual movie ID (The Dark Knight)
    user: null, // Will be populated with actual user ID
    reviewType: 'movie',
    rating: 5,
    title: 'Redefines the Superhero Genre',
    comment: 'The Dark Knight transcends the superhero genre to become a crime thriller of the highest order. Heath Ledger\'s performance as the Joker is nothing short of revolutionary - disturbing, magnetic, and utterly unpredictable. Christian Bale provides the perfect counterpoint as Batman/Bruce Wayne, a man struggling with the consequences of his choices. The film asks complex moral questions about heroism, sacrifice, and the nature of chaos versus order. The action sequences are spectacular, particularly the opening bank heist and the flipping of the semi truck. Hans Zimmer and James Newton Howard\'s score creates a constant sense of tension and unease. Christopher Nolan crafted not just a great comic book movie, but one of the finest films of the 21st century so far.',
    isApproved: true,
    isVerified: true,
    isPublished: true,
    publishDate: new Date('2023-02-12T11:20:00.000Z'),
    displayDate: 'February 12, 2023',
    likes: 289,
    dislikes: 14,
    likedBy: [], // Will be populated with random user IDs
    dislikedBy: [], // Will be populated with random user IDs
    isEdited: false,
    spoiler: false,
    watchedInTheater: true,
    watchDate: new Date('2023-02-05T00:00:00.000Z'),
    images: [],
    tags: ['Superhero', 'Heath Ledger', 'Crime Thriller'],
    featured: true
  },
  {
    movie: null, // Will be populated with actual movie ID (Parasite)
    user: null, // Will be populated with actual user ID
    reviewType: 'movie',
    rating: 5,
    title: 'A Perfect Social Satire',
    comment: 'Parasite is that rare film that works on every level - as a thriller, a dark comedy, a social commentary, and a masterclass in filmmaking technique. Director Bong Joon-ho shifts between tones with incredible skill, making you laugh one moment and gasp the next. The entire cast delivers nuanced performances, portraying characters who are neither heroes nor villains but complex humans shaped by an unequal society. The production design is brilliant, with the contrasting homes of the wealthy Park family and the struggling Kim family telling much of the story visually. The film builds to a climax that is shocking yet feels entirely earned. Parasite deserved every award it won, including its historic Best Picture Oscar. A genuine masterpiece that will be studied for decades to come.',
    isApproved: true,
    isVerified: true,
    isPublished: true,
    publishDate: new Date('2023-03-05T13:40:00.000Z'),
    displayDate: 'March 5, 2023',
    likes: 276,
    dislikes: 8,
    likedBy: [], // Will be populated with random user IDs
    dislikedBy: [], // Will be populated with random user IDs
    isEdited: false,
    spoiler: false,
    watchedInTheater: true,
    watchDate: new Date('2023-02-28T00:00:00.000Z'),
    images: [],
    tags: ['Social Commentary', 'Dark Comedy', 'Oscar Winner'],
    featured: false
  },
  {
    theater: null, // Will be populated with actual theater ID
    user: null, // Will be populated with actual user ID
    reviewType: 'theater',
    rating: 5,
    title: 'Luxury Cinema Experience',
    comment: 'This theater offers the ultimate movie-watching experience. The reclining leather seats are incredibly comfortable, with ample legroom and perfect viewing angles. The sound system is state-of-the-art, with Dolby Atmos creating an immersive audio environment. The picture quality is crystal clear with vibrant colors and perfect contrast. What really sets this theater apart is the service - the staff is friendly and attentive, and the food and beverage options go well beyond typical concessions. I ordered a gourmet burger and craft beer delivered right to my seat. The theater was impeccably clean, and the overall atmosphere was upscale without feeling pretentious. Ticket prices are higher than standard theaters, but the premium experience is absolutely worth it. This is now my go-to venue for any film I\'m excited about seeing.',
    isApproved: true,
    isVerified: true,
    isPublished: true,
    publishDate: new Date('2023-02-20T15:30:00.000Z'),
    displayDate: 'February 20, 2023',
    likes: 142,
    dislikes: 3,
    likedBy: [], // Will be populated with random user IDs
    dislikedBy: [], // Will be populated with random user IDs
    isEdited: false,
    images: [],
    tags: ['Luxury', 'Comfortable Seating', 'Great Food'],
    featured: true
  },
  {
    theater: null, // Will be populated with actual theater ID
    user: null, // Will be populated with actual user ID
    reviewType: 'theater',
    rating: 4,
    title: 'Great Value for Movie Lovers',
    comment: 'This theater offers an excellent balance of quality and affordability. The seats are comfortable standard recliners with good positioning. The sound and picture quality are very good, though not quite at the level of premium formats like Dolby Cinema. Where this theater really shines is its value - ticket prices are reasonable, especially for matinees, and they offer a great loyalty program that gives you free tickets and concession discounts. The concession prices are also more reasonable than most theaters, and they have a good selection beyond the basics. The theater is always clean, and the staff is efficient and friendly. This is my regular theater for most movie outings when I don\'t need the absolute premium experience. Highly recommended for frequent moviegoers who want good quality without breaking the bank.',
    isApproved: true,
    isVerified: true,
    isPublished: true,
    publishDate: new Date('2023-03-15T10:45:00.000Z'),
    displayDate: 'March 15, 2023',
    likes: 98,
    dislikes: 7,
    likedBy: [], // Will be populated with random user IDs
    dislikedBy: [], // Will be populated with random user IDs
    isEdited: false,
    images: [],
    tags: ['Affordable', 'Good Value', 'Loyalty Program'],
    featured: false
  },
  {
    theater: null, // Will be populated with actual theater ID
    user: null, // Will be populated with actual user ID
    reviewType: 'theater',
    rating: 5,
    title: 'Perfect for Film Enthusiasts',
    comment: 'This independent theater is a haven for true film lovers. Unlike multiplexes that focus only on mainstream blockbusters, this venue offers a carefully curated selection of independent films, foreign cinema, documentaries, and classics. The theater itself has a wonderful vintage charm while still providing modern comforts and good technical quality. The staff is knowledgeable and passionate about film - they often provide introductions to special screenings and host Q&A sessions with filmmakers. The concession stand offers unique items like local pastries and gourmet coffee alongside traditional movie snacks. They also have a small bar with a good selection of wines and local beers. The theater hosts several film festivals throughout the year and themed retrospectives that are always thoughtfully programmed. If you\'re serious about cinema beyond the latest superhero movie, this theater is an absolute treasure.',
    isApproved: true,
    isVerified: true,
    isPublished: true,
    publishDate: new Date('2023-01-30T14:20:00.000Z'),
    displayDate: 'January 30, 2023',
    likes: 156,
    dislikes: 2,
    likedBy: [], // Will be populated with random user IDs
    dislikedBy: [], // Will be populated with random user IDs
    isEdited: false,
    images: [],
    tags: ['Independent Films', 'Film Festivals', 'Vintage Charm'],
    featured: true
  },
  {
    theater: null, // Will be populated with actual theater ID
    user: null, // Will be populated with actual user ID
    reviewType: 'theater',
    rating: 3,
    title: 'Decent But Needs Updating',
    comment: 'This theater is acceptable but showing its age. The seats are the older style without reclining functionality, and some are starting to show wear and tear. Sound quality is good in most auditoriums, but screen #3 had some audio issues during my visit. Picture quality is decent but not exceptional. Concession options are standard with the usual overpriced popcorn and soda. The lobby and restrooms were clean, but the overall aesthetic feels dated compared to newer theaters. On the positive side, ticket prices are reasonable, and the location is convenient with plenty of parking. The staff was friendly and helpful. This theater is fine for casual viewing when convenience is a priority, but I would choose a more updated venue for films where presentation quality is important. With some renovations and upgraded seating, this could be a much better movie-watching experience.',
    isApproved: true,
    isVerified: true,
    isPublished: true,
    publishDate: new Date('2023-02-08T16:50:00.000Z'),
    displayDate: 'February 8, 2023',
    likes: 45,
    dislikes: 12,
    likedBy: [], // Will be populated with random user IDs
    dislikedBy: [], // Will be populated with random user IDs
    isEdited: false,
    images: [],
    tags: ['Outdated', 'Affordable', 'Convenient Location'],
    featured: false
  }
];

module.exports = reviewData;
