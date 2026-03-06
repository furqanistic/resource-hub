import mongoose from 'mongoose'

const ResourceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    titleEs: { type: String, trim: true, default: '' },
    description: { type: String, required: true, trim: true },
    descriptionEs: { type: String, trim: true, default: '' },
    ctaLabel: { type: String, required: true, trim: true },
    ctaLabelEs: { type: String, trim: true, default: '' },
    href: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const ResourcesPageContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    titleEs: { type: String, trim: true, default: '' },
    subtitle: { type: String, required: true, trim: true },
    subtitleEs: { type: String, trim: true, default: '' },
    resources: { type: [ResourceItemSchema], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('ResourcesPageContent', ResourcesPageContentSchema)
