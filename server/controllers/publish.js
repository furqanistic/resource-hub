import { createError } from '../error.js'
import Section from '../models/Section.js'
import {
  formatEditorSection,
  getPublishedFields,
  mapToObject,
  sectionHasDraftChanges,
  stampPublishedSnapshot,
} from '../utils/sectionState.js'

// ─── POST /api/cms/publish/all ────────────────────────────────────────────────
// Admin only: publishes every section with pending draft changes.
export const publishAllSections = async (req, res, next) => {
  try {
    const sections = await Section.find({})
    const publishedSections = []

    for (const section of sections) {
      if (!sectionHasDraftChanges(section)) continue

      stampPublishedSnapshot(section, req.user._id)
      await section.save()
      publishedSections.push(formatEditorSection(section))
    }

    res.status(200).json({
      status: 'success',
      results: publishedSections.length,
      message:
        publishedSections.length > 0
          ? `${publishedSections.length} section(s) published`
          : 'No draft changes to publish',
      data: { sections: publishedSections },
    })
  } catch (err) {
    console.error('Error in publishAllSections:', err)
    next(createError(500, 'Failed to publish all sections'))
  }
}

// ─── POST /api/cms/publish/:sectionId ─────────────────────────────────────────
// Admin only: publishes one section by sectionId.
export const publishSectionById = async (req, res, next) => {
  try {
    const { sectionId } = req.params
    const section = await Section.findOne({ sectionId })

    if (!section) {
      return next(createError(404, `Section '${sectionId}' not found`))
    }

    stampPublishedSnapshot(section, req.user._id)
    await section.save()

    res.status(200).json({
      status: 'success',
      message: `Section '${sectionId}' published successfully`,
      data: { section: formatEditorSection(section) },
    })
  } catch (err) {
    console.error('Error in publishSectionById:', err)
    next(createError(500, 'Failed to publish section'))
  }
}

// ─── POST /api/cms/revert/:sectionId ──────────────────────────────────────────
// Admin only: discard draft and restore current published snapshot.
export const revertSection = async (req, res, next) => {
  try {
    const { sectionId } = req.params
    const section = await Section.findOne({ sectionId })

    if (!section) {
      return next(createError(404, `Section '${sectionId}' not found`))
    }

    const publishedFields = getPublishedFields(section)
    if (Object.keys(publishedFields).length === 0) {
      return next(
        createError(
          400,
          `Section '${sectionId}' has no published snapshot to revert to`
        )
      )
    }

    section.draftFields = publishedFields
    section.fields = publishedFields
    section.isDraft = false
    section.updatedBy = req.user._id
    await section.save()

    res.status(200).json({
      status: 'success',
      message: `Section '${sectionId}' reverted to last published content`,
      data: { section: formatEditorSection(section) },
    })
  } catch (err) {
    console.error('Error in revertSection:', err)
    next(createError(500, 'Failed to revert section'))
  }
}

// ─── GET /api/cms/history/:sectionId ──────────────────────────────────────────
// Admin only: returns publish history for a section.
export const getSectionHistory = async (req, res, next) => {
  try {
    const { sectionId } = req.params
    const section = await Section.findOne({ sectionId }).lean()

    if (!section) {
      return next(createError(404, `Section '${sectionId}' not found`))
    }

    const history = (section.history || [])
      .map((entry) => ({
        fields: mapToObject(entry.fields),
        savedAt: entry.savedAt,
        savedBy: entry.savedBy ?? null,
      }))
      .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: {
        sectionId: section.sectionId,
        label: section.label,
        publishedAt: section.publishedAt ?? null,
        history,
      },
    })
  } catch (err) {
    console.error('Error in getSectionHistory:', err)
    next(createError(500, 'Failed to fetch section history'))
  }
}
