// File: server/controllers/resources.js
import { createError } from '../error.js'
import Resource from '../models/Resource.js'

// ─── GET /api/resources ────────────────────────────────────────────────────────
// Public. Supports ?type=resource|partner and ?published=true filters.
export const getAllResources = async (req, res, next) => {
  try {
    const filter = {}

    if (req.query.type) {
      if (!['resource', 'partner'].includes(req.query.type)) {
        return next(createError(400, 'type must be "resource" or "partner"'))
      }
      filter.type = req.query.type
    }

    if (req.query.published === 'true') {
      filter.isPublished = true
    }

    const resources = await Resource.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .lean()

    res.status(200).json({
      status: 'success',
      results: resources.length,
      data: { resources },
    })
  } catch (err) {
    console.error('Error in getAllResources:', err)
    next(createError(500, 'Failed to fetch resources'))
  }
}

// ─── GET /api/resources/:id ────────────────────────────────────────────────────
// Public.
export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).lean()

    if (!resource) {
      return next(createError(404, 'Resource not found'))
    }

    res.status(200).json({
      status: 'success',
      data: { resource },
    })
  } catch (err) {
    console.error('Error in getResourceById:', err)
    next(createError(500, 'Failed to fetch resource'))
  }
}
