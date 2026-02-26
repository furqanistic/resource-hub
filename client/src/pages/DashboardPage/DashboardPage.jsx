import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import heroImg from '@/assets/CloudLogos/hero-img.jpg'
import axiosInstance from '@/lib/axiosInstance'

const defaultContent = {
  heroTitle: 'CHOICE Regional Transportation Hub',
  heroDescription1:
    'This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region.',
  heroDescription2:
    'This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services.',
  heroCta: 'Start My Search',
  heroImageUrl: '',
  heroImageAlt: 'Supportive driver providing transportation',
  supportingPartnersLabel: 'Supporting Partners',
}

const DashboardPage = () => {
  const { user, token } = useSelector((state) => state.auth)
  const [formValues, setFormValues] = useState(defaultContent)
  const [initialValues, setInitialValues] = useState(defaultContent)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

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
      setMessage('Loading home page content...')
      try {
        const { data } = await axiosInstance.get('/content/home')
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
          setMessage('Unable to load home page content. Using defaults instead.')
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
        '/content/home',
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

  const heroPreview = formValues.heroImageUrl?.trim() || heroImg

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Home Page
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Edit home page content</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Update the hero section text and image used on the public homepage.
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

        <form className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSave}>
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Hero text</h2>
              <p className="mt-1 text-sm text-slate-500">These fields appear at the top of the homepage.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="heroTitle">
                    Hero title
                  </label>
                  <input
                    id="heroTitle"
                    name="heroTitle"
                    value={formValues.heroTitle}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                    htmlFor="heroDescription1"
                  >
                    Hero description 1
                  </label>
                  <textarea
                    id="heroDescription1"
                    name="heroDescription1"
                    value={formValues.heroDescription1}
                    onChange={handleChange}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                    htmlFor="heroDescription2"
                  >
                    Hero description 2
                  </label>
                  <textarea
                    id="heroDescription2"
                    name="heroDescription2"
                    value={formValues.heroDescription2}
                    onChange={handleChange}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="heroCta">
                    CTA button label
                  </label>
                  <input
                    id="heroCta"
                    name="heroCta"
                    value={formValues.heroCta}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                    htmlFor="supportingPartnersLabel"
                  >
                    Supporting partners label
                  </label>
                  <input
                    id="supportingPartnersLabel"
                    name="supportingPartnersLabel"
                    value={formValues.supportingPartnersLabel}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Hero image</h2>
              <p className="mt-1 text-sm text-slate-500">
                Paste a public image URL or leave it blank to use the default image.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="heroImageUrl">
                    Image URL
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
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="heroImageAlt">
                    Image description (alt text)
                  </label>
                  <input
                    id="heroImageAlt"
                    name="heroImageAlt"
                    value={formValues.heroImageAlt}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img src={heroPreview} alt="Hero preview" className="h-48 w-full object-cover" />
                </div>
              </div>
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
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
          Logged in as <span className="font-semibold text-slate-700">{user?.email || 'Admin'}</span>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
