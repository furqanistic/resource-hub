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
        className="text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-slate-900"
      >
        {label}
      </Label>
      <div className="relative">{children}</div>
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
        <div className="group relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 lg:aspect-4/1">
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
              className="h-8 rounded-lg px-3 text-[10px] font-semibold shadow-xl"
            >
              <X className="mr-2 h-3.5 w-3.5" />
              Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group flex aspect-3/1 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white transition-all hover:border-slate-900/20 hover:bg-slate-50/50 lg:aspect-4/1"
        >
          <div className="flex flex-row items-center gap-4 px-6 py-4 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-900 group-hover:text-white">
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
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <ImagePlus className="h-8 w-8 text-slate-400" />
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

      <div className="grid grid-cols-1 gap-x-12 gap-y-8">
        <div className="space-y-8">
          <FieldGroup id="hero-title" label="Hero Title">
            <Input
              id="hero-title"
              defaultValue="CHOICE Regional Transportation Hub"
              className="h-12 border-slate-200 bg-white px-4 text-base font-medium transition-all focus:border-[#03385e] focus:ring-4 focus:ring-[#03385e]/5"
            />
          </FieldGroup>

          <FieldGroup id="hero-description1" label="Description Line 1">
            <Textarea
              id="hero-description1"
              defaultValue="This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region."
              className="min-h-24 border-slate-200 bg-white p-4 text-base font-medium leading-relaxed transition-all focus:border-[#03385e] focus:ring-4 focus:ring-[#03385e]/5"
            />
          </FieldGroup>

          <FieldGroup id="hero-description2" label="Description Line 2">
            <Textarea
              id="hero-description2"
              defaultValue="This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services."
              className="min-h-24 border-slate-200 bg-white p-4 text-base font-medium leading-relaxed transition-all focus:border-[#03385e] focus:ring-4 focus:ring-[#03385e]/5"
            />
          </FieldGroup>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FieldGroup id="hero-cta" label="CTA Label">
              <Input
                id="hero-cta"
                defaultValue="Start My Search"
                className="h-11 border-slate-200 bg-white px-4 text-sm font-medium transition-all focus:border-[#03385e] focus:ring-4 focus:ring-[#03385e]/5"
              />
            </FieldGroup>

            <FieldGroup id="hero-link" label="CTA Link">
              <Input
                id="hero-link"
                defaultValue="/directory"
                className="h-11 border-slate-200 bg-white px-4 text-sm font-medium transition-all focus:border-[#03385e] focus:ring-4 focus:ring-[#03385e]/5 font-mono"
              />
            </FieldGroup>
          </div>

          <FieldGroup id="hero-image" label="Hero Banner Image">
            <ImageUpload defaultValue={null} />
          </FieldGroup>

          <FieldGroup id="hero-partner-label" label="Partners Label">
            <Input
              id="hero-partner-label"
              defaultValue="Supporting Partners"
              className="h-11 border-slate-200 bg-white px-4 text-sm font-medium transition-all focus:border-[#03385e] focus:ring-4 focus:ring-[#03385e]/5"
            />
          </FieldGroup>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-16 flex items-center justify-between border-t border-slate-200 pt-8 pb-12">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg border-[#03385e]/20 px-6 text-xs font-semibold text-[#03385e] hover:bg-[#03385e]/5"
          >
            Reset Section
          </Button>
          <Button
            type="button"
            className="h-10 rounded-lg bg-[#03385e] px-8 text-xs font-semibold text-white hover:bg-[#03385e]/90 shadow-md transition-all active:scale-95"
          >
            Save Changes
          </Button>
        </div>

        {nextSection && (
          <Button
            type="button"
            onClick={handleNext}
            className="group h-10 rounded-lg border border-[#03385e] px-6 text-xs font-bold text-[#03385e] transition-all hover:bg-[#03385e] hover:text-white"
          >
            Edit Next: {nextSection.label}
          </Button>
        )}
      </div>
    </section>
  );
};

export default EditorPanel;
