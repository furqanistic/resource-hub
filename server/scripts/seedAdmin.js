import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'

dotenv.config({ quiet: true })

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO
    if (!mongoUri) {
      throw new Error('MONGO is not defined in the environment variables')
    }

    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    const adminEmail = 'admin@cwcog.org'
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists')
      return
    }

    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'testing123',
      role: 'admin',
    })

    console.log('✅ Admin user created')
  } catch (error) {
    console.error('❌ Failed to seed admin user:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedAdmin()
