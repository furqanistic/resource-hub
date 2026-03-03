import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import siteThemeReducer from './slices/siteThemeSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    siteTheme: siteThemeReducer,
  },
})

export default store
