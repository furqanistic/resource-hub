import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const FieldGroup = ({ id, label, children, hint }) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-slate-600"
      >
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:h-full lg:overflow-y-auto">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-900">Home Hero Editor</p>
        <p className="text-xs text-slate-500">
          Demo-only frontend editor. Changes stay local until you reset.
        </p>
      </div>

      <div className="space-y-4">
        <FieldGroup id="hero-title" label="Hero Title">
          <Input
            id="hero-title"
            defaultValue="CHOICE Regional Transportation Hub"
            className="h-9 border-slate-300 text-sm"
          />
        </FieldGroup>

        <FieldGroup id="hero-description1" label="Description Line 1">
          <Textarea
            id="hero-description1"
            defaultValue="This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region."
            className="min-h-20 border-slate-300 text-sm"
          />
        </FieldGroup>

        <FieldGroup id="hero-description2" label="Description Line 2">
          <Textarea
            id="hero-description2"
            defaultValue="This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services."
            className="min-h-20 border-slate-300 text-sm"
          />
        </FieldGroup>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FieldGroup id="hero-cta" label="CTA Label">
            <Input
              id="hero-cta"
              defaultValue="Start My Search"
              className="h-9 border-slate-300 text-sm"
            />
          </FieldGroup>

          <FieldGroup id="hero-link" label="CTA Link">
            <Input
              id="hero-link"
              defaultValue="/directory"
              className="h-9 border-slate-300 text-sm"
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
            className="h-9 border-slate-300 text-sm"
          />
        </FieldGroup>

        <FieldGroup id="hero-partner-label" label="Partners Label">
          <Input
            id="hero-partner-label"
            defaultValue="Supporting Partners"
            className="h-9 border-slate-300 text-sm"
          />
        </FieldGroup>
      </div>
    </section>
  );
};

export default EditorPanel;
