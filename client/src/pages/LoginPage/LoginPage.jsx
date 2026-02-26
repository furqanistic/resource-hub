import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { axiosClient } from '@/lib/api/axiosClient'
import { isAuthenticated, setAuthSession } from '@/lib/auth'
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('admin@cwcog.org')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const redirectPath = useMemo(
    () => location.state?.from?.pathname || '/dashboard',
    [location.state]
  )

  if (isAuthenticated()) {
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await axiosClient.post('/api/auth/signin', {
        email: email.trim(),
        password,
      })

      const token = response?.data?.token
      const user = response?.data?.data?.user

      if (!token) {
        throw new Error('Login succeeded but token is missing in response')
      }

      setAuthSession(token, user)
      navigate(redirectPath, { replace: true })
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to log in. Please verify your credentials.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Resource Hub
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Dashboard Login
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your admin account to manage CMS content.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11 pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11 pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full gap-2 bg-[#03385e] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#022d4b] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-bold uppercase tracking-wider text-slate-500">Dev Credentials</p>
          <p className="mt-1">Email: admin@cwcog.org</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
