// File: client/src/pages/Home/HomePage.jsx
import React from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/HomePAge/Hero'
import RegionalPartners from '@/components/HomePAge/RegionalPartners'
import ServiceCategories from '@/components/HomePAge/ServiceCategories'


const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary/20">
      <Navbar />
      <main>
        <Hero />
        <RegionalPartners />
        <ServiceCategories />
      </main>
      {/* Footer can go here */}
    </div>
  )
}

export default HomePage
