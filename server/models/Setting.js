const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Setting key is required'],
      trim: true,
      unique: true,
      index: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Setting value is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['string', 'number', 'boolean', 'array', 'object', 'date'],
        message: '{VALUE} is not a valid setting type',
      },
      required: [true, 'Setting type is required'],
    },
    group: {
      type: String,
      default: 'general',
      trim: true,
      index: true,
    },
    label: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    options: {
      type: [String],
      default: [],
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
SettingSchema.index({ group: 1, order: 1 });
SettingSchema.index({ isPublic: 1, key: 1 });

// Static method to get setting by key
SettingSchema.statics.getByKey = async function(key) {
  const setting = await this.findOne({ key });
  
  if (!setting) return null;
  
  return setting.value;
};

// Static method to set setting by key
SettingSchema.statics.setByKey = async function(key, value, userId) {
  const setting = await this.findOne({ key });
  
  if (!setting) {
    throw new Error(`Setting with key '${key}' not found`);
  }
  
  setting.value = value;
  setting.updatedBy = userId;
  
  return setting.save();
};

// Static method to get settings by group
SettingSchema.statics.getByGroup = async function(group, isPublicOnly = false) {
  const query = { group };
  
  if (isPublicOnly) {
    query.isPublic = true;
  }
  
  const settings = await this.find(query).sort({ order: 1 });
  
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
};

// Static method to get all public settings
SettingSchema.statics.getAllPublic = async function() {
  const settings = await this.find({ isPublic: true }).sort({ group: 1, order: 1 });
  
  return settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = {};
    }
    
    acc[setting.group][setting.key] = setting.value;
    return acc;
  }, {});
};

// Static method to bulk update settings
SettingSchema.statics.bulkUpdate = async function(settings, userId) {
  const updates = [];
  
  for (const [key, value] of Object.entries(settings)) {
    updates.push(this.setByKey(key, value, userId));
  }
  
  return Promise.all(updates);
};

