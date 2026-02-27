import mongoose from 'mongoose'

const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    descriptionEs: { type: String, trim: true, default: '' },
    logoKey: { type: String, trim: true, default: '' },
    logoUrl: { type: String, trim: true, default: '' },
    logoClass: { type: String, trim: true, default: '' },
  },
  { _id: false }
)

const PartnersPageContentSchema = new mongoose.Schema(
  {
    partners: { type: [PartnerSchema], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('PartnersPageContent', PartnersPageContentSchema)
