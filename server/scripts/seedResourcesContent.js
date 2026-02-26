import dotenv from 'dotenv'
import mongoose from 'mongoose'
import ResourcesPageContent from '../models/ResourcesPageContent.js'

dotenv.config({ quiet: true })

const seedResourcesContent = async () => {
  try {
    const mongoUri = process.env.MONGO
    if (!mongoUri) {
      throw new Error('MONGO is not defined in the environment variables')
    }

    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    const existingContent = await ResourcesPageContent.findOne()
    if (existingContent) {
      console.log('ℹ️  Resources page content already exists')
      return
    }

    await ResourcesPageContent.create({
      title: 'Regional Transportation Resources',
      subtitle: 'Key tools and partners helping people access care, food, and essential services.',
      resources: [
        {
          title: 'CWCOG Mobility Management',
          description:
            'Mobility management tools, travel training, and regional coordination to connect people with transportation options.',
          ctaLabel: 'Visit CWCOG Mobility Management',
          href: 'https://www.cwcog.org/mobility-management/',
        },
        {
          title: 'Great Rivers BH-ASO Transportation Efforts',
          description:
            'Regional coordination focused on improving access to transportation for behavioral health and other essential services.',
          ctaLabel: 'Learn more about Great Rivers BH-ASO',
          href: 'https://www.grbhaso.org',
        },
      ],
    })

    console.log('✅ Resources page content seeded')
  } catch (error) {
    console.error('❌ Failed to seed resources page content:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedResourcesContent()
