// File: server/middleware/upload.js
//
// Multer configuration for local disk storage.
// Stores images in server/uploads/.
// Swappable to Cloudinary / S3 by replacing the storage engine later.

import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createError } from '../error.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads land in server/uploads/ regardless of cwd
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// ── Storage engine ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (_req, file, cb) => {
    // Unique name: timestamp + random suffix + original extension
    const ext = path.extname(file.originalname).toLowerCase()
    const basename = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
    const unique = `${basename}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
    cb(null, unique)
  },
})

// ── File filter (images only) ─────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
  const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(createError(400, 'Only image files are allowed (JPG, PNG, GIF, WEBP, SVG)'), false)
  }
}

// ── Max size: 2 MB ────────────────────────────────────────────────────────────
const MAX_SIZE = parseInt(process.env.UPLOAD_SIZE_LIMIT, 10) || 2 * 1024 * 1024

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
})
