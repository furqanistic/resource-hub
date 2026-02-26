import dotenv from 'dotenv'
import mongoose from 'mongoose'
import HomePageContent from '../models/HomePageContent.js'

dotenv.config({ quiet: true })

const seedHomeContent = async () => {
  try {
    const mongoUri = process.env.MONGO
    if (!mongoUri) {
      throw new Error('MONGO is not defined in the environment variables')
    }

    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    const existingContent = await HomePageContent.findOne()
    if (existingContent) {
      console.log('ℹ️  Home page content already exists')
      return
    }

    await HomePageContent.create({
      heroTitle: 'CHOICE Regional Transportation Hub',
      heroDescription1:
        'This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region.',
      heroDescription2:
        'This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services.',
      heroCta: 'Start My Search',
      heroImageUrl: '',
      heroImageAlt: 'Supportive driver providing transportation',
      supportingPartnersLabel: 'Supporting Partners',
    })

    console.log('✅ Home page content seeded')
  } catch (error) {
    console.error('❌ Failed to seed home page content:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedHomeContent()
