const mongoose = require('mongoose');
const User = require('../models/User');

// @desc    Get all collections in the database
// @route   GET /api/admin/collections
// @access  Private/Admin
const getCollections = async (req, res) => {
  try {
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Get count for each collection
    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        return {
          name: collection.name,
          count
        };
      })
    );
    
    // Sort collections alphabetically
    collectionsWithCount.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(collectionsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get data from a specific collection
// @route   GET /api/admin/collections/:collectionName
// @access  Private/Admin
const getCollectionData = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const skip = (page - 1) * limit;
    
    // Get collection
    const collection = mongoose.connection.db.collection(collectionName);
    
    // Build search query if search term is provided
    let query = {};
    if (search) {
      // Create a text search query for string fields
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get total count
    const total = await collection.countDocuments(query);
    
    // Get data with pagination
    const data = await collection.find(query).skip(skip).limit(limit).toArray();
    
    res.json({
      data,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Get count for each collection
    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        return {
          name: collection.name,
          count
        };
      })
    );
    
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');
    
    res.json({
      collections: collectionsWithCount,
      users: {
        total: totalUsers,
        admin: adminUsers,
        regular: regularUsers,
        recent: recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCollections,
  getCollectionData,
  getDashboardStats
};
