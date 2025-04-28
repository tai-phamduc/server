const mongoose = require('mongoose');

const SeatTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Seat type name is required'],
      trim: true,
      maxlength: [50, 'Seat type name cannot be more than 50 characters'],
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Seat type code is required'],
      trim: true,
      maxlength: [10, 'Seat type code cannot be more than 10 characters'],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#000000',
    },
    priceMultiplier: {
      type: Number,
      default: 1,
      min: [0.1, 'Price multiplier must be at least 0.1'],
    },
    features: {
      type: [String],
      default: [],
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
  }
);

// Create indexes for faster queries
SeatTypeSchema.index({ name: 1 });
SeatTypeSchema.index({ code: 1 });
SeatTypeSchema.index({ isActive: 1, order: 1 });

// Static method to find active seat types
SeatTypeSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 });
};

// Static method to find seat type by code
SeatTypeSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase(), isActive: true });
};

// Static method to calculate price for a seat type
SeatTypeSchema.statics.calculatePrice = function(code, basePrice) {
  return this.findByCode(code)
    .then(seatType => {
      if (!seatType) {
        return basePrice;
      }
      
      return basePrice * seatType.priceMultiplier;
    });
};

module.exports = mongoose.model('SeatType', SeatTypeSchema);
