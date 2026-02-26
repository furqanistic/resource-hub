import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  ImagePlus,
  LoaderCircle,
  RefreshCcw,
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

const toMessage = (error, fallback) => {
  if (!error) return fallback
  if (typeof error === 'string') return error
  if (typeof error?.message === 'string') return error.message
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
    normalizedKey.includes('paragraph') ||
    normalizedKey.includes('content') ||
    normalizedKey.includes('text') ||
    /(^|[-_])p\d+($|[-_])/.test(normalizedKey) ||
    String(value || '').length > 120
  ) {
    return 'textarea'
  }

  return 'text'
}

const buildFieldDefs = (fields) =>
  Object.keys(fields || {}).map((key) => ({
    id: key,
    label: humanizeKey(key),
    type: inferFieldType(key, fields[key]),
  }))

const fieldsChanged = (draftValues, sourceValues) => {
  const keys = new Set([
    ...Object.keys(sourceValues || {}),
    ...Object.keys(draftValues || {}),
  ])

  for (const key of keys) {
    if ((draftValues?.[key] ?? '') !== (sourceValues?.[key] ?? '')) {
      return true
    }
  }

  return false
}

const SectionHeader = ({ id, label, description, isDraft, publishedAt }) => (
  <div className="mb-8 border-b border-slate-200 pb-6">
    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
      <span>Dashboard</span>
      <ChevronRight className="h-3 w-3" />
      <span className="text-[#03385e]">Content Editor</span>
    </div>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{label}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            'rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider',
            isDraft
              ? 'border-amber-200 bg-amber-50 text-amber-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          )}
        >
          {isDraft ? 'Draft' : 'Published'}
        </span>
        <span className="hidden rounded border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-400 lg:block">
          {publishedAt
            ? `Published: ${new Date(publishedAt).toLocaleString()}`
            : 'Never published'}
        </span>
        <span className="hidden rounded border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-400 lg:block">
          REF: {id}
        </span>
      </div>
    </div>
  </div>
)

const FieldHeader = ({ label, dirty }) => (
  <div className="mb-2 flex items-center justify-between">
    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
      {label}
    </Label>
    {dirty ? (
      <span className="flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Local change
      </span>
    ) : null}
  </div>
)

const TextField = ({ field, value, sourceValue, onChange }) => {
  const dirty = (value ?? '') !== (sourceValue ?? '')

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-4 transition-all duration-200',
        dirty
          ? 'border-[#03385e] bg-white shadow-sm'
          : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
      )}
    >
      <FieldHeader label={field.label} dirty={dirty} />
      {field.type === 'textarea' ? (
        <Textarea
          value={value ?? ''}
          onChange={(event) => onChange(field.id, event.target.value)}
          className="min-h-28 resize-none rounded-md border-slate-200 bg-white p-4 text-sm leading-relaxed shadow-inner focus-visible:ring-0"
        />
      ) : (
        <Input
          value={value ?? ''}
          onChange={(event) => onChange(field.id, event.target.value)}
          className="h-11 rounded-md border-slate-200 bg-white px-4 text-sm shadow-inner focus-visible:ring-0"
        />
      )}
    </div>
  )
}

