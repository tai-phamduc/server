const mongoose = require('mongoose');
const validator = require('validator');

const HallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hall name is required'],
    trim: true,
    maxlength: [50, 'Hall name cannot be more than 50 characters'],
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [1000, 'Capacity cannot exceed 1000'],
  },
  seatLayout: {
    rows: {
      type: Number,
      required: [true, 'Number of rows is required'],
      min: [1, 'Must have at least 1 row'],
      max: [50, 'Cannot have more than 50 rows'],
    },
    columns: {
      type: Number,
      required: [true, 'Number of columns is required'],
      min: [1, 'Must have at least 1 column'],
      max: [50, 'Cannot have more than 50 columns'],
    },
    seatMap: {
      type: Map,
      of: {
        type: String,
        enum: {
          values: ['available', 'unavailable', 'accessible', 'premium', 'couple'],
          message: '{VALUE} is not a valid seat type',
        },
      },
      required: [true, 'Seat map is required'],
    },
  },
  features: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 10; // Max 10 features
      },
      message: 'You can only have up to 10 features',
    },
  },
  type: {
    type: String,
    enum: {
      values: ['standard', 'imax', '3d', 'vip', 'premium'],
      message: '{VALUE} is not a valid hall type',
    },
    default: 'standard',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { _id: true });

const OpeningHoursSchema = new mongoose.Schema({
  open: {
    type: String,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // HH:MM format (24-hour)
      },
      message: 'Open time must be in HH:MM format (24-hour)',
    },
  },
  close: {
    type: String,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // HH:MM format (24-hour)
      },
      message: 'Close time must be in HH:MM format (24-hour)',
    },
  },
}, { _id: false });

const TheaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theater name is required'],
      trim: true,
      maxlength: [100, 'Theater name cannot be more than 100 characters'],
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
        validate: {
          validator: function(v) {
            // Basic zip code validation - can be customized based on country
            return /^\d{5}(-\d{4})?$/.test(v);
          },
          message: 'Please provide a valid zip code',
        },
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          validate: {
            validator: function(v) {
              return v.length === 2 &&
                v[0] >= -180 && v[0] <= 180 && // longitude
                v[1] >= -90 && v[1] <= 90;     // latitude
            },
            message: 'Coordinates must be [longitude, latitude] with valid ranges'
          }
        }
      },
      mapUrl: {
        type: String,
        default: '',
      },
    },
    halls: [HallSchema],
    screens: {
      type: Number,
      default: 0,
      min: [0, 'Number of screens cannot be negative'],
    },
    seatingCapacity: {
      type: Number,
      default: 0,
      min: [0, 'Seating capacity cannot be negative'],
    },
    amenities: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return v.length <= 20; // Max 20 amenities
        },
        message: 'You can only have up to 20 amenities',
      },
    },
    facilities: {
      type: [String],
      default: [],
    },
    contactInfo: {
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
          validator: function(v) {
            return validator.isMobilePhone(v);
          },
          message: 'Please provide a valid phone number',
        },
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
          validator: validator.isEmail,
          message: 'Please provide a valid email',
        },
      },
      website: {
        type: String,
        validate: {
          validator: function(v) {
            return v === '' || validator.isURL(v);
          },
          message: 'Please provide a valid URL',
        },
      },
    },
    openingHours: {
      monday: OpeningHoursSchema,
      tuesday: OpeningHoursSchema,
      wednesday: OpeningHoursSchema,
      thursday: OpeningHoursSchema,
      friday: OpeningHoursSchema,
      saturday: OpeningHoursSchema,
      sunday: OpeningHoursSchema,
    },
    displayHours: {
      type: String,
      trim: true,
      default: '10:00 AM - 10:00 PM',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return v.length <= 10; // Max 10 images
        },
        message: 'You can only have up to 10 images',
      },
    },
    gallery: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
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
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'Short description cannot be more than 200 characters'],
    },
    parkingAvailable: {
      type: Boolean,
      default: false,
    },
    foodCourtAvailable: {
      type: Boolean,
      default: false,
    },
    accessibilityFeatures: {
      type: [String],
      default: [],
    },
    chain: {
      type: String,
      trim: true,
    },
    ticketPriceRange: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },
    socialMedia: {
      facebook: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
      instagram: {
        type: String,
        default: '',
      },
      pinterest: {
        type: String,
        default: '',
      },
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug from name before saving
TheaterSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  next();
});

// Create virtual for average rating
TheaterSchema.virtual('averageRating').get(function() {
  if (this.reviewCount === 0) return 0;
  return (this.totalRating / this.reviewCount).toFixed(1);
});

// Create virtual for full address
TheaterSchema.virtual('fullAddress').get(function() {
  const { address, city, state, zipCode, country } = this.location;
  return `${address}, ${city}, ${state} ${zipCode}, ${country}`;
});

// Create virtual for showtimes
TheaterSchema.virtual('showtimes', {
  ref: 'Showtime',
  localField: '_id',
  foreignField: 'theater',
  justOne: false,
});

// Create virtual for reviews
TheaterSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'theater',
  justOne: false,
});

// Create indexes for faster queries
TheaterSchema.index({ 'location.city': 1, 'location.state': 1 });
TheaterSchema.index({ name: 1 });
TheaterSchema.index({ 'location.coordinates': '2dsphere' });
TheaterSchema.index({ isActive: 1, rating: -1 });

// Method to update rating
TheaterSchema.methods.updateRating = async function(newRating) {
  this.totalRating += newRating;
  this.reviewCount += 1;
  this.rating = this.totalRating / this.reviewCount;
  return this.save();
};

// Method to add a hall
TheaterSchema.methods.addHall = async function(hallData) {
  this.halls.push(hallData);
  return this.save();
};

// Method to update a hall
TheaterSchema.methods.updateHall = async function(hallId, hallData) {
  const hallIndex = this.halls.findIndex(hall => hall._id.toString() === hallId.toString());

  if (hallIndex === -1) {
    throw new Error('Hall not found');
  }

  this.halls[hallIndex] = { ...this.halls[hallIndex].toObject(), ...hallData };
  return this.save();
};

// Method to remove a hall
TheaterSchema.methods.removeHall = async function(hallId) {
  this.halls = this.halls.filter(hall => hall._id.toString() !== hallId.toString());
  return this.save();
};

// Static method to find theaters by city
TheaterSchema.statics.findByCity = function(city) {
  return this.find({ 'location.city': city, isActive: true })
    .sort({ name: 1 });
};

// Static method to find theaters by movie
TheaterSchema.statics.findByMovie = async function(movieId) {
  const Showtime = mongoose.model('Showtime');
  const showtimes = await Showtime.find({ movie: movieId, startTime: { $gte: new Date() } })
    .distinct('theater');

  return this.find({ _id: { $in: showtimes }, isActive: true })
    .sort({ name: 1 });
};

// Static method to find theaters by coordinates
TheaterSchema.statics.findByCoordinates = function(latitude, longitude, maxDistance = 10000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance, // in meters
      },
    },
    isActive: true,
  });
};

// Static method to find top rated theaters
TheaterSchema.statics.findTopRated = function(limit = 10) {
  return this.find({ isActive: true, reviewCount: { $gt: 0 } })
    .sort({ rating: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Theater', TheaterSchema);
