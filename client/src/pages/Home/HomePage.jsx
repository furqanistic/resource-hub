// File: client/src/pages/Home/HomePage.jsx
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Hero from '@/components/HomePAge/Hero'
import RegionalPartners from '@/components/HomePAge/RegionalPartners'
import ServiceCategories from '@/components/HomePAge/ServiceCategories'
import NeedHelp from '@/components/HomePAge/NeedHelp'
import ContactForm from '@/components/HomePAge/ContactForm'
import Footer from '@/components/Footer'
import SectionThemeScope from '@/components/SectionThemeScope'
import axiosInstance from '@/lib/axiosInstance'
import DirectoryPage from '@/pages/DirectoryPage/DirectoryPage'
import ResourcesPage from '@/pages/ResourcesPage/ResourcesPage'
import AboutPage from '@/pages/AboutPage/AboutPage'
import PartnersPage from '@/pages/PartnersPage/PartnersPage'

const HomePage = () => {
  const [homeContent, setHomeContent] = useState(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const location = useLocation()

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

  useEffect(() => {
    if (!location.hash) return

    const sectionId = location.hash.replace('#', '')
    const section = document.getElementById(sectionId)
    if (!section) return

    const scrollTimeout = window.setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)

    return () => window.clearTimeout(scrollTimeout)
  }, [location.hash])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[var(--site-background)] text-[var(--site-text)]">
      <Navbar />
      <main>
        <SectionThemeScope scopeKey="home-hero">
          <Hero content={homeContent} />
        </SectionThemeScope>
        <AboutPage embedded />
        <SectionThemeScope scopeKey="home-regional">
          <RegionalPartners />
        </SectionThemeScope>
        <SectionThemeScope scopeKey="home-services">
          <ServiceCategories />
        </SectionThemeScope>
        <DirectoryPage embedded />
        <ResourcesPage embedded />
        <PartnersPage embedded />
        <SectionThemeScope scopeKey="home-need-help">
          <NeedHelp />
        </SectionThemeScope>
        <SectionThemeScope scopeKey="home-contact">
          <ContactForm />
        </SectionThemeScope>
      </main>
      <Footer />
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full border border-[var(--site-primary-soft)] bg-[var(--site-primary)] text-white shadow-lg transition-all duration-300 hover:opacity-90 ${showBackToTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
      >
        <svg className="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}

export default HomePage
