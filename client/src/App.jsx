// File: client/src/App.jsx
import HomePage from '@/pages/Home/HomePage'
import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import AboutPage from '@/pages/AboutPage/AboutPage'
import ResourcesPage from '@/pages/ResourcesPage/ResourcesPage'
import DirectoryPage from '@/pages/DirectoryPage/DirectoryPage'
import PartnersPage from '@/pages/PartnersPage/PartnersPage'
import { LanguageProvider } from '@/contexts/LanguageContext'
import DashboardPage from '@/pages/DashboardPage/DashboardPage'
import LoginPage from '@/pages/LoginPage/LoginPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

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
          <ScrollToTop />
          <Routes>
            <Route path='/'>
              <Route index element={<HomePage />} />
              <Route path='/directory' element={<DirectoryPage />} />
              <Route path='/resources' element={<ResourcesPage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/partners' element={<PartnersPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
