import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import axiosInstance from '@/lib/axiosInstance'
import {
  defaultWebsiteTheme,
  setWebsiteTheme,
} from '@/redux/slices/siteThemeSlice'

const DashboardWebsiteThemePage = () => {
  const token = useSelector((state) => state.auth.token)
  const websiteTheme = useSelector((state) => state.siteTheme.websiteTheme)
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const [formValues, setFormValues] = useState(websiteTheme)
  const [initialValues, setInitialValues] = useState(websiteTheme)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(initialValues),
    [formValues, initialValues]
  )

  useEffect(() => {
    setFormValues(websiteTheme)
    setInitialValues(websiteTheme)
  }, [websiteTheme])

  const colorFields = [
    { key: 'backgroundColor', label: t('dashboard.websiteTheme.backgroundColor') },
    { key: 'textColor', label: t('dashboard.websiteTheme.textColor') },
    { key: 'primaryColor', label: t('dashboard.websiteTheme.primaryColor') },
  ]

  const handleValueChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
    setStatus('idle')
    setMessage('')
  }

  const handleSave = async () => {
    setStatus('saving')
    setMessage(t('dashboard.common.savingChanges'))

    try {
      const { data } = await axiosInstance.put(
        '/site-theme',
        formValues,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )

      const savedTheme = data?.data?.theme || formValues
      dispatch(setWebsiteTheme(savedTheme))
      setInitialValues(savedTheme)
      setFormValues(savedTheme)
      setStatus('success')
      setMessage(t('dashboard.websiteTheme.saveSuccess'))
    } catch (error) {
      setStatus('error')
      setMessage(
        error?.response?.data?.message || error?.message || t('dashboard.websiteTheme.saveError')
      )
    }
  }

  const handleUndoChanges = () => {
    setFormValues(initialValues)
    setStatus('idle')
    setMessage(t('dashboard.common.changesReverted'))
  }

  const handleLoadDefaults = () => {
    setFormValues(defaultWebsiteTheme)
    setStatus('idle')
    setMessage(t('dashboard.websiteTheme.defaultsLoaded'))
  }

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
                  <input
                    type="color"
                    value={formValues[field.key]}
                    onChange={(event) => handleValueChange(field.key, event.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <input
                    type="text"
                    value={formValues[field.key]}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || status === 'saving'}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardWebsiteThemePage
