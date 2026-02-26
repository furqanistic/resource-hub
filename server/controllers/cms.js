// File: server/controllers/cms.js
import { createError } from '../error.js'
import Section from '../models/Section.js'
import {
  formatEditorSection,
  formatPublicSection,
  getDraftFields,
  getPublishedFields,
  mapToObject,
  stampPublishedSnapshot,
} from '../utils/sectionState.js'

// ─── GET /api/cms/sections ────────────────────────────────────────────────────
// Public: returns published fields only.
export const getAllSections = async (req, res, next) => {
  try {
    const sections = await Section.find({}).lean()
    const formattedSections = sections.map(formatPublicSection)

    res.status(200).json({
      status: 'success',
      results: formattedSections.length,
      data: { sections: formattedSections },
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
      data: { section: formatPublicSection(section) },
    })
  } catch (err) {
    console.error('Error in getSectionById:', err)
    next(createError(500, 'Failed to fetch section'))
  }
}

// ─── PUT /api/cms/sections/:id ────────────────────────────────────────────────
// Admin only: saves to draftFields and marks section dirty.
export const updateSection = async (req, res, next) => {
  try {
    const { fields, label } = req.body

    const hasFieldsPayload = fields !== undefined
    if (
      hasFieldsPayload &&
      (typeof fields !== 'object' || Array.isArray(fields) || fields === null)
    ) {
      return next(createError(400, '"fields" must be an object when provided'))
    }

    if (!hasFieldsPayload && !label) {
      return next(createError(400, 'Provide at least one of: "fields", "label"'))
    }

    const section = await Section.findOne({ sectionId: req.params.id })

    if (!section) {
      return next(
        createError(404, `Section '${req.params.id}' not found`)
      )
    }

    if (label) section.label = label.trim()

    if (hasFieldsPayload) {
      // Preserve legacy live content before first draft edit on migrated docs.
      if (
        Object.keys(mapToObject(section.publishedFields)).length === 0 &&
        !section.publishedAt
      ) {
        section.publishedFields = getPublishedFields(section)
      }

      const currentDraft = getDraftFields(section)
      const normalizedPatch = {}

      for (const [key, val] of Object.entries(fields)) {
        normalizedPatch[key] = val == null ? '' : String(val)
      }

      section.draftFields = {
        ...currentDraft,
        ...normalizedPatch,
      }
      // Keep Phase 1 compatibility for consumers that still read section.fields.
      section.fields = section.draftFields
    }

    section.isDraft = true
    section.updatedBy = req.user._id

    await section.save()

    res.status(200).json({
      status: 'success',
      data: { section: formatEditorSection(section) },
    })
  } catch (err) {
    console.error('Error in updateSection:', err)
    next(createError(500, 'Failed to update section'))
  }
}

// ─── POST /api/cms/sections/:id/publish ───────────────────────────────────────
// Admin only legacy endpoint for publishing a single section.
export const publishSection = async (req, res, next) => {
  try {
    const section = await Section.findOne({ sectionId: req.params.id })

    if (!section) {
      return next(
        createError(404, `Section '${req.params.id}' not found`)
      )
    }

    stampPublishedSnapshot(section, req.user._id)
    await section.save()

    res.status(200).json({
      status: 'success',
      message: `Section '${req.params.id}' published successfully`,
      data: { section: formatEditorSection(section) },
    })
  } catch (err) {
    console.error('Error in publishSection:', err)
    next(createError(500, 'Failed to publish section'))
  }
}
