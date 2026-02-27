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
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t, language, setLanguage } = useLanguage();

  const LanguageToggle = ({ compact = false }) => (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-[#03385e]/20 bg-white/90 p-1 shadow-sm",
        compact ? "text-[11px]" : "text-xs"
      )}
      role="group"
      aria-label={t('nav.language')}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={cn(
          "px-3 py-1 rounded-full font-semibold tracking-wide transition-colors",
          language === 'en'
            ? "bg-[#03385e] text-white"
            : "text-[#03385e]/70 hover:text-[#03385e]"
        )}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={cn(
          "px-3 py-1 rounded-full font-semibold tracking-wide transition-colors",
          language === 'es'
            ? "bg-[#03385e] text-white"
            : "text-[#03385e]/70 hover:text-[#03385e]"
        )}
        aria-pressed={language === 'es'}
      >
        ES
      </button>
    </div>
  );

  return (
    <aside
      className={cn(
        'hidden border-r-2 border-slate-300 bg-white lg:flex lg:h-screen lg:flex-col sticky top-0',
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
              {t('dashboard.sidebar.dashboardLabel')}
            </p>
            <h2 className="text-sm font-bold text-[#03385e] leading-tight">
              {t('dashboard.sidebar.contentCms')}
            </h2>
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {!isCollapsed && <LanguageToggle compact />}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[#03385e]/10 text-[#03385e]/60 transition-all hover:bg-[#03385e]/5 hover:text-[#03385e] lg:inline-flex"
            aria-label={isCollapsed ? t('dashboard.sidebar.expandSidebar') : t('dashboard.sidebar.collapseSidebar')}
            title={isCollapsed ? t('dashboard.sidebar.expandSidebar') : t('dashboard.sidebar.collapseSidebar')}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
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
