import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import axiosInstance from '@/lib/axiosInstance'
import { useLanguage } from '@/contexts/LanguageContext'

const defaultContent = {
  partners: [
    {
      name: 'RiverCities Transit',
      url: 'https://www.rctransit.org',
      description: 'RiverCities Transit – We are here, to get you there.',
      descriptionEs: 'RiverCities Transit – Estamos aquí para llevarte allí.',
      logoKey: 'rct',
      logoUrl: '',
      logoClass: '',
    },
  ],
}

const emptyPartner = {
  name: '',
  url: '',
  description: '',
  descriptionEs: '',
  logoKey: '',
  logoUrl: '',
  logoClass: '',
}

const DashboardPartnersPage = () => {
  const { user, token } = useSelector((state) => state.auth)
  const { t } = useLanguage()
  const [formValues, setFormValues] = useState(defaultContent)
  const [initialValues, setInitialValues] = useState(defaultContent)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const logoOptions = useMemo(
    () => [
      { value: '', label: t('dashboard.partners.noLogoKey') },
      { value: 'rct', label: 'RiverCities Transit' },
      { value: 'hca', label: 'Washington State HCA' },
      { value: 'gcr', label: 'Great Rivers BH-ASO' },
      { value: 'chpw', label: 'CHPW' },
      { value: 'bhr', label: 'BHR' },
      { value: 'para', label: 'Paratransit Services' },
      { value: 'wah', label: 'Wahkiakum County' },
      { value: 'doh', label: 'WA Department of Health' },
      { value: 'ght', label: 'Grays Harbor Transit' },
      { value: 'dhr', label: 'Destination Hope & Recovery' },
      { value: 'crhn', label: 'CRHN' },
      { value: 'arbor', label: 'Arbor Health' },
      { value: 'dhrw', label: 'Disability Rights WA' },
      { value: 'ctanw', label: 'CTANW' },
      { value: 'cim', label: 'Community in Motion' },
      { value: 'coastalcap', label: 'Coastal CAP' },
      { value: 'oa', label: 'Olympic Ambulance' },
      { value: 'cwcog', label: 'CWCOG' },
    ],
    [t]
  )

  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(initialValues),
    [formValues, initialValues]
  )

  const isMissingRequired = useMemo(
    () =>
      formValues.partners.some(
        (partner) => !partner.name.trim() || !partner.url.trim() || !partner.description.trim()
      ),
    [formValues]
  )

  const visiblePartners = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return formValues.partners
    return formValues.partners.filter((partner) => {
      const haystack = [
        partner.name,
        partner.url,
        partner.description,
        partner.descriptionEs,
        partner.logoKey,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [formValues.partners, searchQuery])

  useEffect(() => {
    let isMounted = true

    const fetchContent = async () => {
      setStatus('loading')
      setMessage(t('dashboard.partners.loadingMessage'))
      try {
        const { data } = await axiosInstance.get('/content/partners')
        const content = data?.data?.content

        if (isMounted) {
          const nextValues = content ? { ...defaultContent, ...content } : defaultContent
          setInitialValues(nextValues)
          setFormValues(nextValues)
          setUpdatedAt(content?.updatedAt || null)
          setStatus('idle')
          setMessage('')
        }
      } catch (error) {
        if (isMounted) {
          setStatus('error')
          setMessage(t('dashboard.partners.loadError'))
        }
      }
    }

    fetchContent()

    return () => {
      isMounted = false
    }
  }, [])

  const handlePartnerChange = (index, field, value) => {
    setFormValues((prev) => {
      const updatedPartners = prev.partners.map((partner, partnerIndex) =>
        partnerIndex === index ? { ...partner, [field]: value } : partner
      )
      return { ...prev, partners: updatedPartners }
    })
  }

  const handleToggleInvert = (index) => {
    setFormValues((prev) => {
      const updatedPartners = prev.partners.map((partner, partnerIndex) => {
        if (partnerIndex !== index) return partner
        const isInverted = partner.logoClass === 'invert'
        return { ...partner, logoClass: isInverted ? '' : 'invert' }
      })
      return { ...prev, partners: updatedPartners }
    })
  }

  const handleAddPartner = () => {
    setFormValues((prev) => ({
      ...prev,
      partners: [...prev.partners, { ...emptyPartner }],
    }))
    setStatus('idle')
    setMessage(t('dashboard.partners.newPartner'))
  }

  const handleRemovePartner = (index) => {
    if (formValues.partners.length === 1) {
      setStatus('error')
      setMessage(t('dashboard.partners.removeError'))
      return
    }

    const confirmRemove = window.confirm(t('dashboard.partners.removeConfirm'))
    if (!confirmRemove) return

    setFormValues((prev) => ({
      ...prev,
      partners: prev.partners.filter((_, partnerIndex) => partnerIndex !== index),
    }))
    setStatus('idle')
    setMessage(t('dashboard.partners.removed'))
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
        '/content/partners',
        formValues,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )

      const content = data?.data?.content
      const nextValues = content ? { ...defaultContent, ...content } : { ...formValues }

      setInitialValues(nextValues)
      setFormValues(nextValues)
      setUpdatedAt(content?.updatedAt || null)
      setStatus('success')
      setMessage(t('dashboard.partners.saveSuccess'))
    } catch (error) {
      setStatus('error')
      setMessage(error.message || t('dashboard.partners.saveError'))
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              {t('dashboard.partners.pill')}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {t('dashboard.partners.title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {t('dashboard.partners.description')}
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

        <form className="space-y-6" onSubmit={handleSave}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.partners.cardsTitle')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('dashboard.partners.cardsSubtitle')}</p>

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="partnerSearch">
                {t('dashboard.partners.searchLabel')}
              </label>
              <input
                id="partnerSearch"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                placeholder={t('dashboard.partners.searchPlaceholder')}
              />
              <p className="mt-2 text-xs text-slate-500">
                {t('dashboard.common.showing')} {visiblePartners.length} {t('dashboard.common.of')}{' '}
                {formValues.partners.length}
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {visiblePartners.map((partner) => {
                const index = formValues.partners.indexOf(partner)
                return (
                <div key={`${partner.name}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {t('dashboard.partners.partnerLabel')} {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(index)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                    >
                      {t('dashboard.common.delete')}
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {t('dashboard.partners.nameLabel')}
                      </label>
                      <input
                        value={partner.name}
                        onChange={(event) => handlePartnerChange(index, 'name', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {t('dashboard.partners.websiteLabel')}
                      </label>
                      <input
                        value={partner.url}
                        onChange={(event) => handlePartnerChange(index, 'url', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {t('dashboard.partners.logoKeyLabel')}
                      </label>
                      <select
                        value={partner.logoKey}
                        onChange={(event) => handlePartnerChange(index, 'logoKey', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                      >
                        {logoOptions.map((option) => (
                          <option key={option.value || 'none'} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {t('dashboard.partners.logoUrlLabel')}
                      </label>
                      <input
                        value={partner.logoUrl}
                        onChange={(event) => handlePartnerChange(index, 'logoUrl', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        placeholder={t('dashboard.partners.logoUrlPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {t('dashboard.partners.descriptionEn')}
                    </label>
                    <textarea
                      rows={3}
                      value={partner.description}
                      onChange={(event) => handlePartnerChange(index, 'description', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {t('dashboard.partners.descriptionEs')}
                    </label>
                    <textarea
                      rows={3}
                      value={partner.descriptionEs}
                      onChange={(event) => handlePartnerChange(index, 'descriptionEs', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <input
                      id={`invert-${index}`}
                      type="checkbox"
                      checked={partner.logoClass === 'invert'}
                      onChange={() => handleToggleInvert(index)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <label htmlFor={`invert-${index}`} className="text-sm text-slate-600">
                      {t('dashboard.partners.invertLogo')}
                    </label>
                  </div>
                </div>
              )})}
            </div>

            <button
              type="button"
              onClick={handleAddPartner}
              className="mt-6 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
            >
              {t('dashboard.partners.addPartner')}
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

export default DashboardPartnersPage