// Initialize default settings
SettingSchema.statics.initDefaults = async function() {
  const defaults = [
    // Site settings
    {
      key: 'site_name',
      value: 'Aovis - Movie & Cinema Booking System',
      type: 'string',
      group: 'site',
      label: 'Site Name',
      description: 'The name of your website',
      isPublic: true,
      isRequired: true,
      order: 1,
    },
    {
      key: 'site_description',
      value: 'Movie & Cinema Booking System',
      type: 'string',
      group: 'site',
      label: 'Site Description',
      description: 'A short description of your website',
      isPublic: true,
      isRequired: false,
      order: 2,
    },
    {
      key: 'site_logo',
      value: '/images/logo.png',
      type: 'string',
      group: 'site',
      label: 'Site Logo',
      description: 'The logo of your website',
      isPublic: true,
      isRequired: false,
      order: 3,
    },
    {
      key: 'site_favicon',
      value: '/images/favicon.ico',
      type: 'string',
      group: 'site',
      label: 'Site Favicon',
      description: 'The favicon of your website',
      isPublic: true,
      isRequired: false,
      order: 4,
    },
    
    // Contact settings
    {
      key: 'contact_email',
      value: 'info@example.com',
      type: 'string',
      group: 'contact',
      label: 'Contact Email',
      description: 'The email address for contact inquiries',
      isPublic: true,
      isRequired: true,
      order: 1,
    },
    {
      key: 'contact_phone',
      value: '+1 (123) 456-7890',
      type: 'string',
      group: 'contact',
      label: 'Contact Phone',
      description: 'The phone number for contact inquiries',
      isPublic: true,
      isRequired: false,
      order: 2,
    },
    {
      key: 'contact_address',
      value: '123 Main St, City, State, 12345',
      type: 'string',
      group: 'contact',
      label: 'Contact Address',
      description: 'The physical address of your business',
      isPublic: true,
      isRequired: false,
      order: 3,
    },
    
    // Social media settings
    {
      key: 'social_facebook',
      value: 'https://facebook.com/',
      type: 'string',
      group: 'social',
      label: 'Facebook URL',
      description: 'Your Facebook page URL',
      isPublic: true,
      isRequired: false,
      order: 1,
    },
    {
      key: 'social_twitter',
      value: 'https://twitter.com/',
      type: 'string',
      group: 'social',
      label: 'Twitter URL',
      description: 'Your Twitter profile URL',
      isPublic: true,
      isRequired: false,
      order: 2,
    },
    {
      key: 'social_instagram',
      value: 'https://instagram.com/',
      type: 'string',
      group: 'social',
      label: 'Instagram URL',
      description: 'Your Instagram profile URL',
      isPublic: true,
      isRequired: false,
      order: 3,
    },
    {
      key: 'social_youtube',
      value: 'https://youtube.com/',
      type: 'string',
      group: 'social',
      label: 'YouTube URL',
      description: 'Your YouTube channel URL',
      isPublic: true,
      isRequired: false,
      order: 4,
    },
    
    // Email settings
    {
      key: 'email_from',
      value: 'noreply@example.com',
      type: 'string',
      group: 'email',
      label: 'Email From',
      description: 'The email address used to send emails',
      isPublic: false,
      isRequired: true,
      order: 1,
    },
    {
      key: 'email_from_name',
      value: 'Aovis',
      type: 'string',
      group: 'email',
      label: 'Email From Name',
      description: 'The name used to send emails',
      isPublic: false,
      isRequired: true,
      order: 2,
    },
    
    // Payment settings
    {
      key: 'currency',
      value: 'USD',
      type: 'string',
      group: 'payment',
      label: 'Currency',
      description: 'The currency used for payments',
      isPublic: true,
      isRequired: true,
      order: 1,
      options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    },
    {
      key: 'currency_symbol',
      value: '$',
      type: 'string',
      group: 'payment',
      label: 'Currency Symbol',
      description: 'The symbol used for the currency',
      isPublic: true,
      isRequired: true,
      order: 2,
    },
    {
      key: 'tax_rate',
      value: 10,
      type: 'number',
      group: 'payment',
      label: 'Tax Rate (%)',
      description: 'The tax rate applied to purchases',
      isPublic: true,
      isRequired: true,
      order: 3,
    },
    
    // Booking settings
    {
      key: 'booking_expiration_minutes',
      value: 15,
      type: 'number',
      group: 'booking',
      label: 'Booking Expiration (minutes)',
      description: 'How long a booking is held before expiring',
      isPublic: true,
      isRequired: true,
      order: 1,
    },
    {
      key: 'max_tickets_per_booking',
      value: 10,
      type: 'number',
      group: 'booking',
      label: 'Max Tickets Per Booking',
      description: 'Maximum number of tickets allowed per booking',
      isPublic: true,
      isRequired: true,
      order: 2,
    },
    
    // Theme settings
    {
      key: 'theme_primary_color',
      value: '#e4d804',
      type: 'string',
      group: 'theme',
      label: 'Primary Color',
      description: 'The primary color used in the theme',
      isPublic: true,
      isRequired: true,
      order: 1,
    },
    {
      key: 'theme_secondary_color',
      value: '#1e1e1e',
      type: 'string',
      group: 'theme',
      label: 'Secondary Color',
      description: 'The secondary color used in the theme',
      isPublic: true,
      isRequired: true,
      order: 2,
    },
    {
      key: 'theme_accent_color',
      value: '#ffffff',
      type: 'string',
      group: 'theme',
      label: 'Accent Color',
      description: 'The accent color used in the theme',
      isPublic: true,
      isRequired: true,
      order: 3,
    },
    
    // Footer settings
    {
      key: 'footer_text',
      value: '© 2023 Aovis. All rights reserved.',
      type: 'string',
      group: 'footer',
      label: 'Footer Text',
      description: 'The text displayed in the footer',
      isPublic: true,
      isRequired: false,
      order: 1,
    },
    {
      key: 'footer_columns',
      value: 4,
      type: 'number',
      group: 'footer',
      label: 'Footer Columns',
      description: 'Number of columns in the footer',
      isPublic: true,
      isRequired: true,
      order: 2,
      options: ['1', '2', '3', '4'],
    },
  ];
  
  for (const setting of defaults) {
    const exists = await this.findOne({ key: setting.key });
    
    if (!exists) {
      await this.create(setting);
    }
  }
};

module.exports = mongoose.model('Setting', SettingSchema);
