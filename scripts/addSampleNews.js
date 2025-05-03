const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking')
  .then(() => {
    console.log('MongoDB Connected');
    // Run the main function after connection is established
    addSampleNews();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Main function to add sample news
const addSampleNews = async () => {
  try {
    // Check if there are already news in the database
    const newsCount = await mongoose.connection.db.collection('news').countDocuments();
    console.log(`Found ${newsCount} news articles in the database`);

    // If there are already news, don't add more
    if (newsCount > 5) {
      console.log('News already exist in the database. Skipping sample data creation.');
      process.exit(0);
      return;
    }

    // Create sample news
    const sampleNews = [
      {
        title: "Dune: Part Two Breaks Box Office Records",
        slug: "dune-part-two-breaks-box-office-records",
        content: `<p>Denis Villeneuve's epic sci-fi sequel "Dune: Part Two" has shattered box office expectations, grossing over $500 million worldwide in its opening weekend. The film, which continues the adaptation of Frank Herbert's classic novel, has received universal acclaim from critics and audiences alike.</p>
        
        <p>Starring Timothée Chalamet and Zendaya, the film expands on the world-building of the first installment while delivering spectacular action sequences and emotional character development. IMAX screenings have been particularly successful, with many theaters reporting sold-out showings for weeks in advance.</p>
        
        <p>"We're thrilled with the reception," said Villeneuve in a recent interview. "The support from fans has been overwhelming, and it validates our approach to splitting the story into two parts to give it the space it deserves."</p>
        
        <p>The success of "Dune: Part Two" has already sparked discussions about adapting "Dune Messiah," the next book in Herbert's series, with Villeneuve expressing interest in completing a trilogy.</p>`,
        excerpt: "Denis Villeneuve's epic sci-fi sequel has shattered box office expectations, grossing over $500 million worldwide in its opening weekend.",
        featuredImage: "https://image.tmdb.org/t/p/original/jZIYaISP3GBSrVOPfrp98AMa8Ng.jpg",
        publishDate: new Date("2024-03-05"),
        author: "Film Correspondent",
        category: "Box Office",
        tags: ["Dune", "Box Office", "Denis Villeneuve", "Timothée Chalamet", "Zendaya"],
        featured: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Exclusive: Inside Out 2 Director Reveals New Emotions",
        slug: "exclusive-inside-out-2-director-reveals-new-emotions",
        content: `<p>In an exclusive interview, "Inside Out 2" director Kelsey Mann has revealed details about the new emotions joining Joy, Sadness, Anger, Fear, and Disgust in the highly anticipated Pixar sequel.</p>
        
        <p>"As Riley enters her teenage years, her emotional landscape becomes more complex," Mann explained. "We're introducing Anxiety, Embarrassment, Ennui, and a few surprise emotions that will really shake things up in Headquarters."</p>
        
        <p>The film will explore Riley's high school experiences and the challenges of adolescence, with the original emotions having to adapt to working alongside these new, more complicated feelings.</p>
        
        <p>"We wanted to capture that tumultuous time when everything feels heightened," Mann continued. "Anyone who's been a teenager or raised one knows that it's a period of emotional chaos, and that's exactly what makes it such rich territory for an 'Inside Out' story."</p>
        
        <p>Amy Poehler returns as the voice of Joy, with Maya Hawke joining the cast as the voice of Anxiety. The film is set to release on June 14, 2024.</p>`,
        excerpt: "Director Kelsey Mann reveals details about the new emotions joining the cast in the highly anticipated Pixar sequel.",
        featuredImage: "https://image.tmdb.org/t/p/original/aQPeznSu7XDr9Tp5SsHHPuqzl9J.jpg",
        publishDate: new Date("2024-04-02"),
        author: "Animation Insider",
        category: "Upcoming Releases",
        tags: ["Inside Out 2", "Pixar", "Animation", "Disney"],
        featured: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Deadpool & Wolverine Trailer Breaks Viewing Records",
        slug: "deadpool-wolverine-trailer-breaks-viewing-records",
        content: `<p>The first trailer for "Deadpool & Wolverine" has smashed online viewing records, accumulating over 365 million views in its first 24 hours. The trailer, which debuted during the Super Bowl, gives fans their first look at Ryan Reynolds and Hugh Jackman teaming up in the Marvel Cinematic Universe.</p>
        
        <p>The trailer showcases the R-rated humor that made the Deadpool franchise a hit, while also teasing an emotional journey for both characters. Jackman's return as Wolverine has generated particular excitement, as the actor had previously retired from the role after 2017's "Logan."</p>
        
        <p>"Working with Hugh again has been the highlight of my career," Reynolds said in a statement. "This film is a love letter to these characters and to the fans who have supported them for decades."</p>
        
        <p>Director Shawn Levy has promised that the film will honor both characters' legacies while taking them in surprising new directions. "Deadpool & Wolverine" is scheduled for release on July 26, 2024, and is expected to be one of the year's biggest blockbusters.</p>`,
        excerpt: "The first trailer for the Marvel team-up film has accumulated over 365 million views in its first 24 hours.",
        featuredImage: "https://image.tmdb.org/t/p/original/yQvjqIvOwpawVZje41Wno2RR0Ui.jpg",
        publishDate: new Date("2024-02-15"),
        author: "Superhero News",
        category: "Trailers",
        tags: ["Deadpool", "Wolverine", "Marvel", "Ryan Reynolds", "Hugh Jackman"],
        featured: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Cinema City Announces Major IMAX Expansion",
        slug: "cinema-city-announces-major-imax-expansion",
        content: `<p>Cinema City has announced plans to install IMAX technology in 15 additional locations across the country, making it the largest IMAX provider nationwide. The $100 million investment comes as premium format screenings continue to drive box office growth.</p>
        
        <p>"Audiences are increasingly seeking out premium theatrical experiences," said Cinema City CEO in a statement. "Our IMAX expansion reflects our commitment to providing the most immersive and technologically advanced cinema experience possible."</p>
        
        <p>The first five new IMAX theaters will open in time for the summer blockbuster season, with the remaining locations scheduled to be operational by the end of the year. Each theater will feature IMAX's laser projection system and signature sound technology.</p>
        
        <p>The announcement comes as several highly anticipated films shot with IMAX cameras are set for release, including "Dune: Part Two," "Furiosa: A Mad Max Saga," and "Mission: Impossible - The Final Reckoning."</p>
        
        <p>Cinema City also revealed plans to upgrade their existing theaters with luxury seating and expanded concession options, including full-service dining in select locations.</p>`,
        excerpt: "Cinema City will install IMAX technology in 15 additional locations, making it the largest IMAX provider nationwide.",
        featuredImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
        publishDate: new Date("2024-01-20"),
        author: "Business Reporter",
        category: "Industry News",
        tags: ["IMAX", "Cinema City", "Theater Technology", "Business"],
        featured: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Furiosa: Early Reactions Call It 'Best Action Film in Decades'",
        slug: "furiosa-early-reactions-call-it-best-action-film-in-decades",
        content: `<p>The first industry screenings of "Furiosa: A Mad Max Saga" have generated extraordinary buzz, with early viewers calling it "the best action film in decades" and "a masterpiece that surpasses 'Fury Road.'"</p>
        
        <p>George Miller's prequel to the acclaimed "Mad Max: Fury Road" stars Anya Taylor-Joy as the younger version of the character originated by Charlize Theron. The film chronicles Furiosa's journey from being kidnapped from the Green Place of Many Mothers to becoming the fearsome warrior seen in "Fury Road."</p>
        
        <p>"Miller has outdone himself," wrote one industry insider on social media. "The action sequences are breathtaking, and Taylor-Joy delivers a career-defining performance."</p>
        
        <p>Chris Hemsworth, who plays the film's villain Warlord Dementus, has also received particular praise for his transformative performance, with many suggesting it could earn awards consideration.</p>
        
        <p>The film reportedly features several extended action sequences that were shot practically with minimal CGI, continuing Miller's commitment to in-camera effects. "Furiosa: A Mad Max Saga" will premiere at the Cannes Film Festival before its worldwide release on May 24, 2024.</p>`,
        excerpt: "Early industry screenings of George Miller's prequel have generated extraordinary buzz, with viewers calling it a masterpiece.",
        featuredImage: "https://image.tmdb.org/t/p/original/uLtVbjvS1O7cvnZPdSuN3nwVaiZ.jpg",
        publishDate: new Date("2024-04-10"),
        author: "Film Critic",
        category: "Early Reviews",
        tags: ["Furiosa", "Mad Max", "George Miller", "Anya Taylor-Joy", "Chris Hemsworth"],
        featured: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Joker: Folie à Deux First Look Reveals Lady Gaga as Harley Quinn",
        slug: "joker-folie-a-deux-first-look-reveals-lady-gaga-as-harley-quinn",
        content: `<p>Warner Bros. has released the first official images from "Joker: Folie à Deux," giving fans their first look at Lady Gaga as Harley Quinn alongside Joaquin Phoenix's return as Arthur Fleck/Joker.</p>
        
        <p>The highly anticipated sequel to the Oscar-winning 2019 film takes a surprising turn, incorporating musical elements as it explores Arthur's time in Arkham Asylum and his relationship with fellow inmate Harley.</p>
        
        <p>"This film is a natural evolution of the character," director Todd Phillips explained. "Arthur always saw his life through a performative lens, so the musical approach feels organic to his journey."</p>
        
        <p>The images show Phoenix's Joker in his iconic red suit, while Gaga's Harley Quinn appears in a more grounded, realistic interpretation of the character than previous screen versions.</p>
        
        <p>Phillips has emphasized that the film, like its predecessor, exists in its own continuity separate from other DC films. "Joker: Folie à Deux" will be released on October 4, 2024, exactly five years after the original film.</p>`,
        excerpt: "Warner Bros. has released the first official images from the highly anticipated sequel, revealing Lady Gaga's take on the iconic character.",
        featuredImage: "https://image.tmdb.org/t/p/original/nxmfH8Kho4Wp0hLkwcxWLQkJbZz.jpg",
        publishDate: new Date("2024-03-25"),
        author: "Entertainment Reporter",
        category: "First Look",
        tags: ["Joker", "Folie à Deux", "Lady Gaga", "Joaquin Phoenix", "DC"],
        featured: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert news into the database
    const result = await mongoose.connection.db.collection('news').insertMany(sampleNews);
    console.log(`Inserted ${result.insertedCount} news articles`);

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};
