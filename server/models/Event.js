const mongoose = require('mongoose');
const validator = require('validator');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
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
    },
    category: {
      type: String,
      trim: true,
      default: 'Film Festival',
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
    },
    organizer: {
      type: String,
      trim: true,
    },
    sponsors: {
      type: [String],
      default: [],
    },
    ticketPrice: {
      type: Number,
      min: [0, 'Ticket price cannot be negative'],
      default: 0,
    },
    ticketUrl: {
      type: String,
      default: '',
    },
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
    relatedMovies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
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
