const mongoose = require('mongoose');

// Slide Schema (Sub-document)
const SlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Slide title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, 'Subtitle cannot be more than 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Slide image is required'],
    },
    mobileImage: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      trim: true,
      maxlength: [50, 'Button text cannot be more than 50 characters'],
    },
    buttonUrl: {
      type: String,
      trim: true,
    },
    buttonType: {
      type: String,
      enum: {
        values: ['primary', 'secondary', 'outline', 'link'],
        message: '{VALUE} is not a valid button type',
      },
      default: 'primary',
    },
    secondaryButtonText: {
      type: String,
      trim: true,
      maxlength: [50, 'Secondary button text cannot be more than 50 characters'],
    },
    secondaryButtonUrl: {
      type: String,
      trim: true,
    },
    secondaryButtonType: {
      type: String,
      enum: {
        values: ['primary', 'secondary', 'outline', 'link'],
        message: '{VALUE} is not a valid button type',
      },
      default: 'outline',
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    textColor: {
      type: String,
      default: '',
    },
    overlayColor: {
      type: String,
      default: '',
    },
    overlayOpacity: {
      type: Number,
      min: [0, 'Overlay opacity must be between 0 and 1'],
      max: [1, 'Overlay opacity must be between 0 and 1'],
      default: 0.5,
    },
    contentPosition: {
      type: String,
      enum: {
        values: ['left', 'center', 'right'],
        message: '{VALUE} is not a valid content position',
      },
      default: 'center',
    },
    contentAlignment: {
      type: String,
      enum: {
        values: ['top', 'middle', 'bottom'],
        message: '{VALUE} is not a valid content alignment',
      },
      default: 'middle',
    },
    animation: {
      type: String,
      enum: {
        values: ['fade', 'slide', 'zoom', 'none'],
        message: '{VALUE} is not a valid animation',
      },
      default: 'fade',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'referenceModel',
    },
    referenceModel: {
      type: String,
      enum: {
        values: ['Movie', 'Event', 'News', 'Page'],
        message: '{VALUE} is not a valid reference model',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Slider Schema
const SliderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Slider name is required'],
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
    slides: [SlideSchema],
    autoplay: {
      type: Boolean,
      default: true,
    },
    autoplaySpeed: {
      type: Number,
      default: 5000,
      min: [1000, 'Autoplay speed must be at least 1000ms'],
    },
    infinite: {
      type: Boolean,
      default: true,
    },
    arrows: {
      type: Boolean,
      default: true,
    },
    dots: {
      type: Boolean,
      default: true,
    },
    fade: {
      type: Boolean,
      default: false,
    },
    pauseOnHover: {
      type: Boolean,
      default: true,
    },
    adaptiveHeight: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    location: {
      type: String,
      enum: {
        values: ['home', 'movies', 'events', 'news', 'custom'],
        message: '{VALUE} is not a valid slider location',
      },
      default: 'custom',
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
SliderSchema.index({ location: 1, isActive: 1 });

// Pre-save hook to generate slug from name
SliderSchema.pre('save', function(next) {
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

// Static method to find active sliders
SliderSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ name: 1 });
};

// Static method to find slider by location
SliderSchema.statics.findByLocation = function(location) {
  return this.findOne({ location, isActive: true });
};

// Static method to find slider by slug
SliderSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), isActive: true });
};

// Method to get active slides in order
SliderSchema.methods.getActiveSlides = function() {
  return this.slides
    .filter(slide => slide.isActive)
    .sort((a, b) => a.order - b.order);
};

module.exports = mongoose.model('Slider', SliderSchema);
