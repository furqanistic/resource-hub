// File: server/routes/resources.js
import express from 'express'
import {
  getAllResources,
  getResourceById,
} from '../controllers/resources.js'

const router = express.Router()

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', getAllResources)
router.get('/:id', getResourceById)

export default router
