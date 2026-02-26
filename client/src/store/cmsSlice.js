import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getSections,
  publishAll,
  publishSection,
  revertSection,
  updateSection,
  uploadImage,
} from '@/lib/api/cmsApi'
import {
  CMS_SECTION_DEFINITIONS,
  CMS_SECTION_ORDER,
  mergeSectionFields,
} from '@/constants/cmsSections'

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Request failed'

const normalizeSection = (section) => {
  const sectionId = section?.sectionId || section?.id
  if (!sectionId) return null

  const fallback = CMS_SECTION_DEFINITIONS[sectionId]
  const fields = mergeSectionFields(
    sectionId,
    section?.fields || section?.draftFields || {}
  )

  return {
    id: sectionId,
    sectionId,
    label: section?.label || fallback?.label || sectionId,
    description: fallback?.description || '',
    fields,
    draftFields: mergeSectionFields(sectionId, section?.draftFields || fields),
    publishedFields: mergeSectionFields(
      sectionId,
      section?.publishedFields || section?.fields || {}
    ),
    isDraft: Boolean(section?.isDraft),
    publishedAt: section?.publishedAt || null,
    updatedAt: section?.updatedAt || null,
  }
}

const upsertSections = (state, incoming) => {
  for (const rawSection of incoming) {
    const section = normalizeSection(rawSection)
    if (!section) continue
    state.sectionsById[section.id] = section
  }
}

