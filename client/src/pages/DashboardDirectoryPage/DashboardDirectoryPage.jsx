import React, { useEffect, useMemo, useState } from 'react'
import { Download, UploadCloud } from 'lucide-react'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import axiosInstance from '@/lib/axiosInstance'

const emptyService = {
  providerName: '',
  serviceCategory: '',
  serviceTypes: '',
  websiteUrl: '',
  phone: '',
  serviceTimes: '',
  accessibility: '',
  cost: '',
  countiesServed: '',
}

const DashboardDirectoryPage = () => {
  const { user, token } = useSelector((state) => state.auth)
  const [services, setServices] = useState([])
  const [initialServices, setInitialServices] = useState([])
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [fileStatus, setFileStatus] = useState('idle')
  const [selectedFileName, setSelectedFileName] = useState('')

  const isDirty = useMemo(
    () => JSON.stringify(services) !== JSON.stringify(initialServices),
    [services, initialServices]
  )

  const isMissingRequired = useMemo(
    () => services.some((service) => !service.providerName.trim()),
    [services]
  )

  const visibleServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return services
    return services.filter((service) => {
      const haystack = [
        service.providerName,
        service.serviceCategory,
        service.serviceTypes,
        service.countiesServed,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [services, searchQuery])

  useEffect(() => {
    let isMounted = true

    const fetchServices = async () => {
      setStatus('loading')
      setMessage('Loading directory services...')
      try {
        const { data } = await axiosInstance.get('/directory')
        const list = data?.data?.services || []

        if (isMounted) {
          setServices(list)
          setInitialServices(list)
          setStatus('idle')
          setMessage('')
        }
      } catch (error) {
        if (isMounted) {
          setStatus('error')
          setMessage('Unable to load directory services.')
        }
      }
    }

    fetchServices()

    return () => {
      isMounted = false
    }
  }, [])

  const handleServiceChange = (index, field, value) => {
    setServices((prev) =>
      prev.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, [field]: value } : service
      )
    )
  }

  const handleAddService = () => {
    setServices((prev) => [...prev, { ...emptyService }])
    setStatus('idle')
    setMessage('New service added.')
  }

  const handleRemoveService = (index) => {
    if (services.length === 1) {
      setStatus('error')
      setMessage('Keep at least one service.')
      return
    }

    const confirmRemove = window.confirm('Remove this service?')
    if (!confirmRemove) return

    setServices((prev) => prev.filter((_, serviceIndex) => serviceIndex !== index))
    setStatus('idle')
    setMessage('Service removed.')
  }

  const handleReset = () => {
    setServices(initialServices)
    setMessage('Changes reverted.')
    setStatus('idle')
  }

  const handleSave = async (event) => {
    event.preventDefault()

    if (isMissingRequired) {
      setStatus('error')
      setMessage('Please fill in required fields before saving.')
      return
    }

    setStatus('saving')
    setMessage('Saving changes...')

    try {
      const payload = {
        services: services.map((service) => ({
          ...service,
          providerName: service.providerName?.trim(),
        })),
      }

      const { data } = await axiosInstance.put('/directory', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const list = data?.data?.services || []
      setServices(list)
      setInitialServices(list)
      setStatus('success')
      setMessage('Changes saved successfully.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Unable to save changes.')
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFileName(file.name)
    setFileStatus('uploading')
    setMessage('Uploading file...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await axiosInstance.post('/directory/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setFileStatus('success')
      setMessage(`Upload complete. Imported ${data?.data?.imported || 0} services.`)

      const refreshed = await axiosInstance.get('/directory')
      const list = refreshed?.data?.data?.services || []
      setServices(list)
      setInitialServices(list)
    } catch (error) {
      setFileStatus('error')
      setMessage(error.message || 'Upload failed.')
    }
  }

  const handleExport = async () => {
    setFileStatus('downloading')
    setMessage('Preparing export...')

    try {
      const response = await axiosInstance.get('/directory/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'directory-services.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setFileStatus('success')
      setMessage('Export downloaded.')
    } catch (error) {
      setFileStatus('error')
      setMessage(error.message || 'Export failed.')
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Directory Page
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Edit directory services</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Update services manually or upload an Excel/CSV file to replace the directory data.
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
          </div>
        </div>

        {message && (
          <div
            className={
              status === 'error' || fileStatus === 'error'
                ? 'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'
                : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'
            }
          >
            {message}
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Upload directory file</h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload an Excel or CSV file to replace all directory entries.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {selectedFileName || 'Choose a file to upload'}
              </p>
              <p className="mt-1 text-xs text-slate-500">Accepted: .xlsx, .xls, .csv up to 5MB.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <UploadCloud className="h-4 w-4" />
              Upload file
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            {fileStatus === 'uploading' && 'Uploading...'}
            {fileStatus === 'downloading' && 'Preparing export...'}
            {fileStatus === 'success' && 'All set.'}
            {fileStatus === 'error' && 'Something went wrong.'}
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSave}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Service entries</h2>
                <p className="mt-1 text-sm text-slate-500">Provider name is required.</p>
              </div>
              <button
                type="button"
                onClick={handleAddService}
                className="rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Add service
              </button>
            </div>

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="serviceSearch">
                Search services
              </label>
              <input
                id="serviceSearch"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                placeholder="Search by provider, category, or county"
              />
              <p className="mt-2 text-xs text-slate-500">
                Showing {visibleServices.length} of {services.length}
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {visibleServices.map((service) => {
                const index = services.indexOf(service)
                return (
                  <div key={`${service.providerName}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Service {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Provider name
                        </label>
                        <input
                          value={service.providerName}
                          onChange={(event) => handleServiceChange(index, 'providerName', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Service category
                        </label>
                        <input
                          value={service.serviceCategory}
                          onChange={(event) => handleServiceChange(index, 'serviceCategory', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Service types
                        </label>
                        <input
                          value={service.serviceTypes}
                          onChange={(event) => handleServiceChange(index, 'serviceTypes', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Website URL
                        </label>
                        <input
                          value={service.websiteUrl}
                          onChange={(event) => handleServiceChange(index, 'websiteUrl', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Phone
                        </label>
                        <input
                          value={service.phone}
                          onChange={(event) => handleServiceChange(index, 'phone', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Service times
                        </label>
                        <input
                          value={service.serviceTimes}
                          onChange={(event) => handleServiceChange(index, 'serviceTimes', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Accessibility
                        </label>
                        <input
                          value={service.accessibility}
                          onChange={(event) => handleServiceChange(index, 'accessibility', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Cost
                        </label>
                        <input
                          value={service.cost}
                          onChange={(event) => handleServiceChange(index, 'cost', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Counties served
                        </label>
                        <input
                          value={service.countiesServed}
                          onChange={(event) => handleServiceChange(index, 'countiesServed', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
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
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
          Logged in as <span className="font-semibold text-slate-700">{user?.email || 'Admin'}</span>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardDirectoryPage
