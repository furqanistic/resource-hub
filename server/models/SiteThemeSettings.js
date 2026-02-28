// File: server/models/SiteThemeSettings.js
import mongoose from 'mongoose'

const hexColorPattern = /^#[0-9a-fA-F]{6}$/

const SiteThemeSettingsSchema = new mongoose.Schema(
  {
    backgroundColor: {
      type: String,
      trim: true,
      default: '#fcfdfe',
      validate: {
        validator: (value) => hexColorPattern.test(value),
        message: 'Background color must be a valid hex color (#RRGGBB)',
      },
    },
    textColor: {
      type: String,
      trim: true,
      default: '#03385e',
      validate: {
        validator: (value) => hexColorPattern.test(value),
        message: 'Text color must be a valid hex color (#RRGGBB)',
      },
    },
    primaryColor: {
      type: String,
      trim: true,
      default: '#03385e',
      validate: {
        validator: (value) => hexColorPattern.test(value),
        message: 'Primary color must be a valid hex color (#RRGGBB)',
      },
    },
  },
  { timestamps: true }
)

export default mongoose.model('SiteThemeSettings', SiteThemeSettingsSchema)

