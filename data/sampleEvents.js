const events = [
  {
    title: "Summer Film Festival 2024",
    description: "Join us for a week-long celebration of cinema featuring screenings of classic and contemporary films, panel discussions with filmmakers, and interactive workshops.",
    shortDescription: "A week-long celebration of cinema with screenings, panels, and workshops.",
    date: new Date("2024-07-15"),
    endDate: new Date("2024-07-21"),
    startTime: "10:00 AM",
    endTime: "10:00 PM",
    location: "Central Park Amphitheater",
    venue: "Central Park",
    address: "5th Avenue & 59th Street",
    city: "New York",
    state: "NY",
    zipCode: "10022",
    country: "USA",
    coordinates: {
      type: "Point",
      coordinates: [-73.9654, 40.7829]
    },
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    featured: true,
    category: "Film Festival",
    categories: ["Film Festival", "Entertainment", "Arts & Culture"],
    organizer: "NYC Film Society",
    ticketPrice: 50,
    ticketUrl: "https://example.com/tickets/summer-film-festival",
    capacity: 5000,
    isActive: true,
    status: "upcoming"
  },
  {
    title: "Director's Spotlight: Christopher Nolan",
    description: "An in-depth retrospective of Christopher Nolan's filmography, featuring screenings of his most acclaimed works and a discussion of his unique visual style and narrative techniques.",
    shortDescription: "A retrospective of Christopher Nolan's films with screenings and discussions.",
    date: new Date("2024-06-10"),
    endDate: new Date("2024-06-12"),
    startTime: "6:00 PM",
    endTime: "11:00 PM",
    location: "Film Forum",
    venue: "Film Forum",
    address: "209 W Houston St",
    city: "New York",
    state: "NY",
    zipCode: "10014",
    country: "USA",
    coordinates: {
      type: "Point",
      coordinates: [-74.0046, 40.7291]
    },
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featured: true,
    category: "Film Screening",
    categories: ["Film Screening", "Director Spotlight", "Arts & Culture"],
    organizer: "Cinema Appreciation Society",
    ticketPrice: 35,
    ticketUrl: "https://example.com/tickets/nolan-spotlight",
    capacity: 200,
    isActive: true,
    status: "upcoming"
  },
  {
    title: "Animation Workshop for Beginners",
    description: "Learn the fundamentals of animation from industry professionals. This hands-on workshop covers basic principles, character design, and storytelling techniques for aspiring animators.",
    shortDescription: "A hands-on workshop teaching animation fundamentals for beginners.",
    date: new Date("2024-05-20"),
    endDate: new Date("2024-05-20"),
    startTime: "9:00 AM",
    endTime: "4:00 PM",
    location: "Digital Arts Center",
    venue: "Digital Arts Center",
    address: "123 Creative Lane",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90028",
    country: "USA",
    image: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    featured: false,
    category: "Workshop",
    categories: ["Workshop", "Animation", "Education"],
    organizer: "Animation Guild",
    ticketPrice: 75,
    ticketUrl: "https://example.com/tickets/animation-workshop",
    capacity: 30,
    isActive: true,
    status: "upcoming"
  },
  {
    title: "Oscar Winners Screening Series",
    description: "Experience the magic of cinema with our Oscar Winners Screening Series. Each week, we'll showcase a different Academy Award-winning film, followed by a discussion of its cultural impact and artistic merit.",
    shortDescription: "Weekly screenings of Oscar-winning films with post-film discussions.",
    date: new Date("2024-06-05"),
    endDate: new Date("2024-07-31"),
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    location: "Landmark Theater",
    venue: "Landmark Theater",
    address: "657 W 57th St",
    city: "New York",
    state: "NY",
    zipCode: "10019",
    country: "USA",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    featured: false,
    category: "Film Screening",
    categories: ["Film Screening", "Awards", "Discussion"],
    organizer: "Cinema Appreciation Society",
    ticketPrice: 15,
    ticketUrl: "https://example.com/tickets/oscar-series",
    capacity: 150,
    isActive: true,
    status: "upcoming"
  },
  {
    title: "International Documentary Festival",
    description: "A celebration of documentary filmmaking from around the world. This festival showcases powerful stories that illuminate social issues, cultural phenomena, and extraordinary individuals.",
    shortDescription: "A festival showcasing documentary films from around the world.",
    date: new Date("2024-08-10"),
    endDate: new Date("2024-08-15"),
    startTime: "11:00 AM",
    endTime: "9:00 PM",
    location: "Downtown Arts Center",
    venue: "Downtown Arts Center",
    address: "450 Broadway",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "USA",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featured: true,
    category: "Film Festival",
    categories: ["Film Festival", "Documentary", "International"],
    organizer: "Documentary Film Association",
    ticketPrice: 40,
    ticketUrl: "https://example.com/tickets/doc-festival",
    capacity: 1000,
    isActive: true,
    status: "upcoming"
  },
  {
    title: "Screenwriting Masterclass",
    description: "An intensive one-day masterclass on screenwriting taught by award-winning screenwriters. Learn about story structure, character development, dialogue, and how to pitch your screenplay to producers.",
    shortDescription: "An intensive masterclass on screenwriting taught by industry professionals.",
    date: new Date("2024-05-25"),
    endDate: new Date("2024-05-25"),
    startTime: "10:00 AM",
    endTime: "5:00 PM",
    location: "Writers Guild Theater",
    venue: "Writers Guild Theater",
    address: "135 S Doheny Dr",
    city: "Beverly Hills",
    state: "CA",
    zipCode: "90211",
    country: "USA",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80",
    featured: false,
    category: "Workshop",
    categories: ["Workshop", "Screenwriting", "Education"],
    organizer: "Screenwriters Guild",
    ticketPrice: 120,
    ticketUrl: "https://example.com/tickets/screenwriting-masterclass",
    capacity: 50,
    isActive: true,
    status: "upcoming"
  },
  {
    title: "Horror Film Night: Classic Monsters",
    description: "A special evening dedicated to classic monster movies from the golden age of horror. Join us for screenings of iconic films featuring Dracula, Frankenstein, and the Wolf Man, with commentary from film historians.",
    shortDescription: "An evening of classic monster movies with expert commentary.",
    date: new Date("2024-10-30"),
    endDate: new Date("2024-10-30"),
    startTime: "6:00 PM",
    endTime: "11:59 PM",
    location: "Vintage Theater",
    venue: "Vintage Theater",
    address: "789 Main St",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    country: "USA",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1022&q=80",
    featured: false,
    category: "Film Screening",
    categories: ["Film Screening", "Horror", "Classics"],
    organizer: "Horror Film Society",
    ticketPrice: 20,
    ticketUrl: "https://example.com/tickets/horror-night",
    capacity: 100,
    isActive: true,
    status: "upcoming"
  },
  {
    title: "Film Industry Career Fair",
    description: "Connect with studios, production companies, and industry professionals at our annual Film Industry Career Fair. Opportunities for networking, portfolio reviews, and on-the-spot interviews for positions in all aspects of filmmaking.",
    shortDescription: "A career fair connecting job seekers with opportunities in the film industry.",
    date: new Date("2024-09-15"),
    endDate: new Date("2024-09-15"),
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    location: "Convention Center",
    venue: "Convention Center",
    address: "1234 Industry Blvd",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90015",
    country: "USA",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1184&q=80",
    featured: false,
    category: "Career Fair",
    categories: ["Career Fair", "Networking", "Film Industry"],
    organizer: "Film Industry Association",
    ticketPrice: 0,
    ticketUrl: "https://example.com/tickets/career-fair",
    capacity: 2000,
    isActive: true,
    status: "upcoming"
  },
  {
    title: "Outdoor Movie Night: Summer Classics",
    description: "Bring a blanket and enjoy classic summer movies under the stars. Our outdoor screening series features family-friendly films, food trucks, and pre-show entertainment.",
    shortDescription: "Family-friendly outdoor movie screenings with food and entertainment.",
    date: new Date("2024-07-05"),
    endDate: new Date("2024-08-30"),
    startTime: "8:00 PM",
    endTime: "11:00 PM",
    location: "Riverside Park",
    venue: "Riverside Park",
    address: "Riverside Dr & 72nd St",
    city: "New York",
    state: "NY",
    zipCode: "10023",
    country: "USA",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featured: true,
    category: "Film Screening",
    categories: ["Film Screening", "Outdoor", "Family"],
    organizer: "City Parks Department",
    ticketPrice: 5,
    ticketUrl: "https://example.com/tickets/outdoor-movies",
    capacity: 500,
    isActive: true,
    status: "upcoming"
  },
  {
    title: "Virtual Reality Filmmaking Showcase",
    description: "Experience the cutting edge of cinematic storytelling with our VR Filmmaking Showcase. Try out the latest in virtual reality filmmaking technology and view groundbreaking immersive narratives.",
    shortDescription: "A showcase of virtual reality films and filmmaking technology.",
    date: new Date("2024-11-10"),
    endDate: new Date("2024-11-12"),
    startTime: "12:00 PM",
    endTime: "8:00 PM",
    location: "Tech Innovation Center",
    venue: "Tech Innovation Center",
    address: "500 Technology Way",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    country: "USA",
    image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featured: false,
    category: "Technology",
    categories: ["Technology", "Virtual Reality", "Innovation"],
    organizer: "VR Filmmakers Collective",
    ticketPrice: 30,
    ticketUrl: "https://example.com/tickets/vr-showcase",
    capacity: 300,
    isActive: true,
    status: "upcoming"
  }
];

module.exports = events;
