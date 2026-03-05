// File: client/src/components/ServiceCategories.jsx
import { useLanguage } from '@/contexts/LanguageContext'
import React from 'react'

const categories = [
  {
    key: 'doctor',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 sm:h-14 sm:w-14">
        <circle cx="32" cy="32" r="22" fill="#111111" />
        <rect x="29" y="20" width="6" height="24" rx="2" fill="#ffffff" />
        <rect x="20" y="29" width="24" height="6" rx="2" fill="#ffffff" />
      </svg>
    ),
  },
  {
    key: 'groceries',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 sm:h-14 sm:w-14">
        <path
          d="M42 20c-2.5 0-4.7 1.2-6 2.6-1.3-1.4-3.5-2.6-6-2.6-6.6 0-12 5.4-12 12.1C18 44 27.4 52 36 52s18-8 18-19.9C54 25.4 48.6 20 42 20z"
          fill="#d6403f"
        />
        <path d="M38.5 12c-2.9 0-5.3 1.8-6.1 4.3 2.7.2 5.5-1.3 6.7-3.5.5-.9.6-1.7-.6-1.7z" fill="#2e6b3f" />
        <rect x="31" y="12" width="3" height="8" rx="1.5" fill="#2e6b3f" />
      </svg>
    ),
  },
  {
    key: 'work',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 sm:h-14 sm:w-14">
        <path d="M16 30l16-14 16 14v18H16V30z" fill="#0b5b8d" />
        <path d="M20 30h24v18H20V30z" fill="#0b5b8d" />
        <path d="M28 48V36h8v12" fill="#ffffff" />
        <path d="M16 28l16-14 16 14" fill="none" stroke="#0b5b8d" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'transit',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 sm:h-14 sm:w-14">
        <rect x="16" y="14" width="32" height="36" rx="6" fill="#0b5b8d" />
        <rect x="20" y="18" width="24" height="14" rx="2" fill="#ffffff" />
        <rect x="20" y="34" width="24" height="6" rx="2" fill="#0b5b8d" />
        <circle cx="24" cy="48" r="3" fill="#0b5b8d" />
        <circle cx="40" cy="48" r="3" fill="#0b5b8d" />
      </svg>
    ),
  },
]

const ServiceCategories = () => {
  const { t } = useLanguage()

  return (
    <section className="bg-[var(--site-background)] py-16 sm:py-24 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--site-primary-soft)]/5 to-transparent pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-[var(--site-primary-soft)]/20 border border-[var(--site-primary-soft)]/30 text-[var(--site-primary)] text-xs font-bold tracking-widest uppercase">
              {t('home.servicesBadge')}
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--site-primary)]">
              {t('home.servicesTitle')}
            </h3>
            <p className="mt-4 text-[16px] sm:text-[17px] text-[var(--site-text-soft)] leading-relaxed">
              {t('home.servicesSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, idx) => (
            <div
              key={category.key}
              className="group relative flex flex-col min-h-[280px] rounded-[2.5rem] bg-white border border-[var(--site-primary-soft)]/30 p-8 transition-all duration-500 hover:border-[var(--site-primary)]/50 hover:-translate-y-2 overflow-hidden"
            >
              {/* Subtle card background pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--site-primary-soft)]/10 via-transparent to-transparent" />
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-[var(--site-primary-soft)]/20 blur-2xl" />
              </div>

              <div className="relative z-10 mb-auto">
                <div className="inline-flex rounded-3xl bg-[var(--site-primary-soft)]/20 p-4 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 backdrop-blur-sm">
                  {category.icon}
                </div>
                <h4 className="text-xl sm:text-2xl font-bold leading-tight text-[var(--site-text)] mb-3">
                  {t(`home.categories.${category.key}`)}
                </h4>
              </div>
              
              <div className="relative z-10 mt-4 flex items-center gap-2 text-sm font-bold text-[var(--site-primary)] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                {t('home.learnMore')}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--site-primary-soft)]/10 to-transparent rounded-bl-[4rem] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


export default ServiceCategories
