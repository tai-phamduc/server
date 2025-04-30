const mongoose = require('mongoose');
const validator = require('validator');

// Schema for event schedule items
const EventScheduleItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    trim: true,
  },
  speakers: [{
    name: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      trim: true,
    },
  }],
  type: {
    type: String,
    enum: {
      values: ['presentation', 'panel', 'screening', 'workshop', 'networking', 'break', 'other'],
      default: 'other',
    },
  },
  isHighlighted: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

// Schema for event ticket types
const EventTicketTypeSchema = new mongoose.Schema({
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
  currency: {
    type: String,
    default: 'USD',
    trim: true,
  },
  quantity: {
    type: Number,
    min: [0, 'Quantity cannot be negative'],
  },
  quantitySold: {
    type: Number,
    default: 0,
    min: [0, 'Quantity sold cannot be negative'],
  },
  benefits: {
    type: [String],
    default: [],
  },
  saleStartDate: {
    type: Date,
  },
  saleEndDate: {
    type: Date,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { _id: true });

// Schema for event sponsors
const EventSponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    enum: {
      values: ['platinum', 'gold', 'silver', 'bronze', 'partner', 'media', 'other'],
      default: 'other',
    },
  },
  description: {
    type: String,
    trim: true,
  },
}, { _id: true });

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
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
      required: [true, 'Please provide an event description'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot be more than 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
      index: true,
    },
    endDate: {
      type: Date,
    },
    displayDate: {
      type: String,
      trim: true,
    },
    month: {
      type: String,
      trim: true,
    },
    day: {
      type: Number,
    },
    year: {
      type: Number,
    },
    startTime: {
      type: String,
      required: [true, 'Please provide a start time'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'Please provide an end time'],
      trim: true,
    },
    displayTime: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      default: 'America/New_York',
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'USA',
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
    image: {
      type: String, // URL to image
      required: [true, 'Please provide an image URL'],
      validate: {
        validator: function(v) {
          return validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true });
        },
        message: 'Please provide a valid URL for the image',
      },
    },
    gallery: {
      type: [String], // URLs to images
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'Film Festival',
      index: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
      index: true,
    }],
    registrationUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['upcoming', 'ongoing', 'past', 'cancelled', 'postponed'],
        message: '{VALUE} is not a valid event status',
      },
      default: 'upcoming',
      index: true,
    },
    organizer: {
      type: String,
      trim: true,
    },
    organizerLogo: {
      type: String,
      default: '',
    },
    organizerWebsite: {
      type: String,
      default: '',
    },
    organizerDescription: {
      type: String,
      trim: true,
    },
    sponsors: [EventSponsorSchema],
    ticketPrice: {
      type: Number,
      min: [0, 'Ticket price cannot be negative'],
      default: 0,
    },
    ticketUrl: {
      type: String,
      default: '',
    },
    ticketTypes: [EventTicketTypeSchema],
    capacity: {
      type: Number,
      min: [0, 'Capacity cannot be negative'],
      default: 0,
    },
    attendees: {
      type: Number,
      min: [0, 'Attendees cannot be negative'],
      default: 0,
    },
    schedule: [EventScheduleItemSchema],
    relatedMovies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    }],
    relatedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
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
      youtube: {
        type: String,
        default: '',
      },
      hashtag: {
        type: String,
        default: '',
      },
    },
    contactEmail: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return v === '' || validator.isEmail(v);
        },
        message: 'Please provide a valid email',
      },
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    contactWebsite: {
      type: String,
      trim: true,
    },
    faq: [{
      question: {
        type: String,
        required: true,
        trim: true,
      },
      answer: {
        type: String,
        required: true,
        trim: true,
      },
    }],
    isVirtual: {
      type: Boolean,
      default: false,
    },
    virtualEventUrl: {
      type: String,
      trim: true,
    },
    virtualEventPlatform: {
      type: String,
      trim: true,
    },
    isHybrid: {
      type: Boolean,
      default: false,
    },
    ageRestriction: {
      type: String,
      trim: true,
    },
    accessibility: {
      wheelchairAccessible: {
        type: Boolean,
        default: false,
      },
      signLanguageInterpreter: {
        type: Boolean,
        default: false,
      },
      closedCaptioning: {
        type: Boolean,
        default: false,
      },
      assistiveListeningDevices: {
        type: Boolean,
        default: false,
      },
      accessibilityNotes: {
        type: String,
        trim: true,
      },
    },
    viewCount: {
      type: Number,
      default: 0,
      min: [0, 'View count cannot be negative'],
    },
    registrationCount: {
      type: Number,
      default: 0,
      min: [0, 'Registration count cannot be negative'],
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

// Create indexes for faster queries
EventSchema.index({ date: 1 });
EventSchema.index({ featured: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ isActive: 1 });

// Static method to find upcoming events
EventSchema.statics.findUpcoming = function() {
  return this.find({
    date: { $gte: new Date() },
    isActive: true
  })
  .sort({ date: 1 });
};

// Static method to find featured events
EventSchema.statics.findFeatured = function() {
  return this.find({
    featured: true,
    isActive: true
  })
  .sort({ date: 1 });
};

// Static method to find events by category
EventSchema.statics.findByCategory = function(category) {
  return this.find({
    category: category,
    isActive: true
  })
  .sort({ date: 1 });
};

// Static method to find events by tag
EventSchema.statics.findByTag = function(tagId) {
  return this.find({
    tags: tagId,
    isActive: true
  })
  .sort({ date: 1 });
};

// Create virtual for comments
EventSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'event',
  justOne: false,
});

module.exports = mongoose.model('Event', EventSchema);
