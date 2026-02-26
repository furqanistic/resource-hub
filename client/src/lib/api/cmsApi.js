// File: client/src/lib/api/cmsApi.js
import { axiosClient, API_BASE_URL } from '@/lib/api/axiosClient'

const getData = (response) => response?.data?.data || {}

export const resolveAssetUrl = (value) => {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('/')) return `${API_BASE_URL}${value}`
  return `${API_BASE_URL}/${value}`
}

export const getSections = async () => {
  const response = await axiosClient.get('/api/cms/sections')
  return getData(response).sections || []
}

export const updateSection = async (sectionId, payload) => {
  const response = await axiosClient.put(`/api/cms/sections/${encodeURIComponent(sectionId)}`, payload)
  return getData(response).section
}

export const publishSection = async (sectionId) => {
  const response = await axiosClient.post(`/api/cms/publish/${encodeURIComponent(sectionId)}`)
  return getData(response).section
}

export const publishAll = async () => {
  const response = await axiosClient.post('/api/cms/publish/all')
  return getData(response).sections || []
}

export const revertSection = async (sectionId) => {
  const response = await axiosClient.post(`/api/cms/revert/${encodeURIComponent(sectionId)}`)
  return getData(response).section
}

export const getSectionHistory = async (sectionId) => {
  const response = await axiosClient.get(`/api/cms/history/${encodeURIComponent(sectionId)}`)
  return getData(response).history || []
}

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await axiosClient.post('/api/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return getData(response)
}
