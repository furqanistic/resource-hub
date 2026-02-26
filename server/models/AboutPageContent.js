import mongoose from 'mongoose'

const AboutPageContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    paragraphs: { type: [String], required: true, default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('AboutPageContent', AboutPageContentSchema)
