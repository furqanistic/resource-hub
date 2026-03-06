import mongoose from 'mongoose'

const AboutPageContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    titleEs: { type: String, trim: true, default: '' },
    paragraphs: { type: [String], required: true, default: [] },
    paragraphsEs: { type: [String], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('AboutPageContent', AboutPageContentSchema)
