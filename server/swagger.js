const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Movie Booking API',
    version: '1.0.0',
    description: 'API documentation for the Movie Booking System',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: 'API Support',
      url: 'https://example.com',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Movies',
      description: 'Movie operations',
    },
    {
      name: 'Events',
      description: 'Event operations',
    },
    {
      name: 'News',
      description: 'News operations',
    },
    {
      name: 'Users',
      description: 'User operations',
    },
    {
      name: 'Theaters',
      description: 'Theater operations',
    },
    {
      name: 'Showtimes',
      description: 'Showtime operations',
    },
    {
      name: 'Bookings',
      description: 'Booking operations',
    },
    {
      name: 'Reviews',
      description: 'Review operations',
    },
    {
      name: 'Payments',
      description: 'Payment operations',
    },
    {
      name: 'Genres',
      description: 'Genre operations',
    },
    {
      name: 'Directors',
      description: 'Director operations',
    },
    {
      name: 'Actors',
      description: 'Actor operations',
    },
    {
      name: 'Comments',
      description: 'Comment operations',
    },
    {
      name: 'Feedback',
      description: 'Feedback operations',
    },
    {
      name: 'FAQs',
      description: 'FAQ operations',
    },
    {
      name: 'Contact',
      description: 'Contact operations',
    },
    {
      name: 'Newsletter',
      description: 'Newsletter operations',
    },
    {
      name: 'Blog Categories',
      description: 'Blog category operations',
    },
    {
      name: 'Tags',
      description: 'Tag operations',
    },
    {
      name: 'Pages',
      description: 'Page operations',
    },
    {
      name: 'Settings',
      description: 'Setting operations',
    },
    {
      name: 'Admin',
      description: 'Admin operations',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // Movie schemas
      Movie: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Movie ID',
          },
          title: {
            type: 'string',
            description: 'Movie title',
          },
          description: {
            type: 'string',
            description: 'Movie description',
          },
          releaseDate: {
            type: 'string',
            format: 'date',
            description: 'Movie release date',
          },
          duration: {
            type: 'number',
            description: 'Movie duration in minutes',
          },
          genre: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Movie genres',
          },
          genres: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Movie genre IDs',
          },
          director: {
            type: 'string',
            description: 'Movie director ID',
          },
          directorName: {
            type: 'string',
            description: 'Movie director name',
          },
          cast: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                actor: {
                  type: 'string',
                  description: 'Actor ID',
                },
                name: {
                  type: 'string',
                  description: 'Actor name',
                },
                character: {
                  type: 'string',
                  description: 'Character name',
                },
                photo: {
                  type: 'string',
                  description: 'Actor photo URL',
                },
                order: {
                  type: 'number',
                  description: 'Actor order in credits',
                },
              },
            },
            description: 'Movie cast',
          },
          poster: {
            type: 'string',
            description: 'Movie poster URL',
          },
          backdrop: {
            type: 'string',
            description: 'Movie backdrop URL',
          },
          trailer: {
            type: 'string',
            description: 'Movie trailer URL',
          },
          rating: {
            type: 'number',
            description: 'Movie rating',
          },
          isActive: {
            type: 'boolean',
            description: 'Is movie active',
          },
          isFeatured: {
            type: 'boolean',
            description: 'Is movie featured',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Movie tag IDs',
          },
        },
      },

      // Genre schemas
      Genre: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Genre ID',
          },
          name: {
            type: 'string',
            description: 'Genre name',
          },
          description: {
            type: 'string',
            description: 'Genre description',
          },
          slug: {
            type: 'string',
            description: 'Genre slug',
          },
          icon: {
            type: 'string',
            description: 'Genre icon',
          },
          color: {
            type: 'string',
            description: 'Genre color',
          },
          order: {
            type: 'number',
            description: 'Genre order',
          },
          isActive: {
            type: 'boolean',
            description: 'Is genre active',
          },
          isFeatured: {
            type: 'boolean',
            description: 'Is genre featured',
          },
        },
      },

      // Director schemas
      Director: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Director ID',
          },
          name: {
            type: 'string',
            description: 'Director name',
          },
          bio: {
            type: 'string',
            description: 'Director biography',
          },
          photo: {
            type: 'string',
            description: 'Director photo URL',
          },
          birthDate: {
            type: 'string',
            format: 'date',
            description: 'Director birth date',
          },
          birthPlace: {
            type: 'string',
            description: 'Director birth place',
          },
          nationality: {
            type: 'string',
            description: 'Director nationality',
          },
          slug: {
            type: 'string',
            description: 'Director slug',
          },
          isActive: {
            type: 'boolean',
            description: 'Is director active',
          },
          isFeatured: {
            type: 'boolean',
            description: 'Is director featured',
          },
        },
      },

      // Actor schemas
      Actor: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Actor ID',
          },
          name: {
            type: 'string',
            description: 'Actor name',
          },
          bio: {
            type: 'string',
            description: 'Actor biography',
          },
          photo: {
            type: 'string',
            description: 'Actor photo URL',
          },
          birthDate: {
            type: 'string',
            format: 'date',
            description: 'Actor birth date',
          },
          birthPlace: {
            type: 'string',
            description: 'Actor birth place',
          },
          nationality: {
            type: 'string',
            description: 'Actor nationality',
          },
          height: {
            type: 'string',
            description: 'Actor height',
          },
          slug: {
            type: 'string',
            description: 'Actor slug',
          },
          isActive: {
            type: 'boolean',
            description: 'Is actor active',
          },
          isFeatured: {
            type: 'boolean',
            description: 'Is actor featured',
          },
        },
      },

      // Comment schemas
      Comment: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Comment ID',
          },
          user: {
            type: 'string',
            description: 'User ID',
          },
          content: {
            type: 'string',
            description: 'Comment content',
          },
          movie: {
            type: 'string',
            description: 'Movie ID',
          },
          news: {
            type: 'string',
            description: 'News ID',
          },
          event: {
            type: 'string',
            description: 'Event ID',
          },
          parent: {
            type: 'string',
            description: 'Parent comment ID',
          },
          likes: {
            type: 'number',
            description: 'Number of likes',
          },
          dislikes: {
            type: 'number',
            description: 'Number of dislikes',
          },
          isApproved: {
            type: 'boolean',
            description: 'Is comment approved',
          },
        },
      },

      // Tag schemas
      Tag: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Tag ID',
          },
          name: {
            type: 'string',
            description: 'Tag name',
          },
          description: {
            type: 'string',
            description: 'Tag description',
          },
          slug: {
            type: 'string',
            description: 'Tag slug',
          },
          type: {
            type: 'string',
            description: 'Tag type',
            enum: ['movie', 'blog', 'event', 'general'],
          },
          color: {
            type: 'string',
            description: 'Tag color',
          },
          icon: {
            type: 'string',
            description: 'Tag icon',
          },
          order: {
            type: 'number',
            description: 'Tag order',
          },
          isActive: {
            type: 'boolean',
            description: 'Is tag active',
          },
          isFeatured: {
            type: 'boolean',
            description: 'Is tag featured',
          },
        },
      },

      // Blog Category schemas
      BlogCategory: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Blog category ID',
          },
          name: {
            type: 'string',
            description: 'Blog category name',
          },
          description: {
            type: 'string',
            description: 'Blog category description',
          },
          slug: {
            type: 'string',
            description: 'Blog category slug',
          },
          image: {
            type: 'string',
            description: 'Blog category image URL',
          },
          icon: {
            type: 'string',
            description: 'Blog category icon',
          },
          color: {
            type: 'string',
            description: 'Blog category color',
          },
          parent: {
            type: 'string',
            description: 'Parent category ID',
          },
          order: {
            type: 'number',
            description: 'Blog category order',
          },
          isActive: {
            type: 'boolean',
            description: 'Is blog category active',
          },
          featuredInHome: {
            type: 'boolean',
            description: 'Is blog category featured in home',
          },
          featuredInMenu: {
            type: 'boolean',
            description: 'Is blog category featured in menu',
          },
        },
      },

      // FAQ schemas
      FAQ: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'FAQ ID',
          },
          question: {
            type: 'string',
            description: 'FAQ question',
          },
          answer: {
            type: 'string',
            description: 'FAQ answer',
          },
          category: {
            type: 'string',
            description: 'FAQ category',
          },
          order: {
            type: 'number',
            description: 'FAQ order',
          },
          isActive: {
            type: 'boolean',
            description: 'Is FAQ active',
          },
        },
      },

      // Page schemas
      Page: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Page ID',
          },
          title: {
            type: 'string',
            description: 'Page title',
          },
          content: {
            type: 'string',
            description: 'Page content',
          },
          excerpt: {
            type: 'string',
            description: 'Page excerpt',
          },
          slug: {
            type: 'string',
            description: 'Page slug',
          },
          featuredImage: {
            type: 'string',
            description: 'Page featured image URL',
          },
          status: {
            type: 'string',
            description: 'Page status',
            enum: ['draft', 'published', 'archived'],
          },
          template: {
            type: 'string',
            description: 'Page template',
          },
          order: {
            type: 'number',
            description: 'Page order',
          },
          parent: {
            type: 'string',
            description: 'Parent page ID',
          },
          isInMenu: {
            type: 'boolean',
            description: 'Is page in menu',
          },
          isInFooter: {
            type: 'boolean',
            description: 'Is page in footer',
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Page published date',
          },
        },
      },

      // Setting schemas
      Setting: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: 'Setting key',
          },
          value: {
            type: 'object',
            description: 'Setting value',
          },
          group: {
            type: 'string',
            description: 'Setting group',
          },
          label: {
            type: 'string',
            description: 'Setting label',
          },
          type: {
            type: 'string',
            description: 'Setting type',
            enum: ['string', 'number', 'boolean', 'object', 'array'],
          },
          isPublic: {
            type: 'boolean',
            description: 'Is setting public',
          },
          order: {
            type: 'number',
            description: 'Setting order',
          },
        },
      },

      // Error response
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
          },
          stack: {
            type: 'string',
            description: 'Error stack trace',
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Not authorized to access this resource',
                },
              },
            },
          },
        },
      },
      NotFoundError: {
        description: 'The specified resource was not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Resource not found',
                },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Validation failed',
                },
                errors: {
                  type: 'object',
                  example: {
                    field: 'Field is required',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: [
    path.join(__dirname, './routes/*.js'),
    path.join(__dirname, './models/*.js'),
    path.join(__dirname, './controllers/*.js'),
    path.join(__dirname, './docs/*.js'),
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
