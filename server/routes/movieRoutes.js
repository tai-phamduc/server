const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  getMoviesByStatus,
  getMoviesByGenre,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
  getMovieRecommendations,
  getTopRatedMovies
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  validateCreateMovie,
  validateUpdateMovie,
  validateMovieId,
  validateMovieSearch
} = require('../middleware/validation/movieValidation');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management
 */

// Public routes

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Now Playing, Coming Soon, Featured]
 *         description: Movie status
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Movie genre (comma-separated for multiple)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', validateMovieSearch, cacheMiddleware({
  duration: 300,
  etag: true,
  varyOn: ['Accept-Language']
}), getMovies);

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of movies matching the search
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/search', validateMovieSearch, cacheMiddleware({
  duration: 300,
  etag: true,
  varyOn: ['Accept-Language']
}), searchMovies);

/**
 * @swagger
 * /movies/top-rated:
 *   get:
 *     summary: Get top rated movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of movies to return
 *     responses:
 *       200:
 *         description: List of top rated movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/top-rated', cacheMiddleware({
  duration: 600,
  etag: true
}), getTopRatedMovies);

/**
 * @swagger
 * /movies/status/{status}:
 *   get:
 *     summary: Get movies by status
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Now Playing, Coming Soon, Featured]
 *         required: true
 *         description: Movie status
 *     responses:
 *       200:
 *         description: List of movies with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/status/:status', cacheMiddleware({
  duration: 300,
  etag: true
}), getMoviesByStatus);

/**
 * @swagger
 * /movies/genre/{genre}:
 *   get:
 *     summary: Get movies by genre
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: genre
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie genre
 *     responses:
 *       200:
 *         description: List of movies with the specified genre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/genre/:genre', cacheMiddleware({
  duration: 300,
  etag: true
}), getMoviesByGenre);

/**
 * @swagger
 * /movies/{id}/recommendations:
 *   get:
 *     summary: Get movie recommendations
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: List of recommended movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id/recommendations', validateMovieId, cacheMiddleware({
  duration: 600,
  etag: true
}), getMovieRecommendations);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', validateMovieId, cacheMiddleware({
  duration: 600,
  etag: true
}), getMovieById);

// Protected routes (admin only)

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Created movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', protect, admin, validateCreateMovie, createMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Updated movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', protect, admin, validateMovieId, validateUpdateMovie, updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', protect, admin, validateMovieId, deleteMovie);

module.exports = router;
