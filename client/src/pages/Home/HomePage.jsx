// File: client/src/pages/Home/HomePage.jsx
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/HomePAge/Hero'
import RegionalPartners from '@/components/HomePAge/RegionalPartners'
import ServiceCategories from '@/components/HomePAge/ServiceCategories'
import NeedHelp from '@/components/HomePAge/NeedHelp'
import ContactForm from '@/components/HomePAge/ContactForm'
import Footer from '@/components/Footer'
import SectionThemeScope from '@/components/SectionThemeScope'
import axiosInstance from '@/lib/axiosInstance'

const HomePage = () => {
  const [homeContent, setHomeContent] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchContent = async () => {
      try {
        const { data } = await axiosInstance.get('/content/home')
        if (isMounted) {
          setHomeContent(data?.data?.content || null)
        }
      } catch {
        if (isMounted) {
          setHomeContent(null)
        }
      }
    }

    fetchContent()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-[var(--site-background)] text-[var(--site-text)]">
      <Navbar />
      <main>
        <SectionThemeScope scopeKey="home-hero">
          <Hero content={homeContent} />
        </SectionThemeScope>
        <SectionThemeScope scopeKey="home-regional">
          <RegionalPartners />
        </SectionThemeScope>
        <SectionThemeScope scopeKey="home-services">
          <ServiceCategories />
        </SectionThemeScope>
        <SectionThemeScope scopeKey="home-need-help">
          <NeedHelp />
        </SectionThemeScope>
        <SectionThemeScope scopeKey="home-contact">
          <ContactForm />
        </SectionThemeScope>
      </main>
      <Footer />
    </div >
  )
}

export default HomePage
