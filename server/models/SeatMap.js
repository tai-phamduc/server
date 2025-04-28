const mongoose = require('mongoose');

// Seat Schema (Sub-document)
const SeatSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Seat code is required'],
      trim: true,
    },
    row: {
      type: String,
      required: [true, 'Seat row is required'],
      trim: true,
    },
    column: {
      type: Number,
      required: [true, 'Seat column is required'],
      min: [1, 'Seat column must be at least 1'],
    },
    type: {
      type: String,
      enum: {
        values: ['standard', 'premium', 'vip', 'accessible', 'couple', 'unavailable'],
        message: '{VALUE} is not a valid seat type',
      },
      default: 'standard',
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'unavailable', 'maintenance'],
        message: '{VALUE} is not a valid seat status',
      },
      default: 'available',
    },
    position: {
      x: {
        type: Number,
        required: [true, 'Seat X position is required'],
      },
      y: {
        type: Number,
        required: [true, 'Seat Y position is required'],
      },
    },
    label: {
      type: String,
      trim: true,
    },
    isAisle: {
      type: Boolean,
      default: false,
    },
    isLeftSide: {
      type: Boolean,
      default: false,
    },
    isRightSide: {
      type: Boolean,
      default: false,
    },
    isFrontRow: {
      type: Boolean,
      default: false,
    },
    isBackRow: {
      type: Boolean,
      default: false,
    },
    adjacentSeats: {
      left: {
        type: String,
        default: null,
      },
      right: {
        type: String,
        default: null,
      },
      front: {
        type: String,
        default: null,
      },
      back: {
        type: String,
        default: null,
      },
    },
  },
  {
    _id: false,
  }
);

// Row Schema (Sub-document)
const RowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Row name is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, 'Row order is required'],
      min: [1, 'Row order must be at least 1'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'Number of seats must be at least 1'],
    },
    type: {
      type: String,
      enum: {
        values: ['standard', 'premium', 'vip'],
        message: '{VALUE} is not a valid row type',
      },
      default: 'standard',
    },
    position: {
      y: {
        type: Number,
        required: [true, 'Row Y position is required'],
      },
    },
  },
  {
    _id: false,
  }
);

// Section Schema (Sub-document)
const SectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Section name is required'],
      trim: true,
    },
    rows: {
      type: [RowSchema],
      default: [],
    },
    type: {
      type: String,
      enum: {
        values: ['main', 'balcony', 'box', 'vip'],
        message: '{VALUE} is not a valid section type',
      },
      default: 'main',
    },
    position: {
      x: {
        type: Number,
        default: 0,
      },
      y: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    _id: false,
  }
);

