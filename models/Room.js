const mongoose = require('mongoose');

// Schema for seat layout
const SeatSchema = new mongoose.Schema({
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
}, { _id: true });

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      maxlength: [50, 'Room name cannot be more than 50 characters'],
    },
    cinema_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: [true, 'Cinema is required'],
      index: true,
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
    layout: {
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
    },
    seats: [SeatSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual for screenings
RoomSchema.virtual('screenings', {
  ref: 'Screening',
  localField: '_id',
  foreignField: 'room_id',
  justOne: false,
});

// Create virtual for cinema
RoomSchema.virtual('cinema', {
  ref: 'Cinema',
  localField: 'cinema_id',
  foreignField: '_id',
  justOne: true,
});

// Create indexes for faster queries
RoomSchema.index({ cinema_id: 1, name: 1 });
RoomSchema.index({ type: 1 });
RoomSchema.index({ isActive: 1 });

// Static method to find rooms by cinema
RoomSchema.statics.findByCinema = function(cinemaId) {
  return this.find({ cinema_id: cinemaId, isActive: true })
    .sort({ name: 1 });
};

// Static method to find rooms by type
RoomSchema.statics.findByType = function(type) {
  return this.find({ type, isActive: true })
    .sort({ name: 1 })
    .populate('cinema', 'name location');
};

// Static method to find available rooms for a time slot
RoomSchema.statics.findAvailableForTimeSlot = async function(cinemaId, startTime, endTime) {
  const Screening = mongoose.model('Screening');
  
  // Find rooms that have screenings during the specified time slot
  const busyRooms = await Screening.find({
    cinema_id: cinemaId,
    $or: [
      // Screening starts during the requested time slot
      { startTime: { $gte: startTime, $lt: endTime } },
      // Screening ends during the requested time slot
      { endTime: { $gt: startTime, $lte: endTime } },
      // Screening starts before and ends after the requested time slot
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
    ]
  }).distinct('room_id');
  
  // Find rooms that are not busy during the specified time slot
  return this.find({
    cinema_id: cinemaId,
    _id: { $nin: busyRooms },
    isActive: true
  }).sort({ name: 1 });
};

module.exports = mongoose.model('Room', RoomSchema);
