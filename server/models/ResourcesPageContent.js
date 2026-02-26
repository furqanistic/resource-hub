import mongoose from 'mongoose'

const ResourceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    ctaLabel: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const ResourcesPageContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    resources: { type: [ResourceItemSchema], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('ResourcesPageContent', ResourcesPageContentSchema)
