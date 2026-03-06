import heroImg from '@/assets/CloudLogos/hero-img.jpg'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import axiosInstance from '@/lib/axiosInstance'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

const defaultContent = {
  heroTitle: 'CHOICE Regional Transportation Hub',
  heroTitleEs: '',
  heroDescription1:
    'This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region.',
  heroDescription1Es: '',
  heroDescription2:
    'This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services.',
  heroDescription2Es: '',
  heroCta: 'Start My Search',
  heroCtaEs: '',
  heroImageUrl: '',
  heroImageAlt: 'Supportive driver providing transportation',
  heroImageAltEs: '',
  supportingPartnersLabel: 'Supporting Partners',
  supportingPartnersLabelEs: '',
}

const hydrateLocalizedContent = (values) => ({
  ...values,
  heroTitleEs: values.heroTitleEs?.trim() ? values.heroTitleEs : values.heroTitle,
  heroDescription1Es: values.heroDescription1Es?.trim()
    ? values.heroDescription1Es
    : values.heroDescription1,
  heroDescription2Es: values.heroDescription2Es?.trim()
    ? values.heroDescription2Es
    : values.heroDescription2,
  heroCtaEs: values.heroCtaEs?.trim() ? values.heroCtaEs : values.heroCta,
  heroImageAltEs: values.heroImageAltEs?.trim() ? values.heroImageAltEs : values.heroImageAlt,
  supportingPartnersLabelEs: values.supportingPartnersLabelEs?.trim()
    ? values.supportingPartnersLabelEs
    : values.supportingPartnersLabel,
})

const DashboardPage = () => {
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
  const contentField = (baseField) => (isSpanishContent ? `${baseField}Es` : baseField)

  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(initialValues),
    [formValues, initialValues]
  )

  const isMissingRequired = useMemo(
    () =>
      !formValues.heroTitle.trim() ||
      !formValues.heroDescription1.trim() ||
      !formValues.heroDescription2.trim() ||
      !formValues.heroCta.trim(),
    [formValues]
  )

  useEffect(() => {
    let isMounted = true

    const fetchContent = async () => {
      setStatus('loading')
      setMessage(t('dashboard.home.loadingMessage'))
      try {
        const { data } = await axiosInstance.get('/content/home')
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
          setMessage(t('dashboard.home.loadError'))
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
        '/content/home',
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
      setMessage(t('dashboard.home.saveSuccess'))
    } catch (error) {
      setStatus('error')
      setMessage(error.message || t('dashboard.home.saveError'))
    }
  }

  const heroPreview = formValues.heroImageUrl?.trim() || heroImg

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              {t('dashboard.home.pill')}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {t('dashboard.home.title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {t('dashboard.home.description')}
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

        <form className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSave}>
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.home.heroTextTitle')}</h2>
              <p className="mt-1 text-sm text-slate-500">{t('dashboard.home.heroTextSubtitle')}</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor={contentField('heroTitle')}>
                    {t('dashboard.home.heroTitleLabel')}{localizedLabelSuffix}
                  </label>
                  <input
                    id={contentField('heroTitle')}
                    name={contentField('heroTitle')}
                    value={formValues[contentField('heroTitle')]}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                    required={!isSpanishContent}
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                    htmlFor={contentField('heroDescription1')}
                  >
                    {t('dashboard.home.heroDescriptionLabel')} 1{localizedLabelSuffix}
                  </label>
                  <textarea
                    id={contentField('heroDescription1')}
                    name={contentField('heroDescription1')}
                    value={formValues[contentField('heroDescription1')]}
                    onChange={handleChange}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                    required={!isSpanishContent}
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                    htmlFor={contentField('heroDescription2')}
                  >
                    {t('dashboard.home.heroDescriptionLabel')} 2{localizedLabelSuffix}
                  </label>
                  <textarea
                    id={contentField('heroDescription2')}
                    name={contentField('heroDescription2')}
                    value={formValues[contentField('heroDescription2')]}
                    onChange={handleChange}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                    required={!isSpanishContent}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor={contentField('heroCta')}>
                    {t('dashboard.home.ctaLabel')}{localizedLabelSuffix}
                  </label>
                  <input
                    id={contentField('heroCta')}
                    name={contentField('heroCta')}
                    value={formValues[contentField('heroCta')]}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                    required={!isSpanishContent}
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                    htmlFor={contentField('supportingPartnersLabel')}
                  >
                    {t('dashboard.home.supportingPartnersLabel')}{localizedLabelSuffix}
                  </label>
                  <input
                    id={contentField('supportingPartnersLabel')}
                    name={contentField('supportingPartnersLabel')}
                    value={formValues[contentField('supportingPartnersLabel')]}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.home.heroImageTitle')}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {t('dashboard.home.heroImageSubtitle')}
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="heroImageUrl">
                    {t('dashboard.home.imageUrlLabel')}
                  </label>
                  <input
                    id="heroImageUrl"
                    name="heroImageUrl"
                    value={formValues.heroImageUrl}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                    placeholder="https://example.com/hero.jpg"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor={contentField('heroImageAlt')}>
                    {t('dashboard.home.imageAltLabel')}{localizedLabelSuffix}
                  </label>
                  <input
                    id={contentField('heroImageAlt')}
                    name={contentField('heroImageAlt')}
                    value={formValues[contentField('heroImageAlt')]}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img src={heroPreview} alt={t('dashboard.home.heroPreviewAlt')} className="h-48 w-full object-cover" />
                </div>
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

export default DashboardPage
