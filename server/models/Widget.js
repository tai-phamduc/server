const mongoose = require('mongoose');

const WidgetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Widget title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    type: {
      type: String,
      enum: {
        values: [
          'text',
          'html',
          'recent_movies',
          'featured_movies',
          'upcoming_movies',
          'movie_categories',
          'recent_events',
          'featured_events',
          'upcoming_events',
          'recent_news',
          'featured_news',
          'categories',
          'tags',
          'newsletter',
          'contact_info',
          'social_media',
          'image',
          'gallery',
          'video',
          'map',
          'custom',
        ],
        message: '{VALUE} is not a valid widget type',
      },
      required: [true, 'Widget type is required'],
      index: true,
    },
    content: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      enum: {
        values: ['sidebar', 'footer', 'header', 'home', 'custom'],
        message: '{VALUE} is not a valid widget area',
      },
      required: [true, 'Widget area is required'],
      index: true,
    },
    position: {
      type: Number,
      default: 0,
    },
    column: {
      type: Number,
      default: 1,
      min: [1, 'Column must be at least 1'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    cssClass: {
      type: String,
      trim: true,
    },
    settings: {
      limit: {
        type: Number,
        default: 5,
        min: [1, 'Limit must be at least 1'],
      },
      showImage: {
        type: Boolean,
        default: true,
      },
      showDate: {
        type: Boolean,
        default: true,
      },
      showExcerpt: {
        type: Boolean,
        default: false,
      },
      imageUrl: {
        type: String,
        trim: true,
      },
      linkUrl: {
        type: String,
        trim: true,
      },
      linkText: {
        type: String,
        trim: true,
      },
      category: {
        type: String,
        trim: true,
      },
      tag: {
        type: String,
        trim: true,
      },
      layout: {
        type: String,
        enum: {
          values: ['list', 'grid', 'carousel', 'compact'],
          message: '{VALUE} is not a valid layout',
        },
        default: 'list',
      },
      columns: {
        type: Number,
        default: 1,
        min: [1, 'Columns must be at least 1'],
        max: [4, 'Columns cannot be more than 4'],
      },
      videoUrl: {
        type: String,
        trim: true,
      },
      mapLocation: {
        type: String,
        trim: true,
      },
      mapZoom: {
        type: Number,
        default: 14,
        min: [1, 'Zoom must be at least 1'],
        max: [20, 'Zoom cannot be more than 20'],
      },
      backgroundColor: {
        type: String,
        default: '',
      },
      textColor: {
        type: String,
        default: '',
      },
      padding: {
        type: String,
        default: '',
      },
      margin: {
        type: String,
        default: '',
      },
      borderRadius: {
        type: String,
        default: '',
      },
      showViewAll: {
        type: Boolean,
        default: false,
      },
      viewAllUrl: {
        type: String,
        trim: true,
      },
      viewAllText: {
        type: String,
        trim: true,
        default: 'View All',
      },
    },
    visibility: {
      pages: {
        type: [String],
        default: [],
      },
      devices: {
        desktop: {
          type: Boolean,
          default: true,
        },
        tablet: {
          type: Boolean,
          default: true,
        },
        mobile: {
          type: Boolean,
          default: true,
        },
      },
      loggedIn: {
        type: Boolean,
        default: null, // null means show to all, true means show only to logged in, false means show only to logged out
      },
      roles: {
        type: [String],
        default: [],
      },
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
WidgetSchema.index({ area: 1, isActive: 1, position: 1 });
WidgetSchema.index({ type: 1, isActive: 1 });

// Static method to find widgets by area
WidgetSchema.statics.findByArea = function(area) {
  return this.find({ area, isActive: true })
    .sort({ column: 1, position: 1 });
};

// Static method to find widgets by type
WidgetSchema.statics.findByType = function(type) {
  return this.find({ type, isActive: true })
    .sort({ area: 1, column: 1, position: 1 });
};

// Static method to find widgets for a specific page
WidgetSchema.statics.findByPage = function(page, area = null) {
  const query = {
    isActive: true,
    $or: [
      { 'visibility.pages': { $size: 0 } }, // Empty array means show on all pages
      { 'visibility.pages': page },
    ],
  };
  
  if (area) {
    query.area = area;
  }
  
  return this.find(query)
    .sort({ area: 1, column: 1, position: 1 });
};

// Static method to find widgets for a specific device
WidgetSchema.statics.findByDevice = function(device, area = null) {
  const query = {
    isActive: true,
    [`visibility.devices.${device}`]: true,
  };
  
  if (area) {
    query.area = area;
  }
  
  return this.find(query)
    .sort({ area: 1, column: 1, position: 1 });
};

// Static method to find widgets for a specific user
WidgetSchema.statics.findByUser = function(user, area = null) {
  const query = {
    isActive: true,
    $or: [
      { 'visibility.loggedIn': null }, // null means show to all
    ],
  };
  
  if (user) {
    // User is logged in
    query.$or.push({ 'visibility.loggedIn': true });
    
    // Check roles
    if (user.role) {
      query.$or.push({
        'visibility.roles': { $size: 0 }, // Empty array means show to all roles
      });
      
      query.$or.push({
        'visibility.roles': user.role,
      });
    }
  } else {
    // User is not logged in
    query.$or.push({ 'visibility.loggedIn': false });
  }
  
  if (area) {
    query.area = area;
  }
  
  return this.find(query)
    .sort({ area: 1, column: 1, position: 1 });
};

module.exports = mongoose.model('Widget', WidgetSchema);
