// File: server/models/SiteThemeSettings.js
import mongoose from 'mongoose'

const hexColorPattern = /^#[0-9a-fA-F]{6}$/
const allowedFontFamilies = [
  "'Poppins', 'Inter', sans-serif",
  "'Inter', sans-serif",
  "'Lora', serif",
  "'IBM Plex Mono', monospace",
]

const themeOverrideField = {
  type: String,
  trim: true,
}

const ThemeOverrideSchema = new mongoose.Schema(
  {
    backgroundColor: {
      ...themeOverrideField,
      validate: {
        validator: (value) => value === undefined || hexColorPattern.test(value),
        message: 'Background color must be a valid hex color (#RRGGBB)',
      },
    },
    textColor: {
      ...themeOverrideField,
      validate: {
        validator: (value) => value === undefined || hexColorPattern.test(value),
        message: 'Text color must be a valid hex color (#RRGGBB)',
      },
    },
    primaryColor: {
      ...themeOverrideField,
      validate: {
        validator: (value) => value === undefined || hexColorPattern.test(value),
        message: 'Primary color must be a valid hex color (#RRGGBB)',
      },
    },
    fontFamily: {
      ...themeOverrideField,
      validate: {
        validator: (value) => value === undefined || allowedFontFamilies.includes(value),
        message: 'Font family must be one of the supported options',
      },
    },
    headingScale: {
      type: Number,
      min: [0.8, 'Heading scale must be at least 0.8'],
      max: [1.4, 'Heading scale must be at most 1.4'],
    },
    bodySize: {
      type: Number,
      min: [14, 'Body size must be at least 14px'],
      max: [20, 'Body size must be at most 20px'],
      validate: {
        validator: (value) => value === undefined || Number.isInteger(value),
        message: 'Body size must be a whole number',
      },
    },
    lineHeight: {
      type: Number,
      min: [1.2, 'Line height must be at least 1.2'],
      max: [2, 'Line height must be at most 2'],
    },
  },
  { _id: false }
)

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
    fontFamily: {
      type: String,
      trim: true,
      default: "'Poppins', 'Inter', sans-serif",
      enum: {
        values: allowedFontFamilies,
        message: 'Font family must be one of the supported options',
      },
    },
    headingScale: {
      type: Number,
      default: 1,
      min: [0.8, 'Heading scale must be at least 0.8'],
      max: [1.4, 'Heading scale must be at most 1.4'],
    },
    bodySize: {
      type: Number,
      default: 16,
      min: [14, 'Body size must be at least 14px'],
      max: [20, 'Body size must be at most 20px'],
      validate: {
        validator: Number.isInteger,
        message: 'Body size must be a whole number',
      },
    },
    lineHeight: {
      type: Number,
      default: 1.6,
      min: [1.2, 'Line height must be at least 1.2'],
      max: [2, 'Line height must be at most 2'],
    },
    pageOverrides: {
      type: Map,
      of: ThemeOverrideSchema,
      default: {},
    },
    sectionOverrides: {
      type: Map,
      of: ThemeOverrideSchema,
      default: {},
    },
  },
  { timestamps: true }
)

export default mongoose.model('SiteThemeSettings', SiteThemeSettingsSchema)
