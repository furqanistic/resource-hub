import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Plus,
  RotateCcw,
  Save,
  Send,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { resolveAssetUrl } from '@/lib/api/cmsApi'
import { basePartners } from '@/pages/PartnersPage/PartnersPage'

const PARTNER_KEY_RE = /^partner-(name|url|logo|description|description-es)-(\d+)$/

const toMessage = (error, fallback) => {
  if (!error) return fallback
  const apiMessage = error?.response?.data?.message || error?.response?.data?.error
  if (typeof apiMessage === 'string' && apiMessage.trim()) return apiMessage
  if (typeof error?.message === 'string') return error.message
  if (typeof error === 'string') return error
  return fallback
}

const humanizeKey = (key) =>
  key
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

const inferFieldType = (key, value) => {
  const normalizedKey = key.toLowerCase()

  if (
    normalizedKey.includes('image') ||
    normalizedKey.includes('logo') ||
    normalizedKey.includes('banner') ||
    normalizedKey.includes('photo')
  ) {
    return 'image'
  }

  if (
    normalizedKey.includes('description') ||
    normalizedKey.includes('desc') ||
    normalizedKey.includes('content') ||
    normalizedKey.includes('text') ||
    /(^|[-_])p\d+($|[-_])/.test(normalizedKey) ||
    String(value || '').length > 120
  ) {
    return 'textarea'
  }

  return 'text'
}

const fieldsChanged = (draftValues, sourceValues) => {
  const keys = new Set([
    ...Object.keys(sourceValues || {}),
    ...Object.keys(draftValues || {}),
  ])

  for (const key of keys) {
    if ((draftValues?.[key] ?? '') !== (sourceValues?.[key] ?? '')) return true
  }

  return false
}

const routeFromSectionId = (sectionId = '') => {
  const page = sectionId.split('.')[0]
  const routeMap = {
    home: '/',
    about: '/about',
    resources: '/resources',
    partners: '/partners',
    directory: '/directory',
    dashboard: '/dashboard',
  }
  return routeMap[page] || '/'
}

const hasAnyPartnerField = (fields = {}) =>
  Object.keys(fields).some((key) => PARTNER_KEY_RE.test(key))

const buildDefaultPartnerFields = () => {
  const next = {}
  basePartners.forEach((partner, index) => {
    next[`partner-name-${index}`] = partner.name || ''
    next[`partner-url-${index}`] = partner.url || ''
    next[`partner-logo-${index}`] = partner.logo || ''
    next[`partner-description-${index}`] = partner.description || ''
    next[`partner-description-es-${index}`] = partner.descriptionEs || ''
  })
  return next
}

const getPartnerIndexes = (fields = {}) => {
  const indexes = new Set()
  Object.keys(fields).forEach((key) => {
    const match = key.match(PARTNER_KEY_RE)
    if (!match) return
    indexes.add(Number(match[2]))
  })
  return [...indexes].sort((a, b) => a - b)
}

const partnerKey = (field, index) => `partner-${field}-${index}`

const getPartnersFromFields = (fields = {}) => {
  const indexes = getPartnerIndexes(fields)
  return indexes
    .map((index) => ({
      index,
      name: fields[partnerKey('name', index)] ?? '',
      url: fields[partnerKey('url', index)] ?? '',
      logo: fields[partnerKey('logo', index)] ?? '',
      description: fields[partnerKey('description', index)] ?? '',
      descriptionEs: fields[partnerKey('description-es', index)] ?? '',
    }))
    .filter((partner) => {
      return (
        partner.name.trim() ||
        partner.url.trim() ||
        partner.logo.trim() ||
        partner.description.trim() ||
        partner.descriptionEs.trim()
      )
    })
}

