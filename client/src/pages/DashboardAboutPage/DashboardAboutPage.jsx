import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import axiosInstance from '@/lib/axiosInstance'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

const defaultContent = {
  title: 'About & Partners',
  titleEs: '',
  paragraphs: [
    'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. CHOICE created this hub to make it easier for individuals, providers, and care coordinators to find and use transportation services that support access to medical care and essential needs.',
    'This work builds on regional collaboration through the Great Rivers BH-ASO Transportation Collaborative, where partners identified transportation as a major barrier to accessing care. Community surveys and partner feedback showed that many people were unaware of available transportation resources or unsure how to access them.',
    'In response, CHOICE Regional Health Network took the lead in creating this centralized hub to bring transportation information together in one place. This hub reflects CHOICE\'s ongoing commitment to improving access to care and strengthening connections between community members and essential services.',
    'Supporting partners in this effort include Great Rivers BH-ASO, UnitedHealthcare and the Cowlitz-Wahkiakum Council of Governments Mobility Management program, whose collaboration and input helped inform the development of this resource.',
  ],
  paragraphsEs: [],
}

const emptyParagraph = ''

const hydrateLocalizedContent = (values) => {
  const paragraphs = Array.isArray(values.paragraphs) ? values.paragraphs : []
  const incomingParagraphsEs = Array.isArray(values.paragraphsEs) ? values.paragraphsEs : []

  const paragraphsEs = paragraphs.map((paragraph, index) => {
    const candidate = incomingParagraphsEs[index]
    return candidate?.trim() ? candidate : paragraph
  })

  return {
    ...values,
    titleEs: values.titleEs?.trim() ? values.titleEs : values.title,
    paragraphsEs,
  }
}

const DashboardAboutPage = () => {
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
  const paragraphsField = isSpanishContent ? 'paragraphsEs' : 'paragraphs'
  const activeParagraphs = formValues[paragraphsField] || []

  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(initialValues),
    [formValues, initialValues]
  )

  const isMissingRequired = useMemo(() => {
    if (!formValues.title.trim()) return true
    return formValues.paragraphs.some((paragraph) => !paragraph.trim())
  }, [formValues])

  useEffect(() => {
    let isMounted = true

    const fetchContent = async () => {
      setStatus('loading')
      setMessage(t('dashboard.about.loadingMessage'))
      try {
        const { data } = await axiosInstance.get('/content/about')
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
          setMessage(t('dashboard.about.loadError'))
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

  const handleParagraphChange = (index, value) => {
    setFormValues((prev) => {
      const paragraphs = prev[paragraphsField] || []
      const updatedParagraphs = paragraphs.map((paragraph, paragraphIndex) =>
        paragraphIndex === index ? value : paragraph
      )
      return { ...prev, [paragraphsField]: updatedParagraphs }
    })
  }

  const handleAddParagraph = () => {
    setFormValues((prev) => ({
      ...prev,
      [paragraphsField]: [...(prev[paragraphsField] || []), emptyParagraph],
    }))
    setStatus('idle')
    setMessage(t('dashboard.about.newParagraph'))
  }

  const handleRemoveParagraph = (index) => {
    if (activeParagraphs.length === 1) {
      setStatus('error')
      setMessage(t('dashboard.about.removeError'))
      return
    }

    const confirmRemove = window.confirm(t('dashboard.about.removeConfirm'))
    if (!confirmRemove) return

    setFormValues((prev) => ({
      ...prev,
      [paragraphsField]: (prev[paragraphsField] || []).filter(
        (_, paragraphIndex) => paragraphIndex !== index
      ),
    }))
    setStatus('idle')
    setMessage(t('dashboard.about.removed'))
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
        '/content/about',
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
      setMessage(t('dashboard.about.saveSuccess'))
    } catch (error) {
      setStatus('error')
      setMessage(error.message || t('dashboard.about.saveError'))
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              {t('dashboard.about.pill')}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {t('dashboard.about.title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {t('dashboard.about.description')}
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
            <p className="mt-1 text-sm text-slate-500">{t('dashboard.about.pageCopySubtitle')}</p>

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

              <div className="space-y-4">
                {activeParagraphs.map((paragraph, index) => (
                  <div key={`paragraph-${index}`} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {t('dashboard.about.paragraphLabel')} {index + 1}{localizedLabelSuffix}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveParagraph(index)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                      >
                        {t('dashboard.common.delete')}
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={paragraph}
                      onChange={(event) => handleParagraphChange(index, event.target.value)}
                      className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                      required={!isSpanishContent}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="mt-6 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {t('dashboard.common.add')} {t('dashboard.about.paragraphLabel').toLowerCase()}
              </button>
            </div>
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

export default DashboardAboutPage
