import { createSlice } from '@reduxjs/toolkit'

export const defaultWebsiteTheme = {
  backgroundColor: '#fcfdfe',
  textColor: '#03385e',
  primaryColor: '#03385e',
}

const siteThemeSlice = createSlice({
  name: 'siteTheme',
  initialState: {
    websiteTheme: defaultWebsiteTheme,
    isLoaded: false,
  },
  reducers: {
    setWebsiteTheme: (state, action) => {
      state.websiteTheme = { ...defaultWebsiteTheme, ...action.payload }
      state.isLoaded = true
    },
    setWebsiteThemeLoaded: (state) => {
      state.isLoaded = true
    },
  },
})

export const { setWebsiteTheme, setWebsiteThemeLoaded } = siteThemeSlice.actions
export default siteThemeSlice.reducer
