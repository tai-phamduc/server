const Product = require('../models/Product');
const Cinema = require('../models/Cinema');
const asyncHandler = require('express-async-handler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const category = req.query.category;
  const cinemaId = req.query.cinema;
  const featured = req.query.featured === 'true';
  const popular = req.query.popular === 'true';

  let products;

  if (featured) {
    products = await Product.findFeatured(cinemaId);
  } else if (popular) {
    products = await Product.findPopular(cinemaId);
  } else if (category) {
    products = await Product.findByCategory(category, cinemaId);
  } else {
    const query = { isAvailable: true };

    if (cinemaId) {
      query.cinema_id = cinemaId;
    }

    products = await Product.find(query)
      .sort({ order: 1, name: 1 })
      .populate('cinema_id', 'name');
  }

  res.json(products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('cinema_id', 'name location');

  if (!product || !product.isAvailable) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Get products by cinema
// @route   GET /api/products/cinema/:id
// @access  Public
const getProductsByCinema = asyncHandler(async (req, res) => {
  const cinema = await Cinema.findById(req.params.id);

  if (!cinema) {
    res.status(404);
    throw new Error('Cinema not found');
  }

  const products = await Product.find({
    cinema_id: req.params.id,
    isAvailable: true
  })
    .sort({ order: 1, category: 1, name: 1 });

  res.json(products);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    image,
    images,
    category,
    subcategory,
    cinema_id,
    isAvailable,
    stock,
    isPopular,
    isFeatured,
    order,
    nutritionalInfo,
    allergens,
    ingredients,
    preparationTime
  } = req.body;

  // Check if cinema exists
  const cinema = await Cinema.findById(cinema_id);

  if (!cinema) {
    res.status(404);
    throw new Error('Cinema not found');
  }

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice,
    image,
    images,
    category,
    subcategory,
    cinema_id,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    stock: stock || 0,
    isPopular: isPopular || false,
    isFeatured: isFeatured || false,
    order: order || 0,
    nutritionalInfo,
    allergens,
    ingredients,
    preparationTime,
    createdBy: req.user._id
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    image,
    images,
    category,
    subcategory,
    cinema_id,
    isAvailable,
    stock,
    isPopular,
    isFeatured,
    order,
    nutritionalInfo,
    allergens,
    ingredients,
    preparationTime
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if cinema exists if provided
  if (cinema_id && cinema_id !== product.cinema_id.toString()) {
    const cinema = await Cinema.findById(cinema_id);
    if (!cinema) {
      res.status(404);
      throw new Error('Cinema not found');
    }
  }

  // Update fields
  if (name) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (discountPrice !== undefined) product.discountPrice = discountPrice;
  if (image !== undefined) product.image = image;
  if (images !== undefined) product.images = images;
  if (category) product.category = category;
  if (subcategory !== undefined) product.subcategory = subcategory;
  if (cinema_id) product.cinema_id = cinema_id;
  if (isAvailable !== undefined) product.isAvailable = isAvailable;
  if (stock !== undefined) product.stock = stock;
  if (isPopular !== undefined) product.isPopular = isPopular;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;
  if (order !== undefined) product.order = order;
  if (nutritionalInfo !== undefined) product.nutritionalInfo = nutritionalInfo;
  if (allergens !== undefined) product.allergens = allergens;
  if (ingredients !== undefined) product.ingredients = ingredients;
  if (preparationTime !== undefined) product.preparationTime = preparationTime;

  product.updatedBy = req.user._id;

  const updatedProduct = await product.save();

  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.deleteOne({ _id: req.params.id });

  res.json({ message: 'Product removed' });
});

// @desc    Reorder products
// @route   PUT /api/products/reorder
// @access  Private/Admin
const reorderProducts = asyncHandler(async (req, res) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error('Invalid order data');
  }

  const updatePromises = orders.map(item => {
    return Product.findByIdAndUpdate(
      item.id,
      { order: item.order },
      { new: true }
    );
  });

  await Promise.all(updatePromises);

  res.json({ message: 'Products reordered successfully' });
});

module.exports = {
  getProducts,
  getProductById,
  getProductsByCinema,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts
};
