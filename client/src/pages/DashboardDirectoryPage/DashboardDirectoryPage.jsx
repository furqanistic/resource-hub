import React, { useEffect, useMemo, useState } from 'react'
import { Download, UploadCloud } from 'lucide-react'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import axiosInstance from '@/lib/axiosInstance'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const { t } = useLanguage()
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
      setMessage(t('dashboard.directory.loadingMessage'))
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
          setMessage(t('dashboard.directory.loadError'))
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
    setMessage(t('dashboard.directory.newService'))
  }

  const handleRemoveService = (index) => {
    if (services.length === 1) {
      setStatus('error')
      setMessage(t('dashboard.directory.removeError'))
      return
    }

    const confirmRemove = window.confirm(t('dashboard.directory.removeConfirm'))
    if (!confirmRemove) return

    setServices((prev) => prev.filter((_, serviceIndex) => serviceIndex !== index))
    setStatus('idle')
    setMessage(t('dashboard.directory.removed'))
  }

  const handleReset = () => {
    setServices(initialServices)
    setMessage(t('dashboard.common.changesReverted'))
    setStatus('idle')
  }

  const handleSave = async (event) => {
    event.preventDefault()

    if (isMissingRequired) {
      setStatus('error')
      setMessage(t('dashboard.directory.fillRequiredBeforeSave'))
      return
    }

    setStatus('saving')
    setMessage(t('dashboard.common.savingChanges'))

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
      setMessage(t('dashboard.directory.saveSuccess'))
    } catch (error) {
      setStatus('error')
      setMessage(error.message || t('dashboard.directory.saveError'))
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFileName(file.name)
    setFileStatus('uploading')
    setMessage(t('dashboard.directory.uploadMessage'))

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
      setMessage(
        `${t('dashboard.directory.uploadComplete')} ${data?.data?.imported || 0} ${t('dashboard.directory.servicesLabel')}`
      )

      const refreshed = await axiosInstance.get('/directory')
      const list = refreshed?.data?.data?.services || []
      setServices(list)
      setInitialServices(list)
    } catch (error) {
      setFileStatus('error')
      setMessage(error.message || t('dashboard.directory.uploadFailed'))
    }
  }

  const handleExport = async () => {
    setFileStatus('downloading')
    setMessage(t('dashboard.directory.exportMessage'))

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
      setMessage(t('dashboard.directory.exportDownloaded'))
    } catch (error) {
      setFileStatus('error')
      setMessage(error.message || t('dashboard.directory.exportFailed'))
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              {t('dashboard.directory.pill')}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {t('dashboard.directory.title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {t('dashboard.directory.description')}
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
              <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.directory.uploadTitle')}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {t('dashboard.directory.uploadSubtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              <Download className="h-4 w-4" />
              {t('dashboard.directory.exportCsv')}
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {selectedFileName || t('dashboard.directory.chooseFile')}
              </p>
              <p className="mt-1 text-xs text-slate-500">{t('dashboard.directory.acceptedFiles')}</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <UploadCloud className="h-4 w-4" />
              {t('dashboard.directory.uploadFile')}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            {fileStatus === 'uploading' && t('dashboard.directory.uploading')}
            {fileStatus === 'downloading' && t('dashboard.directory.preparingExport')}
            {fileStatus === 'success' && t('dashboard.directory.allSet')}
            {fileStatus === 'error' && t('dashboard.directory.somethingWrong')}
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSave}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.directory.entriesTitle')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('dashboard.directory.entriesSubtitle')}</p>
              </div>
              <button
                type="button"
                onClick={handleAddService}
                className="rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {t('dashboard.directory.addService')}
              </button>
            </div>

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="serviceSearch">
                {t('dashboard.directory.searchLabel')}
              </label>
              <input
                id="serviceSearch"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                placeholder={t('dashboard.directory.searchPlaceholder')}
              />
              <p className="mt-2 text-xs text-slate-500">
                {t('dashboard.common.showing')} {visibleServices.length} {t('dashboard.common.of')} {services.length}
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {visibleServices.map((service) => {
                const index = services.indexOf(service)
                return (
                  <div key={`${service.providerName}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {t('dashboard.directory.serviceLabel')} {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                      >
                        {t('dashboard.common.delete')}
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {t('dashboard.directory.providerName')}
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
                          {t('dashboard.directory.serviceCategory')}
                        </label>
                        <input
                          value={service.serviceCategory}
                          onChange={(event) => handleServiceChange(index, 'serviceCategory', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {t('dashboard.directory.serviceTypes')}
                        </label>
                        <input
                          value={service.serviceTypes}
                          onChange={(event) => handleServiceChange(index, 'serviceTypes', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {t('dashboard.directory.websiteUrl')}
                        </label>
                        <input
                          value={service.websiteUrl}
                          onChange={(event) => handleServiceChange(index, 'websiteUrl', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {t('dashboard.directory.phone')}
                        </label>
                        <input
                          value={service.phone}
                          onChange={(event) => handleServiceChange(index, 'phone', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {t('dashboard.directory.serviceTimes')}
                        </label>
                        <input
                          value={service.serviceTimes}
                          onChange={(event) => handleServiceChange(index, 'serviceTimes', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {t('dashboard.directory.accessibility')}
                        </label>
                        <input
                          value={service.accessibility}
                          onChange={(event) => handleServiceChange(index, 'accessibility', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {t('dashboard.directory.cost')}
                        </label>
                        <input
                          value={service.cost}
                          onChange={(event) => handleServiceChange(index, 'cost', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {t('dashboard.directory.countiesServed')}
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

export default DashboardDirectoryPage
