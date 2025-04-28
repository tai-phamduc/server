const newsData = [
  {
    title: 'Christopher Nolan\'s Next Film Announced',
    slug: 'christopher-nolans-next-film-announced',
    content: `<p>Acclaimed director Christopher Nolan has officially announced his next project, a historical thriller set during the Cold War. The film, currently titled "Oppenheimer," will focus on J. Robert Oppenheimer and his role in the development of the atomic bomb.</p>
    <p>Universal Pictures has won the bidding war for the project, marking Nolan's first film not made with Warner Bros. in nearly two decades. The film is scheduled to begin production in early 2022 with a planned release date of July 2023.</p>
    <p>Cillian Murphy, a frequent collaborator with Nolan, is in talks to star as Oppenheimer. The film will be shot on a combination of IMAX 65mm and 65mm large-format film, continuing Nolan's commitment to high-quality film formats and practical effects.</p>
    <p>"I'm thrilled to be working with Universal on this extraordinary story," Nolan said in a statement. "The moral complexities of Oppenheimer's life and the profound impact of his decisions continue to resonate today. It's a subject that demands to be brought to the screen with the scale and craft that only the theatrical experience can offer."</p>
    <p>Industry analysts predict this could be another Oscar contender for Nolan, who has received five Academy Award nominations throughout his career.</p>`,
    excerpt: 'Christopher Nolan has officially announced his next project, a historical thriller about J. Robert Oppenheimer and the development of the atomic bomb.',
    author: null, // Will be populated with actual user ID
    authorName: 'John Smith',
    authorImage: 'https://example.com/authors/john-smith.jpg',
    featuredImage: 'https://example.com/news/nolan-next-film.jpg',
    gallery: [
      'https://example.com/news/nolan-next-film-1.jpg',
      'https://example.com/news/nolan-next-film-2.jpg'
    ],
    categories: ['Movie News', 'Directors'],
    blogCategories: [], // Will be populated with actual blog category IDs
    category: 'Movie News',
    tags: ['Christopher Nolan', 'Oppenheimer', 'Universal Pictures', 'Cillian Murphy'],
    blogTags: [], // Will be populated with actual tag IDs
    publishDate: new Date('2023-06-15T14:30:00.000Z'),
    displayDate: 'June 15, 2023',
    status: 'published',
    featured: true,
    views: 1250,
    likes: 342,
    comments: 48,
    relatedMovies: [], // Will be populated with actual movie IDs
    relatedEvents: [], // Will be populated with actual event IDs
    socialMedia: {
      facebook: 'https://facebook.com/cinemadaily/posts/nolan-film',
      twitter: 'https://twitter.com/cinemadaily/status/123456789',
      instagram: 'https://instagram.com/cinemadaily/p/abc123',
      pinterest: ''
    },
    metaTitle: 'Christopher Nolan Announces New Historical Thriller About Oppenheimer',
    metaDescription: 'Learn about Christopher Nolan\'s next film project focusing on J. Robert Oppenheimer and the development of the atomic bomb.',
    metaKeywords: ['Christopher Nolan', 'Oppenheimer', 'Universal Pictures', 'Cillian Murphy', 'Atomic Bomb', 'Movie News']
  },
  {
    title: 'Top 10 Summer Blockbusters to Watch This Season',
    slug: 'top-10-summer-blockbusters-to-watch-this-season',
    content: `<p>Summer is here, and that means it's time for the biggest blockbusters of the year to hit theaters. From superhero epics to action-packed adventures, this summer's lineup promises something for everyone.</p>
    <h2>1. "Fast X"</h2>
    <p>The tenth installment in the Fast & Furious saga brings back the entire family for another high-octane adventure. With new villain Jason Momoa joining the cast, this promises to be the most explosive entry yet.</p>
    <h2>2. "The Marvels"</h2>
    <p>Captain Marvel returns, this time teaming up with Monica Rambeau and Ms. Marvel for an cosmic adventure that will change the MCU forever.</p>
    <h2>3. "Mission: Impossible - Dead Reckoning Part One"</h2>
    <p>Tom Cruise returns as Ethan Hunt in what's being called the most dangerous mission yet. Expect breathtaking stunts and globe-trotting action.</p>
    <h2>4. "Indiana Jones and the Dial of Destiny"</h2>
    <p>Harrison Ford dons the fedora one last time in this nostalgic adventure directed by James Mangold.</p>
    <h2>5. "Barbie"</h2>
    <p>Greta Gerwig directs Margot Robbie and Ryan Gosling in this unexpected take on the iconic doll. Early buzz suggests this could be the surprise hit of the summer.</p>
    <h2>6. "Oppenheimer"</h2>
    <p>Christopher Nolan's historical thriller about the creation of the atomic bomb features an all-star cast led by Cillian Murphy.</p>
    <h2>7. "Elemental"</h2>
    <p>Pixar's latest original film explores a world where the elements - fire, water, earth, and air - are living entities.</p>
    <h2>8. "Insidious: The Red Door"</h2>
    <p>The fifth installment in the horror franchise sees Patrick Wilson return both in front of and behind the camera.</p>
    <h2>9. "Haunted Mansion"</h2>
    <p>Disney's second attempt at adapting their famous attraction features an ensemble cast including LaKeith Stanfield and Tiffany Haddish.</p>
    <h2>10. "Blue Beetle"</h2>
    <p>DC's first Latino superhero gets his own film, with Xolo Maridueña starring as Jaime Reyes.</p>
    <p>With such a diverse lineup, this summer is shaping up to be one of the biggest box office seasons in years. Which films are you most excited to see?</p>`,
    excerpt: 'From superhero epics to action-packed adventures, this summer\'s movie lineup promises something for everyone. Check out our top 10 must-see blockbusters.',
    author: null, // Will be populated with actual user ID
    authorName: 'Sarah Johnson',
    authorImage: 'https://example.com/authors/sarah-johnson.jpg',
    featuredImage: 'https://example.com/news/summer-blockbusters.jpg',
    gallery: [
      'https://example.com/news/summer-blockbusters-1.jpg',
      'https://example.com/news/summer-blockbusters-2.jpg'
    ],
    categories: ['Movie Lists', 'Summer Movies'],
    blogCategories: [], // Will be populated with actual blog category IDs
    category: 'Movie Lists',
    tags: ['Summer Movies', 'Blockbusters', 'Fast X', 'The Marvels', 'Mission Impossible'],
    blogTags: [], // Will be populated with actual tag IDs
    publishDate: new Date('2023-06-01T10:15:00.000Z'),
    displayDate: 'June 1, 2023',
    status: 'published',
    featured: true,
    views: 2100,
    likes: 520,
    comments: 75,
    relatedMovies: [], // Will be populated with actual movie IDs
    relatedEvents: [], // Will be populated with actual event IDs
    socialMedia: {
      facebook: 'https://facebook.com/cinemadaily/posts/summer-blockbusters',
      twitter: 'https://twitter.com/cinemadaily/status/987654321',
      instagram: 'https://instagram.com/cinemadaily/p/def456',
      pinterest: 'https://pinterest.com/cinemadaily/summer-movies-2023'
    },
    metaTitle: 'Top 10 Summer Blockbusters to Watch in Theaters This Season',
    metaDescription: 'Discover the biggest and most anticipated summer blockbusters hitting theaters this season, from superhero films to action adventures.',
    metaKeywords: ['Summer Movies', 'Blockbusters', 'Fast X', 'The Marvels', 'Mission Impossible', 'Indiana Jones', 'Barbie', 'Oppenheimer']
  },
  {
    title: 'Oscar Nominations Announced: Full List and Surprises',
    slug: 'oscar-nominations-announced-full-list-and-surprises',
    content: `<p>The Academy of Motion Picture Arts and Sciences has announced the nominations for the 95th Academy Awards, with several surprises and snubs making headlines.</p>
    <p>"Everything Everywhere All at Once" leads the pack with 11 nominations, including Best Picture, Best Director for Daniel Kwan and Daniel Scheinert, Best Actress for Michelle Yeoh, and Best Supporting Actor and Actress for Ke Huy Quan and Jamie Lee Curtis, respectively.</p>
    <p>Close behind is "The Banshees of Inisherin" with 9 nominations, followed by "All Quiet on the Western Front" and "Elvis" with 8 each.</p>
    <h2>Major Category Nominations:</h2>
    <h3>Best Picture</h3>
    <ul>
      <li>"All Quiet on the Western Front"</li>
      <li>"Avatar: The Way of Water"</li>
      <li>"The Banshees of Inisherin"</li>
      <li>"Elvis"</li>
      <li>"Everything Everywhere All at Once"</li>
      <li>"The Fabelmans"</li>
      <li>"Tár"</li>
      <li>"Top Gun: Maverick"</li>
      <li>"Triangle of Sadness"</li>
      <li>"Women Talking"</li>
    </ul>
    <h3>Best Director</h3>
    <ul>
      <li>Martin McDonagh, "The Banshees of Inisherin"</li>
      <li>Daniel Kwan and Daniel Scheinert, "Everything Everywhere All at Once"</li>
      <li>Steven Spielberg, "The Fabelmans"</li>
      <li>Todd Field, "Tár"</li>
      <li>Ruben Östlund, "Triangle of Sadness"</li>
    </ul>
    <h3>Best Actor</h3>
    <ul>
      <li>Austin Butler, "Elvis"</li>
      <li>Colin Farrell, "The Banshees of Inisherin"</li>
      <li>Brendan Fraser, "The Whale"</li>
      <li>Paul Mescal, "Aftersun"</li>
      <li>Bill Nighy, "Living"</li>
    </ul>
    <h3>Best Actress</h3>
    <ul>
      <li>Cate Blanchett, "Tár"</li>
      <li>Ana de Armas, "Blonde"</li>
      <li>Andrea Riseborough, "To Leslie"</li>
      <li>Michelle Williams, "The Fabelmans"</li>
      <li>Michelle Yeoh, "Everything Everywhere All at Once"</li>
    </ul>
    <p>Notable surprises include Andrea Riseborough's nomination for the little-seen indie drama "To Leslie," following a grassroots campaign by fellow actors, and the strong showing for the German war film "All Quiet on the Western Front."</p>
    <p>Significant snubs include Tom Cruise not receiving an acting nomination for "Top Gun: Maverick" despite the film's Best Picture nod, and no women being nominated in the Best Director category.</p>
    <p>The 95th Academy Awards ceremony will be held on March 12, 2023, at the Dolby Theatre in Los Angeles, with Jimmy Kimmel returning as host.</p>`,
    excerpt: 'The Academy has announced nominations for the 95th Oscars, with "Everything Everywhere All at Once" leading with 11 nominations. See the full list and biggest surprises.',
    author: null, // Will be populated with actual user ID
    authorName: 'Michael Chen',
    authorImage: 'https://example.com/authors/michael-chen.jpg',
    featuredImage: 'https://example.com/news/oscar-nominations.jpg',
    gallery: [
      'https://example.com/news/oscar-nominations-1.jpg',
      'https://example.com/news/oscar-nominations-2.jpg'
    ],
    categories: ['Awards', 'Oscar Season'],
    blogCategories: [], // Will be populated with actual blog category IDs
    category: 'Awards',
    tags: ['Oscars', 'Academy Awards', 'Everything Everywhere All at Once', 'Michelle Yeoh'],
    blogTags: [], // Will be populated with actual tag IDs
    publishDate: new Date('2023-01-24T18:45:00.000Z'),
    displayDate: 'January 24, 2023',
    status: 'published',
    featured: false,
    views: 1850,
    likes: 310,
    comments: 92,
    relatedMovies: [], // Will be populated with actual movie IDs
    relatedEvents: [], // Will be populated with actual event IDs
    socialMedia: {
      facebook: 'https://facebook.com/cinemadaily/posts/oscar-nominations',
      twitter: 'https://twitter.com/cinemadaily/status/567891234',
      instagram: 'https://instagram.com/cinemadaily/p/ghi789',
      pinterest: ''
    },
    metaTitle: 'Oscar Nominations 2023: Complete List and Surprising Nominees',
    metaDescription: 'See the full list of 2023 Oscar nominations, including surprises, snubs, and which films received the most Academy Award nominations.',
    metaKeywords: ['Oscars', 'Academy Awards', 'Oscar Nominations', 'Everything Everywhere All at Once', 'Michelle Yeoh', 'Brendan Fraser']
  },
  {
    title: 'Major Theater Chain Announces Luxury Upgrade Program',
    slug: 'major-theater-chain-announces-luxury-upgrade-program',
    content: `<p>AMC Theatres, the largest movie theater chain in the United States, has announced a $500 million investment program to upgrade theaters nationwide with luxury amenities.</p>
    <p>The "AMC Premiere" initiative will transform over 200 locations over the next three years, adding reclining leather seats, expanded food and beverage options including full-service dining, and enhanced audio-visual technology.</p>
    <p>"We're committed to elevating the moviegoing experience to compete with the convenience of home streaming," said Adam Aron, CEO of AMC Entertainment. "These upgrades will give audiences compelling reasons to experience films the way they're meant to be seen - on the big screen with state-of-the-art presentation."</p>
    <p>The renovations will include:</p>
    <ul>
      <li>Power reclining seats with heated options and individual tables</li>
      <li>Full-service dining with expanded menus and alcoholic beverages</li>
      <li>Enhanced Dolby Cinema and IMAX installations</li>
      <li>Modernized lobbies with self-service kiosks</li>
      <li>Reserved seating for all showings</li>
    </ul>
    <p>The first 50 locations will begin renovations this summer, with completion expected by the holiday movie season. The company has stated that most theaters will remain partially open during renovations to minimize disruption.</p>
    <p>Industry analysts view this move as a direct response to declining theater attendance and increased competition from streaming services. The luxury theater model has proven successful for smaller chains like Alamo Drafthouse and iPic, which have maintained strong attendance despite industry-wide challenges.</p>
    <p>"This is a smart strategic move," said Sarah Thompson, entertainment analyst at Morgan Stanley. "Premium experiences command premium prices, and consumers have shown willingness to pay more for enhanced comfort and amenities."</p>
    <p>AMC has indicated that ticket prices will increase at renovated locations, but the company plans to offer expanded subscription options through its AMC Stubs program to provide value for frequent moviegoers.</p>`,
    excerpt: 'AMC Theatres has announced a $500 million investment to upgrade 200 locations with luxury amenities including reclining seats, dining options, and enhanced technology.',
    author: null, // Will be populated with actual user ID
    authorName: 'David Wilson',
    authorImage: 'https://example.com/authors/david-wilson.jpg',
    featuredImage: 'https://example.com/news/theater-upgrades.jpg',
    gallery: [
      'https://example.com/news/theater-upgrades-1.jpg',
      'https://example.com/news/theater-upgrades-2.jpg'
    ],
    categories: ['Industry News', 'Theaters'],
    blogCategories: [], // Will be populated with actual blog category IDs
    category: 'Industry News',
    tags: ['AMC Theatres', 'Theater Upgrades', 'Luxury Cinema', 'Movie Theater Industry'],
    blogTags: [], // Will be populated with actual tag IDs
    publishDate: new Date('2023-05-12T09:30:00.000Z'),
    displayDate: 'May 12, 2023',
    status: 'published',
    featured: false,
    views: 1420,
    likes: 275,
    comments: 63,
    relatedMovies: [], // Will be populated with actual movie IDs
    relatedEvents: [], // Will be populated with actual event IDs
    socialMedia: {
      facebook: 'https://facebook.com/cinemadaily/posts/amc-upgrades',
      twitter: 'https://twitter.com/cinemadaily/status/345678912',
      instagram: 'https://instagram.com/cinemadaily/p/jkl012',
      pinterest: ''
    },
    metaTitle: 'AMC Theatres Announces $500 Million Luxury Theater Upgrade Program',
    metaDescription: 'AMC Theatres is investing $500 million to transform 200 locations with luxury amenities including reclining seats, dining options, and enhanced technology.',
    metaKeywords: ['AMC Theatres', 'Theater Upgrades', 'Luxury Cinema', 'Reclining Seats', 'Dine-in Movies', 'Movie Theater Industry']
  },
  {
    title: 'Exclusive Interview: Director Talks About Creating the Year\'s Most Talked-About Film',
    slug: 'exclusive-interview-director-talks-about-creating-the-years-most-talked-about-film',
    content: `<p>In an exclusive interview, acclaimed director Ava DuVernay sits down with us to discuss her latest film, "Horizon," which has been generating Oscar buzz since its premiere at the Cannes Film Festival.</p>
    <p>The historical drama, which explores untold stories from the American Civil Rights movement, has been praised for its powerful performances, stunning cinematography, and unflinching portrayal of a pivotal moment in history.</p>
    <h2>On the Genesis of the Project</h2>
    <p>"This story has been with me for nearly a decade," DuVernay explains. "I discovered these incredible, lesser-known figures while researching another project, and I became obsessed with bringing their stories to light. These were ordinary people who did extraordinary things, and yet history has largely forgotten them."</p>
    <p>The film focuses on a group of student activists in the early 1960s whose grassroots organizing laid the groundwork for major legislative changes. "What fascinated me was the strategic brilliance of these young people, many still in their teens, who understood how to create meaningful change against overwhelming odds."</p>
    <h2>Casting and Performances</h2>
    <p>The film stars an ensemble cast of both established actors and newcomers. "I wanted faces that weren't overly familiar to audiences for many of the roles," says DuVernay. "There's something powerful about discovering these historical figures through fresh faces."</p>
    <p>However, the director did cast several well-known actors in key roles, including Viola Davis as a community organizer who mentors the students. "Viola brings such dignity and fire to every role. She understood this woman's complexity immediately - the public strength and private doubts, the strategic mind and the nurturing heart."</p>
    <h2>Technical Challenges</h2>
    <p>Recreating the 1960s presented numerous challenges for the production team. "We shot in many of the actual locations where these events took place, which was emotionally powerful but logistically complex," DuVernay notes. "Many of these buildings and streets have changed dramatically over six decades."</p>
    <p>The film employed a combination of practical set design and digital effects to recreate the period accurately. "Our production designer, Hannah Beachler, did extraordinary research. We had photographs of many locations, but often had to piece together what spaces looked like from written descriptions and oral histories."</p>
    <h2>Critical Reception and Impact</h2>
    <p>Since its premiere, "Horizon" has received overwhelmingly positive reviews, with particular praise for its unflinching yet nuanced approach to depicting both historical violence and moments of human connection.</p>
    <p>"I didn't want to shy away from showing the brutality these activists faced," DuVernay says. "But I was equally committed to showing their joy, their humor, their love stories. Resistance movements aren't sustained by anger alone - they require community, celebration, and hope."</p>
    <p>When asked about the film's Oscar prospects, DuVernay deflects. "That's not why we make films. We made this to honor these overlooked heroes and to remind audiences that significant change often begins with young people who refuse to accept the world as it is."</p>
    <p>"Horizon" opens in select theaters on October 15 before expanding nationwide on November 1.</p>`,
    excerpt: 'In an exclusive interview, director Ava DuVernay discusses her acclaimed new film "Horizon," the challenges of historical recreation, and bringing overlooked Civil Rights heroes to the screen.',
    author: null, // Will be populated with actual user ID
    authorName: 'Emily Rodriguez',
    authorImage: 'https://example.com/authors/emily-rodriguez.jpg',
    featuredImage: 'https://example.com/news/director-interview.jpg',
    gallery: [
      'https://example.com/news/director-interview-1.jpg',
      'https://example.com/news/director-interview-2.jpg'
    ],
    categories: ['Interviews', 'Directors'],
    blogCategories: [], // Will be populated with actual blog category IDs
    category: 'Interviews',
    tags: ['Ava DuVernay', 'Horizon', 'Director Interview', 'Civil Rights', 'Viola Davis'],
    blogTags: [], // Will be populated with actual tag IDs
    publishDate: new Date('2023-06-28T11:20:00.000Z'),
    displayDate: 'June 28, 2023',
    status: 'published',
    featured: true,
    views: 1680,
    likes: 420,
    comments: 57,
    relatedMovies: [], // Will be populated with actual movie IDs
    relatedEvents: [], // Will be populated with actual event IDs
    socialMedia: {
      facebook: 'https://facebook.com/cinemadaily/posts/duvernay-interview',
      twitter: 'https://twitter.com/cinemadaily/status/123456780',
      instagram: 'https://instagram.com/cinemadaily/p/mno345',
      pinterest: ''
    },
    metaTitle: 'Exclusive: Ava DuVernay Discusses Her Oscar-Buzzy New Film "Horizon"',
    metaDescription: 'Read our exclusive interview with director Ava DuVernay about her acclaimed new Civil Rights drama "Horizon," the filmmaking process, and bringing overlooked heroes to the screen.',
    metaKeywords: ['Ava DuVernay', 'Horizon', 'Director Interview', 'Civil Rights', 'Viola Davis', 'Oscar Buzz', 'Cannes Film Festival']
  }
];

module.exports = newsData;
