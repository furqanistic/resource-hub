import dotenv from 'dotenv'
import mongoose from 'mongoose'
import AboutPageContent from '../models/AboutPageContent.js'

dotenv.config({ quiet: true })

const seedAboutContent = async () => {
  try {
    const mongoUri = process.env.MONGO
    if (!mongoUri) {
      throw new Error('MONGO is not defined in the environment variables')
    }

    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    const existingContent = await AboutPageContent.findOne()
    if (existingContent) {
      console.log('ℹ️  About page content already exists')
      return
    }

    await AboutPageContent.create({
      title: 'About & Partners',
      paragraphs: [
        'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. CHOICE created this hub to make it easier for individuals, providers, and care coordinators to find and use transportation services that support access to medical care and essential needs.',
        'This work builds on regional collaboration through the Great Rivers BH-ASO Transportation Collaborative, where partners identified transportation as a major barrier to accessing care. Community surveys and partner feedback showed that many people were unaware of available transportation resources or unsure how to access them.',
        'In response, CHOICE Regional Health Network took the lead in creating this centralized hub to bring transportation information together in one place. This hub reflects CHOICE\'s ongoing commitment to improving access to care and strengthening connections between community members and essential services.',
        'Supporting partners in this effort include Great Rivers BH-ASO, UnitedHealthcare and the Cowlitz-Wahkiakum Council of Governments Mobility Management program, whose collaboration and input helped inform the development of this resource.',
      ],
    })

    console.log('✅ About page content seeded')
  } catch (error) {
    console.error('❌ Failed to seed about page content:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedAboutContent()
