const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Language name is required'],
      trim: true,
      maxlength: [50, 'Language name cannot be more than 50 characters'],
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Language code is required'],
      trim: true,
      maxlength: [10, 'Language code cannot be more than 10 characters'],
      unique: true,
    },
    nativeName: {
      type: String,
      trim: true,
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
    isDefault: {
      type: Boolean,
      default: false,
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
LanguageSchema.virtual('moviesCount', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'language',
  count: true,
});

// Create indexes for faster queries
LanguageSchema.index({ name: 1 });
LanguageSchema.index({ code: 1 });
LanguageSchema.index({ isActive: 1, order: 1 });
LanguageSchema.index({ isDefault: 1 });

// Static method to find active languages
LanguageSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 });
};

// Static method to find default language
LanguageSchema.statics.findDefault = function() {
  return this.findOne({ isDefault: true, isActive: true });
};

// Static method to find language by code
LanguageSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toLowerCase(), isActive: true });
};

// Static method to find languages with movies count
LanguageSchema.statics.findWithMoviesCount = function() {
  return this.find({ isActive: true })
    .populate('moviesCount')
    .sort({ order: 1, name: 1 });
};

module.exports = mongoose.model('Language', LanguageSchema);
