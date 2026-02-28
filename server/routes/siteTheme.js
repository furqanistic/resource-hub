// File: server/routes/siteTheme.js
import express from 'express'
import {
  getSiteThemeSettings,
  updateSiteThemeSettings,
} from '../controllers/siteTheme.js'
import { restrictTo, verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getSiteThemeSettings)
router.put('/', verifyToken, restrictTo('admin'), updateSiteThemeSettings)

export default router

