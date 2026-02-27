import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) {
    return envUrl
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:8800'
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return 'http://localhost:8800'
}

const API_BASE_URL = resolveApiBaseUrl()

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        return rejectWithValue(data?.message || 'Login failed')
      }

      const user = data?.data?.user
      if (!user || user.role !== 'admin') {
        return rejectWithValue('Admin access only')
      }

      return {
        user,
        token: data?.token || null,
      }
    } catch (error) {
      const message =
        error?.message === 'Failed to fetch'
          ? 'Unable to reach server. Check your connection or API URL.'
          : error?.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

const initialState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Login failed'
        state.isAuthenticated = false
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer
