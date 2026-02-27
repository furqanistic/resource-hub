// File: server/index.js - MINIMAL VERSION TO GET STARTED
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

// Only import existing routes
import authRoute from './routes/auth.js'
import contentRoute from './routes/content.js'
import directoryRoute from './routes/directory.js'
// import referralRoute from './routes/referral.js' // Comment out for now

const app = express()
dotenv.config({ quiet: true })

app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'http://187.77.218.189/'
        : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Routes
app.use('/api/auth/', authRoute)
app.use('/api/content/', contentRoute)
app.use('/api/directory/', directoryRoute)
// app.use('/api/referral/', referralRoute) // Comment out for now

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  })
})

// Database connection
const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log('✅ Connected to MongoDB')
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err)
      process.exit(1)
    })
}


const PORT = process.env.PORT || 8800

app.listen(PORT, () => {
  connect()
  console.log(`🚀 Server running on port ${PORT}`)
})
