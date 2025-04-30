const mongoose = require('mongoose');
const validator = require('validator');

// Schema for room seat layout
const SeatLayoutSchema = new mongoose.Schema({
  row: {
    type: String,
    required: true,
    trim: true,
  },
  column: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'couple', 'accessible', 'unavailable'],
    default: 'standard',
  },
  price: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { _id: false });

// Schema for cinema rooms
const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: [50, 'Room name cannot be more than 50 characters'],
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [1000, 'Capacity cannot exceed 1000'],
  },
  type: {
    type: String,
    enum: {
      values: ['standard', 'imax', '3d', 'vip', 'premium', '4dx'],
      message: '{VALUE} is not a valid room type',
    },
    default: 'standard',
  },
  features: {
    type: [String],
    default: [],
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
    seats: [SeatLayoutSchema],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { _id: true });

// Schema for opening hours
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

// Main Cinema schema
const CinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cinema name is required'],
      trim: true,
      maxlength: [100, 'Cinema name cannot be more than 100 characters'],
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
    rooms: [RoomSchema],
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
    featuredImage: {
      type: String,
      default: '',
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
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug from name before saving
CinemaSchema.pre('save', function(next) {
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
CinemaSchema.virtual('averageRating').get(function() {
  if (this.reviewCount === 0) return 0;
  return (this.totalRating / this.reviewCount).toFixed(1);
});

// Create virtual for full address
CinemaSchema.virtual('fullAddress').get(function() {
  const { address, city, state, zipCode, country } = this.location;
  return `${address}, ${city}, ${state} ${zipCode}, ${country}`;
});

// Create virtual for screenings
CinemaSchema.virtual('screenings', {
  ref: 'Screening',
  localField: '_id',
  foreignField: 'cinema_id',
  justOne: false,
});

// Create virtual for products
CinemaSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'cinema_id',
  justOne: false,
});

// Create indexes for faster queries
CinemaSchema.index({ 'location.city': 1, 'location.state': 1 });
CinemaSchema.index({ name: 1 });
CinemaSchema.index({ 'location.coordinates': '2dsphere' });
CinemaSchema.index({ isActive: 1, rating: -1 });

// Method to update rating
CinemaSchema.methods.updateRating = async function(newRating) {
  this.totalRating += newRating;
  this.reviewCount += 1;
  this.rating = this.totalRating / this.reviewCount;
  return this.save();
};

// Method to add a room
CinemaSchema.methods.addRoom = async function(roomData) {
  this.rooms.push(roomData);
  return this.save();
};

// Method to update a room
CinemaSchema.methods.updateRoom = async function(roomId, roomData) {
  const roomIndex = this.rooms.findIndex(room => room._id.toString() === roomId.toString());

  if (roomIndex === -1) {
    throw new Error('Room not found');
  }

  this.rooms[roomIndex] = { ...this.rooms[roomIndex].toObject(), ...roomData };
  return this.save();
};

// Method to remove a room
CinemaSchema.methods.removeRoom = async function(roomId) {
  this.rooms = this.rooms.filter(room => room._id.toString() !== roomId.toString());
  return this.save();
};

// Static method to find cinemas by city
CinemaSchema.statics.findByCity = function(city) {
  return this.find({ 'location.city': city, isActive: true })
    .sort({ name: 1 });
};

// Static method to find cinemas by movie
CinemaSchema.statics.findByMovie = async function(movieId) {
  const Screening = mongoose.model('Screening');
  const screenings = await Screening.find({ movie_id: movieId, startTime: { $gte: new Date() } })
    .distinct('cinema_id');

  return this.find({ _id: { $in: screenings }, isActive: true })
    .sort({ name: 1 });
};

// Static method to find cinemas by coordinates
CinemaSchema.statics.findByCoordinates = function(latitude, longitude, maxDistance = 10000) {
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

// Static method to find top rated cinemas
CinemaSchema.statics.findTopRated = function(limit = 10) {
  return this.find({ isActive: true, reviewCount: { $gt: 0 } })
    .sort({ rating: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Cinema', CinemaSchema);
