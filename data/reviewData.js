const reviewData = [
  {
    movie: null, // Will be populated with actual movie ID (Inception)
    user: null, // Will be populated with actual user ID
    rating: 5,
    title: 'A Mind-Bending Masterpiece',
    content: 'Christopher Nolan\'s "Inception" is a stunning achievement in filmmaking. The concept is brilliantly executed, with layers of dreams within dreams creating a puzzle that keeps you engaged throughout. The visual effects are spectacular, especially considering how many were done practically rather than with CGI. Leonardo DiCaprio delivers a powerful performance as a man haunted by his past. The supporting cast is equally strong, particularly Marion Cotillard as his wife. Hans Zimmer\'s score perfectly complements the tension and emotion of the story. This is a film that rewards multiple viewings and continues to spark discussion about its ambiguous ending. A true modern classic.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 245,
    dislikes: 12,
    createdAt: '2023-01-15T14:30:00.000Z'
  },
  {
    movie: null, // Will be populated with actual movie ID (Inception)
    user: null, // Will be populated with actual user ID
    rating: 4,
    title: 'Complex but Rewarding',
    content: 'Inception requires your full attention, but it\'s worth the mental effort. The dream-within-a-dream concept could have been confusing, but Nolan guides the audience through the layers with skill. The action sequences are thrilling, especially the zero-gravity hotel corridor fight. My only criticism is that some of the exposition feels heavy-handed, with characters explaining the rules of the dreamworld a bit too explicitly. Still, the emotional core of DiCaprio\'s character seeking redemption grounds the high-concept premise in something relatable. The ending is perfectly ambiguous, leaving you to draw your own conclusions. Visually stunning and intellectually stimulating.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 187,
    dislikes: 23,
    createdAt: '2023-02-03T09:45:00.000Z'
  },
  {
    movie: null, // Will be populated with actual movie ID (The Shawshank Redemption)
    user: null, // Will be populated with actual user ID
    rating: 5,
    title: 'The Definition of a Perfect Film',
    content: 'The Shawshank Redemption is storytelling at its finest. Every element works in perfect harmony - the pacing, the performances, the script, the score. Morgan Freeman and Tim Robbins create two of cinema\'s most memorable characters in Red and Andy. The film deals with heavy themes of institutionalization, hope, and redemption, but never feels preachy or manipulative. The friendship that develops between the main characters feels authentic and earned. Director Frank Darabont captures both the oppressive atmosphere of the prison and the humanity of those within its walls. The ending is one of the most satisfying in film history, delivering an emotional payoff that feels both surprising and inevitable. If you haven\'t seen this film, you\'re missing out on a true masterpiece.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 312,
    dislikes: 5,
    createdAt: '2023-01-20T16:15:00.000Z'
  },
  {
    movie: null, // Will be populated with actual movie ID (The Dark Knight)
    user: null, // Will be populated with actual user ID
    rating: 5,
    title: 'Redefines the Superhero Genre',
    content: 'The Dark Knight transcends the superhero genre to become a crime thriller of the highest order. Heath Ledger\'s performance as the Joker is nothing short of revolutionary - disturbing, magnetic, and utterly unpredictable. Christian Bale provides the perfect counterpoint as Batman/Bruce Wayne, a man struggling with the consequences of his choices. The film asks complex moral questions about heroism, sacrifice, and the nature of chaos versus order. The action sequences are spectacular, particularly the opening bank heist and the flipping of the semi truck. Hans Zimmer and James Newton Howard\'s score creates a constant sense of tension and unease. Christopher Nolan crafted not just a great comic book movie, but one of the finest films of the 21st century so far.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 289,
    dislikes: 14,
    createdAt: '2023-02-12T11:20:00.000Z'
  },
  {
    movie: null, // Will be populated with actual movie ID (Parasite)
    user: null, // Will be populated with actual user ID
    rating: 5,
    title: 'A Perfect Social Satire',
    content: 'Parasite is that rare film that works on every level - as a thriller, a dark comedy, a social commentary, and a masterclass in filmmaking technique. Director Bong Joon-ho shifts between tones with incredible skill, making you laugh one moment and gasp the next. The entire cast delivers nuanced performances, portraying characters who are neither heroes nor villains but complex humans shaped by an unequal society. The production design is brilliant, with the contrasting homes of the wealthy Park family and the struggling Kim family telling much of the story visually. The film builds to a climax that is shocking yet feels entirely earned. Parasite deserved every award it won, including its historic Best Picture Oscar. A genuine masterpiece that will be studied for decades to come.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 276,
    dislikes: 8,
    createdAt: '2023-03-05T13:40:00.000Z'
  },
  {
    movie: null, // Will be populated with actual movie ID (Avengers: Endgame)
    user: null, // Will be populated with actual user ID
    rating: 4,
    title: 'A Satisfying Conclusion to an Epic Saga',
    content: 'Avengers: Endgame had the nearly impossible task of concluding a 22-film saga, and it succeeds admirably. The three-hour runtime flies by as the film balances action, humor, and genuine emotional moments. The first act deals with the aftermath of "Infinity War" in a surprisingly somber and thoughtful way. The time heist middle section provides both nostalgia and new perspectives on previous films. The final battle is everything fans could hope for - epic in scale but still finding time for character moments that pay off years of development. Robert Downey Jr. and Chris Evans in particular deliver powerful performances that bring their character arcs to satisfying conclusions. While some plot elements rely on convenient time travel mechanics, the emotional truth of the story overcomes any logical nitpicks. A fitting end to Marvel\'s unprecedented cinematic experiment.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 254,
    dislikes: 31,
    createdAt: '2023-01-30T10:25:00.000Z'
  },
  {
    movie: null, // Will be populated with actual movie ID (The Godfather)
    user: null, // Will be populated with actual user ID
    rating: 5,
    title: 'The Standard by Which All Films Are Judged',
    content: 'The Godfather remains the pinnacle of filmmaking 50 years after its release. Francis Ford Coppola\'s direction is flawless, creating a rich, immersive world that feels authentic in every detail. Marlon Brando\'s performance as Don Vito Corleone is iconic, but equally impressive is Al Pacino\'s portrayal of Michael\'s transformation from reluctant outsider to ruthless leader. The screenplay balances intimate family drama with the brutal realities of organized crime. Gordon Willis\'s cinematography, with its warm amber tones and strategic use of shadow, creates a visual language that has influenced countless films since. Nino Rota\'s haunting score instantly evokes the film\'s themes of family, loyalty, and power. The Godfather isn\'t just a great gangster movie - it\'s a profound examination of the American Dream, immigration, family legacy, and moral compromise. A perfect film in every respect.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 327,
    dislikes: 4,
    createdAt: '2023-02-18T17:50:00.000Z'
  },
  {
    movie: null, // Will be populated with actual movie ID (Pulp Fiction)
    user: null, // Will be populated with actual user ID
    rating: 5,
    title: 'Revolutionary Filmmaking That Still Feels Fresh',
    content: 'Pulp Fiction revolutionized cinema with its non-linear storytelling, pop culture-laden dialogue, and blend of extreme violence with unexpected humor. Tarantino\'s script crackles with energy - these characters don\'t just talk, they philosophize, argue, and reveal themselves through conversation that feels both stylized and authentic. The performances are uniformly excellent, with John Travolta\'s career revival, Samuel L. Jackson\'s biblical fury, Uma Thurman\'s enigmatic cool, and Bruce Willis\'s weathered dignity creating characters that have become cultural icons. The film\'s structure, jumping between interconnected stories and playing with chronology, was groundbreaking in 1994 and continues to influence filmmakers today. The soundtrack perfectly complements the action, using carefully chosen songs to enhance scenes rather than simply filling silence. Nearly 30 years later, Pulp Fiction remains as vibrant, shocking, and entertaining as it was upon release - the mark of a true classic.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 298,
    dislikes: 17,
    createdAt: '2023-03-10T12:35:00.000Z'
  },
  {
    movie: null, // Will be populated with actual movie ID (The Matrix)
    user: null, // Will be populated with actual user ID
    rating: 5,
    title: 'A Visionary Film That Defined an Era',
    content: 'The Matrix is that rare blockbuster that works as both mind-bending entertainment and profound philosophical exploration. The Wachowskis created a film that was visually revolutionary - the "bullet time" effect alone changed action cinematography forever. But beyond the groundbreaking special effects is a story that thoughtfully explores questions of reality, free will, and the relationship between humans and technology. Keanu Reeves finds the perfect role as Neo, his somewhat detached quality fitting perfectly for a character discovering that his entire reality is a simulation. The action sequences combine Hong Kong martial arts, anime influences, and cutting-edge visual effects to create something that felt entirely new. The film\'s visual style - from the green-tinted digital world to the leather-clad rebels - created an aesthetic that defined the late 90s/early 2000s. While its sequels had mixed reception, the original Matrix stands as one of the most influential and perfectly executed science fiction films ever made.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 267,
    dislikes: 13,
    createdAt: '2023-01-25T14:15:00.000Z'
  },
  {
    movie: null, // Will be populated with actual movie ID (Interstellar)
    user: null, // Will be populated with actual user ID
    rating: 4,
    title: 'Ambitious Sci-Fi with Emotional Depth',
    content: 'Interstellar aims for the stars both literally and figuratively, combining hard science fiction concepts with a deeply emotional core story about a father\'s love for his daughter. The visual effects are stunning, particularly the depictions of black holes and alien planets that were created with scientific accuracy in mind. Matthew McConaughey delivers a powerful performance as Cooper, conveying both the explorer\'s excitement and the father\'s heartbreak. The supporting cast, including Anne Hathaway, Jessica Chastain, and Michael Caine, all bring depth to their roles. Hans Zimmer\'s organ-driven score creates a sense of cosmic grandeur appropriate to the themes. Christopher Nolan balances the intellectual concepts of relativity, gravity, and higher dimensions with the emotional reality of human connections transcending time and space. While the third act takes some controversial scientific and narrative leaps, the film\'s ambition and emotional impact make it a remarkable achievement in modern science fiction.',
    isRecommended: true,
    isVerified: true,
    isActive: true,
    likes: 231,
    dislikes: 42,
    createdAt: '2023-02-28T09:55:00.000Z'
  }
];

module.exports = reviewData;
