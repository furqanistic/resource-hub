// File: server/routes/media.js
import express from 'express'
import { uploadImage, deleteImage, serveImage } from '../controllers/media.js'
import { upload } from '../middleware/upload.js'
import { verifyToken, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── Public: serve/redirect to image ──────────────────────────────────────────
router.get('/:filename', serveImage)

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.use(verifyToken, restrictTo('admin'))

// upload.single('image') runs multer before the controller
router.post('/upload', upload.single('image'), uploadImage)
router.delete('/:filename', deleteImage)

export default router
