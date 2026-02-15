// File: client/src/pages/Home/HomePage.jsx
import React from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/HomePage/Hero'
import RegionalPartners from '@/components/HomePage/RegionalPartners'
import ServiceCategories from '@/components/HomePage/ServiceCategories'
import NeedHelp from '@/components/HomePage/NeedHelp'


const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary/20">
      <Navbar />
      <main>
        <Hero />
        <RegionalPartners />
        <ServiceCategories />
        <NeedHelp />
      </main>
      {/* Footer can go here */ }
    </div >
  )
}

export default HomePage