const TextField = ({ field, value, sourceValue, onChange }) => {
  const dirty = (value ?? '') !== (sourceValue ?? '')

  return (
    <div
      className={cn(
        'rounded-md border p-4',
        dirty ? 'border-[#03385e] bg-[#f8fbff]' : 'border-slate-200 bg-white'
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <Label className="text-sm font-semibold text-slate-700">{field.label}</Label>
        <span className="text-[11px] text-slate-500">{field.id}</span>
      </div>

      {field.type === 'textarea' ? (
        <Textarea
          value={value ?? ''}
          onChange={(event) => onChange(field.id, event.target.value)}
          className="min-h-28 bg-white"
        />
      ) : (
        <Input
          value={value ?? ''}
          onChange={(event) => onChange(field.id, event.target.value)}
          className="h-10 bg-white"
        />
      )}
    </div>
  )
}

const ImageField = ({ field, value, sourceValue, onChange, onUpload, isUploading }) => {
  const fileInputRef = React.useRef(null)
  const preview = resolveAssetUrl(value)
  const dirty = (value ?? '') !== (sourceValue ?? '')

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file || isUploading) return
    await onUpload(field.id, file)
    event.target.value = ''
  }

  return (
    <div
      className={cn(
        'rounded-md border p-4',
        dirty ? 'border-[#03385e] bg-[#f8fbff]' : 'border-slate-200 bg-white'
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <Label className="text-sm font-semibold text-slate-700">{field.label}</Label>
        <span className="text-[11px] text-slate-500">{field.id}</span>
      </div>

      <div className="mb-3 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
        {preview ? (
          <img src={preview} alt={field.label} className="h-40 w-full object-contain" />
        ) : (
          <div className="flex h-40 items-center justify-center text-slate-400">
            <ImagePlus className="mr-2 h-5 w-5" />
            No image
          </div>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-[#03385e] text-white hover:bg-[#03385e]/90"
        >
          {isUploading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          Upload
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange(field.id, '')}
          disabled={isUploading}
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <Input
        value={value ?? ''}
        onChange={(event) => onChange(field.id, event.target.value)}
        className="h-9"
        placeholder="Image URL"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  )
}

const PartnerTable = ({
  draftValues,
  sourceFields,
  searchValue,
  onChange,
  onUpload,
  onAdd,
  onRemove,
  mediaUploadStatus,
  uploadingFieldId,
}) => {
  const partners = useMemo(() => getPartnersFromFields(draftValues), [draftValues])

  const filteredPartners = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return partners

    return partners.filter((partner) => {
      const haystack = [
        partner.name,
        partner.url,
        partner.description,
        partner.descriptionEs,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [partners, searchValue])

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Partners</p>
          <p className="text-xs text-slate-500">
            {filteredPartners.length} of {partners.length} shown
          </p>
        </div>
        <Button type="button" onClick={onAdd} className="bg-[#03385e] text-white hover:bg-[#03385e]/90">
          <Plus className="h-4 w-4" />
          Add Partner
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Logo</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Website URL</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Description (EN)</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Description (ES)</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPartners.map((partner) => {
              const nameKey = partnerKey('name', partner.index)
              const urlKey = partnerKey('url', partner.index)
              const logoKey = partnerKey('logo', partner.index)
              const descKey = partnerKey('description', partner.index)
              const descEsKey = partnerKey('description-es', partner.index)
              const logo = resolveAssetUrl(draftValues[logoKey] ?? '')
              const isUploading =
                uploadingFieldId === logoKey || mediaUploadStatus === 'loading'

              const rowDirty =
                (draftValues[nameKey] ?? '') !== (sourceFields[nameKey] ?? '') ||
                (draftValues[urlKey] ?? '') !== (sourceFields[urlKey] ?? '') ||
                (draftValues[logoKey] ?? '') !== (sourceFields[logoKey] ?? '') ||
                (draftValues[descKey] ?? '') !== (sourceFields[descKey] ?? '') ||
                (draftValues[descEsKey] ?? '') !== (sourceFields[descEsKey] ?? '')

              return (
                <tr key={`partner-row-${partner.index}`} className={cn('border-t border-slate-200 align-top', rowDirty ? 'bg-[#f8fbff]' : 'bg-white')}>
                  <td className="px-3 py-3">
                    <div className="w-36 space-y-2">
                      <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                        {logo ? (
                          <img src={logo} alt={partner.name || `Partner ${partner.index + 1}`} className="h-20 w-full object-contain p-2" />
                        ) : (
                          <div className="flex h-20 items-center justify-center text-xs text-slate-400">No logo</div>
                        )}
                      </div>
                      <Input
                        value={draftValues[logoKey] ?? ''}
                        onChange={(event) => onChange(logoKey, event.target.value)}
                        placeholder="Logo URL"
                        className="h-8 text-xs"
                      />
                      <div className="flex gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                          {isUploading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0]
                              if (!file || isUploading) return
                              onUpload(logoKey, file)
                              event.target.value = ''
                            }}
                            disabled={isUploading}
                          />
                        </label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => onChange(logoKey, '')}
                          disabled={isUploading}
                        >
                          <X className="h-3.5 w-3.5" />
                          Clear
                        </Button>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <Input
                      value={draftValues[nameKey] ?? ''}
                      onChange={(event) => onChange(nameKey, event.target.value)}
                      placeholder="Partner name"
                    />
                  </td>

                  <td className="px-3 py-3">
                    <Input
                      value={draftValues[urlKey] ?? ''}
                      onChange={(event) => onChange(urlKey, event.target.value)}
                      placeholder="https://..."
                    />
                  </td>

                  <td className="px-3 py-3">
                    <Textarea
                      value={draftValues[descKey] ?? ''}
                      onChange={(event) => onChange(descKey, event.target.value)}
                      className="min-h-24"
                    />
                  </td>

                  <td className="px-3 py-3">
                    <Textarea
                      value={draftValues[descEsKey] ?? ''}
                      onChange={(event) => onChange(descEsKey, event.target.value)}
                      className="min-h-24"
                    />
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-rose-200 text-rose-700 hover:bg-rose-50"
                        onClick={() => onRemove(partner.index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const EditorPanel = ({
  activeSectionId,
  sections,
  onSaveDraft,
  onPublishSection,
  onPublishAll,
  onRevertSection,
  onUploadImage,
  saveStatus,
  publishStatus,
  revertStatus,
  publishAllStatus,
  mediaUploadStatus,
  error,
  lastActionMessage,
  onClearMessage,
}) => {
  const currentSection = useMemo(
    () => sections?.find((section) => section.id === activeSectionId),
    [sections, activeSectionId]
  )

  const sourceFields = useMemo(() => {
    const raw = { ...(currentSection?.fields || {}) }

    if (currentSection?.id !== 'partners.page') return raw
    if (hasAnyPartnerField(raw)) return raw

    return {
      ...raw,
      ...buildDefaultPartnerFields(),
    }
  }, [currentSection?.id, currentSection?.updatedAt, currentSection?.fields])

  const fieldDefs = useMemo(() => {
    const keys = Object.keys(sourceFields || {})
      .filter((key) => !PARTNER_KEY_RE.test(key))
      .sort((a, b) => a.localeCompare(b))

    return keys.map((key) => ({
      id: key,
      label: humanizeKey(key),
      type: inferFieldType(key, sourceFields[key]),
    }))
  }, [sourceFields])

  const [draftValues, setDraftValues] = useState(sourceFields)
  const [searchValue, setSearchValue] = useState('')
  const [localError, setLocalError] = useState('')
  const [localMessage, setLocalMessage] = useState('')
  const [uploadingFieldId, setUploadingFieldId] = useState('')

  useEffect(() => {
    setDraftValues(sourceFields)
  }, [sourceFields])

  useEffect(() => {
    setLocalError('')
    setLocalMessage('')
    onClearMessage?.()
  }, [activeSectionId, onClearMessage])

  const isDirty = useMemo(
    () => fieldsChanged(draftValues, sourceFields),
    [draftValues, sourceFields]
  )

  const busy =
    saveStatus === 'loading' ||
    publishStatus === 'loading' ||
    revertStatus === 'loading' ||
    publishAllStatus === 'loading'

  const filteredFields = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return fieldDefs
    return fieldDefs.filter((field) => {
      return (
        field.id.toLowerCase().includes(query) ||
        field.label.toLowerCase().includes(query)
      )
    })
  }, [fieldDefs, searchValue])

  const setFieldValue = (fieldId, value) => {
    setDraftValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSaveDraft = async () => {
    if (!currentSection || !isDirty) return
    setLocalError('')
    setLocalMessage('')

    try {
      const updated = await onSaveDraft(currentSection.id, draftValues, currentSection.label)
      if (updated?.fields) setDraftValues(updated.fields)
      setLocalMessage('Draft saved.')
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to save draft.'))
    }
  }

  const handlePublishSection = async () => {
    if (!currentSection) return
    setLocalError('')
    setLocalMessage('')

    try {
      if (isDirty) {
        await onSaveDraft(currentSection.id, draftValues, currentSection.label)
      }
      const published = await onPublishSection(currentSection.id)
      if (published?.fields) setDraftValues(published.fields)
      setLocalMessage('Section published.')
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to publish section.'))
    }
  }

  const handlePublishAll = async () => {
    setLocalError('')
    setLocalMessage('')

    try {
      if (currentSection?.id && isDirty) {
        await onSaveDraft(currentSection.id, draftValues, currentSection.label)
      }
      await onPublishAll()
      setLocalMessage('All sections published.')
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to publish all sections.'))
    }
  }

  const handleRevert = async () => {
    if (!currentSection) return
    setLocalError('')
    setLocalMessage('')

    try {
      const reverted = await onRevertSection(currentSection.id)
      setDraftValues({ ...(reverted?.fields || {}) })
      setLocalMessage('Section reverted to published version.')
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to revert section.'))
    }
  }

  const handleUpload = async (fieldId, file) => {
    setLocalError('')
    setLocalMessage('')
    setUploadingFieldId(fieldId)

    try {
      const uploadResult = await onUploadImage(file)
      if (!uploadResult?.url) {
        throw new Error('Upload completed but no file URL returned')
      }
      setFieldValue(fieldId, uploadResult.url)
      setLocalMessage('Image uploaded. Save draft to keep this change.')
    } catch (err) {
      setLocalError(toMessage(err, 'Image upload failed.'))
    } finally {
      setUploadingFieldId('')
    }
  }

  const handleAddPartner = () => {
    const indexes = getPartnerIndexes(draftValues)
    const nextIndex = indexes.length > 0 ? Math.max(...indexes) + 1 : 0

    setDraftValues((prev) => ({
      ...prev,
      [partnerKey('name', nextIndex)]: '',
      [partnerKey('url', nextIndex)]: '',
      [partnerKey('logo', nextIndex)]: '',
      [partnerKey('description', nextIndex)]: '',
      [partnerKey('description-es', nextIndex)]: '',
    }))
  }

  const handleRemovePartner = (index) => {
    setDraftValues((prev) => {
      const next = { ...prev }
      delete next[partnerKey('name', index)]
      delete next[partnerKey('url', index)]
      delete next[partnerKey('logo', index)]
      delete next[partnerKey('description', index)]
      delete next[partnerKey('description-es', index)]
      return next
    })
  }

  if (!currentSection) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-500">
        No section selected.
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Editing Section
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{currentSection.label}</h2>
            <p className="mt-1 text-sm text-slate-600">
              Route: <span className="font-semibold">{routeFromSectionId(activeSectionId)}</span> · ID:{' '}
              <span className="font-mono">{activeSectionId}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleRevert} disabled={busy}>
              {revertStatus === 'loading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
              Revert
            </Button>
            <Button type="button" onClick={handleSaveDraft} disabled={!isDirty || busy} className="bg-[#03385e] text-white hover:bg-[#03385e]/90">
              {saveStatus === 'loading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </Button>
            <Button type="button" onClick={handlePublishSection} disabled={busy} className="bg-emerald-600 text-white hover:bg-emerald-700">
              {publishStatus === 'loading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publish
            </Button>
            <Button type="button" variant="outline" onClick={handlePublishAll} disabled={busy}>
              {publishAllStatus === 'loading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              Publish All
            </Button>
          </div>
        </div>
      </div>

      {(localError || error) ? (
        <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{localError || error}</span>
        </div>
      ) : null}

      {(localMessage || lastActionMessage) ? (
        <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{localMessage || lastActionMessage}</span>
        </div>
      ) : null}

      {activeSectionId === 'partners.page' ? (
        <>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Partner Directory Editor</p>
                <p className="text-xs text-slate-500">
                  Add, edit, search, upload logos, and remove partners.
                </p>
              </div>
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search partners by name, URL, or description"
                className="h-9 w-full max-w-sm"
              />
            </div>
          </div>

          <PartnerTable
            draftValues={draftValues}
            sourceFields={sourceFields}
            searchValue={searchValue}
            onChange={setFieldValue}
            onUpload={handleUpload}
            onAdd={handleAddPartner}
            onRemove={handleRemovePartner}
            mediaUploadStatus={mediaUploadStatus}
            uploadingFieldId={uploadingFieldId}
          />
        </>
      ) : (
        <>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Fields</p>
                <p className="text-xs text-slate-500">
                  {filteredFields.length} of {fieldDefs.length} visible
                </p>
              </div>
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search field by name or key"
                className="h-9 w-full max-w-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFields.map((field) => {
              const value = draftValues[field.id] ?? ''
              const sourceValue = sourceFields[field.id] ?? ''

              if (field.type === 'image') {
                return (
                  <ImageField
                    key={field.id}
                    field={field}
                    value={value}
                    sourceValue={sourceValue}
                    onChange={setFieldValue}
                    onUpload={handleUpload}
                    isUploading={uploadingFieldId === field.id || mediaUploadStatus === 'loading'}
                  />
                )
              }

              return (
                <TextField
                  key={field.id}
                  field={field}
                  value={value}
                  sourceValue={sourceValue}
                  onChange={setFieldValue}
                />
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

export default EditorPanel
