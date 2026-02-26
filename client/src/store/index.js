// File: client/src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import cmsReducer from '@/store/cmsSlice'
import resourcesReducer from '@/store/resourcesSlice'

export const store = configureStore({
  reducer: {
    cms: cmsReducer,
    resources: resourcesReducer,
  },
})
