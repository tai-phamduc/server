const tags = [
 // Movie tags
  {
    name: 'Oscar Winner',
    slug: 'oscar-winner',
    description: 'Films that have won Academy Awards',
    type: 'movie',
    color: '#ffd700',
    icon: 'fa-solid fa-trophy',
    isFeatured: true,
    order: 1
  },
  {
    name: 'Blockbuster',
    slug: 'blockbuster',
    description: 'High-budget, commercially successful films',
    type: 'movie',
    color: '#e53935',
    icon: 'fa-solid fa-fire',
    isFeatured: true,
    order: 2
  },
  {
    name: 'Indie Film',
    slug: 'indie-film',
    description: 'Independent films with unique storytelling',
    type: 'movie',
    color: '#8e24aa',
    icon: 'fa-solid fa-film',
    isFeatured: true,
    order: 3
  },
  {
    name: 'Based on Book',
    slug: 'based-on-book',
    description: 'Films adapted from books or novels',
    type: 'movie',
    color: '#1e88e5',
    icon: 'fa-solid fa-book',
    isFeatured: true,
    order: 4
  },
  {
    name: 'Sequel',
    slug: 'sequel',
    description: 'Follow-up films to previous movies',
    type: 'movie',
    color: '#43a047',
    icon: 'fa-solid fa-arrow-right',
    isFeatured: false,
    order: 5
  },
  {
    name: 'Remake',
    slug: 'remake',
    description: 'New versions of previously released films',
    type: 'movie',
    color: '#fb8c00',
    icon: 'fa-solid fa-rotate',
    isFeatured: false,
    order: 6
  },
  {
    name: 'Franchise',
    slug: 'franchise',
    description: 'Films that are part of a larger series or universe',
    type: 'movie',
    color: '#6d4c41',
    icon: 'fa-solid fa-link',
    isFeatured: true,
    order: 7
  },
  {
    name: 'Classic',
    slug: 'classic',
    description: 'Timeless films considered among the best',
    type: 'movie',
    color: '#546e7a',
    icon: 'fa-solid fa-crown',
    isFeatured: true,
    order: 8
  },
  
  // Blog tags
  {
    name: 'Exclusive',
    slug: 'exclusive',
    description: 'Exclusive content and interviews',
    type: 'blog',
    color: '#d81b60',
    icon: 'fa-solid fa-star',
    isFeatured: true,
    order: 9
  },
  {
    name: 'Breaking News',
    slug: 'breaking-news',
    description: 'Latest and most important news',
    type: 'blog',
    color: '#e53935',
    icon: 'fa-solid fa-bolt',
    isFeatured: true,
    order: 10
  },
  {
    name: 'Opinion',
    slug: 'opinion',
    description: 'Editorial opinions and commentary',
    type: 'blog',
    color: '#8e24aa',
    icon: 'fa-solid fa-comment',
    isFeatured: false,
    order: 11
  },
  {
    name: 'Analysis',
    slug: 'analysis',
    description: 'In-depth analysis and research',
    type: 'blog',
    color: '#1e88e5',
    icon: 'fa-solid fa-magnifying-glass-chart',
    isFeatured: true,
    order: 12
  },
  {
    name: 'Interview',
    slug: 'interview',
    description: 'Interviews with industry professionals',
    type: 'blog',
    color: '#43a047',
    icon: 'fa-solid fa-microphone',
    isFeatured: true,
    order: 13
  },
  {
    name: 'Review',
    slug: 'review',
    description: 'Film reviews and critiques',
    type: 'blog',
    color: '#fb8c00',
    icon: 'fa-solid fa-star-half-stroke',
    isFeatured: true,
    order: 14
  },
  
  // Event tags
  {
    name: 'Premiere',
    slug: 'premiere',
    description: 'Film premiere events',
    type: 'event',
    color: '#d81b60',
    icon: 'fa-solid fa-film',
    isFeatured: true,
    order: 15
  },
  {
    name: 'Festival',
    slug: 'festival',
    description: 'Film festival events',
    type: 'event',
    color: '#e53935',
    icon: 'fa-solid fa-ticket',
    isFeatured: true,
    order: 16
  },
  {
    name: 'Q&A Session',
    slug: 'qa-session',
    description: 'Question and answer sessions with filmmakers',
    type: 'event',
    color: '#8e24aa',
    icon: 'fa-solid fa-question',
    isFeatured: false,
    order: 17
  },
  {
    name: 'Special Screening',
    slug: 'special-screening',
    description: 'Special film screening events',
    type: 'event',
    color: '#1e88e5',
    icon: 'fa-solid fa-clapperboard',
    isFeatured: true,
    order: 18
  },
  {
    name: 'Awards Ceremony',
    slug: 'awards-ceremony',
    description: 'Film awards ceremonies',
    type: 'event',
    color: '#ffd700',
    icon: 'fa-solid fa-trophy',
    isFeatured: true,
    order: 19
  },
  
  // General tags
  {
    name: 'Featured',
    slug: 'featured',
    description: 'Featured content across the site',
    type: 'general',
    color: '#d81b60',
    icon: 'fa-solid fa-star',
    isFeatured: true,
    order: 20
  },
  {
    name: 'Trending',
    slug: 'trending',
    description: 'Currently popular content',
    type: 'general',
    color: '#e53935',
    icon: 'fa-solid fa-arrow-trend-up',
    isFeatured: true,
    order: 21
  },
  {
    name: 'Must See',
    slug: 'must-see',
    description: 'Highly recommended content',
    type: 'general',
    color: '#8e24aa',
    icon: 'fa-solid fa-eye',
    isFeatured: true,
    order: 22
  }];

module.exports = tags;
