import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import DashboardSidebar from '@/pages/DashboardPage/components/DashboardSidebar';
import EditorPanel from '@/pages/DashboardPage/components/EditorPanel';

const dashboardSections = [
  {
    id: 'home.hero',
    label: 'Home Hero',
    status: 'ready',
    description: 'Title, description, CTA and hero image',
  },
  {
    id: 'home.regional',
    label: 'Home Regional',
    status: 'planned',
    description: 'Regional partners text and map block',
  },
  {
    id: 'about.page',
    label: 'About Page',
    status: 'planned',
    description: 'Headings and paragraphs',
  },
  {
    id: 'resources.page',
    label: 'Resources Page',
    status: 'planned',
    description: 'Resource cards and links',
  },
  {
    id: 'partners.page',
    label: 'Partners Page',
    status: 'planned',
    description: 'Partner cards, logo and descriptions',
  },
];

const DashboardPage = () => {
  const [activeSectionId, setActiveSectionId] = useState('home.hero');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);

  const pageTitle = useMemo(
    () =>
      dashboardSections.find((item) => item.id === activeSectionId)?.label ??
      'Dashboard',
    [activeSectionId]
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Content Dashboard
            </p>
            <h1 className="text-base font-semibold text-slate-900">
              Demo Editor · {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 rounded-lg border-slate-300 px-3 text-xs"
            >
              Reset
            </Button>
            <Button
              type="button"
              className="h-8 rounded-lg bg-slate-900 px-3 text-xs text-white hover:bg-slate-800"
            >
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
        <DashboardSidebar
          sections={dashboardSections}
          activeSectionId={activeSectionId}
          onSelectSection={setActiveSectionId}
        />

        <EditorPanel activeSectionId={activeSectionId} />
      </main>

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <p className="text-xs text-slate-500">
          Frontend-only UI demo. No backend or data integration.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
