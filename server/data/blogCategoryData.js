const blogCategories = [
{
    name: 'Movie News',
    slug: 'movie-news',
    description: 'Latest news and updates about movies, actors, directors, and the film industry.',
    icon: 'fa-solid fa-film',
    color: '#1e88e5',
    featuredInHome: true,
    featuredInMenu: true,
    order: 1
  },
  {
    name: 'Reviews',
    slug: 'reviews',
    description: 'Movie reviews, ratings, and critical analysis of the latest releases.',
    icon: 'fa-solid fa-star',
    color: '#ffb300',
    featuredInHome: true,
    featuredInMenu: true,
    order: 2
  },
  {
    name: 'Interviews',
    slug: 'interviews',
    description: 'Exclusive interviews with actors, directors, producers, and other film industry professionals.',
    icon: 'fa-solid fa-microphone',
    color: '#8e24aa',
    featuredInHome: true,
    featuredInMenu: true,
    order: 3
  },
  {
    name: 'Behind the Scenes',
    slug: 'behind-the-scenes',
    description: 'Behind-the-scenes stories, making-of features, and production insights.',
    icon: 'fa-solid fa-clapperboard',
    color: '#43a047',
    featuredInHome: true,
    featuredInMenu: false,
    order: 4
  },
  {
    name: 'Box Office',
    slug: 'box-office',
    description: 'Box office reports, analysis, and trends in movie ticket sales.',
    icon: 'fa-solid fa-chart-line',
    color: '#e53935',
    featuredInHome: false,
    featuredInMenu: false,
    order: 5
  },
  {
    name: 'Trailers & Teasers',
    slug: 'trailers-teasers',
    description: 'Latest movie trailers, teasers, and promotional videos.',
    icon: 'fa-solid fa-play',
    color: '#f4511e',
    featuredInHome: true,
    featuredInMenu: false,
    order: 6
  },
  {
    name: 'Awards & Festivals',
    slug: 'awards-festivals',
    description: 'Coverage of film awards, ceremonies, and international film festivals.',
    icon: 'fa-solid fa-trophy',
    color: '#fdd835',
    featuredInHome: false,
    featuredInMenu: true,
    order: 7
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Film technology, special effects, innovations, and technical aspects of filmmaking.',
    icon: 'fa-solid fa-gears',
    color: '#546e7a',
    featuredInHome: false,
    featuredInMenu: false,
    order: 8
  },
  {
    name: 'Streaming',
    slug: 'streaming',
    description: 'News and updates about streaming platforms, digital releases, and online content.',
    icon: 'fa-solid fa-display',
    color: '#00acc1',
    featuredInHome: true,
    featuredInMenu: true,
    order: 9
  },
  {
    name: 'Throwbacks',
    slug: 'throwbacks',
    description: 'Retrospectives, anniversaries, and nostalgic looks at classic films and film history.',
    icon: 'fa-solid fa-clock-rotate-left',
    color: '#6d4c41',
    featuredInHome: false,
    featuredInMenu: false,
    order: 10
  }];

module.exports = blogCategories;
