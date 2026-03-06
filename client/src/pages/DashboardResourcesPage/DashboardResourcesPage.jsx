import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import axiosInstance from '@/lib/axiosInstance'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

const defaultContent = {
  title: 'Regional Transportation Resources',
  titleEs: '',
  subtitle: 'Key tools and partners helping people access care, food, and essential services.',
  subtitleEs: '',
  resources: [
    {
      title: 'CWCOG Mobility Management',
      titleEs: '',
      description:
        'Mobility management tools, travel training, and regional coordination to connect people with transportation options.',
      descriptionEs: '',
      ctaLabel: 'Visit CWCOG Mobility Management',
      ctaLabelEs: '',
      href: 'https://www.cwcog.org/mobility-management/',
    },
    {
      title: 'Great Rivers BH-ASO Transportation Efforts',
      titleEs: '',
      description:
        'Regional coordination focused on improving access to transportation for behavioral health and other essential services.',
      descriptionEs: '',
      ctaLabel: 'Learn more about Great Rivers BH-ASO',
      ctaLabelEs: '',
      href: 'https://www.grbhaso.org',
    },
  ],
}

const emptyResource = {
  title: '',
  titleEs: '',
  description: '',
  descriptionEs: '',
  ctaLabel: '',
  ctaLabelEs: '',
  href: '',
}

const hydrateLocalizedContent = (values) => ({
  ...values,
  titleEs: values.titleEs?.trim() ? values.titleEs : values.title,
  subtitleEs: values.subtitleEs?.trim() ? values.subtitleEs : values.subtitle,
  resources: (values.resources || []).map((resource) => ({
    ...resource,
    titleEs: resource?.titleEs?.trim() ? resource.titleEs : resource.title,
    descriptionEs: resource?.descriptionEs?.trim()
      ? resource.descriptionEs
      : resource.description,
    ctaLabelEs: resource?.ctaLabelEs?.trim() ? resource.ctaLabelEs : resource.ctaLabel,
  })),
})

