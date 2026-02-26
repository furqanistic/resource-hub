import { configureStore } from '@reduxjs/toolkit'
import cmsReducer from '@/store/cmsSlice'

export const store = configureStore({
  reducer: {
    cms: cmsReducer,
  },
})
