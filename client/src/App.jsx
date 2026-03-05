// File: client/src/App.jsx
import HomePage from '@/pages/Home/HomePage'
import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import DashboardPage from '@/pages/DashboardPage/DashboardPage'
import DashboardResourcesPage from '@/pages/DashboardResourcesPage/DashboardResourcesPage'
import DashboardAboutPage from '@/pages/DashboardAboutPage/DashboardAboutPage'
import DashboardPartnersPage from '@/pages/DashboardPartnersPage/DashboardPartnersPage'
import DashboardDirectoryPage from '@/pages/DashboardDirectoryPage/DashboardDirectoryPage'
import AdminLoginPage from '@/pages/AdminLoginPage/AdminLoginPage'
import DashboardWebsiteThemePage from '@/pages/DashboardWebsiteThemePage/DashboardWebsiteThemePage'
import DashboardWebsiteTypographyPage from '@/pages/DashboardWebsiteThemePage/DashboardWebsiteTypographyPage'
import WebsiteThemeSync from '@/components/WebsiteThemeSync'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="choice-theme">
      <LanguageProvider>
        <BrowserRouter>
          <WebsiteThemeSync />
          <ScrollToTop />
          <Routes>
            <Route path='/'>
              <Route index element={<HomePage />} />
              <Route path='/directory' element={<Navigate to='/#directory' replace />} />
              <Route path='/resources' element={<Navigate to='/#resources' replace />} />
              <Route path='/about' element={<Navigate to='/#about' replace />} />
              <Route path='/partners' element={<Navigate to='/#partners' replace />} />
              <Route path='/admin/login' element={<AdminLoginPage />} />
              <Route path='/dashboard' element={<DashboardPage />} />
              <Route path='/dashboard/resources' element={<DashboardResourcesPage />} />
              <Route path='/dashboard/about' element={<DashboardAboutPage />} />
              <Route path='/dashboard/partners' element={<DashboardPartnersPage />} />
              <Route path='/dashboard/directory' element={<DashboardDirectoryPage />} />
              <Route path='/dashboard/website-theme' element={<Navigate to='/dashboard/website-theme/colors' replace />} />
              <Route path='/dashboard/website-theme/colors' element={<DashboardWebsiteThemePage />} />
              <Route path='/dashboard/website-theme/typography' element={<DashboardWebsiteTypographyPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
