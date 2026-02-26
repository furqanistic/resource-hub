// File: client/src/components/dashboard/EditorPanel.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
  Save,
  Send,
  UploadCloud,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  CMS_SECTION_DEFINITIONS,
  getDefaultFieldsForSection,
} from '@/constants/cmsSections';
import { resolveAssetUrl } from '@/lib/api/cmsApi';

const toMessage = (error, fallback) => {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (typeof error?.message === 'string') return error.message;
  return fallback;
};

const fieldsChanged = (fieldDefs, draftValues, sourceValues) =>
  fieldDefs.some((field) => {
    const next = draftValues?.[field.id] ?? '';
    const prev = sourceValues?.[field.id] ?? '';
    return next !== prev;
  });

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
          {publishedAt ? `Published: ${new Date(publishedAt).toLocaleString()}` : 'Never published'}
        </span>
        <span className="hidden rounded border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-400 lg:block">
          REF: {id}
        </span>
      </div>
    </div>
  </div>
);

const FieldHeader = ({ label, dirty }) => (
  <div className="mb-2 flex items-center justify-between">
    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</Label>
    {dirty ? (
      <span className="flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Local change
      </span>
    ) : null}
  </div>
);

const TextField = ({ field, value, sourceValue, onChange }) => {
  const dirty = (value ?? '') !== (sourceValue ?? '');

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
  );
};

const ImageField = ({ field, value, sourceValue, onChange, onUpload, isUploading }) => {
  const fileInputRef = React.useRef(null);
  const dirty = (value ?? '') !== (sourceValue ?? '');
  const preview = resolveAssetUrl(value);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await onUpload(field.id, file);
    event.target.value = '';
  };

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
          <img src={preview} alt={field.label || 'Uploaded asset'} className="h-full w-full object-cover" />
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
              <p className="mt-1 text-xs text-slate-400">Supports JPG, PNG, GIF, WEBP, SVG (Max 2MB)</p>
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
  );
};

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
}) => {
  const currentSection = useMemo(
    () => sections?.find((section) => section.id === activeSectionId),
    [sections, activeSectionId]
  );

  const sectionDefinition = CMS_SECTION_DEFINITIONS[activeSectionId] || null;
  const fieldDefs = sectionDefinition?.fields || [];
  const sourceFields = useMemo(
    () => currentSection?.fields || getDefaultFieldsForSection(activeSectionId),
    [activeSectionId, currentSection?.id, currentSection?.updatedAt]
  );

  const [draftValues, setDraftValues] = useState(sourceFields);
  const [localError, setLocalError] = useState('');
  const [localMessage, setLocalMessage] = useState('');
  const [uploadingFieldId, setUploadingFieldId] = useState('');

  useEffect(() => {
    setDraftValues(sourceFields);
    setLocalError('');
  }, [activeSectionId, currentSection?.updatedAt, sourceFields]);

  const currentIndex = sections?.findIndex((s) => s.id === activeSectionId) ?? -1;
  const nextSection = sections?.[currentIndex + 1];

  const isDirty = useMemo(
    () => fieldsChanged(fieldDefs, draftValues, sourceFields),
    [fieldDefs, draftValues, sourceFields]
  );

  const busy =
    saveStatus === 'loading' ||
    publishStatus === 'loading' ||
    revertStatus === 'loading' ||
    publishAllStatus === 'loading';

  const setFieldValue = (fieldId, value) => {
    setDraftValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSaveDraft = async () => {
    if (!currentSection || !isDirty) return;
    setLocalError('');
    setLocalMessage('');

    try {
      const updatedSection = await onSaveDraft(currentSection.id, draftValues, currentSection.label);
      if (updatedSection?.fields) {
        setDraftValues(updatedSection.fields);
      }
      setLocalMessage('Draft saved successfully.');
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to save draft.'));
    }
  };

  const handlePublishSection = async () => {
    if (!currentSection) return;
    setLocalError('');
    setLocalMessage('');

    try {
      if (isDirty) {
        const updatedSection = await onSaveDraft(currentSection.id, draftValues, currentSection.label);
        if (updatedSection?.fields) {
          setDraftValues(updatedSection.fields);
        }
      }

      const publishedSection = await onPublishSection(currentSection.id);
      if (publishedSection?.fields) {
        setDraftValues(publishedSection.fields);
      }
      setLocalMessage('Section published successfully.');
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to publish section.'));
    }
  };

  const handlePublishAll = async () => {
    setLocalError('');
    setLocalMessage('');

    try {
      if (currentSection?.id && isDirty) {
        const updatedSection = await onSaveDraft(currentSection.id, draftValues, currentSection.label);
        if (updatedSection?.fields) {
          setDraftValues(updatedSection.fields);
        }
      }

      await onPublishAll();
      setLocalMessage('All pending sections were published.');
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to publish all sections.'));
    }
  };

  const handleRevert = async () => {
    if (!currentSection) return;
    setLocalError('');
    setLocalMessage('');

    try {
      const revertedSection = await onRevertSection(currentSection.id);
      setDraftValues(revertedSection?.fields || getDefaultFieldsForSection(currentSection.id));
      setLocalMessage('Section reverted to published snapshot.');
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to revert section.'));
    }
  };

  const handleUpload = async (fieldId, file) => {
    setLocalError('');
    setLocalMessage('');
    setUploadingFieldId(fieldId);

    try {
      const uploadResult = await onUploadImage(file);
      const uploadedUrl = uploadResult?.url;
      if (!uploadedUrl) {
        throw new Error('Upload succeeded but no URL was returned');
      }

      setFieldValue(fieldId, uploadedUrl);
      setLocalMessage('Image uploaded. Save draft to persist this change.');
    } catch (err) {
      setLocalError(toMessage(err, 'Failed to upload image.'));
    } finally {
      setUploadingFieldId('');
    }
  };

  const handleNext = () => {
    if (!nextSection) return;

    onSelectSection(nextSection.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!sectionDefinition) {
    return (
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <SectionHeader
          id={activeSectionId}
          label={currentSection?.label || 'Unknown Section'}
          description="This module is currently read-only or pending implementation."
          isDraft={false}
          publishedAt={null}
        />
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/30 p-16 text-center">
          <div className="mb-6 rounded-full border border-slate-100 bg-white p-5 shadow-sm">
            <ImagePlus className="h-10 w-10 text-[#03385e]/20" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Editor Placeholder</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            This section is not configured in the frontend schema yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader
        id={activeSectionId}
        label={currentSection?.label || sectionDefinition.label}
        description={currentSection?.description || sectionDefinition.description}
        isDraft={Boolean(currentSection?.isDraft || isDirty)}
        publishedAt={currentSection?.publishedAt || null}
      />

      {(localError || error) ? (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{localError || error}</span>
        </div>
      ) : null}

      {(localMessage || lastActionMessage) ? (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{localMessage || lastActionMessage}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fieldDefs.map((field) => {
          const value = draftValues[field.id] ?? '';
          const sourceValue = sourceFields[field.id] ?? '';

          return (
            <div
              key={field.id}
              className={cn(field.type === 'textarea' || field.type === 'image' ? 'md:col-span-2' : '')}
            >
              {field.type === 'image' ? (
                <ImageField
                  field={field}
                  value={value}
                  sourceValue={sourceValue}
                  onChange={setFieldValue}
                  onUpload={handleUpload}
                  isUploading={uploadingFieldId === field.id || mediaUploadStatus === 'loading'}
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
          );
        })}
      </div>

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
          <span className="hidden text-xs font-medium italic text-slate-400 md:block">
            Changes are staged locally until global publish.
          </span>
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
  );
};

export default EditorPanel;
