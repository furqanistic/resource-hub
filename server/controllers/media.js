// File: server/controllers/media.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createError } from '../error.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

// ─── POST /api/media/upload ────────────────────────────────────────────────────
// Admin only. Receives a single image via multipart/form-data field "image".
// Returns the public URL that can be stored in a Section field.
export const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, 'No file uploaded. Send a file under the "image" field.'))
    }

    const publicUrl = `/uploads/${req.file.filename}`

    res.status(201).json({
      status: 'success',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: publicUrl,
      },
    })
  } catch (err) {
    console.error('Error in uploadImage:', err)
    next(createError(500, 'Upload failed'))
  }
}

// ─── DELETE /api/media/:filename ───────────────────────────────────────────────
// Admin only. Deletes a file from the uploads directory.
export const deleteImage = (req, res, next) => {
  try {
    const { filename } = req.params

    // Basic path-traversal guard
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return next(createError(400, 'Invalid filename'))
    }

    const filePath = path.join(UPLOADS_DIR, filename)

    if (!fs.existsSync(filePath)) {
      return next(createError(404, `File '${filename}' not found`))
    }

    fs.unlinkSync(filePath)

    res.status(200).json({
      status: 'success',
      message: `File '${filename}' deleted`,
    })
  } catch (err) {
    console.error('Error in deleteImage:', err)
    next(createError(500, 'Failed to delete file'))
  }
}

// ─── GET /api/media/:filename ─────────────────────────────────────────────────
// Public. Redirects to the static file URL.
// (Direct static serving via express.static is preferred, but this route
//  is useful if you later switch to S3/CDN — just change the redirect target.)
export const serveImage = (req, res, next) => {
  try {
    const { filename } = req.params

    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return next(createError(400, 'Invalid filename'))
    }

    const filePath = path.join(UPLOADS_DIR, filename)

    if (!fs.existsSync(filePath)) {
      return next(createError(404, `File '${filename}' not found`))
    }

    res.redirect(`/uploads/${filename}`)
  } catch (err) {
    console.error('Error in serveImage:', err)
    next(createError(500, 'Failed to serve file'))
  }
}