export const fetchCmsSections = createAsyncThunk(
  'cms/fetchCmsSections',
  async (_, { rejectWithValue }) => {
    try {
      return await getSections()
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const saveCmsSectionDraft = createAsyncThunk(
  'cms/saveCmsSectionDraft',
  async ({ sectionId, fields, label }, { rejectWithValue }) => {
    try {
      return await updateSection(sectionId, { fields, label })
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const publishCmsSection = createAsyncThunk(
  'cms/publishCmsSection',
  async (sectionId, { rejectWithValue }) => {
    try {
      return await publishSection(sectionId)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const publishAllCmsSections = createAsyncThunk(
  'cms/publishAllCmsSections',
  async (_, { rejectWithValue }) => {
    try {
      return await publishAll()
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const revertCmsSection = createAsyncThunk(
  'cms/revertCmsSection',
  async (sectionId, { rejectWithValue }) => {
    try {
      return await revertSection(sectionId)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const uploadCmsImage = createAsyncThunk(
  'cms/uploadCmsImage',
  async (file, { rejectWithValue }) => {
    try {
      return await uploadImage(file)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

const initialState = {
  sectionsById: {},
  sectionOrder: CMS_SECTION_ORDER,
  activeSectionId: CMS_SECTION_ORDER[0],
  fetchStatus: 'idle',
  saveStatusById: {},
  publishStatusById: {},
  revertStatusById: {},
  publishAllStatus: 'idle',
  mediaUploadStatus: 'idle',
  error: null,
  lastActionMessage: '',
}

const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    setActiveSectionId: (state, action) => {
      state.activeSectionId = action.payload
    },
    clearCmsMessage: (state) => {
      state.lastActionMessage = ''
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCmsSections.pending, (state) => {
        state.fetchStatus = 'loading'
        state.error = null
      })
      .addCase(fetchCmsSections.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded'
        upsertSections(state, action.payload)
      })
      .addCase(fetchCmsSections.rejected, (state, action) => {
        state.fetchStatus = 'failed'
        state.error = action.payload || 'Failed to load sections'
      })
      .addCase(saveCmsSectionDraft.pending, (state, action) => {
        const { sectionId } = action.meta.arg
        state.saveStatusById[sectionId] = 'loading'
        state.error = null
      })
      .addCase(saveCmsSectionDraft.fulfilled, (state, action) => {
        const section = normalizeSection(action.payload)
        if (section) {
          state.sectionsById[section.id] = section
          state.saveStatusById[section.id] = 'succeeded'
        }
        state.lastActionMessage = 'Draft saved'
      })
      .addCase(saveCmsSectionDraft.rejected, (state, action) => {
        const { sectionId } = action.meta.arg
        state.saveStatusById[sectionId] = 'failed'
        state.error = action.payload || 'Failed to save draft'
      })
      .addCase(publishCmsSection.pending, (state, action) => {
        const sectionId = action.meta.arg
        state.publishStatusById[sectionId] = 'loading'
        state.error = null
      })
      .addCase(publishCmsSection.fulfilled, (state, action) => {
        const section = normalizeSection(action.payload)
        if (section) {
          state.sectionsById[section.id] = section
          state.publishStatusById[section.id] = 'succeeded'
        }
        state.lastActionMessage = 'Section published'
      })
      .addCase(publishCmsSection.rejected, (state, action) => {
        const sectionId = action.meta.arg
        state.publishStatusById[sectionId] = 'failed'
        state.error = action.payload || 'Failed to publish section'
      })
      .addCase(publishAllCmsSections.pending, (state) => {
        state.publishAllStatus = 'loading'
        state.error = null
      })
      .addCase(publishAllCmsSections.fulfilled, (state, action) => {
        state.publishAllStatus = 'succeeded'
        upsertSections(state, action.payload || [])
        state.lastActionMessage = 'All pending sections published'
      })
      .addCase(publishAllCmsSections.rejected, (state, action) => {
        state.publishAllStatus = 'failed'
        state.error = action.payload || 'Failed to publish all sections'
      })
      .addCase(revertCmsSection.pending, (state, action) => {
        const sectionId = action.meta.arg
        state.revertStatusById[sectionId] = 'loading'
        state.error = null
      })
      .addCase(revertCmsSection.fulfilled, (state, action) => {
        const section = normalizeSection(action.payload)
        if (section) {
          state.sectionsById[section.id] = section
          state.revertStatusById[section.id] = 'succeeded'
        }
        state.lastActionMessage = 'Section reverted to last published'
      })
      .addCase(revertCmsSection.rejected, (state, action) => {
        const sectionId = action.meta.arg
        state.revertStatusById[sectionId] = 'failed'
        state.error = action.payload || 'Failed to revert section'
      })
      .addCase(uploadCmsImage.pending, (state) => {
        state.mediaUploadStatus = 'loading'
        state.error = null
      })
      .addCase(uploadCmsImage.fulfilled, (state) => {
        state.mediaUploadStatus = 'succeeded'
      })
      .addCase(uploadCmsImage.rejected, (state, action) => {
        state.mediaUploadStatus = 'failed'
        state.error = action.payload || 'Failed to upload image'
      })
  },
})

export const { setActiveSectionId, clearCmsMessage } = cmsSlice.actions

export const selectCmsState = (state) => state.cms

export const selectCmsSections = (state) => {
  const cmsState = selectCmsState(state)
  const ordered = cmsState.sectionOrder.map((sectionId) => {
    const existing = cmsState.sectionsById[sectionId]
    if (existing) return existing

    const fallback = CMS_SECTION_DEFINITIONS[sectionId]
    return {
      id: sectionId,
      sectionId,
      label: fallback?.label || sectionId,
      description: fallback?.description || '',
      fields: mergeSectionFields(sectionId, {}),
      draftFields: mergeSectionFields(sectionId, {}),
      publishedFields: mergeSectionFields(sectionId, {}),
      isDraft: false,
      publishedAt: null,
      updatedAt: null,
    }
  })

  const remaining = Object.values(cmsState.sectionsById).filter(
    (section) => !cmsState.sectionOrder.includes(section.id)
  )

  return [...ordered, ...remaining]
}

export const selectActiveSection = (state) => {
  const cmsState = selectCmsState(state)
  const sections = selectCmsSections(state)
  return (
    sections.find((section) => section.id === cmsState.activeSectionId) || null
  )
}

export default cmsSlice.reducer
