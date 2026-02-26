// File: server/models/Section.js
import mongoose from 'mongoose'

const sectionSchema = new mongoose.Schema(
  {
    sectionId: {
      type: String,
      required: [true, 'Section ID is required'],
      unique: true,
      trim: true,
      // e.g. 'home.hero', 'home.regional', 'about.page', 'resources.page', 'partners.page'
    },
    label: {
      type: String,
      required: [true, 'Section label is required'],
      trim: true,
    },
    fields: {
      type: Map,
      of: String,
      default: {},
      // e.g. { 'hero-title': 'CHOICE Regional...', 'hero-cta': 'Start My Search' }
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Section = mongoose.model('Section', sectionSchema)

export default Section
