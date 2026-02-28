// File: client/src/components/dashboard/DashboardLayout.jsx
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLanguage } from '@/contexts/LanguageContext'
import { logout } from '@/redux/slices/authSlice'
import { cn } from '@/lib/utils'

const DashboardLayout = ({ children }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t, language, setLanguage } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.directory'), path: '/directory' },
    { name: t('nav.resources'), path: '/resources' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.partners'), path: '/partners' },
  ]

  const dashboardLinks = [
    { name: t('dashboard.links.homeEditor'), path: '/dashboard' },
    { name: t('dashboard.links.resourcesEditor'), path: '/dashboard/resources' },
    { name: t('dashboard.links.aboutEditor'), path: '/dashboard/about' },
    { name: t('dashboard.links.partnersEditor'), path: '/dashboard/partners' },
    { name: t('dashboard.links.directoryEditor'), path: '/dashboard/directory' },
  ]

  const websiteThemeLinks = [
    { name: t('dashboard.links.websiteThemeEditor'), path: '/dashboard/website-theme' },
  ]

  const isActive = (path) => location.pathname === path

  const LanguageToggle = ({ compact = false }) => (
    <div
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-full border border-[#03385e]/20 bg-white/90 p-1 shadow-sm',
        compact ? 'text-[11px]' : 'text-xs'
      )}
      role="group"
      aria-label={t('nav.language')}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={cn(
          'px-3 py-1 rounded-full font-semibold tracking-wide transition-colors',
          language === 'en'
            ? 'bg-[#03385e] text-white'
            : 'text-[#03385e]/70 hover:text-[#03385e]'
        )}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={cn(
          'px-3 py-1 rounded-full font-semibold tracking-wide transition-colors',
          language === 'es'
            ? 'bg-[#03385e] text-white'
            : 'text-[#03385e]/70 hover:text-[#03385e]'
        )}
        aria-pressed={language === 'es'}
      >
        ES
      </button>
    </div>
  )

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login')
  }

  const handleMobileNavigate = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white px-6 py-8 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:h-screen lg:shadow-[0_20px_60px_-55px_rgba(15,23,42,0.3)]">
          <div className="mb-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t('dashboard.layout.adminLabel')}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">
                {t('dashboard.layout.dashboardTitle')}
              </h2>
            </div>
          </div>
          <div className="mb-6">
            <LanguageToggle />
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto pr-2">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t('dashboard.layout.dashboardSection')}
              </p>
              {dashboardLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'flex items-center rounded-xl px-4 py-2 text-sm font-medium transition',
                    isActive(link.path)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t('dashboard.layout.mainSiteSection')}
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'flex items-center rounded-xl px-4 py-2 text-sm font-medium transition',
                    isActive(link.path)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t('dashboard.layout.websiteThemeSection')}
              </p>
              {websiteThemeLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'flex items-center rounded-xl px-4 py-2 text-sm font-medium transition',
                    isActive(link.path)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
          >
            {t('dashboard.layout.logout')}
          </button>
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="border-b border-slate-200 bg-white px-6 py-4 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t('dashboard.layout.adminLabel')}
              </p>
              <h2 className="text-sm font-semibold text-slate-900">
                {t('dashboard.layout.dashboardTitle')}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle compact />
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
              >
                {t('dashboard.layout.logout')}
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Toggle dashboard menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
            </div>

            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              )}
            >
              <nav className="space-y-2 pb-2">
                <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {t('dashboard.layout.dashboardSection')}
                </p>
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleMobileNavigate}
                    className={cn(
                      'block rounded-lg px-4 py-2 text-sm font-medium transition',
                      isActive(link.path)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}

                <p className="px-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {t('dashboard.layout.websiteThemeSection')}
                </p>
                {websiteThemeLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleMobileNavigate}
                    className={cn(
                      'block rounded-lg px-4 py-2 text-sm font-medium transition',
                      isActive(link.path)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="p-6 sm:p-10">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
