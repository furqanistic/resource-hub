import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import EditorPanel from '@/components/dashboard/EditorPanel';

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
    status: 'ready',
    description: 'Regional partners text and map block',
  },
  {
    id: 'about.page',
    label: 'About Page',
    status: 'ready',
    description: 'Headings and paragraphs',
  },
  {
    id: 'resources.page',
    label: 'Resources Page',
    status: 'ready',
    description: 'Resource cards and links',
  },
  {
    id: 'partners.page',
    label: 'Partners Page',
    status: 'ready',
    description: 'Partner cards, logo and descriptions',
  },
];

const DashboardPage = () => {
  const [activeSectionId, setActiveSectionId] = useState('home.hero');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Sidebar - Full Height */}
      <DashboardSidebar
        sections={dashboardSections}
        activeSectionId={activeSectionId}
        onSelectSection={setActiveSectionId}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="z-20 border-b border-slate-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between gap-4 px-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Content Management
              </p>
              <h1 className="text-sm font-semibold text-slate-900">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Auto-saving enabled
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          <div className="mx-auto max-w-6xl">
            <EditorPanel
              activeSectionId={activeSectionId}
              sections={dashboardSections}
              onSelectSection={setActiveSectionId}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
