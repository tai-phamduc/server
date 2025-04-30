const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCinema,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/cinema/:id', getProductsByCinema);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/reorder', protect, admin, reorderProducts);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
