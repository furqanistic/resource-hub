// File: server/routes/media.js
import express from 'express'
import { uploadImage, deleteImage, serveImage } from '../controllers/media.js'
import { upload } from '../middleware/upload.js'
import { verifyToken, restrictTo } from '../middleware/authMiddleware.js'
import { createError } from '../error.js'

const router = express.Router()

// ── Public: serve/redirect to image ──────────────────────────────────────────
router.get('/:filename', serveImage)

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.use(verifyToken, restrictTo('admin'))

// upload.single('image') runs multer before the controller
router.post(
  '/upload',
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (!err) return next()

      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(createError(413, 'Image too large. Maximum allowed size is 2MB.'))
      }

      return next(err)
    })
  },
  uploadImage
)
router.delete('/:filename', deleteImage)

export default router
