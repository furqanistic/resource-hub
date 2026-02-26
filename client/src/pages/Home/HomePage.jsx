// File: client/src/pages/Home/HomePage.jsx
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/HomePage/Hero'
import RegionalPartners from '@/components/HomePage/RegionalPartners'
import ServiceCategories from '@/components/HomePage/ServiceCategories'
import NeedHelp from '@/components/HomePage/NeedHelp'
import ContactForm from '@/components/HomePage/ContactForm'
import Footer from '@/components/Footer'
import { getSections } from '@/lib/api/cmsApi'


const HomePage = () => {
  const [sectionsById, setSectionsById] = useState({})

  useEffect(() => {
    let active = true

    getSections()
      .then((sections) => {
        if (!active || !Array.isArray(sections)) return

        const next = {}
        for (const section of sections) {
          const id = section?.sectionId || section?.id
          if (!id) continue
          next[id] = section?.fields || {}
        }
        setSectionsById(next)
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary/20">
      <Navbar />
      <main>
        <Hero fields={sectionsById['home.hero']} />
        <RegionalPartners fields={sectionsById['home.regional']} />
        <ServiceCategories />
        <NeedHelp />
        <ContactForm />
      </main>
      <Footer />
    </div >
  )
}

export default HomePage
