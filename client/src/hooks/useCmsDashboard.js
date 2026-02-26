import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearCmsMessage,
  fetchCmsSections,
  publishAllCmsSections,
  publishCmsSection,
  revertCmsSection,
  saveCmsSectionDraft,
  selectCmsSections,
  selectCmsState,
  setActiveSectionId,
  uploadCmsImage,
} from '@/store/cmsSlice'
import {
  createResource,
  deleteResource,
  fetchResourceEntries,
  reorderResources,
  selectEntriesByType,
  selectResourcesState,
  updateResource,
} from '@/store/resourcesSlice'

export const useCmsDashboard = () => {
  const dispatch = useDispatch()
  const cmsState = useSelector(selectCmsState)
  const sections = useSelector(selectCmsSections)
  const resourcesState = useSelector(selectResourcesState)
  const resourceEntries = useSelector((state) =>
    selectEntriesByType(state, 'resource')
  )
  const partnerEntries = useSelector((state) =>
    selectEntriesByType(state, 'partner')
  )

  useEffect(() => {
    if (cmsState.fetchStatus === 'idle') {
      dispatch(fetchCmsSections())
    }
  }, [dispatch, cmsState.fetchStatus])

  const selectSection = useCallback(
    (sectionId) => {
      dispatch(setActiveSectionId(sectionId))
    },
    [dispatch]
  )

  const refreshSections = useCallback(
    () => dispatch(fetchCmsSections()).unwrap(),
    [dispatch]
  )

  const saveDraft = useCallback(
    (sectionId, fields, label) =>
      dispatch(saveCmsSectionDraft({ sectionId, fields, label })).unwrap(),
    [dispatch]
  )

  const publishSection = useCallback(
    (sectionId) => dispatch(publishCmsSection(sectionId)).unwrap(),
    [dispatch]
  )

  const publishAllSections = useCallback(
    () => dispatch(publishAllCmsSections()).unwrap(),
    [dispatch]
  )

  const revertSection = useCallback(
    (sectionId) => dispatch(revertCmsSection(sectionId)).unwrap(),
    [dispatch]
  )

  const uploadImage = useCallback(
    (file) => dispatch(uploadCmsImage(file)).unwrap(),
    [dispatch]
  )

  const clearMessage = useCallback(
    () => dispatch(clearCmsMessage()),
    [dispatch]
  )

  const fetchEntriesByType = useCallback(
    (type) => dispatch(fetchResourceEntries(type)).unwrap(),
    [dispatch]
  )

  const createEntry = useCallback(
    (type, payload) => dispatch(createResource({ type, payload })).unwrap(),
    [dispatch]
  )

  const updateEntry = useCallback(
    (id, payload) => dispatch(updateResource({ id, payload })).unwrap(),
    [dispatch]
  )

  const deleteEntry = useCallback(
    (id, type) => dispatch(deleteResource({ id, type })).unwrap(),
    [dispatch]
  )

  const reorderEntries = useCallback(
    (type, items) => dispatch(reorderResources({ type, items })).unwrap(),
    [dispatch]
  )

  return {
    sections,
    activeSectionId: cmsState.activeSectionId,
    fetchStatus: cmsState.fetchStatus,
    saveStatusById: cmsState.saveStatusById,
    publishStatusById: cmsState.publishStatusById,
    revertStatusById: cmsState.revertStatusById,
    publishAllStatus: cmsState.publishAllStatus,
    mediaUploadStatus: cmsState.mediaUploadStatus,
    error: cmsState.error,
    lastActionMessage: cmsState.lastActionMessage,
    resourceEntries,
    partnerEntries,
    resourceFetchStatusByType: resourcesState.fetchStatusByType,
    resourceMutationStatus: resourcesState.mutationStatus,
    resourceError: resourcesState.error,
    selectSection,
    refreshSections,
    saveDraft,
    publishSection,
    publishAllSections,
    revertSection,
    uploadImage,
    clearMessage,
    fetchEntriesByType,
    createEntry,
    updateEntry,
    deleteEntry,
    reorderEntries,
  }
}
