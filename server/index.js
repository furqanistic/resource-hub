import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import authRoute from './routes/auth.js'

const app = express()
dotenv.config({ quiet: true })

app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://ascendaiempire.com/'
        : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Routes
app.use('/api/auth/', authRoute)

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
