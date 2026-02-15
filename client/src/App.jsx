// File: client/src/App.jsx
import HomePage from '@/pages/Home/HomePage'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import AboutPage from '@/pages/AboutPage/AboutPage'
import DirectoryPage from '@/pages/DirectoryPage/DirectoryPage'

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="choice-theme">
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<HomePage />} />
            <Route path='/directory' element={<DirectoryPage />} />
            <Route path='/about' element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
