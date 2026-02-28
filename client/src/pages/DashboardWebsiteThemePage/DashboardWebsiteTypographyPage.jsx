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

const FONT_FAMILY_OPTIONS = [
  { value: "'Poppins', 'Inter', sans-serif", labelKey: 'dashboard.websiteTheme.fontOptionPoppins' },
  { value: "'Inter', sans-serif", labelKey: 'dashboard.websiteTheme.fontOptionInter' },
  { value: "'Lora', serif", labelKey: 'dashboard.websiteTheme.fontOptionLora' },
  { value: "'IBM Plex Mono', monospace", labelKey: 'dashboard.websiteTheme.fontOptionIbmPlexMono' },
]

const TYPOGRAPHY_LIMITS = {
  headingScale: { min: 0.8, max: 1.4, step: 0.05 },
  bodySize: { min: 14, max: 20, step: 1 },
  lineHeight: { min: 1.2, max: 2, step: 0.05 },
}

const extractTypographyValues = (theme = {}) => ({
  fontFamily: theme.fontFamily,
  headingScale: Number(theme.headingScale),
  bodySize: Number(theme.bodySize),
  lineHeight: Number(theme.lineHeight),
})

const DashboardWebsiteTypographyPage = () => {
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

    return extractTypographyValues(scopedTheme)
  }, [activeOverride, scopeType, websiteTheme])

  const formValues = draftValues || sourceValues

  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(sourceValues),
    [formValues, sourceValues]
  )

  const hasInvalidInput = useMemo(() => {
    if (!formValues.fontFamily?.trim()) {
      return true
    }

    const headingScale = Number(formValues.headingScale)
    const bodySize = Number(formValues.bodySize)
    const lineHeight = Number(formValues.lineHeight)

    if (!Number.isFinite(headingScale) || !Number.isFinite(bodySize) || !Number.isFinite(lineHeight)) {
      return true
    }

    if (
      headingScale < TYPOGRAPHY_LIMITS.headingScale.min ||
      headingScale > TYPOGRAPHY_LIMITS.headingScale.max
    ) {
      return true
    }

    if (
      bodySize < TYPOGRAPHY_LIMITS.bodySize.min ||
      bodySize > TYPOGRAPHY_LIMITS.bodySize.max ||
      !Number.isInteger(bodySize)
    ) {
      return true
    }

    return (
      lineHeight < TYPOGRAPHY_LIMITS.lineHeight.min ||
      lineHeight > TYPOGRAPHY_LIMITS.lineHeight.max
    )
  }, [formValues])

  const resetDraftState = () => {
    setDraftValues(null)
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
    setStatus('idle')
    setMessage('')
  }

  const handleNumberChange = (key, value) => {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) return
    handleValueChange(key, numericValue)
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
    if (hasInvalidInput) {
      setStatus('error')
      setMessage(t('dashboard.websiteTheme.invalidTypography'))
      return
    }

    setStatus('saving')
    setMessage(t('dashboard.common.savingChanges'))

    try {
      const payload = {
        fontFamily: formValues.fontFamily,
        headingScale: Number(formValues.headingScale),
        bodySize: Number(formValues.bodySize),
        lineHeight: Number(formValues.lineHeight),
      }

      const { data } = await axiosInstance.put(
        '/site-theme',
        buildScopePayload(payload),
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )

      const nextSettings = data?.data
      if (nextSettings?.theme) {
        dispatch(setWebsiteThemeSettings(nextSettings))
      }

      setDraftValues(null)
      setStatus('success')
      setMessage(
        scopeType === 'global'
          ? t('dashboard.websiteTheme.typographySaveSuccess')
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
    setStatus('idle')
    setMessage(t('dashboard.common.changesReverted'))
  }

  const handleLoadDefaults = () => {
    const base = scopeType === 'global' ? defaultWebsiteTheme : websiteTheme
    setDraftValues(extractTypographyValues(base))
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
      setStatus('success')
      setMessage(t('dashboard.websiteTheme.overrideCleared'))
    } catch (error) {
      setStatus('error')
      setMessage(
        error?.response?.data?.message || error?.message || t('dashboard.websiteTheme.saveError')
      )
    }
  }

  const previewHeadingSize = `${Math.round(34 * Number(formValues.headingScale))}px`
  const scopeOptions = scopeType === 'page' ? PAGE_THEME_SCOPES : SECTION_THEME_SCOPES

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              {t('dashboard.websiteTheme.typographyPill')}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {t('dashboard.websiteTheme.typographyTitle')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {t('dashboard.websiteTheme.typographyDescription')}
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
            {t('dashboard.websiteTheme.typographyControlsTitle')}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t('dashboard.websiteTheme.typographyControlsDescription')}
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t('dashboard.websiteTheme.fontFamily')}
              </label>
              <select
                value={formValues.fontFamily}
                onChange={(event) => handleValueChange('fontFamily', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              >
                {FONT_FAMILY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t('dashboard.websiteTheme.headingScale')}
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={TYPOGRAPHY_LIMITS.headingScale.min}
                  max={TYPOGRAPHY_LIMITS.headingScale.max}
                  step={TYPOGRAPHY_LIMITS.headingScale.step}
                  value={formValues.headingScale}
                  onChange={(event) => handleNumberChange('headingScale', event.target.value)}
                  className="w-full"
                />
                <input
                  type="number"
                  min={TYPOGRAPHY_LIMITS.headingScale.min}
                  max={TYPOGRAPHY_LIMITS.headingScale.max}
                  step={TYPOGRAPHY_LIMITS.headingScale.step}
                  value={formValues.headingScale}
                  onChange={(event) => handleNumberChange('headingScale', event.target.value)}
                  className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t('dashboard.websiteTheme.bodySize')}
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={TYPOGRAPHY_LIMITS.bodySize.min}
                  max={TYPOGRAPHY_LIMITS.bodySize.max}
                  step={TYPOGRAPHY_LIMITS.bodySize.step}
                  value={formValues.bodySize}
                  onChange={(event) => handleNumberChange('bodySize', event.target.value)}
                  className="w-full"
                />
                <input
                  type="number"
                  min={TYPOGRAPHY_LIMITS.bodySize.min}
                  max={TYPOGRAPHY_LIMITS.bodySize.max}
                  step={TYPOGRAPHY_LIMITS.bodySize.step}
                  value={formValues.bodySize}
                  onChange={(event) => handleNumberChange('bodySize', event.target.value)}
                  className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t('dashboard.websiteTheme.lineHeight')}
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={TYPOGRAPHY_LIMITS.lineHeight.min}
                  max={TYPOGRAPHY_LIMITS.lineHeight.max}
                  step={TYPOGRAPHY_LIMITS.lineHeight.step}
                  value={formValues.lineHeight}
                  onChange={(event) => handleNumberChange('lineHeight', event.target.value)}
                  className="w-full"
                />
                <input
                  type="number"
                  min={TYPOGRAPHY_LIMITS.lineHeight.min}
                  max={TYPOGRAPHY_LIMITS.lineHeight.max}
                  step={TYPOGRAPHY_LIMITS.lineHeight.step}
                  value={formValues.lineHeight}
                  onChange={(event) => handleNumberChange('lineHeight', event.target.value)}
                  className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {t('dashboard.websiteTheme.previewTitle')}
            </p>
            <div
              className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-slate-700"
              style={{
                fontFamily: formValues.fontFamily,
                fontSize: `${formValues.bodySize}px`,
                lineHeight: formValues.lineHeight,
              }}
            >
              <h3
                className="font-semibold text-slate-900"
                style={{ fontSize: previewHeadingSize, lineHeight: 1.2 }}
              >
                {t('dashboard.websiteTheme.previewHeading')}
              </h3>
              <p className="mt-3">
                {t('dashboard.websiteTheme.previewBody')}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || status === 'saving' || hasInvalidInput}
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

export default DashboardWebsiteTypographyPage
