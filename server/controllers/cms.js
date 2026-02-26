// File: server/controllers/cms.js
import { createError } from '../error.js'
import Section from '../models/Section.js'

// ─── GET /api/cms/sections ────────────────────────────────────────────────────
// Public: returns all sections (published fields only for non-admins)
export const getAllSections = async (req, res, next) => {
  try {
    const sections = await Section.find({}).lean()

    res.status(200).json({
      status: 'success',
      results: sections.length,
      data: { sections },
    })
  } catch (err) {
    console.error('Error in getAllSections:', err)
    next(createError(500, 'Failed to fetch sections'))
  }
}

// ─── GET /api/cms/sections/:id ────────────────────────────────────────────────
// Public: returns a single section by its sectionId (e.g. 'home.hero')
export const getSectionById = async (req, res, next) => {
  try {
    const section = await Section.findOne({
      sectionId: req.params.id,
    }).lean()

    if (!section) {
      return next(
        createError(404, `Section '${req.params.id}' not found`)
      )
    }

    res.status(200).json({
      status: 'success',
      data: { section },
    })
  } catch (err) {
    console.error('Error in getSectionById:', err)
    next(createError(500, 'Failed to fetch section'))
  }
}

// ─── PUT /api/cms/sections/:id ────────────────────────────────────────────────
// Admin only: upsert fields for a section
export const updateSection = async (req, res, next) => {
  try {
    const { fields, label } = req.body

    if (!fields || typeof fields !== 'object') {
      return next(createError(400, 'A "fields" object is required'))
    }

    const updateData = {
      isDraft: true,
      updatedBy: req.user._id,
    }

    if (label) updateData.label = label

    // Build a $set patch for each field key so we do a partial merge,
    // not a full overwrite of the entire Map.
    const fieldPatch = {}
    for (const [key, val] of Object.entries(fields)) {
      fieldPatch[`fields.${key}`] = val
    }

    const section = await Section.findOneAndUpdate(
      { sectionId: req.params.id },
      { $set: { ...updateData, ...fieldPatch } },
      { new: true, runValidators: true, upsert: false }
    )

    if (!section) {
      return next(
        createError(404, `Section '${req.params.id}' not found`)
      )
    }

    res.status(200).json({
      status: 'success',
      data: { section },
    })
  } catch (err) {
    console.error('Error in updateSection:', err)
    next(createError(500, 'Failed to update section'))
  }
}

// ─── POST /api/cms/sections/:id/publish ───────────────────────────────────────
// Admin only: mark a section as published (clears draft flag, stamps publishedAt)
export const publishSection = async (req, res, next) => {
  try {
    const section = await Section.findOneAndUpdate(
      { sectionId: req.params.id },
      {
        $set: {
          isDraft: false,
          publishedAt: new Date(),
          updatedBy: req.user._id,
        },
      },
      { new: true }
    )

    if (!section) {
      return next(
        createError(404, `Section '${req.params.id}' not found`)
      )
    }

    res.status(200).json({
      status: 'success',
      message: `Section '${req.params.id}' published successfully`,
      data: { section },
    })
  } catch (err) {
    console.error('Error in publishSection:', err)
    next(createError(500, 'Failed to publish section'))
  }
}
