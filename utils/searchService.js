const Movie = require('../models/Movie');
const Event = require('../models/Event');
const News = require('../models/News');
const Theater = require('../models/Theater');
const Content = require('../models/Content');

// Search movies
const searchMovies = async (query, options = {}) => {
  try {
    const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;

    // Build search pipeline
    const pipeline = [
      {
        $search: {
          index: 'movies',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: ['title', 'description', 'director', 'cast'],
                  score: { boost: { value: 2 } },
                },
              },
              {
                text: {
                  query: query,
                  path: ['genre'],
                  score: { boost: { value: 1.5 } },
                },
              },
            ],
          },
          highlight: {
            path: ['title', 'description'],
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' },
          highlights: { $meta: 'searchHighlights' },
        },
      },
      { $sort: { score: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    // Execute search
    const results = await Movie.aggregate(pipeline);

    // Get total count
    const countPipeline = [
      {
        $search: {
          index: 'movies',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: ['title', 'description', 'director', 'cast'],
                },
              },
              {
                text: {
                  query: query,
                  path: ['genre'],
                },
              },
            ],
          },
        },
      },
      { $count: 'total' },
    ];

    const countResult = await Movie.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    // Fallback to regular search if Atlas Search is not available
    const regex = new RegExp(query, 'i');
    const results = await Movie.find({
      $or: [
        { title: regex },
        { description: regex },
        { director: regex },
        { cast: { $in: [regex] } },
        { genre: { $in: [regex] } },
      ],
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments({
      $or: [
        { title: regex },
        { description: regex },
        { director: regex },
        { cast: { $in: [regex] } },
        { genre: { $in: [regex] } },
      ],
    });

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  }
};

// Search events
const searchEvents = async (query, options = {}) => {
  try {
    const { limit = 10, skip = 0, sort = { date: 1 } } = options;

    // Build search pipeline
    const pipeline = [
      {
        $search: {
          index: 'events',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: ['title', 'description'],
                  score: { boost: { value: 2 } },
                },
              },
              {
                text: {
                  query: query,
                  path: ['location'],
                  score: { boost: { value: 1.5 } },
                },
              },
            ],
          },
          highlight: {
            path: ['title', 'description'],
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' },
          highlights: { $meta: 'searchHighlights' },
        },
      },
      { $sort: { score: -1, date: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    // Execute search
    const results = await Event.aggregate(pipeline);

    // Get total count
    const countPipeline = [
      {
        $search: {
          index: 'events',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: ['title', 'description'],
                },
              },
              {
                text: {
                  query: query,
                  path: ['location'],
                },
              },
            ],
          },
        },
      },
      { $count: 'total' },
    ];

    const countResult = await Event.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error searching events:', error);
    // Fallback to regular search if Atlas Search is not available
    const regex = new RegExp(query, 'i');
    const results = await Event.find({
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
      ],
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments({
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
      ],
    });

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  }
};

// Search news
const searchNews = async (query, options = {}) => {
  try {
    const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;

    // Build search pipeline
    const pipeline = [
      {
        $search: {
          index: 'news',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: ['title', 'content'],
                  score: { boost: { value: 2 } },
                },
              },
              {
                text: {
                  query: query,
                  path: ['category', 'tags'],
                  score: { boost: { value: 1.5 } },
                },
              },
            ],
          },
          highlight: {
            path: ['title', 'content'],
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' },
          highlights: { $meta: 'searchHighlights' },
        },
      },
      { $sort: { score: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    // Execute search
    const results = await News.aggregate(pipeline);

    // Get total count
    const countPipeline = [
      {
        $search: {
          index: 'news',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: ['title', 'content'],
                },
              },
              {
                text: {
                  query: query,
                  path: ['category', 'tags'],
                },
              },
            ],
          },
        },
      },
      { $count: 'total' },
    ];

    const countResult = await News.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error searching news:', error);
    // Fallback to regular search if Atlas Search is not available
    const regex = new RegExp(query, 'i');
    const results = await News.find({
      $or: [
        { title: regex },
        { content: regex },
        { category: regex },
        { tags: { $in: [regex] } },
      ],
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments({
      $or: [
        { title: regex },
        { content: regex },
        { category: regex },
        { tags: { $in: [regex] } },
      ],
    });

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  }
};

