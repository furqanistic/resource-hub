import express from 'express'
import {
  getAboutContent,
  getHomeContent,
  getPartnersContent,
  getResourcesContent,
  updateAboutContent,
  updateHomeContent,
  updatePartnersContent,
  updateResourcesContent,
} from '../controllers/content.js'
import { restrictTo, verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/home', getHomeContent)
router.put('/home', verifyToken, restrictTo('admin'), updateHomeContent)
router.get('/resources', getResourcesContent)
router.put('/resources', verifyToken, restrictTo('admin'), updateResourcesContent)
router.get('/about', getAboutContent)
router.put('/about', verifyToken, restrictTo('admin'), updateAboutContent)
router.get('/partners', getPartnersContent)
router.put('/partners', verifyToken, restrictTo('admin'), updatePartnersContent)

export default router
