// File: server/models/Section.js
import mongoose from 'mongoose'

const historyEntrySchema = new mongoose.Schema(
  {
    fields: {
      type: Map,
      of: String,
      default: {},
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
    savedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { _id: false }
)

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
    draftFields: {
      type: Map,
      of: String,
      default: {},
    },
    publishedFields: {
      type: Map,
      of: String,
      default: {},
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    history: {
      type: [historyEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const Section = mongoose.model('Section', sectionSchema)

export default Section
