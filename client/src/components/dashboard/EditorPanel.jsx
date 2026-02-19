// File: client/src/components/dashboard/EditorPanel.jsx
import React from 'react';
import { ImagePlus, UploadCloud, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const FieldGroup = ({ id, label, children, hint }) => {
  return (
    <div className="group space-y-2">
      <Label
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-[#03385e]"
      >
        {label}
      </Label>
      <div className="relative">{children}</div>
      {hint ? <p className="text-xs text-slate-400/80">{hint}</p> : null}
    </div>
  );
};

const EditableField = ({ id, label, defaultValue, type = 'input', hint }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [tempValue, setTempValue] = React.useState(defaultValue);

  const handleSave = () => {
    setValue(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="group space-y-2 rounded-sm border border-transparent p-1 transition-all hover:bg-slate-50/50">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className="text-[11px] font-bold uppercase tracking-wider text-slate-400"
        >
          {label}
        </Label>
        {!isEditing && (
          <Button
            type="button"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 rounded-sm bg-[#03385e] px-3 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-[#03385e]/90 active:scale-95"
          >
            Edit
          </Button>
        )}
      </div>

      <div className="relative">
        {isEditing ? (
          <div className="space-y-3">
            {type === 'textarea' ? (
              <Textarea
                id={id}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="min-h-24 rounded-sm border-slate-200 bg-white p-4 text-base font-medium leading-relaxed transition-all focus:border-[#03385e] focus:ring-4 focus:ring-[#03385e]/5"
                autoFocus
              />
            ) : (
              <Input
                id={id}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="h-12 rounded-sm border-slate-200 bg-white px-4 text-base font-medium transition-all focus:border-[#03385e] focus:ring-4 focus:ring-[#03385e]/5"
                autoFocus
              />
            )}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8 rounded-sm bg-[#03385e] px-4 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#03385e]/90"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 rounded-sm px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-sm border border-transparent bg-transparent py-2 text-base font-medium text-slate-900">
            {value}
          </div>
        )}
      </div>
      {hint ? <p className="text-xs text-slate-400/80">{hint}</p> : null}
    </div>
  );
};

const ImageUpload = ({ defaultValue, onChange }) => {
  const [preview, setPreview] = React.useState(defaultValue);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange?.(url);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="group relative aspect-square w-full overflow-hidden rounded-sm border border-slate-200 bg-slate-50 lg:aspect-4/1">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="h-8 rounded-sm px-3 text-[10px] font-semibold"
            >
              <X className="mr-2 h-3.5 w-3.5" />
              Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group flex aspect-3/1 w-full cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-[#03385e]/10 bg-white transition-all hover:border-[#03385e]/30 hover:bg-[#b1ccdf]/5 lg:aspect-4/1"
        >
          <div className="flex flex-row items-center gap-4 px-6 py-4 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#b1ccdf]/40 text-[#03385e] transition-colors group-hover:bg-[#03385e] group-hover:text-white">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Click to upload banner image
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

const EditorPanel = ({ activeSectionId, sections, onSelectSection }) => {
  const currentIndex = React.useMemo(
    () => sections?.findIndex((s) => s.id === activeSectionId) ?? -1,
    [sections, activeSectionId]
  );
  const nextSection = sections?.[currentIndex + 1];

  const handleNext = () => {
    if (nextSection) {
      onSelectSection(nextSection.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (activeSectionId !== 'home.hero') {
    return (
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="mb-10 border-b border-slate-200 pb-6 uppercase tracking-widest text-slate-400">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {sections?.find(s => s.id === activeSectionId)?.label}
          </h2>
          <p className="mt-1 text-sm lowercase tracking-normal">
            Phase 2 implementation in progress...
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-20 text-center">
          <div className="rounded-sm bg-[#b1ccdf]/40 p-4 mb-4">
            <ImagePlus className="h-8 w-8 text-[#03385e]" />
          </div>
          <p className="text-base font-medium text-slate-900">Section Editor Coming Soon</p>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            This editor is currently under development. Please check back later or start editing the Home section.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-10 flex items-end justify-between border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Home Hero Editor
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Customize the main greeting and banner of your landing page.
          </p>
        </div>
        <div className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-400 lg:block">
          Section ID: {activeSectionId}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10">
        <div className="space-y-10">
          <EditableField
            id="hero-title"
            label="Hero Title"
            defaultValue="CHOICE Regional Transportation Hub"
          />

          <EditableField
            id="hero-description1"
            label="Description Line 1"
            type="textarea"
            defaultValue="This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region."
          />

          <EditableField
            id="hero-description2"
            label="Description Line 2"
            type="textarea"
            defaultValue="This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services."
          />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <EditableField
              id="hero-cta"
              label="CTA Label"
              defaultValue="Start My Search"
            />

            <EditableField
              id="hero-link"
              label="CTA Link"
              defaultValue="/directory"
            />
          </div>

          <FieldGroup id="hero-image" label="Hero Banner Image">
            <ImageUpload defaultValue={null} />
          </FieldGroup>

          <EditableField
            id="hero-partner-label"
            label="Partners Label"
            defaultValue="Supporting Partners"
          />
        </div>
      </div>

      <div className="mt-16 flex items-center justify-end border-t border-slate-200 pt-8 pb-12">
        {nextSection && (
          <Button
            type="button"
            onClick={handleNext}
            className="group h-10 rounded-sm bg-[#b1ccdf] px-6 text-xs font-bold text-[#03385e] transition-all hover:bg-[#b1ccdf]/80"
          >
            Edit Next Component: {nextSection.label}
          </Button>
        )}
      </div>
    </section>
  );
};

export default EditorPanel;
