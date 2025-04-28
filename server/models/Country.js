const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Country name is required'],
      trim: true,
      maxlength: [100, 'Country name cannot be more than 100 characters'],
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Country code is required'],
      trim: true,
      maxlength: [3, 'Country code cannot be more than 3 characters'],
      unique: true,
    },
    flag: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for movies count
CountrySchema.virtual('moviesCount', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'country',
  count: true,
});

// Create indexes for faster queries
CountrySchema.index({ name: 1 });
CountrySchema.index({ code: 1 });
CountrySchema.index({ isActive: 1, order: 1 });

// Static method to find active countries
CountrySchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 });
};

// Static method to find country by code
CountrySchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase(), isActive: true });
};

// Static method to find countries with movies count
CountrySchema.statics.findWithMoviesCount = function() {
  return this.find({ isActive: true })
    .populate('moviesCount')
    .sort({ order: 1, name: 1 });
};

module.exports = mongoose.model('Country', CountrySchema);
