import mongoose from 'mongoose'

const DirectoryServiceSchema = new mongoose.Schema(
  {
    providerName: { type: String, required: true, trim: true },
    serviceCategory: { type: String, trim: true, default: '' },
    serviceTypes: { type: String, trim: true, default: '' },
    websiteUrl: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    serviceTimes: { type: String, trim: true, default: '' },
    accessibility: { type: String, trim: true, default: '' },
    cost: { type: String, trim: true, default: '' },
    countiesServed: { type: String, trim: true, default: '' },
    source: { type: String, trim: true, default: 'upload' },
    raw: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
)

DirectoryServiceSchema.index({ providerName: 1 })

export default mongoose.model('DirectoryService', DirectoryServiceSchema)
