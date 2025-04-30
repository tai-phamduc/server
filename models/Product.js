const mongoose = require('mongoose');

// Schema for product customization options
const CustomizationOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { _id: true });

// Schema for product customization groups
const CustomizationGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  multipleSelection: {
    type: Boolean,
    default: false,
  },
  minSelections: {
    type: Number,
    default: 0,
    min: [0, 'Minimum selections cannot be negative'],
  },
  maxSelections: {
    type: Number,
    default: 1,
    min: [1, 'Maximum selections must be at least 1'],
  },
  options: [CustomizationOptionSchema],
}, { _id: true });

// Schema for product combo items
const ComboItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  isCustomizable: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

// Schema for product inventory
const InventorySchema = new mongoose.Schema({
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [1, 'Low stock threshold must be at least 1'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  lastRestocked: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters'],
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [100, 'Short description cannot be more than 100 characters'],
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
    displayPrice: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return v.length <= 5; // Max 5 images
        },
        message: 'You can only have up to 5 images',
      },
    },
    category: {
      type: String,
      enum: {
        values: ['food', 'beverage', 'snack', 'combo', 'merchandise', 'dessert', 'alcohol', 'other'],
        message: '{VALUE} is not a valid product category',
      },
      required: [true, 'Category is required'],
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
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
    isNew: {
      type: Boolean,
      default: false,
      index: true,
    },
    isLimitedTime: {
      type: Boolean,
      default: false,
    },
    limitedTimeStart: {
      type: Date,
    },
    limitedTimeEnd: {
      type: Date,
    },
    inventory: [InventorySchema],
    nutritionalInfo: {
      calories: {
        type: Number,
        default: 0,
        min: [0, 'Calories cannot be negative'],
      },
      fat: {
        type: Number,
        default: 0,
        min: [0, 'Fat cannot be negative'],
      },
      saturatedFat: {
        type: Number,
        default: 0,
        min: [0, 'Saturated fat cannot be negative'],
      },
      transFat: {
        type: Number,
        default: 0,
        min: [0, 'Trans fat cannot be negative'],
      },
      cholesterol: {
        type: Number,
        default: 0,
        min: [0, 'Cholesterol cannot be negative'],
      },
      carbs: {
        type: Number,
        default: 0,
        min: [0, 'Carbs cannot be negative'],
      },
      sugar: {
        type: Number,
        default: 0,
        min: [0, 'Sugar cannot be negative'],
      },
      fiber: {
        type: Number,
        default: 0,
        min: [0, 'Fiber cannot be negative'],
      },
      protein: {
        type: Number,
        default: 0,
        min: [0, 'Protein cannot be negative'],
      },
      sodium: {
        type: Number,
        default: 0,
        min: [0, 'Sodium cannot be negative'],
      },
      allergens: {
        type: [String],
        default: [],
      },
      servingSize: {
        type: String,
        trim: true,
      },
      servingsPerContainer: {
        type: Number,
        min: [0, 'Servings per container cannot be negative'],
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
    variants: [{
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
      },
      size: {
        type: String,
        trim: true,
      },
      image: {
        type: String,
        default: '',
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
      stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative'],
      },
      sku: {
        type: String,
        trim: true,
      },
    }],
    customizationGroups: [CustomizationGroupSchema],
    isCustomizable: {
      type: Boolean,
      default: false,
    },
    isCombo: {
      type: Boolean,
      default: false,
    },
    comboItems: [ComboItemSchema],
    comboSavings: {
      type: Number,
      default: 0,
      min: [0, 'Combo savings cannot be negative'],
    },
    tags: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    dietaryAttributes: {
      isVegetarian: {
        type: Boolean,
        default: false,
      },
      isVegan: {
        type: Boolean,
        default: false,
      },
      isGlutenFree: {
        type: Boolean,
        default: false,
      },
      isOrganic: {
        type: Boolean,
        default: false,
      },
      isKosher: {
        type: Boolean,
        default: false,
      },
      isHalal: {
        type: Boolean,
        default: false,
      },
      isDairyFree: {
        type: Boolean,
        default: false,
      },
      isNutFree: {
        type: Boolean,
        default: false,
      },
    },
    isSpicy: {
      type: Boolean,
      default: false,
    },
    spicyLevel: {
      type: Number,
      default: 0,
      min: [0, 'Spicy level cannot be negative'],
      max: [5, 'Spicy level cannot be more than 5'],
    },
    ingredients: {
      type: [String],
      default: [],
    },
    barcode: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    totalRating: {
      type: Number,
      default: 0,
      min: [0, 'Total rating cannot be negative'],
    },
    salesCount: {
      type: Number,
      default: 0,
      min: [0, 'Sales count cannot be negative'],
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
