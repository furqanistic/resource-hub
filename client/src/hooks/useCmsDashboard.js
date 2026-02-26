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

export const useCmsDashboard = () => {
  const dispatch = useDispatch()
  const cmsState = useSelector(selectCmsState)
  const sections = useSelector(selectCmsSections)

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
    selectSection,
    refreshSections,
    saveDraft,
    publishSection,
    publishAllSections,
    revertSection,
    uploadImage,
    clearMessage,
  }
}
