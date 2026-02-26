import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import axiosInstance from '@/lib/axiosInstance'

const defaultContent = {
  title: 'Regional Transportation Resources',
  subtitle: 'Key tools and partners helping people access care, food, and essential services.',
  resources: [
    {
      title: 'CWCOG Mobility Management',
      description:
        'Mobility management tools, travel training, and regional coordination to connect people with transportation options.',
      ctaLabel: 'Visit CWCOG Mobility Management',
      href: 'https://www.cwcog.org/mobility-management/',
    },
    {
      title: 'Great Rivers BH-ASO Transportation Efforts',
      description:
        'Regional coordination focused on improving access to transportation for behavioral health and other essential services.',
      ctaLabel: 'Learn more about Great Rivers BH-ASO',
      href: 'https://www.grbhaso.org',
    },
  ],
}

const emptyResource = {
  title: '',
  description: '',
  ctaLabel: '',
  href: '',
}

const DashboardResourcesPage = () => {
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
      setMessage('Loading resources page content...')
      try {
        const { data } = await axiosInstance.get('/content/resources')
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
          setMessage('Unable to load resources content. Using defaults instead.')
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
    setMessage('New card added.')
  }

  const handleRemoveResource = (index) => {
    if (formValues.resources.length === 1) {
      setStatus('error')
      setMessage('Keep at least one resource card.')
      return
    }

    const confirmRemove = window.confirm('Remove this resource card?')
    if (!confirmRemove) return

    setFormValues((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, resourceIndex) => resourceIndex !== index),
    }))
    setStatus('idle')
    setMessage('Resource card removed.')
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
        '/content/resources',
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
              Resources Page
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Edit resources content</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Update the title, subtitle, and resource cards shown on the public resources page.
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
            <h2 className="text-lg font-semibold text-slate-900">Page copy</h2>
            <p className="mt-1 text-sm text-slate-500">These fields appear at the top of the resources page.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="title">
                  Page title
                </label>
                <input
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="subtitle">
                  Page subtitle
                </label>
                <textarea
                  id="subtitle"
                  name="subtitle"
                  value={formValues.subtitle}
                  onChange={handleChange}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Resource cards</h2>
            <p className="mt-1 text-sm text-slate-500">Edit each card to match the public page.</p>

            <div className="mt-6 space-y-6">
              {formValues.resources.map((resource, index) => (
                <div key={`${resource.title}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Card {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveResource(index)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Title
                      </label>
                      <input
                        value={resource.title}
                        onChange={(event) => handleResourceChange(index, 'title', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={resource.description}
                        onChange={(event) => handleResourceChange(index, 'description', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        CTA label
                      </label>
                      <input
                        value={resource.ctaLabel}
                        onChange={(event) => handleResourceChange(index, 'ctaLabel', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Link URL
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
              Add resource card
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

export default DashboardResourcesPage
