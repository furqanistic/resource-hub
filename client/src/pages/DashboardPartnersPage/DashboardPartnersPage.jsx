import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import axiosInstance from '@/lib/axiosInstance'

const logoOptions = [
  { value: '', label: 'No logo key' },
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
]

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
  const [formValues, setFormValues] = useState(defaultContent)
  const [initialValues, setInitialValues] = useState(defaultContent)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

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
      setMessage('Loading partners content...')
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
          setMessage('Unable to load partners content. Using defaults instead.')
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
    setMessage('New partner added.')
  }

  const handleRemovePartner = (index) => {
    if (formValues.partners.length === 1) {
      setStatus('error')
      setMessage('Keep at least one partner.')
      return
    }

    const confirmRemove = window.confirm('Remove this partner?')
    if (!confirmRemove) return

    setFormValues((prev) => ({
      ...prev,
      partners: prev.partners.filter((_, partnerIndex) => partnerIndex !== index),
    }))
    setStatus('idle')
    setMessage('Partner removed.')
  }

  const handleReset = () => {
    setFormValues(initialValues)
    setMessage('Changes reverted.')
    setStatus('idle')
  }

  const handleSave = async (event) => {
    event.preventDefault()

    if (isMissingRequired) {
      setStatus('error')
      setMessage('Please fill in all required fields before saving.')
      return
    }

    setStatus('saving')
    setMessage('Saving changes...')

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
      setMessage('Changes saved successfully.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Unable to save changes.')
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Partners Page
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Edit partners content</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Update partner cards shown on the public partners page.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-900">Status</p>
            <p className="mt-1">
              {status === 'loading' && 'Loading content...'}
              {status === 'saving' && 'Saving changes...'}
              {status === 'success' && 'All changes saved'}
              {status === 'error' && 'Action needed'}
              {status === 'idle' && (isDirty ? 'Unsaved changes' : 'No pending changes')}
            </p>
            {updatedAt && (
              <p className="mt-1 text-[11px] text-slate-500">
                Last saved: {new Date(updatedAt).toLocaleString()}
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
            <h2 className="text-lg font-semibold text-slate-900">Partner cards</h2>
            <p className="mt-1 text-sm text-slate-500">Edit each partner card. English description is required.</p>

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="partnerSearch">
                Search partners
              </label>
              <input
                id="partnerSearch"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                placeholder="Search by name, URL, or description"
              />
              <p className="mt-2 text-xs text-slate-500">
                Showing {visiblePartners.length} of {formValues.partners.length}
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {visiblePartners.map((partner) => {
                const index = formValues.partners.indexOf(partner)
                return (
                <div key={`${partner.name}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Partner {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(index)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Name
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
                        Website URL
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
                        Logo key (optional)
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
                        Logo URL (optional)
                      </label>
                      <input
                        value={partner.logoUrl}
                        onChange={(event) => handlePartnerChange(index, 'logoUrl', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Description (English)
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
                      Description (Spanish)
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
                      Invert logo colors
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
              Add partner
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={status === 'saving' || status === 'loading' || !isDirty || isMissingRequired}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'saving' ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={status === 'saving' || status === 'loading' || !isDirty}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Undo changes
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
          Logged in as <span className="font-semibold text-slate-700">{user?.email || 'Admin'}</span>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPartnersPage
