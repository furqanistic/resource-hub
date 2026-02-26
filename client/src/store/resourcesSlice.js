// File: client/src/store/resourcesSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createResourceEntry,
  deleteResourceEntry,
  getResourceEntries,
  reorderResourceEntries,
  updateResourceEntry,
} from '@/lib/api/resourcesApi'

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Request failed'

const normalizeEntry = (entry) => ({
  _id: entry?._id || '',
  type: entry?.type || 'resource',
  name: entry?.name || '',
  description: entry?.description || '',
  url: entry?.url || '',
  logoUrl: entry?.logoUrl || '',
  order: Number.isFinite(entry?.order) ? entry.order : 0,
  isPublished: Boolean(entry?.isPublished),
})

const sortEntries = (entries) =>
  [...entries].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

export const fetchResourceEntries = createAsyncThunk(
  'resources/fetchResourceEntries',
  async (type, { rejectWithValue }) => {
    try {
      const entries = await getResourceEntries(type)
      return { type, entries }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const createResource = createAsyncThunk(
  'resources/createResource',
  async ({ type, payload }, { rejectWithValue }) => {
    try {
      const created = await createResourceEntry({ ...payload, type })
      return normalizeEntry(created)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const updateResource = createAsyncThunk(
  'resources/updateResource',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const updated = await updateResourceEntry(id, payload)
      return normalizeEntry(updated)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async ({ id, type }, { rejectWithValue }) => {
    try {
      await deleteResourceEntry(id)
      return { id, type }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const reorderResources = createAsyncThunk(
  'resources/reorderResources',
  async ({ type, items }, { rejectWithValue }) => {
    try {
      const nextItems = await reorderResourceEntries(items)
      return { type, items: nextItems }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

const initialState = {
  entriesByType: {
    resource: [],
    partner: [],
  },
  fetchStatusByType: {
    resource: 'idle',
    partner: 'idle',
  },
  mutationStatus: 'idle',
  error: null,
}

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResourceEntries.pending, (state, action) => {
        const type = action.meta.arg
        state.fetchStatusByType[type] = 'loading'
        state.error = null
      })
      .addCase(fetchResourceEntries.fulfilled, (state, action) => {
        const { type, entries } = action.payload
        state.fetchStatusByType[type] = 'succeeded'
        state.entriesByType[type] = sortEntries(entries.map(normalizeEntry))
      })
      .addCase(fetchResourceEntries.rejected, (state, action) => {
        const type = action.meta.arg
        state.fetchStatusByType[type] = 'failed'
        state.error = action.payload || 'Failed to fetch entries'
      })
      .addCase(createResource.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(createResource.fulfilled, (state, action) => {
        const created = action.payload
        state.mutationStatus = 'succeeded'
        state.entriesByType[created.type] = sortEntries([
          ...state.entriesByType[created.type],
          created,
        ])
      })
      .addCase(createResource.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Failed to create entry'
      })
      .addCase(updateResource.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        const updated = action.payload
        state.mutationStatus = 'succeeded'

        state.entriesByType.resource = state.entriesByType.resource.filter(
          (entry) => entry._id !== updated._id
        )
        state.entriesByType.partner = state.entriesByType.partner.filter(
          (entry) => entry._id !== updated._id
        )
        state.entriesByType[updated.type] = sortEntries([
          ...state.entriesByType[updated.type],
          updated,
        ])
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Failed to update entry'
      })
      .addCase(deleteResource.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        const { id, type } = action.payload
        state.mutationStatus = 'succeeded'
        state.entriesByType[type] = state.entriesByType[type].filter(
          (entry) => entry._id !== id
        )
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Failed to delete entry'
      })
      .addCase(reorderResources.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(reorderResources.fulfilled, (state, action) => {
        const { type, items } = action.payload
        state.mutationStatus = 'succeeded'
        const orderById = new Map(items.map((item) => [item.id, item.order]))
        state.entriesByType[type] = sortEntries(
          state.entriesByType[type].map((entry) => ({
            ...entry,
            order: orderById.get(entry._id) ?? entry.order,
          }))
        )
      })
      .addCase(reorderResources.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Failed to reorder entries'
      })
  },
})

export const selectResourcesState = (state) => state.resources

export const selectEntriesByType = (state, type) =>
  selectResourcesState(state).entriesByType[type] || []

export default resourcesSlice.reducer