const ImageField = ({ field, value, sourceValue, onChange, onUpload, isUploading }) => {
  const fileInputRef = React.useRef(null)
  const dirty = (value ?? '') !== (sourceValue ?? '')
  const preview = resolveAssetUrl(value)

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    await onUpload(field.id, file)
    event.target.value = ''
  }

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-5 transition-all duration-200',
        dirty
          ? 'border-[#03385e] bg-white shadow-sm'
          : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
      )}
    >
      <FieldHeader label={field.label || 'Image Asset'} dirty={dirty} />

      {preview ? (
        <div className="group relative aspect-video w-full overflow-hidden rounded-md border border-slate-200 bg-white lg:aspect-[3/1]">
          <img
            src={preview}
            alt={field.label || 'Uploaded asset'}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onChange(field.id, '')}
                className="h-9 gap-2 rounded-md text-[10px] font-bold uppercase tracking-wider"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 gap-2 rounded-md bg-[#03385e] px-4 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#03385e]/90"
              >
                <UploadCloud className="h-4 w-4" />
                Replace
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group flex aspect-3/1 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-[#03385e]/50 bg-white transition-colors hover:border-[#03385e] hover:bg-slate-50/50"
        >
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-[#03385e] group-hover:text-white">
              <ImagePlus className="h-6 w-6" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-bold text-slate-900">Click to upload image</p>
              <p className="mt-1 text-xs text-slate-400">
                Supports JPG, PNG, GIF, WEBP, SVG (Max 2MB)
              </p>
            </div>
          </div>
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {isUploading ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#03385e]" />
          Uploading image...
        </div>
      ) : null}
    </div>
  )
}

const blankEntry = {
  name: '',
  description: '',
  url: '',
  logoUrl: '',
  isPublished: true,
}

const ResourceEntriesEditor = ({
  type,
  title,
  entries,
  fetchStatus,
  mutationStatus,
  error,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
}) => {
  const [newEntry, setNewEntry] = useState(blankEntry)
  const [draftById, setDraftById] = useState({})
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    const nextDraftMap = {}
    for (const entry of entries) {
      nextDraftMap[entry._id] = {
        name: entry.name || '',
        description: entry.description || '',
        url: entry.url || '',
        logoUrl: entry.logoUrl || '',
        isPublished: Boolean(entry.isPublished),
      }
    }
    setDraftById(nextDraftMap)
  }, [entries])

  const setDraft = (id, key, value) => {
    setDraftById((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || blankEntry),
        [key]: value,
      },
    }))
  }

  const handleCreate = async () => {
    setLocalError('')
    try {
      await onCreate(type, newEntry)
      setNewEntry(blankEntry)
    } catch (err) {
      setLocalError(toMessage(err, `Failed to add ${type}`))
    }
  }

  const handleUpdate = async (entryId) => {
    setLocalError('')
    try {
      await onUpdate(entryId, draftById[entryId])
    } catch (err) {
      setLocalError(toMessage(err, `Failed to update ${type}`))
    }
  }

  const handleDelete = async (entryId) => {
    setLocalError('')
    try {
      await onDelete(entryId, type)
    } catch (err) {
      setLocalError(toMessage(err, `Failed to delete ${type}`))
    }
  }

  const handleMove = async (entryId, direction) => {
    const list = [...entries]
    const currentIndex = list.findIndex((entry) => entry._id === entryId)
    const targetIndex = currentIndex + direction

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= list.length) {
      return
    }

    const swapped = [...list]
    ;[swapped[currentIndex], swapped[targetIndex]] = [
      swapped[targetIndex],
      swapped[currentIndex],
    ]

    const items = swapped.map((entry, index) => ({ id: entry._id, order: index }))

    setLocalError('')
    try {
      await onReorder(type, items)
    } catch (err) {
      setLocalError(toMessage(err, `Failed to reorder ${type} entries`))
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {title}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRefresh(type)}
          className="h-8 gap-2 rounded-md text-[10px] font-bold uppercase tracking-wider"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refresh List
        </Button>
      </div>

      {(localError || error) ? (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {localError || error}
        </div>
      ) : null}

      <div className="mb-5 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <Input
          value={newEntry.name}
          onChange={(event) =>
            setNewEntry((prev) => ({ ...prev, name: event.target.value }))
          }
          placeholder="Name"
          className="h-10 bg-white"
        />
        <Input
          value={newEntry.url}
          onChange={(event) =>
            setNewEntry((prev) => ({ ...prev, url: event.target.value }))
          }
          placeholder="Website URL"
          className="h-10 bg-white"
        />
        <Textarea
          value={newEntry.description}
          onChange={(event) =>
            setNewEntry((prev) => ({ ...prev, description: event.target.value }))
          }
          placeholder="Description"
          className="min-h-24 bg-white md:col-span-2"
        />
        <Input
          value={newEntry.logoUrl}
          onChange={(event) =>
            setNewEntry((prev) => ({ ...prev, logoUrl: event.target.value }))
          }
          placeholder="Logo/Image URL"
          className="h-10 bg-white"
        />
        <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={newEntry.isPublished}
            onChange={(event) =>
              setNewEntry((prev) => ({ ...prev, isPublished: event.target.checked }))
            }
          />
          Published
        </label>

        <Button
          type="button"
          onClick={handleCreate}
          disabled={mutationStatus === 'loading' || !newEntry.name.trim()}
          className="h-10 rounded-md bg-[#03385e] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#022e4c] md:col-span-2"
        >
          Add {type}
        </Button>
      </div>

      {fetchStatus === 'loading' ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Loading {type} entries...
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-slate-500">No {type} entries found.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => {
            const draft = draftById[entry._id] || blankEntry

            return (
              <div key={entry._id} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {type} #{index + 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleMove(entry._id, -1)}
                      disabled={index === 0 || mutationStatus === 'loading'}
                      className="h-8 w-8"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleMove(entry._id, 1)}
                      disabled={index === entries.length - 1 || mutationStatus === 'loading'}
                      className="h-8 w-8"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input
                    value={draft.name}
                    onChange={(event) => setDraft(entry._id, 'name', event.target.value)}
                    placeholder="Name"
                    className="h-10"
                  />
                  <Input
                    value={draft.url}
                    onChange={(event) => setDraft(entry._id, 'url', event.target.value)}
                    placeholder="Website URL"
                    className="h-10"
                  />
                  <Textarea
                    value={draft.description}
                    onChange={(event) =>
                      setDraft(entry._id, 'description', event.target.value)
                    }
                    placeholder="Description"
                    className="min-h-24 md:col-span-2"
                  />
                  <Input
                    value={draft.logoUrl}
                    onChange={(event) =>
                      setDraft(entry._id, 'logoUrl', event.target.value)
                    }
                    placeholder="Logo/Image URL"
                    className="h-10"
                  />
                  <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={draft.isPublished}
                      onChange={(event) =>
                        setDraft(entry._id, 'isPublished', event.target.checked)
                      }
                    />
                    Published
                  </label>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleUpdate(entry._id)}
                    disabled={mutationStatus === 'loading'}
                    className="h-8 gap-1 rounded-md bg-[#03385e] px-3 text-[10px] font-bold uppercase tracking-wider text-white"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(entry._id)}
                    disabled={mutationStatus === 'loading'}
                    className="h-8 gap-1 rounded-md px-3 text-[10px] font-bold uppercase tracking-wider"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const EditorPanel = ({
  activeSectionId,
  sections,
  onSelectSection,
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
  partnerEntries,
  resourceFetchStatusByType,
  resourceMutationStatus,
  resourceError,
  onFetchEntriesByType,
  onCreateEntry,
  onUpdateEntry,
  onDeleteEntry,
  onReorderEntries,
}) => {
  const currentSection = useMemo(
    () => sections?.find((section) => section.id === activeSectionId),
    [sections, activeSectionId]
  )

  const sourceFields = useMemo(
    () => ({ ...(currentSection?.fields || {}) }),
    [currentSection?.id, currentSection?.updatedAt, currentSection?.fields]
  )

  const fieldDefs = useMemo(() => buildFieldDefs(sourceFields), [sourceFields])

  const [draftValues, setDraftValues] = useState(sourceFields)
  const [localError, setLocalError] = useState('')
  const [localMessage, setLocalMessage] = useState('')
  const [uploadingFieldId, setUploadingFieldId] = useState('')

  useEffect(() => {
    setDraftValues(sourceFields)
    setLocalError('')
  }, [activeSectionId, sourceFields])

  useEffect(() => {
    if (activeSectionId === 'partners.page' && resourceFetchStatusByType.partner === 'idle') {
      onFetchEntriesByType('partner').catch(() => {})
    }
  }, [
    activeSectionId,
    onFetchEntriesByType,
    resourceFetchStatusByType.partner,
  ])

  const currentIndex = sections?.findIndex((section) => section.id === activeSectionId) ?? -1
  const nextSection = sections?.[currentIndex + 1]

  const isDirty = useMemo(
    () => fieldsChanged(draftValues, sourceFields),
    [draftValues, sourceFields]
  )

  const busy =
    saveStatus === 'loading' ||
    publishStatus === 'loading' ||
    revertStatus === 'loading' ||
    publishAllStatus === 'loading'

  const setFieldValue = (fieldId, value) => {
    setDraftValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSaveDraft = async () => {
    if (!currentSection || !isDirty) return

    setLocalError('')
    setLocalMessage('')

    try {
      const updatedSection = await onSaveDraft(
        currentSection.id,
        draftValues,
        currentSection.label
      )
      if (updatedSection?.fields) {
        setDraftValues(updatedSection.fields)
      }
      setLocalMessage('Draft saved successfully.')
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
        const updatedSection = await onSaveDraft(
          currentSection.id,
          draftValues,
          currentSection.label
        )
        if (updatedSection?.fields) {
          setDraftValues(updatedSection.fields)
        }
      }

      const publishedSection = await onPublishSection(currentSection.id)
      if (publishedSection?.fields) {
        setDraftValues(publishedSection.fields)
      }
      setLocalMessage('Section published successfully.')
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to publish section.'))
    }
  }

  const handlePublishAll = async () => {
    setLocalError('')
    setLocalMessage('')

    try {
      if (currentSection?.id && isDirty) {
        const updatedSection = await onSaveDraft(
          currentSection.id,
          draftValues,
          currentSection.label
        )
        if (updatedSection?.fields) {
          setDraftValues(updatedSection.fields)
        }
      }

      await onPublishAll()
      setLocalMessage('All pending sections were published.')
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to publish all sections.'))
    }
  }

  const handleRevert = async () => {
    if (!currentSection) return

    setLocalError('')
    setLocalMessage('')

    try {
      const revertedSection = await onRevertSection(currentSection.id)
      setDraftValues({ ...(revertedSection?.fields || {}) })
      setLocalMessage('Section reverted to published snapshot.')
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
      const uploadedUrl = uploadResult?.url
      if (!uploadedUrl) {
        throw new Error('Upload succeeded but no URL was returned')
      }

      setFieldValue(fieldId, uploadedUrl)
      setLocalMessage('Image uploaded. Save draft to persist this change.')
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to upload image.'))
    } finally {
      setUploadingFieldId('')
    }
  }

  const handleNext = () => {
    if (!nextSection) return

    onSelectSection(nextSection.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!currentSection) {
    return (
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-slate-200 bg-white">
          <p className="text-sm text-slate-500">No section available from backend.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader
        id={activeSectionId}
        label={currentSection.label || activeSectionId}
        description={currentSection.description || ''}
        isDraft={Boolean(currentSection.isDraft || isDirty)}
        publishedAt={currentSection.publishedAt || null}
      />

      {(localError || error || resourceError) ? (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{localError || error || resourceError}</span>
        </div>
      ) : null}

      {(localMessage || lastActionMessage) ? (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{localMessage || lastActionMessage}</span>
        </div>
      ) : null}

      {fieldDefs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {fieldDefs.map((field) => {
            const value = draftValues[field.id] ?? ''
            const sourceValue = sourceFields[field.id] ?? ''

            return (
              <div
                key={field.id}
                className={cn(
                  field.type === 'textarea' || field.type === 'image'
                    ? 'md:col-span-2'
                    : ''
                )}
              >
                {field.type === 'image' ? (
                  <ImageField
                    field={field}
                    value={value}
                    sourceValue={sourceValue}
                    onChange={setFieldValue}
                    onUpload={handleUpload}
                    isUploading={
                      uploadingFieldId === field.id || mediaUploadStatus === 'loading'
                    }
                  />
                ) : (
                  <TextField
                    field={field}
                    value={value}
                    sourceValue={sourceValue}
                    onChange={setFieldValue}
                  />
                )}
              </div>
            )
          })}
        </div>
      ) : null}

      {activeSectionId === 'partners.page' ? (
        <ResourceEntriesEditor
          type="partner"
          title="Partner Entries"
          entries={partnerEntries}
          fetchStatus={resourceFetchStatusByType.partner}
          mutationStatus={resourceMutationStatus}
          error={resourceError}
          onRefresh={onFetchEntriesByType}
          onCreate={onCreateEntry}
          onUpdate={onUpdateEntry}
          onDelete={onDeleteEntry}
          onReorder={onReorderEntries}
        />
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-8">
        <Button
          type="button"
          onClick={handleSaveDraft}
          disabled={!isDirty || busy}
          className="h-10 gap-2 rounded-md bg-[#03385e] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#022e4c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saveStatus === 'loading' ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Draft
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleRevert}
          disabled={busy}
          className="h-10 gap-2 rounded-md border-slate-200 px-5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {revertStatus === 'loading' ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          Revert
        </Button>

        <Button
          type="button"
          onClick={handlePublishSection}
          disabled={busy}
          className="h-10 gap-2 rounded-md bg-emerald-600 px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {publishStatus === 'loading' ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Publish Section
        </Button>

        <Button
          type="button"
          onClick={handlePublishAll}
          disabled={busy}
          className="h-10 gap-2 rounded-md bg-slate-900 px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {publishAllStatus === 'loading' ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          Publish All
        </Button>

        <div className="ml-auto flex items-center gap-3">
          {nextSection ? (
            <Button
              type="button"
              onClick={handleNext}
              className="h-10 gap-2 rounded-md border border-slate-200 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
            >
              Next Section
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default EditorPanel