// SeatMap Schema
const SeatMapSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Seat map name is required'],
      trim: true,
      maxlength: [100, 'Seat map name cannot be more than 100 characters'],
      unique: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: [true, 'Theater is required'],
      index: true,
    },
    hall: {
      type: String,
      required: [true, 'Hall is required'],
      trim: true,
    },
    hallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater.halls',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    sections: {
      type: [SectionSchema],
      default: [],
    },
    seats: {
      type: Map,
      of: SeatSchema,
      required: [true, 'Seats are required'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1'],
    },
    standardSeats: {
      type: Number,
      default: 0,
      min: [0, 'Standard seats cannot be negative'],
    },
    premiumSeats: {
      type: Number,
      default: 0,
      min: [0, 'Premium seats cannot be negative'],
    },
    vipSeats: {
      type: Number,
      default: 0,
      min: [0, 'VIP seats cannot be negative'],
    },
    accessibleSeats: {
      type: Number,
      default: 0,
      min: [0, 'Accessible seats cannot be negative'],
    },
    coupleSeats: {
      type: Number,
      default: 0,
      min: [0, 'Couple seats cannot be negative'],
    },
    width: {
      type: Number,
      required: [true, 'Width is required'],
      min: [1, 'Width must be at least 1'],
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [1, 'Height must be at least 1'],
    },
    screenPosition: {
      x: {
        type: Number,
        default: 0,
      },
      y: {
        type: Number,
        default: 0,
      },
      width: {
        type: Number,
        default: 0,
      },
      height: {
        type: Number,
        default: 0,
      },
    },
    entrancePositions: [
      {
        x: {
          type: Number,
          required: true,
        },
        y: {
          type: Number,
          required: true,
        },
        label: {
          type: String,
          default: 'Entrance',
        },
      },
    ],
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
SeatMapSchema.index({ theater: 1, hall: 1 });
SeatMapSchema.index({ isActive: 1 });

// Pre-save hook to calculate seat counts
SeatMapSchema.pre('save', function(next) {
  try {
    if (this.isModified('seats')) {
      // Reset counts
      this.standardSeats = 0;
      this.premiumSeats = 0;
      this.vipSeats = 0;
      this.accessibleSeats = 0;
      this.coupleSeats = 0;
      
      // Count seats by type
      for (const [code, seat] of this.seats.entries()) {
        if (seat.status === 'available') {
          switch (seat.type) {
            case 'standard':
              this.standardSeats += 1;
              break;
            case 'premium':
              this.premiumSeats += 1;
              break;
            case 'vip':
              this.vipSeats += 1;
              break;
            case 'accessible':
              this.accessibleSeats += 1;
              break;
            case 'couple':
              this.coupleSeats += 1;
              break;
          }
        }
      }
      
      // Update total seats
      this.totalSeats = this.standardSeats + this.premiumSeats + this.vipSeats + 
                        this.accessibleSeats + this.coupleSeats;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find seat maps by theater
SeatMapSchema.statics.findByTheater = function(theaterId) {
  return this.find({ theater: theaterId, isActive: true })
    .sort({ hall: 1 });
};

// Static method to find seat map by theater and hall
SeatMapSchema.statics.findByTheaterAndHall = function(theaterId, hall) {
  return this.findOne({ theater: theaterId, hall, isActive: true });
};

// Method to get available seats
SeatMapSchema.methods.getAvailableSeats = function() {
  const availableSeats = {};
  
  for (const [code, seat] of this.seats.entries()) {
    if (seat.status === 'available') {
      availableSeats[code] = seat;
    }
  }
  
  return availableSeats;
};

// Method to get seat by code
SeatMapSchema.methods.getSeat = function(code) {
  return this.seats.get(code);
};

// Method to get adjacent seats
SeatMapSchema.methods.getAdjacentSeats = function(code) {
  const seat = this.seats.get(code);
  
  if (!seat) {
    return [];
  }
  
  const adjacentSeats = [];
  
  if (seat.adjacentSeats.left) {
    adjacentSeats.push(seat.adjacentSeats.left);
  }
  
  if (seat.adjacentSeats.right) {
    adjacentSeats.push(seat.adjacentSeats.right);
  }
  
  if (seat.adjacentSeats.front) {
    adjacentSeats.push(seat.adjacentSeats.front);
  }
  
  if (seat.adjacentSeats.back) {
    adjacentSeats.push(seat.adjacentSeats.back);
  }
  
  return adjacentSeats;
};

// Method to get seats by row
SeatMapSchema.methods.getSeatsByRow = function(row) {
  const rowSeats = [];
  
  for (const [code, seat] of this.seats.entries()) {
    if (seat.row === row) {
      rowSeats.push({ code, ...seat.toObject() });
    }
  }
  
  return rowSeats.sort((a, b) => a.column - b.column);
};

// Method to get all rows
SeatMapSchema.methods.getRows = function() {
  const rows = new Set();
  
  for (const seat of this.seats.values()) {
    rows.add(seat.row);
  }
  
  return Array.from(rows).sort();
};

module.exports = mongoose.model('SeatMap', SeatMapSchema);
