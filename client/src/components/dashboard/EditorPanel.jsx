import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const FieldGroup = ({ id, label, children, hint }) => {
  return (
    <div className="group space-y-2">
      <Label
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-slate-900"
      >
        {label}
      </Label>
      <div className="relative">
        {children}
      </div>
      {hint ? <p className="text-xs text-slate-400/80">{hint}</p> : null}
    </div>
  );
};

const EditorPanel = ({ activeSectionId }) => {
  if (activeSectionId !== 'home.hero') {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:h-full lg:overflow-y-auto">
        <p className="text-sm font-semibold text-slate-900">Section Editor</p>
        <p className="mt-2 text-sm text-slate-600">
          This section is planned for next phase. Hero editor is live in Phase 1.
        </p>
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
              className="h-12 border-slate-200 bg-white px-4 text-base font-medium transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
            />
          </FieldGroup>

          <FieldGroup id="hero-description1" label="Description Line 1">
            <Textarea
              id="hero-description1"
              defaultValue="This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region."
              className="min-h-24 border-slate-200 bg-white p-4 text-base font-medium leading-relaxed transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
            />
          </FieldGroup>

          <FieldGroup id="hero-description2" label="Description Line 2">
            <Textarea
              id="hero-description2"
              defaultValue="This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services."
              className="min-h-24 border-slate-200 bg-white p-4 text-base font-medium leading-relaxed transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
            />
          </FieldGroup>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FieldGroup id="hero-cta" label="CTA Label">
              <Input
                id="hero-cta"
                defaultValue="Start My Search"
                className="h-11 border-slate-200 bg-white px-4 text-sm font-medium transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
              />
            </FieldGroup>

            <FieldGroup id="hero-link" label="CTA Link">
              <Input
                id="hero-link"
                defaultValue="/directory"
                className="h-11 border-slate-200 bg-white px-4 text-sm font-medium transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 font-mono"
              />
            </FieldGroup>
          </div>

          <FieldGroup
            id="hero-image"
            label="Image URL"
            hint="Use relative path like /logo.avif or any public image URL."
          >
            <Input
              id="hero-image"
              defaultValue="/logo.avif"
              className="h-11 border-slate-200 bg-white px-4 text-sm font-medium transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
            />
          </FieldGroup>

          <FieldGroup id="hero-partner-label" label="Partners Label">
            <Input
              id="hero-partner-label"
              defaultValue="Supporting Partners"
              className="h-11 border-slate-200 bg-white px-4 text-sm font-medium transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
            />
          </FieldGroup>
        </div>
      </div>
    </section>
  );
};

export default EditorPanel;
