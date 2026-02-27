import dotenv from 'dotenv'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import DirectoryService from '../models/DirectoryService.js'

dotenv.config({ quiet: true })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const normalizeRow = (row) => ({
  providerName: `${row['Provider Name'] || ''}`.trim(),
  serviceCategory: `${row['Service Category'] || ''}`.trim(),
  serviceTypes: `${row['Service Type(s)'] || ''}`.trim(),
  websiteUrl: `${row['Website Url'] || ''}`.trim(),
  phone: `${row['Phone'] || ''}`.trim(),
  serviceTimes: `${row['Service Times'] || ''}`.trim(),
  accessibility: `${row['Accessibility'] || ''}`.trim(),
  cost: `${row['Cost'] || ''}`.trim(),
  countiesServed: `${row['Counties Served'] || ''}`.trim(),
  source: 'seed-json',
  raw: row,
})

const seedFromJson = async () => {
  try {
    const mongoUri = process.env.MONGO
    if (!mongoUri) {
      throw new Error('MONGO is not defined in the environment variables')
    }

    const jsonPath = path.join(
      __dirname,
      '..',
      '..',
      'client',
      'src',
      'lib',
      'data',
      'Transportation Services in Washington.json'
    )

    const raw = fs.readFileSync(jsonPath, 'utf-8')
    const rows = JSON.parse(raw)
    const services = rows.map((row) => normalizeRow(row)).filter((row) => row.providerName)

    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    await DirectoryService.deleteMany({})
    await DirectoryService.insertMany(services)

    console.log(`✅ Seeded ${services.length} directory services from JSON`)
  } catch (error) {
    console.error('❌ Failed to seed directory services:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedFromJson()
