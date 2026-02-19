// File: client/src/pages/DashboardPage/components/DashboardSidebar.jsx
import React from 'react';
import { cn } from '@/lib/utils';

const statusStyles = {
  ready: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  planned: 'bg-slate-100 text-slate-600 border-slate-200',
};

const DashboardSidebar = ({ sections, activeSectionId, onSelectSection }) => {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Content Sections
        </p>
      </div>

      <div className="space-y-2">
        {sections.map((section) => {
          const isActive = activeSectionId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              className={cn(
                'w-full rounded-xl border px-3 py-3 text-left transition',
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{section.label}</span>
                <span
                  className={cn(
                    'rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                    isActive
                      ? 'border-white/20 bg-white/10 text-white'
                      : statusStyles[section.status]
                  )}
                >
                  {section.status}
                </span>
              </div>
              <p
                className={cn(
                  'mt-1 text-xs',
                  isActive ? 'text-slate-200' : 'text-slate-500'
                )}
              >
                {section.description}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
