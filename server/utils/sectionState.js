export const mapToObject = (value) => {
  if (!value) return {}
  if (value instanceof Map) return Object.fromEntries(value)
  if (typeof value === 'object' && !Array.isArray(value)) return value
  return {}
}

const hasKeys = (value) => Object.keys(value).length > 0

export const getDraftFields = (section) => {
  const draftFields = mapToObject(section.draftFields)
  if (hasKeys(draftFields)) return draftFields
  return mapToObject(section.fields)
}

export const getPublishedFields = (section, { allowLegacyFallback = true } = {}) => {
  const publishedFields = mapToObject(section.publishedFields)
  if (hasKeys(publishedFields)) return publishedFields

  if (!allowLegacyFallback) return {}

  const legacyFields = mapToObject(section.fields)
  const hasHistory = Array.isArray(section.history) && section.history.length > 0
  if (!section.publishedAt && !hasHistory && hasKeys(legacyFields)) {
    return legacyFields
  }

  return {}
}

export const formatPublicSection = (section) => ({
  _id: section._id,
  sectionId: section.sectionId,
  label: section.label,
  fields: getPublishedFields(section),
  publishedAt: section.publishedAt ?? null,
  isDraft: !!section.isDraft,
  createdAt: section.createdAt,
  updatedAt: section.updatedAt,
})

export const formatEditorSection = (section) => ({
  _id: section._id,
  sectionId: section.sectionId,
  label: section.label,
  fields: getDraftFields(section),
  draftFields: getDraftFields(section),
  publishedFields: getPublishedFields(section),
  isDraft: !!section.isDraft,
  publishedAt: section.publishedAt ?? null,
  publishedBy: section.publishedBy ?? null,
  updatedBy: section.updatedBy ?? null,
  createdAt: section.createdAt,
  updatedAt: section.updatedAt,
})

const fieldsChanged = (a, b) => JSON.stringify(a) !== JSON.stringify(b)

export const sectionHasDraftChanges = (section) => {
  const draft = getDraftFields(section)
  const published = getPublishedFields(section)
  return !!section.isDraft || fieldsChanged(draft, published)
}

export const stampPublishedSnapshot = (section, userId) => {
  const nextPublishedFields = getDraftFields(section)
  const now = new Date()

  section.publishedFields = nextPublishedFields
  section.draftFields = nextPublishedFields
  section.fields = nextPublishedFields
  section.isDraft = false
  section.publishedAt = now
  section.publishedBy = userId
  section.updatedBy = userId
  section.history.push({
    fields: nextPublishedFields,
    savedAt: now,
    savedBy: userId,
  })

  return section
}
