const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: {
        values: ['food', 'beverage', 'snack', 'combo', 'merchandise', 'other'],
        message: '{VALUE} is not a valid product category',
      },
      required: [true, 'Category is required'],
      index: true,
    },
    cinema_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: [true, 'Cinema is required'],
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    nutritionalInfo: {
      calories: {
        type: Number,
        default: 0,
      },
      fat: {
        type: Number,
        default: 0,
      },
      carbs: {
        type: Number,
        default: 0,
      },
      protein: {
        type: Number,
        default: 0,
      },
      sodium: {
        type: Number,
        default: 0,
      },
      allergens: {
        type: [String],
        default: [],
      },
    },
    size: {
      type: String,
      enum: {
        values: ['small', 'medium', 'large', 'extra_large', 'regular', 'kids', 'one_size'],
        message: '{VALUE} is not a valid size',
      },
      default: 'regular',
    },
    tags: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for cinema
ProductSchema.virtual('cinema', {
  ref: 'Cinema',
  localField: 'cinema_id',
  foreignField: '_id',
  justOne: true,
});

// Create indexes for faster queries
ProductSchema.index({ name: 1, cinema_id: 1 });
ProductSchema.index({ category: 1, isAvailable: 1 });
ProductSchema.index({ isPopular: 1, isAvailable: 1 });
ProductSchema.index({ isFeatured: 1, isAvailable: 1 });
ProductSchema.index({ price: 1 });

// Static method to find products by cinema
ProductSchema.statics.findByCinema = function(cinemaId) {
  return this.find({ cinema_id: cinemaId, isAvailable: true })
    .sort({ category: 1, order: 1, name: 1 });
};

// Static method to find products by category
ProductSchema.statics.findByCategory = function(category, cinemaId = null) {
  const query = { category, isAvailable: true };
  
  if (cinemaId) {
    query.cinema_id = cinemaId;
  }
  
  return this.find(query)
    .sort({ order: 1, name: 1 });
};

// Static method to find popular products
ProductSchema.statics.findPopular = function(cinemaId = null, limit = 10) {
  const query = { isPopular: true, isAvailable: true };
  
  if (cinemaId) {
    query.cinema_id = cinemaId;
  }
  
  return this.find(query)
    .sort({ order: 1 })
    .limit(limit);
};

// Static method to find featured products
ProductSchema.statics.findFeatured = function(cinemaId = null, limit = 10) {
  const query = { isFeatured: true, isAvailable: true };
  
  if (cinemaId) {
    query.cinema_id = cinemaId;
  }
  
  return this.find(query)
    .sort({ order: 1 })
    .limit(limit);
};

module.exports = mongoose.model('Product', ProductSchema);
