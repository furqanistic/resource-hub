// File: server/routes/cms.js
import express from 'express'
import {
  getAllSections,
  getAllSectionsForAdmin,
  getSectionById,
  getSectionByIdForAdmin,
  updateSection,
  publishSection,
} from '../controllers/cms.js'
import {
  getSectionHistory,
  publishAllSections,
  publishSectionById,
  revertSection,
} from '../controllers/publish.js'
import { verifyToken, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/sections', getAllSections)
router.get('/sections/:id', getSectionById)

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.use(verifyToken, restrictTo('admin'))

router.get('/admin/sections', getAllSectionsForAdmin)
router.get('/admin/sections/:id', getSectionByIdForAdmin)
router.put('/sections/:id', updateSection)
router.post('/sections/:id/publish', publishSection)
router.post('/publish/all', publishAllSections)
router.post('/publish/:sectionId', publishSectionById)
router.post('/revert/:sectionId', revertSection)
router.get('/history/:sectionId', getSectionHistory)

export default router
