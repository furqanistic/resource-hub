import { createSlice } from '@reduxjs/toolkit'

export const defaultWebsiteTheme = {
  backgroundColor: '#fcfdfe',
  textColor: '#03385e',
  primaryColor: '#03385e',
  fontFamily: "'Poppins', 'Inter', sans-serif",
  headingScale: 1,
  bodySize: 16,
  lineHeight: 1.6,
}

const themeKeys = Object.keys(defaultWebsiteTheme)

const sanitizeTheme = (theme = {}) => {
  const result = {}

  for (const key of themeKeys) {
    if (theme[key] !== undefined && theme[key] !== null) {
      result[key] = theme[key]
    }
  }

  return { ...defaultWebsiteTheme, ...result }
}

const sanitizeOverrideMap = (overrideMap = {}) => {
  const result = {}

  for (const [scopeKey, rawOverride] of Object.entries(overrideMap || {})) {
    if (!scopeKey) continue

    const cleanOverride = {}
    for (const key of themeKeys) {
      if (rawOverride?.[key] !== undefined && rawOverride?.[key] !== null) {
        cleanOverride[key] = rawOverride[key]
      }
    }

    if (Object.keys(cleanOverride).length) {
      result[scopeKey] = cleanOverride
    }
  }

  return result
}

const siteThemeSlice = createSlice({
  name: 'siteTheme',
  initialState: {
    websiteTheme: defaultWebsiteTheme,
    pageOverrides: {},
    sectionOverrides: {},
    isLoaded: false,
  },
  reducers: {
    setWebsiteThemeSettings: (state, action) => {
      const payload = action.payload || {}
      state.websiteTheme = sanitizeTheme(payload.theme || payload.websiteTheme || {})
      state.pageOverrides = sanitizeOverrideMap(payload.pageOverrides)
      state.sectionOverrides = sanitizeOverrideMap(payload.sectionOverrides)
      state.isLoaded = true
    },
    setWebsiteTheme: (state, action) => {
      state.websiteTheme = sanitizeTheme(action.payload || {})
      state.isLoaded = true
    },
    setWebsiteThemeLoaded: (state) => {
      state.isLoaded = true
    },
  },
})

export const { setWebsiteThemeSettings, setWebsiteTheme, setWebsiteThemeLoaded } = siteThemeSlice.actions
export default siteThemeSlice.reducer
