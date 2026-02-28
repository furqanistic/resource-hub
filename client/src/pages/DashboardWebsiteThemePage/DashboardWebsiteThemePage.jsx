// File: client/src/pages/DashboardWebsiteThemePage/DashboardWebsiteThemePage.jsx
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import axiosInstance from '@/lib/axiosInstance'
import {
  defaultWebsiteTheme,
  setWebsiteThemeSettings,
} from '@/redux/slices/siteThemeSlice'
import {
  PAGE_THEME_SCOPES,
  SECTION_THEME_SCOPES,
} from '@/constants/siteThemeScopes'

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/
const isValidHexColor = (value) => HEX_COLOR_PATTERN.test(value || '')

const extractColorValues = (theme = {}) => ({
  backgroundColor: theme.backgroundColor,
  textColor: theme.textColor,
  primaryColor: theme.primaryColor,
})

const DashboardWebsiteThemePage = () => {
  const token = useSelector((state) => state.auth.token)
  const { websiteTheme, pageOverrides, sectionOverrides } = useSelector(
    (state) => state.siteTheme
  )
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const [scopeType, setScopeType] = useState('global')
  const [pageScopeKey, setPageScopeKey] = useState(PAGE_THEME_SCOPES[0]?.key || 'home')
  const [sectionScopeKey, setSectionScopeKey] = useState(
    SECTION_THEME_SCOPES[0]?.key || 'home-hero'
  )
  const [draftValues, setDraftValues] = useState(null)
  const [hexDraftValues, setHexDraftValues] = useState(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const activeScopeKey = scopeType === 'page' ? pageScopeKey : sectionScopeKey

  const activeOverride = useMemo(() => {
    if (scopeType === 'page') {
      return pageOverrides?.[pageScopeKey] || {}
    }

    if (scopeType === 'section') {
      return sectionOverrides?.[sectionScopeKey] || {}
    }

    return {}
  }, [pageOverrides, pageScopeKey, scopeType, sectionOverrides, sectionScopeKey])

  const hasScopeOverride = useMemo(
    () => scopeType !== 'global' && Object.keys(activeOverride).length > 0,
    [activeOverride, scopeType]
  )

  const sourceValues = useMemo(() => {
    const scopedTheme =
      scopeType === 'global'
        ? websiteTheme
        : {
            ...websiteTheme,
            ...activeOverride,
          }

    return extractColorValues(scopedTheme)
  }, [activeOverride, scopeType, websiteTheme])

  const formValues = draftValues || sourceValues
  const hexInputValues = hexDraftValues || formValues

  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(sourceValues),
    [formValues, sourceValues]
  )

  const hasInvalidHexInput = useMemo(
    () =>
      Object.values(hexInputValues).some((value) => {
        const inputValue = value || ''
        return inputValue.length > 0 && !isValidHexColor(inputValue)
      }),
    [hexInputValues]
  )

  const resetDraftState = () => {
    setDraftValues(null)
    setHexDraftValues(null)
    setStatus('idle')
    setMessage('')
  }

  const handleScopeTypeChange = (nextScopeType) => {
    setScopeType(nextScopeType)
    resetDraftState()
  }

  const handleScopeKeyChange = (nextScopeKey) => {
    if (scopeType === 'page') {
      setPageScopeKey(nextScopeKey)
    } else {
      setSectionScopeKey(nextScopeKey)
    }
    resetDraftState()
  }

  const handleValueChange = (key, value) => {
    setDraftValues((prev) => ({
      ...(prev || formValues),
      [key]: value,
    }))
    setHexDraftValues((prev) => ({
      ...(prev || formValues),
      [key]: value,
    }))
    setStatus('idle')
    setMessage('')
  }

  const handleHexInputChange = (key, value) => {
    setHexDraftValues((prev) => ({
      ...(prev || formValues),
      [key]: value,
    }))

    if (isValidHexColor(value)) {
      setDraftValues((prev) => ({
        ...(prev || formValues),
        [key]: value.toLowerCase(),
      }))
      setStatus('idle')
      setMessage('')
    }
  }

  const handleHexInputBlur = (key) => {
    setHexDraftValues((prev) => ({
      ...(prev || formValues),
      [key]: formValues[key],
    }))
  }

  const buildScopePayload = (basePayload) => {
    if (scopeType === 'global') return basePayload

    return {
      ...basePayload,
      scopeType,
      scopeKey: activeScopeKey,
    }
  }

  const handleSave = async () => {
    if (hasInvalidHexInput) {
      setStatus('error')
      setMessage(t('dashboard.websiteTheme.invalidHex'))
      return
    }

    setStatus('saving')
    setMessage(t('dashboard.common.savingChanges'))

    try {
      const { data } = await axiosInstance.put(
        '/site-theme',
        buildScopePayload(formValues),
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )

      const nextSettings = data?.data
      if (nextSettings?.theme) {
        dispatch(setWebsiteThemeSettings(nextSettings))
      }

      setDraftValues(null)
      setHexDraftValues(null)
      setStatus('success')
      setMessage(
        scopeType === 'global'
          ? t('dashboard.websiteTheme.saveSuccess')
          : t('dashboard.websiteTheme.overrideSaveSuccess')
      )
    } catch (error) {
      setStatus('error')
      setMessage(
        error?.response?.data?.message || error?.message || t('dashboard.websiteTheme.saveError')
      )
    }
  }

  const handleUndoChanges = () => {
    setDraftValues(null)
    setHexDraftValues(null)
    setStatus('idle')
    setMessage(t('dashboard.common.changesReverted'))
  }

  const handleLoadDefaults = () => {
    const base = scopeType === 'global' ? defaultWebsiteTheme : websiteTheme
    const defaultColors = extractColorValues(base)
    setDraftValues(defaultColors)
    setHexDraftValues(defaultColors)
    setStatus('idle')
    setMessage(t('dashboard.websiteTheme.defaultsLoaded'))
  }

  const handleClearOverride = async () => {
    if (scopeType === 'global') return

    setStatus('saving')
    setMessage(t('dashboard.common.savingChanges'))

    try {
      const { data } = await axiosInstance.put(
        '/site-theme',
        {
          scopeType,
          scopeKey: activeScopeKey,
          clearScope: true,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )

      const nextSettings = data?.data
      if (nextSettings?.theme) {
        dispatch(setWebsiteThemeSettings(nextSettings))
      }

      setDraftValues(null)
      setHexDraftValues(null)
      setStatus('success')
      setMessage(t('dashboard.websiteTheme.overrideCleared'))
    } catch (error) {
      setStatus('error')
      setMessage(
        error?.response?.data?.message || error?.message || t('dashboard.websiteTheme.saveError')
      )
    }
  }

  const colorFields = [
    { key: 'backgroundColor', label: t('dashboard.websiteTheme.backgroundColor') },
    { key: 'textColor', label: t('dashboard.websiteTheme.textColor') },
    { key: 'primaryColor', label: t('dashboard.websiteTheme.primaryColor') },
  ]

  const scopeOptions = scopeType === 'page' ? PAGE_THEME_SCOPES : SECTION_THEME_SCOPES

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              {t('dashboard.websiteTheme.pill')}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {t('dashboard.websiteTheme.title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {t('dashboard.websiteTheme.description')}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-900">{t('dashboard.common.status')}</p>
            <p className="mt-1">{t('dashboard.websiteTheme.autoSaveDescription')}</p>
            <p className="mt-1">
              {status === 'saving' && t('dashboard.common.savingChanges')}
              {status === 'success' && t('dashboard.common.allChangesSaved')}
              {status === 'error' && t('dashboard.common.actionNeeded')}
              {status === 'idle' &&
                (isDirty ? t('dashboard.common.unsavedChanges') : t('dashboard.common.noPendingChanges'))}
            </p>
          </div>
        </div>

        {message && (
          <div
            className={
              status === 'error'
                ? 'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'
                : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'
            }
          >
            {message}
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {t('dashboard.websiteTheme.scopeTitle')}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t('dashboard.websiteTheme.scopeDescription')}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t('dashboard.websiteTheme.scopeTypeLabel')}
              </label>
              <select
                value={scopeType}
                onChange={(event) => handleScopeTypeChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              >
                <option value="global">{t('dashboard.websiteTheme.scopeGlobal')}</option>
                <option value="page">{t('dashboard.websiteTheme.scopePage')}</option>
                <option value="section">{t('dashboard.websiteTheme.scopeSection')}</option>
              </select>
            </div>

            {scopeType !== 'global' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {t('dashboard.websiteTheme.scopeKeyLabel')}
                </label>
                <select
                  value={activeScopeKey}
                  onChange={(event) => handleScopeKeyChange(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  {scopeOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {t(option.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {scopeType !== 'global' && (
            <p className="mt-4 text-xs text-slate-500">
              {hasScopeOverride
                ? t('dashboard.websiteTheme.overrideApplied')
                : t('dashboard.websiteTheme.overrideNotApplied')}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {t('dashboard.websiteTheme.controlsTitle')}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t('dashboard.websiteTheme.controlsDescription')}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {colorFields.map((field) => (
              <div key={field.key}>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {field.label}
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-10 w-12 overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
                    <div
                      className="h-full w-full rounded-md border border-slate-200"
                      style={{
                        backgroundColor: isValidHexColor(hexInputValues[field.key])
                          ? hexInputValues[field.key]
                          : formValues[field.key],
                      }}
                    />
                    <input
                      type="color"
                      value={formValues[field.key]}
                      onChange={(event) => handleValueChange(field.key, event.target.value)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={hexInputValues[field.key]}
                    onChange={(event) => handleHexInputChange(field.key, event.target.value)}
                    onBlur={() => handleHexInputBlur(field.key)}
                    className={`w-full rounded-xl border px-3 py-2 text-sm ${
                      isValidHexColor(hexInputValues[field.key])
                        ? 'border-slate-200 text-slate-700'
                        : 'border-rose-300 text-rose-700'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || status === 'saving' || hasInvalidHexInput}
              className="min-w-[150px] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'saving' ? t('dashboard.common.saving') : t('dashboard.common.saveChanges')}
            </button>

            <button
              type="button"
              onClick={handleUndoChanges}
              disabled={!isDirty || status === 'saving'}
              className="min-w-[150px] rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold whitespace-nowrap text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('dashboard.common.undoChanges')}
            </button>

            <button
              type="button"
              onClick={handleLoadDefaults}
              disabled={status === 'saving'}
              className="min-w-[150px] rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold whitespace-nowrap text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('dashboard.websiteTheme.resetTheme')}
            </button>

            {scopeType !== 'global' && (
              <button
                type="button"
                onClick={handleClearOverride}
                disabled={!hasScopeOverride || status === 'saving'}
                className="min-w-[150px] rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold whitespace-nowrap text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('dashboard.websiteTheme.clearOverride')}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardWebsiteThemePage
