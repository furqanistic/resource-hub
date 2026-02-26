// File: client/src/lib/api/resourcesApi.js
import { axiosClient } from '@/lib/api/axiosClient'

const getData = (response) => response?.data?.data || {}

export const getResourceEntries = async (type) => {
  const response = await axiosClient.get('/api/resources', {
    params: { type },
  })
  return getData(response).resources || []
}

export const createResourceEntry = async (payload) => {
  const response = await axiosClient.post('/api/resources', payload)
  return getData(response).resource
}

export const updateResourceEntry = async (id, payload) => {
  const response = await axiosClient.put(`/api/resources/${id}`, payload)
  return getData(response).resource
}

export const deleteResourceEntry = async (id) => {
  await axiosClient.delete(`/api/resources/${id}`)
  return id
}

export const reorderResourceEntries = async (items) => {
  await axiosClient.patch('/api/resources/reorder', { items })
  return items
}
