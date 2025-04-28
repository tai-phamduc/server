const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
      maxlength: [100, 'Template name cannot be more than 100 characters'],
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
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot be more than 200 characters'],
    },
    htmlContent: {
      type: String,
      required: [true, 'HTML content is required'],
    },
    textContent: {
      type: String,
      required: [true, 'Text content is required'],
    },
    category: {
      type: String,
      enum: {
        values: ['user', 'booking', 'payment', 'newsletter', 'system', 'marketing'],
        message: '{VALUE} is not a valid category',
      },
      default: 'system',
      index: true,
    },
    variables: {
      type: [String],
      default: [],
    },
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
EmailTemplateSchema.index({ category: 1, isActive: 1 });

// Pre-save hook to generate slug from name
EmailTemplateSchema.pre('save', function(next) {
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

// Static method to find active templates
EmailTemplateSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ name: 1 });
};

// Static method to find templates by category
EmailTemplateSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true })
    .sort({ name: 1 });
};

// Static method to find template by slug
EmailTemplateSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug.toLowerCase(), isActive: true });
};

// Method to render template with variables
EmailTemplateSchema.methods.render = function(variables = {}) {
  let html = this.htmlContent;
  let text = this.textContent;
  
  // Replace variables in the template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(regex, value);
    text = text.replace(regex, value);
  }
  
  // Replace any remaining variables with empty string
  html = html.replace(/{{.*?}}/g, '');
  text = text.replace(/{{.*?}}/g, '');
  
  return {
    subject: this.subject,
    html,
    text,
  };
};

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
