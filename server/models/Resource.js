// File: server/models/Resource.js
import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['resource', 'partner'],
      required: [true, 'Type must be "resource" or "partner"'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      default: '',
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Sort by order ascending by default
resourceSchema.index({ type: 1, order: 1 })

const Resource = mongoose.model('Resource', resourceSchema)

export default Resource
