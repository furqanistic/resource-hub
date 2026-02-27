import { loginAdmin } from '@/redux/slices/authSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminLoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error, isAuthenticated } = useSelector((state) => state.auth)

  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(loginAdmin(formValues))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_50%),radial-gradient(circle_at_20%_80%,_rgba(59,130,246,0.2),_transparent_55%),radial-gradient(circle_at_80%_70%,_rgba(99,102,241,0.25),_transparent_60%)]" />
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-16">
          <div className="w-full rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Admin</p>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Sign in to continue</h1>
              <p className="mt-2 text-sm text-white/60">Welcome back. Enter your credentials below.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
                  placeholder="example@hubchoice.org"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/60 hover:text-white"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {status === 'loading' ? 'Signing in…' : 'Sign in'}
                </span>
                <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <span className="absolute inset-0 bg-white/10" />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
