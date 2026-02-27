import express from 'express'
import multer from 'multer'
import { restrictTo, verifyToken } from '../middleware/authMiddleware.js'
import {
  getDirectoryServices,
  replaceDirectoryServices,
  uploadDirectoryFile,
} from '../controllers/directory.js'
import { exportDirectoryCsv } from '../controllers/directoryExport.js'
import { parseDirectoryUpload, uploadDirectoryFileConfig } from '../middleware/uploadDirectory.js'

const router = express.Router()

router.get('/', getDirectoryServices)
router.get('/export', verifyToken, restrictTo('admin'), exportDirectoryCsv)

router.put('/', verifyToken, restrictTo('admin'), replaceDirectoryServices)

const storage = multer.diskStorage(uploadDirectoryFileConfig.storage)
const upload = multer({
  storage,
  fileFilter: uploadDirectoryFileConfig.fileFilter,
  limits: uploadDirectoryFileConfig.limits,
})

router.post(
  '/upload',
  verifyToken,
  restrictTo('admin'),
  upload.single('file'),
  parseDirectoryUpload,
  uploadDirectoryFile
)

export default router
