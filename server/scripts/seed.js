// File: server/scripts/seed.js
//
// Run with:  node scripts/seed.js
// (from the server/ directory, with a valid MONGO env var set)
//
// This pre-populates all 5 CMS sections with the hardcoded defaults
// that the EditorPanel.jsx currently shows.  Safe to re-run –
// existing documents will NOT be overwritten (updateOne with upsert:false
// is skipped if the sectionId already exists).

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import dns from 'dns'
import Section from '../models/Section.js'

dotenv.config({ quiet: true })
dns.setServers(['8.8.8.8', '1.1.1.1'])

const SECTIONS = [
  {
    sectionId: 'home.hero',
    label: 'Home Hero',
    fields: {
      'hero-title': 'CHOICE Regional Transportation Hub',
      'hero-description1':
        'This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region.',
      'hero-description2':
        'This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services.',
      'hero-cta': 'Start My Search',
      'hero-link': '/directory',
      'hero-image': '',
    },
  },
  {
    sectionId: 'home.regional',
    label: 'Regional Partners',
    fields: {
      'regional-title-1': 'Regional Partners',
      'regional-title-2': 'Collaborating for Care',
      'regional-p1':
        'Our regional partners work together to ensure that every community member has access to the transportation they need.',
      'regional-p2':
        'By coordinating resources and sharing information, we can better serve our region and improve health outcomes.',
      'regional-image': '',
    },
  },
  {
    sectionId: 'about.page',
    label: 'About Page',
    fields: {
      'about-title': 'About Our Hub',
      'about-p1':
        'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. (Block 1)',
      'about-p2':
        'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. (Block 2)',
      'about-p3':
        'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. (Block 3)',
      'about-p4':
        'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. (Block 4)',
    },
  },
  {
    sectionId: 'resources.page',
    label: 'Resources Page',
    fields: {
      'resources-title': 'Regional Transportation Resources',
      'resources-subtitle': 'Key tools and partners helping people access care.',
      'res-cwcog-title': 'CWCOG Mobility Management',
      'res-cwcog-desc': 'Mobility management tools and coordination...',
    },
  },
  {
    sectionId: 'partners.page',
    label: 'Partners Page',
    fields: {
      'partner-name-0': 'RiverCities Transit',
      'partner-url-0': 'https://www.rctransit.org',
      'partner-name-1': 'Washington State Health Care Authority (HCA)',
      'partner-url-1': 'https://www.hca.wa.gov',
    },
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log('✅ Connected to MongoDB')

    let created = 0
    let skipped = 0

    for (const data of SECTIONS) {
      const exists = await Section.findOne({ sectionId: data.sectionId })

      if (exists) {
        console.log(`⏭  Skipped '${data.sectionId}' — already exists`)
        skipped++
      } else {
        const now = new Date()
        await Section.create({
          ...data,
          draftFields: data.fields,
          publishedFields: data.fields,
          isDraft: false,
          publishedAt: now,
          history: [{ fields: data.fields, savedAt: now, savedBy: null }],
        })
        console.log(`✅ Seeded  '${data.sectionId}'`)
        created++
      }
    }

    console.log(
      `\n🌱 Done — ${created} created, ${skipped} skipped (already existed)`
    )
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

seed()
