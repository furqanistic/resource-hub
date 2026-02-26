// File: server/index.js
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import dns from 'dns'
import authRoute from './routes/auth.js'
import cmsRoute from './routes/cms.js'
import mediaRoute from './routes/media.js'
import resourcesRoute from './routes/resources.js'

const app = express()
dotenv.config({ quiet: true })
dns.setServers(['8.8.8.8', '1.1.1.1'])
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
app.use('/api/cms', cmsRoute)
app.use('/api/media', mediaRoute)
app.use('/api/resources', resourcesRoute)

// Static: serve uploaded images directly
app.use('/uploads', express.static('uploads'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  })
})

// Global error handler (always return JSON)
app.use((err, _req, res, _next) => {
  const statusCode =
    err?.statusCode || (err?.code === 'LIMIT_FILE_SIZE' ? 413 : 500)
  const status = err?.status || (String(statusCode).startsWith('4') ? 'fail' : 'error')
  const message =
    err?.message ||
    (statusCode === 413
      ? 'Image too large. Maximum allowed size is 2MB.'
      : 'Something went wrong')

  res.status(statusCode).json({
    status,
    message,
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
