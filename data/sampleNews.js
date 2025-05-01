const news = [
  {
    title: "Deadpool & Wolverine Breaks R-Rated Opening Weekend Record",
    content: "Marvel Studios' 'Deadpool & Wolverine' has shattered box office records, becoming the highest-grossing R-rated opening weekend of all time. The film, which marks the Merc with a Mouth's official entry into the Marvel Cinematic Universe, earned an estimated $185 million domestically and $240 million internationally in its first weekend.\n\nThe highly anticipated team-up between Ryan Reynolds' Deadpool and Hugh Jackman's Wolverine has resonated with audiences worldwide, earning critical acclaim for its humor, action sequences, and the chemistry between its leads.\n\n'We're absolutely thrilled with the response,' said director Shawn Levy. 'Ryan and Hugh poured their hearts into these characters, and it's wonderful to see fans embracing their return with such enthusiasm.'\n\nThe film's success further cements R-rated superhero films as a viable box office draw following the success of previous Deadpool films, Logan, and Joker.",
    excerpt: "Marvel Studios' 'Deadpool & Wolverine' has shattered box office records, becoming the highest-grossing R-rated opening weekend of all time with $185 million domestically.",
    author: null, // Will be populated with ObjectId
    authorName: "Film Correspondent",
    featuredImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    categories: ["Box Office", "Marvel", "Superhero"],
    category: "Box Office",
    tags: ["Deadpool", "Wolverine", "Marvel", "Box Office Records", "Ryan Reynolds", "Hugh Jackman"],
    publishDate: new Date("2024-07-29"),
    status: "published",
    featured: true,
    isTrending: true,
    isBreakingNews: false
  },
  {
    title: "Christopher Nolan Announces New Sci-Fi Project",
    content: "Academy Award-winning director Christopher Nolan has announced his next project, an original science fiction film titled 'Quantum Horizon.' Following the success of 'Oppenheimer,' Nolan returns to the sci-fi genre that has defined much of his career with films like 'Inception,' 'Interstellar,' and 'Tenet.'\n\nDetails about the plot remain tightly under wraps, but sources close to the production describe it as 'a mind-bending exploration of parallel realities with profound philosophical implications.' The film is set to begin production in early 2025 with a planned release in summer 2026.\n\nNolan will once again partner with cinematographer Hoyte van Hoytema, composer Ludwig Göransson, and editor Jennifer Lame. Casting announcements are expected in the coming months, with speculation already swirling about which actors from Nolan's regular ensemble might join the project.\n\n'I've been developing this concept for several years,' Nolan said in a statement. 'It's a story that demands the scale and immersion of the theatrical experience, and I'm excited to bring it to audiences around the world.'",
    excerpt: "Academy Award-winning director Christopher Nolan has announced his next project, an original science fiction film titled 'Quantum Horizon' set to begin production in early 2025.",
    author: null, // Will be populated with ObjectId
    authorName: "Entertainment Reporter",
    featuredImage: "https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    categories: ["Production News", "Directors", "Science Fiction"],
    category: "Production News",
    tags: ["Christopher Nolan", "Science Fiction", "Quantum Horizon", "Film Production", "Directors"],
    publishDate: new Date("2024-05-15"),
    status: "published",
    featured: true,
    isTrending: true,
    isBreakingNews: true
  },
  {
    title: "Cannes Film Festival Announces 2024 Lineup",
    content: "The Cannes Film Festival has unveiled its official selection for the 2024 edition, featuring a mix of established auteurs and emerging talents from around the world. The prestigious festival, running from May 14-25, will showcase 21 films in competition for the coveted Palme d'Or.\n\nHighlights include new works from previous Palme d'Or winners Jane Campion and Ruben Östlund, alongside the latest from acclaimed directors Park Chan-wook, Claire Denis, and Mia Hansen-Løve. The festival will also feature the world premiere of an anticipated animated feature from Studio Ghibli.\n\nThis year's selection reflects a strong presence of female directors, with eight women competing for the top prize—a record in the festival's history. The lineup also emphasizes global diversity, with films from 15 different countries spanning five continents.\n\n'This year's selection demonstrates the vibrant state of cinema worldwide,' said festival director Thierry Frémaux. 'These films address urgent contemporary issues while pushing the boundaries of cinematic language.'\n\nAmerican actress Jennifer Lawrence will preside over the main competition jury, becoming one of the youngest jury presidents in the festival's history.",
    excerpt: "The Cannes Film Festival has unveiled its official selection for the 2024 edition, featuring 21 films in competition and a record number of female directors.",
    author: null, // Will be populated with ObjectId
    authorName: "Film Festival Correspondent",
    featuredImage: "https://images.unsplash.com/photo-1518929458113-28ff62e5b2cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    categories: ["Film Festivals", "International Cinema"],
    category: "Film Festivals",
    tags: ["Cannes Film Festival", "Film Festivals", "International Cinema", "Palme d'Or", "Jane Campion", "Ruben Östlund"],
    publishDate: new Date("2024-04-18"),
    status: "published",
    featured: false,
    isTrending: false,
    isBreakingNews: false
  },
  {
    title: "Meryl Streep to Receive Lifetime Achievement Award at Venice Film Festival",
    content: "Legendary actress Meryl Streep will be honored with the Golden Lion for Lifetime Achievement at the 81st Venice International Film Festival this September. The three-time Oscar winner and 21-time nominee will receive the prestigious award in recognition of her extraordinary contributions to cinema over a career spanning five decades.\n\n'Meryl Streep is not just an icon of American cinema but a global cultural treasure,' said festival director Alberto Barbera. 'Her versatility, emotional depth, and commitment to her craft have redefined what it means to be an actor. The Golden Lion for Lifetime Achievement is a small token of our immense gratitude for the joy and inspiration her work has brought to audiences worldwide.'\n\nStreep expressed her gratitude in a statement: 'I am deeply honored to receive this recognition from the Venice Film Festival, an institution that has championed the art of cinema for over eight decades. Venice has always held a special place in my heart, and I look forward to celebrating this milestone in such a magical city.'\n\nThe award ceremony will be accompanied by a special screening of 'Sophie's Choice' (1982), for which Streep won her second Academy Award. The actress is also expected to participate in a public masterclass discussing her approach to acting and reflections on her illustrious career.",
    excerpt: "Meryl Streep will be honored with the Golden Lion for Lifetime Achievement at the 81st Venice International Film Festival, celebrating her five-decade career in cinema.",
    author: null, // Will be populated with ObjectId
    authorName: "Awards Correspondent",
    featuredImage: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    categories: ["Awards", "Film Festivals", "Actors"],
    category: "Awards",
    tags: ["Meryl Streep", "Venice Film Festival", "Lifetime Achievement", "Golden Lion", "Awards"],
    publishDate: new Date("2024-06-10"),
    status: "published",
    featured: false,
    isTrending: false,
    isBreakingNews: false
  },
  {
    title: "James Cameron Reveals 'Avatar 3' Title and Release Date",
    content: "Director James Cameron has officially announced that the third installment in the groundbreaking 'Avatar' franchise will be titled 'Avatar: Fire and Ash' and is scheduled for release on December 18, 2025. The announcement came during a special presentation at CinemaCon in Las Vegas.\n\nCameron shared that production on the film is nearly complete, with only final visual effects work remaining. 'We're pushing the boundaries of what's possible in cinematic storytelling once again,' Cameron told the audience of theater owners and industry professionals. 'The scope of this film is even more ambitious than its predecessors.'\n\nThe director revealed that 'Fire and Ash' will introduce a new fire-based Na'vi tribe and will explore new regions of Pandora not seen in previous films. The story will continue to follow Jake Sully (Sam Worthington) and Neytiri (Zoe Saldaña) as they face new threats to their family and homeworld.\n\nCameron also confirmed that work on 'Avatar 4' is already underway, with a targeted release date of December 2029. 'We're creating a saga that spans generations,' he explained. 'Each film stands on its own while building toward a larger narrative arc.'\n\n'Avatar: The Way of Water,' released in 2022, grossed over $2.3 billion worldwide, becoming one of the highest-grossing films of all time.",
    excerpt: "Director James Cameron has officially announced that the third installment in the 'Avatar' franchise will be titled 'Avatar: Fire and Ash' and is scheduled for release on December 18, 2025.",
    author: null, // Will be populated with ObjectId
    authorName: "Film Industry Analyst",
    featuredImage: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1156&q=80",
    categories: ["Production News", "Science Fiction", "Sequels"],
    category: "Production News",
    tags: ["James Cameron", "Avatar", "Sequels", "Science Fiction", "20th Century Studios"],
    publishDate: new Date("2024-04-25"),
    status: "published",
    featured: true,
    isTrending: true,
    isBreakingNews: false
  },
  {
    title: "Indie Horror Film 'Whispers in the Dark' Acquired After Sundance Sensation",
    content: "First-time director Maya Chen's indie horror film 'Whispers in the Dark' has been acquired by A24 following its midnight premiere at the Sundance Film Festival, where it received a standing ovation and sparked a bidding war among distributors.\n\nThe psychological horror film, made on a shoestring budget of just $850,000, follows a linguist who discovers an ancient language that appears to have supernatural properties. Critics have praised the film for its innovative sound design, atmospheric tension, and thoughtful exploration of language and communication.\n\n'I'm overwhelmed by the response,' said Chen, who also wrote the screenplay. 'This film was a labor of love for our entire team, and finding a home with A24, who champions bold, original voices, is a dream come true.'\n\nThe deal, reportedly worth $8 million, includes worldwide distribution rights. A24 plans a theatrical release in October, positioning the film for the Halloween season.\n\nThe acquisition continues A24's tradition of supporting breakthrough horror films with artistic ambitions, following successes like 'Hereditary,' 'Midsommar,' and 'Talk to Me.'\n\nChen, 29, developed the film at the Sundance Screenwriters Lab and secured financing through a combination of grants, private investors, and crowdfunding. The film stars relative newcomer Lucia Diaz in a performance that has already generated early awards buzz.",
    excerpt: "First-time director Maya Chen's indie horror film 'Whispers in the Dark' has been acquired by A24 for $8 million following its sensational midnight premiere at the Sundance Film Festival.",
    author: null, // Will be populated with ObjectId
    authorName: "Independent Film Reporter",
    featuredImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1159&q=80",
    categories: ["Independent Film", "Horror", "Film Festivals", "Distribution"],
    category: "Independent Film",
    tags: ["Sundance Film Festival", "A24", "Horror Films", "Maya Chen", "Film Acquisition", "Indie Films"],
    publishDate: new Date("2024-02-05"),
    status: "published",
    featured: false,
    isTrending: false,
    isBreakingNews: false
  },
  {
    title: "Streaming Services Invest Record $30 Billion in Original Content for 2024",
    content: "Major streaming platforms are collectively investing a record $30 billion in original content production for 2024, according to a new industry report. The figure represents a 15% increase from 2023, highlighting the intensifying competition for subscribers in an increasingly crowded marketplace.\n\nNetflix leads the pack with a planned $9 billion expenditure, followed by Amazon Prime Video and Disney+ at $7 billion and $6 billion respectively. Apple TV+, despite having a smaller content library, is significantly increasing its budget to $4 billion, while HBO Max has allocated $4 billion for original programming.\n\n'We're seeing an unprecedented arms race for content,' said media analyst Sarah Johnson. 'With subscriber growth slowing in mature markets, these platforms are betting that exclusive, high-quality original programming is the key to reducing churn and attracting new users.'\n\nThe report indicates a strategic shift toward fewer but bigger productions, with an emphasis on franchise development and international content with global appeal. Streamers are also increasingly investing in live sports rights and reality programming to complement their scripted offerings.\n\nThis massive investment comes despite economic headwinds and recent cost-cutting measures at several media companies. Industry experts suggest that the streaming business is entering a new phase of maturity, where profitability and sustainable growth are becoming as important as subscriber numbers.\n\n'The days of growth at all costs are over,' Johnson added. 'These companies are now focused on creating sustainable business models while still delivering the content that keeps viewers engaged.'",
    excerpt: "Major streaming platforms are collectively investing a record $30 billion in original content production for 2024, a 15% increase from 2023, as competition for subscribers intensifies.",
    author: null, // Will be populated with ObjectId
    authorName: "Streaming Industry Analyst",
    featuredImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    categories: ["Streaming", "Industry News", "Production"],
    category: "Industry News",
    tags: ["Streaming Services", "Netflix", "Disney+", "Amazon Prime Video", "Apple TV+", "HBO Max", "Content Production"],
    publishDate: new Date("2024-01-15"),
    status: "published",
    featured: false,
    isTrending: true,
    isBreakingNews: false
  },
  {
    title: "Academy Announces Major Changes to Oscars Ceremony Format",
    content: "The Academy of Motion Picture Arts and Sciences has announced significant changes to the Oscars ceremony format beginning with the 97th Academy Awards in 2025. The revamped ceremony aims to streamline the broadcast while maintaining the prestige of cinema's highest honor.\n\nKey changes include reducing the number of awards presented during the live telecast from 23 to 16, with categories such as Best Sound, Best Production Design, and several short film categories to be presented during a separate ceremony earlier in Oscar week. Highlights from this preliminary event will be incorporated into the main broadcast.\n\nAdditionally, the Academy is introducing a new category for Best Casting, acknowledging the crucial role casting directors play in a film's success. This marks the first new competitive category added since Best Animated Feature was introduced in 2001.\n\nThe ceremony will also feature a more flexible runtime, potentially extending beyond the traditional three-hour window to allow for more clips from nominated films and expanded cultural context for international nominees.\n\n'These changes reflect our commitment to celebrating filmmaking excellence while creating a more engaging viewing experience,' said Academy CEO Bill Kramer. 'We want to honor all aspects of filmmaking while reconnecting with our global audience.'\n\nThe decision follows years of declining viewership for the telecast, though the 2024 ceremony saw a modest ratings increase. The Academy emphasized that all winners, regardless of when their awards are presented, will receive identical statuettes and recognition in the official record.",
    excerpt: "The Academy has announced major changes to the Oscars ceremony format, including reducing the number of awards presented during the live telecast and adding a new category for Best Casting.",
    author: null, // Will be populated with ObjectId
    authorName: "Awards Season Correspondent",
    featuredImage: "https://images.unsplash.com/photo-1610890690846-5149750c8634?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    categories: ["Awards", "Industry News", "Oscars"],
    category: "Awards",
    tags: ["Academy Awards", "Oscars", "Award Shows", "Film Industry", "Academy of Motion Picture Arts and Sciences"],
    publishDate: new Date("2024-06-24"),
    status: "published",
    featured: false,
    isTrending: false,
    isBreakingNews: true
  },
  {
    title: "Pioneering Visual Effects Artist Harryhausen Collection Acquired by Film Museum",
    content: "The complete collection of legendary visual effects pioneer Ray Harryhausen has been acquired by the National Film Museum, ensuring the preservation of his groundbreaking work for future generations. The acquisition includes original stop-motion models, drawings, storyboards, and personal archives from the artist whose work revolutionized special effects in films like 'Jason and the Argonauts' and 'Clash of the Titans.'\n\nThe collection, valued at over $12 million, was previously maintained by the Ray and Diana Harryhausen Foundation. It contains more than 50,000 items, including the iconic skeleton warriors from 'Jason and the Argonauts' and the Medusa from 'Clash of the Titans.'\n\n'Ray Harryhausen's innovative techniques and artistic vision fundamentally changed cinema,' said National Film Museum director Eleanor Hughes. 'His influence extends from Star Wars to Jurassic Park and beyond. This acquisition ensures his legacy will continue to inspire filmmakers and audiences for generations to come.'\n\nThe museum plans a major exhibition of Harryhausen's work in 2025, followed by a permanent gallery dedicated to his contributions to film history. The collection will also be digitized for research and educational purposes.\n\nHarryhausen, who passed away in 2013 at the age of 92, developed the technique known as 'Dynamation,' which allowed stop-motion creatures to interact seamlessly with live actors on screen. His work influenced countless filmmakers, including Steven Spielberg, James Cameron, Peter Jackson, and Guillermo del Toro.\n\n'My grandfather would be thrilled to know his life's work will be preserved and shared with the public,' said Vanessa Harryhausen, the artist's granddaughter and a trustee of his foundation. 'He was passionate about inspiring young filmmakers and artists.'",
    excerpt: "The complete collection of legendary visual effects pioneer Ray Harryhausen has been acquired by the National Film Museum for over $12 million, including original models from 'Jason and the Argonauts' and 'Clash of the Titans.'",
    author: null, // Will be populated with ObjectId
    authorName: "Film History Correspondent",
    featuredImage: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    categories: ["Film History", "Visual Effects", "Preservation"],
    category: "Film History",
    tags: ["Ray Harryhausen", "Visual Effects", "Stop Motion", "Film Preservation", "Film History", "Special Effects"],
    publishDate: new Date("2024-03-08"),
    status: "published",
    featured: false,
    isTrending: false,
    isBreakingNews: false
  },
  {
    title: "Global Box Office Rebounds to Pre-Pandemic Levels in First Half of 2024",
    content: "The global box office has fully rebounded to pre-pandemic levels in the first half of 2024, according to new data from the Motion Picture Association. Worldwide theatrical revenues reached $21.5 billion from January through June, marking a 12% increase over the same period in 2023 and slightly surpassing 2019's pre-pandemic figure of $21.2 billion.\n\nThe recovery has been driven by a combination of franchise tentpoles, original hits, and strong international performance, particularly in Asian markets. China's box office has returned to robust health, contributing $4.8 billion to the global total.\n\n'This milestone represents a significant achievement for the theatrical exhibition industry,' said MPA Chairman Charles Rivkin. 'It demonstrates the enduring appeal of the moviegoing experience and the resilience of our industry.'\n\nNorth American theaters generated $5.7 billion in the first half of the year, while international markets outside China contributed $11 billion. The data shows particular strength in premium formats like IMAX, which saw revenues increase by 18% compared to 2019.\n\nThe year's biggest global hits so far include 'Dune: Part Two' ($752 million), 'Godzilla x Kong: The New Empire' ($570 million), and 'Inside Out 2' ($820 million and still in theaters). The success of mid-budget original films like 'IF' ($325 million) and 'The Fall Guy' ($290 million) has also contributed to the healthy box office landscape.\n\nTheater owners expressed optimism about the second half of 2024, with anticipated releases including 'Deadpool & Wolverine,' 'Joker: Folie à Deux,' and 'Wicked: Part One.'",
    excerpt: "The global box office has fully rebounded to pre-pandemic levels in the first half of 2024, reaching $21.5 billion worldwide and surpassing 2019's pre-pandemic figures.",
    author: null, // Will be populated with ObjectId
    authorName: "Box Office Analyst",
    featuredImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    categories: ["Box Office", "Industry News", "Theatrical Exhibition"],
    category: "Box Office",
    tags: ["Box Office", "Theatrical Exhibition", "Film Industry", "Post-Pandemic Recovery", "Motion Picture Association"],
    publishDate: new Date("2024-07-10"),
    status: "published",
    featured: true,
    isTrending: true,
    isBreakingNews: false
  }
];

module.exports = news;