const DashboardResourcesPage = () => {
  const { user, token } = useSelector((state) => state.auth)
  const { t } = useLanguage()
  const [formValues, setFormValues] = useState(defaultContent)
  const [initialValues, setInitialValues] = useState(defaultContent)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [activeContentLanguage, setActiveContentLanguage] = useState('en')

  const isSpanishContent = activeContentLanguage === 'es'
  const localizedLabelSuffix = isSpanishContent ? ' (Spanish)' : ''
  const titleField = isSpanishContent ? 'titleEs' : 'title'
  const subtitleField = isSpanishContent ? 'subtitleEs' : 'subtitle'
  const resourceField = (baseField) =>
    isSpanishContent ? `${baseField}Es` : baseField

  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(initialValues),
    [formValues, initialValues]
  )

  const isMissingRequired = useMemo(() => {
    if (!formValues.title.trim() || !formValues.subtitle.trim()) return true
    return formValues.resources.some(
      (resource) =>
        !resource.title.trim() ||
        !resource.description.trim() ||
        !resource.ctaLabel.trim() ||
        !resource.href.trim()
    )
  }, [formValues])

  useEffect(() => {
    let isMounted = true

    const fetchContent = async () => {
      setStatus('loading')
      setMessage(t('dashboard.resources.loadingMessage'))
      try {
        const { data } = await axiosInstance.get('/content/resources')
        const content = data?.data?.content

        if (isMounted) {
          const nextValues = hydrateLocalizedContent(
            content ? { ...defaultContent, ...content } : defaultContent
          )
          setInitialValues(nextValues)
          setFormValues(nextValues)
          setUpdatedAt(content?.updatedAt || null)
          setStatus('idle')
          setMessage('')
        }
      } catch (error) {
        if (isMounted) {
          setStatus('error')
          setMessage(t('dashboard.resources.loadError'))
        }
      }
    }

    fetchContent()

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleResourceChange = (index, field, value) => {
    setFormValues((prev) => {
      const updatedResources = prev.resources.map((resource, resourceIndex) =>
        resourceIndex === index ? { ...resource, [field]: value } : resource
      )
      return { ...prev, resources: updatedResources }
    })
  }

  const handleAddResource = () => {
    setFormValues((prev) => ({
      ...prev,
      resources: [...prev.resources, { ...emptyResource }],
    }))
    setStatus('idle')
    setMessage(t('dashboard.resources.newCard'))
  }

  const handleRemoveResource = (index) => {
    if (formValues.resources.length === 1) {
      setStatus('error')
      setMessage(t('dashboard.resources.removeError'))
      return
    }

    const confirmRemove = window.confirm(t('dashboard.resources.removeConfirm'))
    if (!confirmRemove) return

    setFormValues((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, resourceIndex) => resourceIndex !== index),
    }))
    setStatus('idle')
    setMessage(t('dashboard.resources.removed'))
  }

  const handleReset = () => {
    setFormValues(initialValues)
    setMessage(t('dashboard.common.changesReverted'))
    setStatus('idle')
  }

  const handleSave = async (event) => {
    event.preventDefault()

    if (isMissingRequired) {
      setStatus('error')
      setMessage(t('dashboard.common.fillRequiredBeforeSave'))
      return
    }

    setStatus('saving')
    setMessage(t('dashboard.common.savingChanges'))

    try {
      const { data } = await axiosInstance.put(
        '/content/resources',
        formValues,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )

      const content = data?.data?.content
      const nextValues = hydrateLocalizedContent(
        content ? { ...defaultContent, ...content } : { ...formValues }
      )

      setInitialValues(nextValues)
      setFormValues(nextValues)
      setUpdatedAt(content?.updatedAt || null)
      setStatus('success')
      setMessage(t('dashboard.resources.saveSuccess'))
    } catch (error) {
      setStatus('error')
      setMessage(error.message || t('dashboard.resources.saveError'))
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              {t('dashboard.resources.pill')}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {t('dashboard.resources.title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {t('dashboard.resources.description')}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-900">{t('dashboard.common.status')}</p>
            <p className="mt-1">
              {status === 'loading' && t('dashboard.common.loadingContent')}
              {status === 'saving' && t('dashboard.common.savingChanges')}
              {status === 'success' && t('dashboard.common.allChangesSaved')}
              {status === 'error' && t('dashboard.common.actionNeeded')}
              {status === 'idle' &&
                (isDirty ? t('dashboard.common.unsavedChanges') : t('dashboard.common.noPendingChanges'))}
            </p>
            {updatedAt && (
              <p className="mt-1 text-[11px] text-slate-500">
                {t('dashboard.common.lastSaved')} {new Date(updatedAt).toLocaleString()}
              </p>
            )}
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

        {/* <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Content Language</p>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setActiveContentLanguage('en')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${!isSpanishContent ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setActiveContentLanguage('es')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isSpanishContent ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              ES
            </button>
          </div>
        </div> */}

        <form className="space-y-6" onSubmit={handleSave}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.common.pageCopy')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('dashboard.resources.pageCopySubtitle')}</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor={titleField}>
                  {t('dashboard.common.pageTitle')}{localizedLabelSuffix}
                </label>
                <input
                  id={titleField}
                  name={titleField}
                  value={formValues[titleField]}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  required={!isSpanishContent}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor={subtitleField}>
                  {t('dashboard.common.pageSubtitle')}{localizedLabelSuffix}
                </label>
                <textarea
                  id={subtitleField}
                  name={subtitleField}
                  value={formValues[subtitleField]}
                  onChange={handleChange}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  required={!isSpanishContent}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.resources.cardsTitle')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('dashboard.resources.cardsSubtitle')}</p>

            <div className="mt-6 space-y-6">
              {formValues.resources.map((resource, index) => (
                <div key={`${resource.title}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {t('dashboard.resources.cardLabel')} {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveResource(index)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                    >
                      {t('dashboard.common.delete')}
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {t('dashboard.resources.titleLabel')}{localizedLabelSuffix}
                      </label>
                      <input
                        value={resource[resourceField('title')] || ''}
                        onChange={(event) => handleResourceChange(index, resourceField('title'), event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required={!isSpanishContent}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {t('dashboard.resources.descriptionLabel')}{localizedLabelSuffix}
                      </label>
                      <textarea
                        rows={3}
                        value={resource[resourceField('description')] || ''}
                        onChange={(event) => handleResourceChange(index, resourceField('description'), event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required={!isSpanishContent}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {t('dashboard.resources.ctaLabel')}{localizedLabelSuffix}
                      </label>
                      <input
                        value={resource[resourceField('ctaLabel')] || ''}
                        onChange={(event) => handleResourceChange(index, resourceField('ctaLabel'), event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required={!isSpanishContent}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {t('dashboard.resources.linkUrlLabel')}
                      </label>
                      <input
                        value={resource.href}
                        onChange={(event) => handleResourceChange(index, 'href', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddResource}
              className="mt-6 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
            >
              {t('dashboard.resources.addCard')}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={status === 'saving' || status === 'loading' || !isDirty || isMissingRequired}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'saving' ? t('dashboard.common.saving') : t('dashboard.common.saveChanges')}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={status === 'saving' || status === 'loading' || !isDirty}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('dashboard.common.undoChanges')}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
          {t('dashboard.common.loggedInAs')}{' '}
          <span className="font-semibold text-slate-700">
            {user?.email || t('dashboard.common.adminFallback')}
          </span>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardResourcesPage
