import mongoose from 'mongoose'

const HomePageContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, required: true, trim: true },
    heroDescription1: { type: String, required: true, trim: true },
    heroDescription2: { type: String, required: true, trim: true },
    heroCta: { type: String, required: true, trim: true },
    heroImageUrl: { type: String, trim: true, default: '' },
    heroImageAlt: { type: String, trim: true, default: '' },
    supportingPartnersLabel: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('HomePageContent', HomePageContentSchema)
