import React, { useMemo } from 'react'
import {
  BookOpenText,
  Compass,
  House,
  Info,
  LayoutDashboard,
  MapPinned,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sectionIcons = {
  'home.hero': House,
  'home.regional': MapPinned,
  'about.page': Info,
  'resources.page': BookOpenText,
  'partners.page': Users,
}

const pageMeta = {
  home: { label: 'Home Page', route: '/' },
  about: { label: 'About Page', route: '/about' },
  resources: { label: 'Resources Page', route: '/resources' },
  partners: { label: 'Partners Page', route: '/partners' },
  directory: { label: 'Directory Page', route: '/directory' },
}

const groupSections = (sections = []) => {
  const groups = {}

  for (const section of sections) {
    const pageKey = (section?.id || '').split('.')[0] || 'other'
    if (!groups[pageKey]) groups[pageKey] = []
    groups[pageKey].push(section)
  }

  return groups
}

const DashboardSidebar = ({
  sections,
  activeSectionId,
  onSelectSection,
  className,
}) => {
  const groups = useMemo(() => groupSections(sections), [sections])

  return (
    <aside
      className={cn(
        'flex h-full w-full flex-col border-r border-slate-200 bg-white',
        className
      )}
    >
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Website CMS
        </p>
        <h2 className="mt-1 text-sm font-bold text-slate-900">Pages & Sections</h2>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
        {Object.entries(groups).map(([pageKey, pageSections]) => {
          const meta = pageMeta[pageKey] || {
            label: `${pageKey[0]?.toUpperCase() || ''}${pageKey.slice(1)} Page`,
            route: '/',
          }

          return (
            <div key={pageKey}>
              <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <Compass className="h-3.5 w-3.5" />
                <span>{meta.label}</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                  {meta.route}
                </span>
              </div>

              <div className="space-y-1">
                {pageSections.map((section) => {
                  const isActive = section.id === activeSectionId
                  const Icon = sectionIcons[section.id] || LayoutDashboard

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => onSelectSection(section.id)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left transition',
                        isActive
                          ? 'border-[#03385e] bg-[#03385e] text-white'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{section.label}</p>
                        <p
                          className={cn(
                            'truncate text-[11px]',
                            isActive ? 'text-white/80' : 'text-slate-500'
                          )}
                        >
                          {section.id}
                        </p>
                      </div>
                      {section.isDraft ? (
                        <span
                          className={cn(
                            'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase',
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-amber-100 text-amber-700'
                          )}
                        >
                          Draft
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default DashboardSidebar
