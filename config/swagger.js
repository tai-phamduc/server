const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Booking API',
      version: '1.0.0',
      description: 'API documentation for the Movie Booking application',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@moviebooking.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Development server',
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
        Movie: {
          type: 'object',
          required: [
            'title',
            'description',
            'releaseDate',
            'duration',
            'genre',
            'director',
            'cast',
            'poster',
            'trailer',
            'status',
          ],
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
              type: 'integer',
              description: 'Movie duration in minutes',
            },
            genre: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Movie genres',
            },
            director: {
              type: 'string',
              description: 'Movie director',
            },
            cast: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Movie cast',
            },
            poster: {
              type: 'string',
              description: 'URL to movie poster',
            },
            trailer: {
              type: 'string',
              description: 'URL to movie trailer',
            },
            status: {
              type: 'string',
              enum: ['Now Playing', 'Coming Soon', 'Featured'],
              description: 'Movie status',
            },
            rating: {
              type: 'number',
              description: 'Movie rating (0-10)',
            },
            language: {
              type: 'string',
              description: 'Movie language',
            },
            country: {
              type: 'string',
              description: 'Movie country',
            },
            ageRating: {
              type: 'string',
              enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated'],
              description: 'Movie age rating',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the movie is active',
            },
            reviewCount: {
              type: 'integer',
              description: 'Number of reviews',
            },
            totalRating: {
              type: 'number',
              description: 'Sum of all ratings',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Additional movie images',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Update timestamp',
            },
          },
        },
        Review: {
          type: 'object',
          required: ['user', 'movie', 'rating', 'title', 'comment'],
          properties: {
            _id: {
              type: 'string',
              description: 'Review ID',
            },
            user: {
              type: 'string',
              description: 'User ID',
            },
            movie: {
              type: 'string',
              description: 'Movie ID',
            },
            rating: {
              type: 'number',
              description: 'Rating (0-10)',
            },
            title: {
              type: 'string',
              description: 'Review title',
            },
            comment: {
              type: 'string',
              description: 'Review comment',
            },
            spoiler: {
              type: 'boolean',
              description: 'Whether the review contains spoilers',
            },
            watchedInTheater: {
              type: 'boolean',
              description: 'Whether the user watched the movie in a theater',
            },
            likes: {
              type: 'integer',
              description: 'Number of likes',
            },
            dislikes: {
              type: 'integer',
              description: 'Number of dislikes',
            },
            isApproved: {
              type: 'boolean',
              description: 'Whether the review is approved',
            },
            isReported: {
              type: 'boolean',
              description: 'Whether the review is reported',
            },
            reportCount: {
              type: 'integer',
              description: 'Number of reports',
            },
            reportReasons: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Report reasons',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Update timestamp',
            },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              description: 'User password (hashed)',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
            },
            isVerified: {
              type: 'boolean',
              description: 'Whether the user is verified',
            },
            profilePicture: {
              type: 'string',
              description: 'URL to profile picture',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
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
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFoundError: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
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
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../models/*.js'),
    path.join(__dirname, '../controllers/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
