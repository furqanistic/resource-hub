import mongoose from 'mongoose'

const HomePageContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, required: true, trim: true },
    heroTitleEs: { type: String, trim: true, default: '' },
    heroDescription1: { type: String, required: true, trim: true },
    heroDescription1Es: { type: String, trim: true, default: '' },
    heroDescription2: { type: String, required: true, trim: true },
    heroDescription2Es: { type: String, trim: true, default: '' },
    heroCta: { type: String, required: true, trim: true },
    heroCtaEs: { type: String, trim: true, default: '' },
    heroImageUrl: { type: String, trim: true, default: '' },
    heroImageAlt: { type: String, trim: true, default: '' },
    heroImageAltEs: { type: String, trim: true, default: '' },
    supportingPartnersLabel: { type: String, trim: true, default: '' },
    supportingPartnersLabelEs: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('HomePageContent', HomePageContentSchema)
