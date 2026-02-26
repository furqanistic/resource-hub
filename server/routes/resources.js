// File: server/routes/resources.js
import express from 'express'
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  reorderResources,
} from '../controllers/resources.js'
import { verifyToken, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', getAllResources)
router.get('/:id', getResourceById)

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.use(verifyToken, restrictTo('admin'))

router.post('/', createResource)
router.put('/:id', updateResource)
router.delete('/:id', deleteResource)
router.patch('/reorder', reorderResources)

export default router
