const mongoose = require('mongoose');

// Menu Item Schema (Sub-document)
const MenuItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Menu item title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    url: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ['custom', 'page', 'movie', 'event', 'news', 'category', 'tag', 'theater'],
        message: '{VALUE} is not a valid menu item type',
      },
      default: 'custom',
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'items.type',
    },
    icon: {
      type: String,
      default: '',
    },
    cssClass: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNewTab: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
      }
    ],
    megaMenu: {
      isEnabled: {
        type: Boolean,
        default: false,
      },
      columns: {
        type: Number,
        default: 1,
        min: [1, 'Columns must be at least 1'],
        max: [4, 'Columns cannot be more than 4'],
      },
      featuredImage: {
        type: String,
        default: '',
      },
      featuredContent: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Menu Schema
const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
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
    location: {
      type: String,
      enum: {
        values: ['header', 'footer', 'sidebar', 'mobile', 'custom'],
        message: '{VALUE} is not a valid menu location',
      },
      default: 'custom',
      index: true,
    },
    items: [MenuItemSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
MenuSchema.index({ location: 1, isActive: 1 });

// Pre-save hook to generate slug from name
MenuSchema.pre('save', function(next) {
  try {
    if (this.isModified('name') && !this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find active menus
MenuSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ name: 1 });
};

// Static method to find menu by location
MenuSchema.statics.findByLocation = function(location) {
  return this.findOne({ location, isActive: true });
};

// Static method to find menu by slug
MenuSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), isActive: true });
};

// Helper method to organize menu items into a hierarchical structure
MenuSchema.methods.getHierarchicalItems = function() {
  const items = this.items.sort((a, b) => a.order - b.order);
  const rootItems = items.filter(item => !item.parent);
  
  const buildHierarchy = (parentId) => {
    const children = items.filter(item => item.parent && item.parent.toString() === parentId.toString());
    
    return children.map(child => ({
      ...child.toObject(),
      children: buildHierarchy(child._id),
    }));
  };
  
  return rootItems.map(item => ({
    ...item.toObject(),
    children: buildHierarchy(item._id),
  }));
};

module.exports = mongoose.model('Menu', MenuSchema);
