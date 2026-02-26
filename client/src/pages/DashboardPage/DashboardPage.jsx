import React from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user)

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
          Admin Dashboard
        </span>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Welcome to the dashboard{user?.name ? `, ${user.name}` : ''}.
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
          You are signed in as an administrator. We will add management tools here next.
        </p>
        <div className="mt-6 grid w-full gap-4 sm:grid-cols-3">
          {[
            { label: 'Content', value: 'Coming soon' },
            { label: 'Partners', value: 'Coming soon' },
            { label: 'Directory', value: 'Coming soon' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
