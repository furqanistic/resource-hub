import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLanguage } from '@/contexts/LanguageContext'
import { logout } from '@/redux/slices/authSlice'
import { cn } from '@/lib/utils'

const DashboardLayout = ({ children }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.directory'), path: '/directory' },
    { name: t('nav.resources'), path: '/resources' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.partners'), path: '/partners' },
  ]

  const dashboardLinks = [
    { name: 'Home Editor', path: '/dashboard' },
    { name: 'Resources Editor', path: '/dashboard/resources' },
    { name: 'About Editor', path: '/dashboard/about' },
    { name: 'Partners Editor', path: '/dashboard/partners' },
    { name: 'Directory Editor', path: '/dashboard/directory' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white px-6 py-8 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:h-screen lg:shadow-[0_20px_60px_-55px_rgba(15,23,42,0.3)]">
          <div className="mb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Admin
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Dashboard</h2>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto pr-2">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                Dashboard
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
                Main Site
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
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
          >
            Logout
          </button>
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:hidden">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                Admin
              </p>
              <h2 className="text-sm font-semibold text-slate-900">Dashboard</h2>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
            >
              Logout
            </button>
          </header>

          <main className="p-6 sm:p-10">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
