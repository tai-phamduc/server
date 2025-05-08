const Comment = require('../models/Comment');
const Movie = require('../models/Movie');
const News = require('../models/News');
const Event = require('../models/Event');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get comments for a movie
// @route   GET /api/comments/movie/:id
// @access  Public
const getMovieComments = asyncHandler(async (req, res) => {
  const movieId = req.params.id;

  // Check if movie exists
  const movie = await Movie.findById(movieId);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || 'newest';

  let sortOptions = {};
  switch (sort) {
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    case 'oldest':
      sortOptions = { createdAt: 1 };
      break;
    case 'likes':
      sortOptions = { likes: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  const comments = await Comment.findByMovie(movieId, {
    sort: sortOptions,
    limit,
    skip: (page - 1) * limit
  });

  const total = await Comment.countDocuments({
    movie: movieId,
    parent: null,
    isApproved: true
  });

  res.json({
    comments,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get comments for a news article
// @route   GET /api/comments/news/:id
// @access  Public
const getNewsComments = asyncHandler(async (req, res) => {
  const newsId = req.params.id;

  // Check if news exists
  const news = await News.findById(newsId);
  if (!news) {
    res.status(404);
    throw new Error('News article not found');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || 'newest';

  let sortOptions = {};
  switch (sort) {
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    case 'oldest':
      sortOptions = { createdAt: 1 };
      break;
    case 'likes':
      sortOptions = { likes: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  const comments = await Comment.findByNews(newsId, {
    sort: sortOptions,
    limit,
    skip: (page - 1) * limit
  });

  const total = await Comment.countDocuments({
    news: newsId,
    parent: null,
    isApproved: true
  });

  res.json({
    comments,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get comments for an event
// @route   GET /api/comments/event/:id
// @access  Public
const getEventComments = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || 'newest';

  let sortOptions = {};
  switch (sort) {
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    case 'oldest':
      sortOptions = { createdAt: 1 };
      break;
    case 'likes':
      sortOptions = { likes: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  const comments = await Comment.findByEvent(eventId, {
    sort: sortOptions,
    limit,
    skip: (page - 1) * limit
  });

  const total = await Comment.countDocuments({
    event: eventId,
    parent: null,
    isApproved: true
  });

  res.json({
    comments,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get replies to a comment
// @route   GET /api/comments/:id/replies
// @access  Public
const getCommentReplies = asyncHandler(async (req, res) => {
  const commentId = req.params.id;

  // Check if comment exists
  const comment = await Comment.findById(commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const replies = await Comment.findReplies(commentId, {
    sort: { createdAt: 1 },
    limit,
    skip: (page - 1) * limit
  });

  const total = await Comment.countDocuments({
    parent: commentId,
    isApproved: true
  });

  res.json({
    replies,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { content, movieId, newsId, eventId, parentId } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  // Check that at least one of movieId, newsId, or eventId is provided
  if (!movieId && !newsId && !eventId) {
    res.status(400);
    throw new Error('At least one of movieId, newsId, or eventId is required');
  }

  // Check if parent comment exists if parentId is provided
  if (parentId) {
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      res.status(404);
      throw new Error('Parent comment not found');
    }
  }

  // Create comment object
  const commentData = {
    user: req.user._id,
    content,
    parent: parentId || null
  };

  // Add reference based on provided ID
  if (movieId) {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }
    commentData.movie = movieId;
  } else if (newsId) {
    const news = await News.findById(newsId);
    if (!news) {
      res.status(404);
      throw new Error('News article not found');
    }
    commentData.news = newsId;
  } else if (eventId) {
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    commentData.event = eventId;
  }

  const comment = await Comment.create(commentData);

  // Increment user's comment count
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { commentCount: 1 }
  });

  // If this is a reply, update the parent comment's replies count
  if (parentId) {
    await Comment.findByIdAndUpdate(parentId, {
      $inc: { replyCount: 1 }
    });
  }

  // Populate user info
  const populatedComment = await Comment.findById(comment._id)
    .populate('userInfo');

  res.status(201).json(populatedComment);
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is the comment author
  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this comment');
  }

  comment.content = content || comment.content;

  const updatedComment = await comment.save();

  res.json(updatedComment);
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is the comment author or admin
  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  // If this is a parent comment, delete all replies
  if (!comment.parent) {
    await Comment.deleteMany({ parent: comment._id });
  } else {
    // If this is a reply, decrement the parent comment's replies count
    await Comment.findByIdAndUpdate(comment.parent, {
      $inc: { replyCount: -1 }
    });
  }

  // Decrement user's comment count
  await User.findByIdAndUpdate(comment.user, {
    $inc: { commentCount: -1 }
  });

  await comment.remove();

  res.json({ message: 'Comment removed' });
});

// @desc    Like a comment
// @route   PUT /api/comments/:id/like
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Thực hiện thủ công vì phương thức like không tồn tại
  // Xóa khỏi dislikedBy nếu có
  if (comment.dislikedBy.includes(req.user._id)) {
    comment.dislikedBy = comment.dislikedBy.filter(id => id.toString() !== req.user._id.toString());
  }

  // Thêm vào likedBy nếu chưa có
  if (!comment.likedBy.includes(req.user._id)) {
    comment.likedBy.push(req.user._id);
  }

  // Cập nhật số lượng
  comment.likes = comment.likedBy.length;
  comment.dislikes = comment.dislikedBy.length;

  await comment.save();

  res.json({
    likes: comment.likes,
    dislikes: comment.dislikes,
    likedBy: comment.likedBy,
    dislikedBy: comment.dislikedBy
  });
});

// @desc    Dislike a comment
// @route   PUT /api/comments/:id/dislike
// @access  Private
const dislikeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Thực hiện thủ công vì phương thức dislike không tồn tại
  // Xóa khỏi likedBy nếu có
  if (comment.likedBy.includes(req.user._id)) {
    comment.likedBy = comment.likedBy.filter(id => id.toString() !== req.user._id.toString());
  }

  // Thêm vào dislikedBy nếu chưa có
  if (!comment.dislikedBy.includes(req.user._id)) {
    comment.dislikedBy.push(req.user._id);
  }

  // Cập nhật số lượng
  comment.likes = comment.likedBy.length;
  comment.dislikes = comment.dislikedBy.length;

  await comment.save();

  res.json({
    likes: comment.likes,
    dislikes: comment.dislikes,
    likedBy: comment.likedBy,
    dislikedBy: comment.dislikedBy
  });
});

// @desc    Report a comment
// @route   PUT /api/comments/:id/report
// @access  Private
const reportComment = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    res.status(400);
    throw new Error('Report reason is required');
  }

  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  await comment.report(req.user._id, reason);

  res.json({ message: 'Comment reported successfully' });
});

// @desc    Approve a comment (admin only)
// @route   PUT /api/comments/:id/approve
// @access  Private/Admin
const approveComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  await comment.approve();

  res.json({ message: 'Comment approved successfully' });
});

// @desc    Reject a comment (admin only)
// @route   PUT /api/comments/:id/reject
// @access  Private/Admin
const rejectComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  await comment.reject();

  res.json({ message: 'Comment rejected successfully' });
});

// @desc    Get reported comments (admin only)
// @route   GET /api/comments/reported
// @access  Private/Admin
const getReportedComments = asyncHandler(async (req, res) => {
  const comments = await Comment.findReported()
    .populate('userInfo')
    .populate('news', 'title')
    .populate('movie', 'title')
    .populate('event', 'title');

  res.json(comments);
});

// @desc    Get the 3 most liked comments for a movie
// @route   GET /api/comments/movie/:id/most-liked
// @access  Public
const getMostLikedMovieComments = asyncHandler(async (req, res) => {
  const movieId = req.params.id;

  // Check if movie exists
  const movie = await Movie.findById(movieId);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  // Get limit from query params or default to 3
  const limit = parseInt(req.query.limit) || 3;

  // Get the most liked comments
  const comments = await Comment.findMostLikedByMovie(movieId, limit);

  res.json({
    movie: {
      _id: movie._id,
      title: movie.title
    },
    comments
  });
});

module.exports = {
  getMovieComments,
  getNewsComments,
  getEventComments,
  getCommentReplies,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  reportComment,
  approveComment,
  rejectComment,
  getReportedComments,
  getMostLikedMovieComments
};
