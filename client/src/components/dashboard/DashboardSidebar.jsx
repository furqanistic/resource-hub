import React from 'react';
import logo from '@/assets/logo.avif';
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
}) => {
  return (
    <aside
      className={cn(
        'hidden border-r border-slate-200 bg-white lg:flex lg:h-screen lg:flex-col sticky top-0',
        'transition-[width] duration-300',
        isCollapsed ? 'lg:w-[80px]' : 'lg:w-[280px]'
      )}
    >
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div
          className={cn(
            'flex items-center gap-2 overflow-hidden',
            isCollapsed ? 'lg:justify-center' : ''
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-transparent">
            <img src={logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div className={cn(isCollapsed ? 'hidden' : 'block')}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Dashboard
            </p>
            <p className="text-sm font-semibold text-slate-900">Content CMS</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden h-8 w-8 items-center justify-center rounded-sm border border-[#03385e]/20 text-[#03385e] transition hover:bg-[#03385e]/5 lg:inline-flex"
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

              <div className={cn('min-w-0', isCollapsed ? 'hidden' : 'block')}>
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
