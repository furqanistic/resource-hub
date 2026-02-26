// File: server/scripts/seedAdmin.js
import bcrypt from 'bcryptjs'
import dns from 'dns'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'

dotenv.config({ quiet: true })
dns.setServers(['8.8.8.8', '1.1.1.1'])

const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Resource Hub Admin'
const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL || 'admin@resourcehub.local')
  .toLowerCase()
  .trim()
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345'

const run = async () => {
  try {
    if (!process.env.MONGO) {
      throw new Error('MONGO is not set in environment variables')
    }

    await mongoose.connect(process.env.MONGO)
    console.log('Connected to MongoDB')

    const now = new Date()
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)
    const existing = await User.collection.findOne({ email: ADMIN_EMAIL })

    if (existing) {
      await User.collection.updateOne(
        { _id: existing._id },
        {
          $set: {
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            isDeleted: false,
            updatedAt: now,
          },
        }
      )
      console.log(`Updated existing admin user: ${ADMIN_EMAIL}`)
    } else {
      await User.collection.insertOne({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isDeleted: false,
        lastLogin: null,
        createdAt: now,
        updatedAt: now,
      })
      console.log(`Created admin user: ${ADMIN_EMAIL}`)
    }

    console.log('\nLogin credentials:')
    console.log(`Email: ${ADMIN_EMAIL}`)
    console.log(`Password: ${ADMIN_PASSWORD}`)
  } catch (error) {
    console.error('Failed to seed admin:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

run()