// Search theaters
const searchTheaters = async (query, options = {}) => {
  try {
    const { limit = 10, skip = 0, sort = { name: 1 } } = options;

    // Build search pipeline
    const pipeline = [
      {
        $search: {
          index: 'theaters',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: ['name'],
                  score: { boost: { value: 2 } },
                },
              },
              {
                text: {
                  query: query,
                  path: ['location.address', 'location.city', 'location.state', 'location.country'],
                  score: { boost: { value: 1.5 } },
                },
              },
            ],
          },
          highlight: {
            path: ['name', 'location.address', 'location.city'],
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' },
          highlights: { $meta: 'searchHighlights' },
        },
      },
      { $sort: { score: -1, name: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    // Execute search
    const results = await Theater.aggregate(pipeline);

    // Get total count
    const countPipeline = [
      {
        $search: {
          index: 'theaters',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: ['name'],
                },
              },
              {
                text: {
                  query: query,
                  path: ['location.address', 'location.city', 'location.state', 'location.country'],
                },
              },
            ],
          },
        },
      },
      { $count: 'total' },
    ];

    const countResult = await Theater.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error searching theaters:', error);
    // Fallback to regular search if Atlas Search is not available
    const regex = new RegExp(query, 'i');
    const results = await Theater.find({
      $or: [
        { name: regex },
        { 'location.address': regex },
        { 'location.city': regex },
        { 'location.state': regex },
        { 'location.country': regex },
      ],
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Theater.countDocuments({
      $or: [
        { name: regex },
        { 'location.address': regex },
        { 'location.city': regex },
        { 'location.state': regex },
        { 'location.country': regex },
      ],
    });

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  }
};

// Search content
const searchContent = async (query, options = {}) => {
  try {
    const { limit = 10, skip = 0, type, status = 'published' } = options;

    // Build search pipeline
    const pipeline = [
      {
        $search: {
          index: 'content',
          compound: {
            must: [
              {
                text: {
                  query: query,
                  path: ['title', 'content', 'summary'],
                },
              },
            ],
            filter: [
              {
                text: {
                  query: status,
                  path: 'status',
                },
              },
            ],
          },
          highlight: {
            path: ['title', 'content', 'summary'],
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' },
          highlights: { $meta: 'searchHighlights' },
        },
      },
      { $sort: { score: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    // Add type filter if provided
    if (type) {
      pipeline[0].$search.compound.filter.push({
        text: {
          query: type,
          path: 'type',
        },
      });
    }

    // Execute search
    const results = await Content.aggregate(pipeline);

    // Get total count
    const countPipeline = [
      {
        $search: {
          index: 'content',
          compound: {
            must: [
              {
                text: {
                  query: query,
                  path: ['title', 'content', 'summary'],
                },
              },
            ],
            filter: [
              {
                text: {
                  query: status,
                  path: 'status',
                },
              },
            ],
          },
        },
      },
      { $count: 'total' },
    ];

    // Add type filter if provided
    if (type) {
      countPipeline[0].$search.compound.filter.push({
        text: {
          query: type,
          path: 'type',
        },
      });
    }

    const countResult = await Content.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error searching content:', error);
    // Fallback to regular search if Atlas Search is not available
    const regex = new RegExp(query, 'i');
    const filter = {
      status: status || 'published',
      $or: [
        { title: regex },
        { content: regex },
        { summary: regex },
      ],
    };

    if (type) {
      filter.type = type;
    }

    const results = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Content.countDocuments(filter);

    return {
      results,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    };
  }
};

// Global search across all collections
const globalSearch = async (query, options = {}) => {
  try {
    const { limit = 5 } = options;

    // Search in parallel
    const [movies, events, news, theaters, content] = await Promise.all([
      searchMovies(query, { limit }),
      searchEvents(query, { limit }),
      searchNews(query, { limit }),
      searchTheaters(query, { limit }),
      searchContent(query, { limit }),
    ]);

    return {
      movies: movies.results,
      events: events.results,
      news: news.results,
      theaters: theaters.results,
      content: content.results,
      totals: {
        movies: movies.total,
        events: events.total,
        news: news.total,
        theaters: theaters.total,
        content: content.total,
        all: movies.total + events.total + news.total + theaters.total + content.total,
      },
    };
  } catch (error) {
    console.error('Error performing global search:', error);
    throw error;
  }
};

module.exports = {
  searchMovies,
  searchEvents,
  searchNews,
  searchTheaters,
  searchContent,
  globalSearch,
};
