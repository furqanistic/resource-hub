// File: client/src/components/dashboard/EditorPanel.jsx
import React from 'react';
import {
  ImagePlus,
  UploadCloud,
  X,
  Save,
  RotateCcw,
  Edit3,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SectionHeader = ({ id, label, description }) => (
  <div className="mb-8 border-b border-slate-200 pb-6">
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
      <span>Dashboard</span>
      <ChevronRight className="h-3 w-3" />
      <span className="text-[#03385e]">Content Editor</span>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {label}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>
      <div className="hidden text-[10px] font-mono font-medium text-slate-400 lg:block bg-slate-50 px-2 py-1 rounded border border-slate-100">
        REF: {id}
      </div>
    </div>
  </div>
);

const FieldHeader = ({ label, isEditing }) => (
  <div className="flex items-center justify-between mb-2">
    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
      {label}
    </Label>
    {isEditing && (
      <span className="flex items-center gap-1.5 text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Unsaved Changes
      </span>
    )}
  </div>
);

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
    <div className={cn(
      "group relative rounded-lg border-2 transition-all duration-200",
      isEditing
        ? "border-[#03385e] bg-white p-5 shadow-sm"
        : "border-slate-100 bg-slate-50/30 p-4 hover:border-slate-200 hover:bg-slate-50/50"
    )}>
      <FieldHeader label={label} isEditing={isEditing} />

      <div className="relative">
        {isEditing ? (
          <div className="space-y-4">
            {type === 'textarea' ? (
              <Textarea
                id={id}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="min-h-32 resize-none rounded-md border-slate-200 bg-white p-4 text-sm font-medium leading-relaxed shadow-inner focus-visible:ring-0 focus-visible:border-slate-300"
                autoFocus
              />
            ) : (
              <Input
                id={id}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="h-11 rounded-md border-slate-200 bg-white px-4 text-sm font-medium shadow-inner focus-visible:ring-0 focus-visible:border-slate-300"
                autoFocus
              />
            )}

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleSave}
                className="h-9 gap-2 rounded-md bg-[#03385e] px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#03385e]/90"
              >
                <Save className="h-3.5 w-3.5" />
                Apply Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-9 gap-2 rounded-md border-slate-200 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Discard
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 text-sm font-medium text-slate-900 leading-relaxed py-1">
              {value || <span className="text-slate-400 italic font-normal">No content provided</span>}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 shrink-0 rounded-md text-slate-400 hover:text-[#03385e] hover:bg-[#03385e]/5"
              title="Edit field"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {hint && !isEditing && (
        <p className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {hint}
        </p>
      )}
    </div>
  );
};

const ImageUpload = ({ label, defaultValue, onChange }) => {
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
    <div className="rounded-lg border-2 border-slate-100 bg-slate-50/30 p-5">
      <div className="mb-4">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label || 'Image Asset'}
        </Label>
      </div>

      {preview ? (
        <div className="group relative aspect-video w-full overflow-hidden rounded-md border border-slate-200 bg-white lg:aspect-[3/1]">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="h-9 gap-2 rounded-md font-bold uppercase tracking-wider text-[10px]"
            >
              <X className="h-4 w-4" />
              Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group flex aspect-[3/1] w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-white transition-colors hover:border-[#03385e]/30 hover:bg-slate-50/50"
        >
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-[#03385e] group-hover:text-white">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-bold text-slate-900">
                Click to upload image
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Supports JPG, PNG, SVG (Max 2MB)
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
  const currentSection = React.useMemo(
    () => sections?.find((s) => s.id === activeSectionId),
    [sections, activeSectionId]
  );

  const currentIndex = sections?.findIndex((s) => s.id === activeSectionId) ?? -1;
  const nextSection = sections?.[currentIndex + 1];

  const handleNext = () => {
    if (nextSection) {
      onSelectSection(nextSection.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!['home.hero', 'home.regional', 'about.page', 'resources.page', 'partners.page'].includes(activeSectionId)) {
    return (
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <SectionHeader
          id={activeSectionId}
          label={currentSection?.label || "Unknown Section"}
        />
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/30 p-16 text-center">
          <div className="rounded-full bg-white p-5 shadow-sm border border-slate-100 mb-6">
            <ImagePlus className="h-10 w-10 text-[#03385e]/20" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Editor Placeholder</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            This module is currently read-only or pending implementation. You can manage existing content via the sidebar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader
        id={activeSectionId}
        label={currentSection?.label || "Section Editor"}
        description={
          activeSectionId === 'home.hero' ? "Configure the main visual identity of your landing page." :
            activeSectionId === 'home.regional' ? "Manage regional partnership details and geographic focus." :
              activeSectionId === 'about.page' ? "Edit the organizational narrative and background information." :
                activeSectionId === 'resources.page' ? "Curate the list of essential service providers and tools." :
                  "Manage key strategic partners and their external connections."
        }
      />

      <div className="space-y-12">
        {activeSectionId === 'home.hero' && (
          <div className="grid grid-cols-1 gap-8">
            <EditableField
              id="hero-title"
              label="Primary Heading"
              defaultValue="CHOICE Regional Transportation Hub"
              hint="Maximum impact text for the top of the page"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EditableField
                id="hero-description1"
                label="Introductory Text"
                type="textarea"
                defaultValue="This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region."
              />

              <EditableField
                id="hero-description2"
                label="Supplementary Text"
                type="textarea"
                defaultValue="This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EditableField
                id="hero-cta"
                label="Action Button Label"
                defaultValue="Start My Search"
              />

              <EditableField
                id="hero-link"
                label="Action Destination"
                defaultValue="/directory"
              />
            </div>

            <ImageUpload
              label="Hero Banner Media"
              defaultValue={null}
            />
          </div>
        )}

        {/* Similar patterns for other sections */}
        {activeSectionId === 'home.regional' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EditableField id="regional-title-1" label="Section Header 1" defaultValue="Regional Partners" />
              <EditableField id="regional-title-2" label="Section Header 2" defaultValue="Collaborating for Care" />
            </div>
            <EditableField id="regional-p1" label="First Paragraph" type="textarea" defaultValue="Our regional partners work together to ensure that every community member has access to the transportation they need." />
            <EditableField id="regional-p2" label="Second Paragraph" type="textarea" defaultValue="By coordinating resources and sharing information, we can better serve our region and improve health outcomes." />
            <ImageUpload label="Regional Impact Map" defaultValue={null} />
          </div>
        )}

        {activeSectionId === 'about.page' && (
          <div className="space-y-8">
            <EditableField id="about-title" label="Main Exhibit Title" defaultValue="About Our Hub" />
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4].map(n => (
                <EditableField
                  key={n}
                  id={`about-p${n}`}
                  label={`Narrative Block ${n}`}
                  type="textarea"
                  defaultValue={`The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. (Block ${n})`}
                />
              ))}
            </div>
          </div>
        )}

        {activeSectionId === 'resources.page' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EditableField id="resources-title" label="Module Title" defaultValue="Regional Transportation Resources" />
              <EditableField id="resources-subtitle" label="Tagline" defaultValue="Key tools and partners helping people access care." />
            </div>

            <div className="p-6 rounded-xl border-2 border-slate-100 bg-slate-50/30">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Resource Entry: CWCOG</h3>
                <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border">ID: CWCOG-01</span>
              </div>
              <div className="space-y-8">
                <EditableField id="res-cwcog-title" label="Entry Name" defaultValue="CWCOG Mobility Management" />
                <EditableField id="res-cwcog-desc" label="Entry Description" type="textarea" defaultValue="Mobility management tools and coordination..." />
              </div>
            </div>
          </div>
        )}

        {activeSectionId === 'partners.page' && (
          <div className="space-y-12">
            {[
              { name: 'RiverCities Transit', url: 'https://www.rctransit.org' },
              { name: 'Washington State Health Care Authority (HCA)', url: 'https://www.hca.wa.gov' }
            ].map((partner, idx) => (
              <div key={idx} className="p-6 rounded-xl border-2 border-slate-100 bg-slate-50/30">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Partner Entry: {partner.name}</h3>
                </div>
                <div className="space-y-6">
                  <EditableField id={`partner-name-${idx}`} label="Partner Name" defaultValue={partner.name} />
                  <EditableField id={`partner-url-${idx}`} label="Website URL" defaultValue={partner.url} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-12 border-t border-slate-200">
          <div className="text-xs text-slate-400 font-medium italic">
            Note: Changes are staged locally until global publish.
          </div>
          {nextSection && (
            <Button
              type="button"
              variant="outline"
              onClick={handleNext}
              className="h-10 gap-2 rounded-md border-slate-200 px-6 text-xs font-bold uppercase tracking-wider text-[#03385e] hover:bg-slate-50 transition-all active:scale-95"
            >
              Next Section
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditorPanel;
