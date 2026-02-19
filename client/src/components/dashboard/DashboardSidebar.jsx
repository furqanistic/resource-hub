// File: client/src/components/dashboard/DashboardSidebar.jsx
import React from 'react';
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  House,
  Info,
  LayoutDashboard,
  MapPinned,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sectionIcons = {
  'home.hero': House,
  'home.regional': MapPinned,
  'about.page': Info,
  'resources.page': BookOpenText,
  'partners.page': Users,
};

const DashboardSidebar = ({
  sections,
  activeSectionId,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  className,
}) => {
  return (
    <aside
      className={cn(
        'hidden border-r border-slate-200 bg-white lg:flex lg:h-screen lg:flex-col sticky top-0',
        'transition-[width] duration-300',
        isCollapsed ? 'lg:w-20' : 'lg:w-70',
        className
      )}
    >
      <div className={cn("flex h-16 items-center justify-between border-b border-slate-200 px-6", className?.includes('lg:hidden') ? 'hidden lg:flex' : '')}>
        <div
          className={cn(
            'flex flex-1 items-center gap-3 overflow-hidden',
            isCollapsed ? 'lg:justify-center' : ''
          )}
        >
          <div className={cn(isCollapsed ? 'hidden' : 'block')}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Dashboard
            </p>
            <h2 className="text-sm font-bold text-[#03385e] leading-tight">Content CMS</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[#03385e]/10 text-[#03385e]/60 transition-all hover:bg-[#03385e]/5 hover:text-[#03385e] lg:inline-flex"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {sections.map((section) => {
          const isActive = activeSectionId === section.id;
          const Icon = sectionIcons[section.id] ?? LayoutDashboard;

          return (
            <button
              key={section.id}
              type="button"
              title={section.label}
              onClick={() => onSelectSection(section.id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left transition',
                isActive
                  ? 'bg-[#03385e] text-white'
                  : 'text-[#03385e]/70 hover:bg-[#03385e]/5 hover:text-[#03385e]',
                isCollapsed ? 'justify-center px-0' : ''
              )}
            >
              <div className="relative">
                <Icon className="h-4 w-4 shrink-0" />
              </div>

              <div className={cn('flex-1 min-w-0', isCollapsed ? 'hidden' : 'block')}>
                <p className="truncate text-sm font-medium">{section.label}</p>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
