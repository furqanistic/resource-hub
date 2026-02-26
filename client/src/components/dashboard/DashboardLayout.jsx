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
    { name: t('nav.adminLogin'), path: '/admin/login' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white px-6 py-8 lg:flex">
          <div className="mb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Admin
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Dashboard</h2>
          </div>

          <nav className="flex-1 space-y-2">
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
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Logout
          </button>
        </aside>

        <div className="flex-1">
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
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
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
