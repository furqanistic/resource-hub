// File: server/controllers/resources.js
import mongoose from 'mongoose'
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

// ─── POST /api/resources ───────────────────────────────────────────────────────
// Admin only. Creates a new resource or partner entry.
export const createResource = async (req, res, next) => {
  try {
    const { type, name, description, url, logoUrl, order, isPublished } = req.body

    if (!type || !name) {
      return next(createError(400, '"type" and "name" are required'))
    }

    // Auto-assign order at the end of existing entries of the same type
    let assignedOrder = order
    if (assignedOrder === undefined || assignedOrder === null) {
      const last = await Resource.findOne({ type }).sort({ order: -1 })
      assignedOrder = last ? last.order + 1 : 0
    }

    const resource = await Resource.create({
      type,
      name: name.trim(),
      description: description?.trim() || '',
      url: url?.trim() || '',
      logoUrl: logoUrl?.trim() || '',
      order: assignedOrder,
      isPublished: isPublished ?? false,
      createdBy: req.user._id,
    })

    res.status(201).json({
      status: 'success',
      data: { resource },
    })
  } catch (err) {
    console.error('Error in createResource:', err)
    next(createError(500, 'Failed to create resource'))
  }
}

// ─── PUT /api/resources/:id ────────────────────────────────────────────────────
// Admin only. Full or partial update.
export const updateResource = async (req, res, next) => {
  try {
    const allowed = ['name', 'description', 'url', 'logoUrl', 'order', 'isPublished', 'type']
    const updateData = {}

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updateData[key] = typeof req.body[key] === 'string'
          ? req.body[key].trim()
          : req.body[key]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return next(createError(400, 'No valid fields provided for update'))
    }

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!resource) {
      return next(createError(404, 'Resource not found'))
    }

    res.status(200).json({
      status: 'success',
      data: { resource },
    })
  } catch (err) {
    console.error('Error in updateResource:', err)
    next(createError(500, 'Failed to update resource'))
  }
}

// ─── DELETE /api/resources/:id ─────────────────────────────────────────────────
// Admin only.
export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id)

    if (!resource) {
      return next(createError(404, 'Resource not found'))
    }

    res.status(204).json({ status: 'success', data: null })
  } catch (err) {
    console.error('Error in deleteResource:', err)
    next(createError(500, 'Failed to delete resource'))
  }
}

// ─── PATCH /api/resources/reorder ─────────────────────────────────────────────
// Admin only. Accepts an array of { id, order } objects and bulk-updates order.
// Used by drag-and-drop reordering in the UI.
export const reorderResources = async (req, res, next) => {
  try {
    const { items } = req.body // [{ id: '...', order: 0 }, ...]

    if (!Array.isArray(items) || items.length === 0) {
      return next(createError(400, '"items" must be a non-empty array of { id, order }'))
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const ops = items.map(({ id, order }) =>
        Resource.findByIdAndUpdate(id, { $set: { order } }, { session })
      )
      await Promise.all(ops)
      await session.commitTransaction()
    } catch (innerErr) {
      await session.abortTransaction()
      throw innerErr
    } finally {
      session.endSession()
    }

    res.status(200).json({
      status: 'success',
      message: `${items.length} items reordered`,
    })
  } catch (err) {
    console.error('Error in reorderResources:', err)
    next(createError(500, 'Failed to reorder resources'))
  }
}
