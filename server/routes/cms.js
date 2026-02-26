// File: server/routes/cms.js
import express from 'express'
import {
  getAllSections,
  getSectionById,
  updateSection,
  publishSection,
} from '../controllers/cms.js'
import { verifyToken, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/sections', getAllSections)
router.get('/sections/:id', getSectionById)

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.use(verifyToken, restrictTo('admin'))

router.put('/sections/:id', updateSection)
router.post('/sections/:id/publish', publishSection)

export default router
