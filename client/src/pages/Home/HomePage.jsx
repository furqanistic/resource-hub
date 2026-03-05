// File: client/src/pages/Home/HomePage.jsx
import Footer from '@/components/Footer'
import AboutRegionalCombined from '@/components/HomePAge/AboutRegionalCombined'
import ContactForm from '@/components/HomePAge/ContactForm'
import Hero from '@/components/HomePAge/Hero'
import NeedHelp from '@/components/HomePAge/NeedHelp'
import ServiceCategories from '@/components/HomePAge/ServiceCategories'
import Navbar from '@/components/Navbar'
import SectionThemeScope from '@/components/SectionThemeScope'
import axiosInstance from '@/lib/axiosInstance'
import DirectoryPage from '@/pages/DirectoryPage/DirectoryPage'
import PartnersPage from '@/pages/PartnersPage/PartnersPage'
import ResourcesPage from '@/pages/ResourcesPage/ResourcesPage'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const STICKY_NAV_OFFSET = 96

const scrollToHashTarget = (hash, behavior = 'auto') => {
  const sectionId = hash.replace('#', '')
  if (!sectionId) return false

  const section = document.getElementById(sectionId)
  if (!section) return false

  const nextTop = section.getBoundingClientRect().top + window.scrollY - STICKY_NAV_OFFSET
  window.scrollTo({
    top: Math.max(0, nextTop),
    behavior,
  })
  return true
}

const HomePage = () => {
  const [homeContent, setHomeContent] = useState(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
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

    let frameId = null
    let attempts = 0

    const tryScroll = () => {
      attempts += 1
      const didScroll = scrollToHashTarget(location.hash, 'auto')

      if (!didScroll && attempts < 8) {
        frameId = window.requestAnimationFrame(tryScroll)
      }
    }

    frameId = window.requestAnimationFrame(tryScroll)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [location.hash])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
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
    <div className="relative min-h-screen overflow-x-clip bg-[var(--site-background)] text-[var(--site-text)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-transparent">
        <div className="h-full bg-[var(--site-primary)] transition-[width] duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      <Navbar />

      <main className="relative pb-6">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--site-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>


        <SectionThemeScope scopeKey="home-hero">
          <Hero content={homeContent} />
        </SectionThemeScope>

        <AboutRegionalCombined />


        <section className="py-1 sm:py-2">
          <SectionThemeScope scopeKey="home-services">
            <ServiceCategories />
          </SectionThemeScope>
        </section>

        <section className="py-1 sm:py-2">
          <DirectoryPage embedded />
        </section>

        <section className="py-1 sm:py-2">
          <ResourcesPage embedded />
        </section>

        <section className="py-1 sm:py-2">
          <PartnersPage embedded />
        </section>

        <section className="py-2 sm:py-3">
          <SectionThemeScope scopeKey="home-need-help">
            <NeedHelp />
          </SectionThemeScope>
        </section>

        <section className="py-2 sm:py-3">
          <SectionThemeScope scopeKey="home-contact">
            <section id="contact" className="scroll-mt-28">
              <ContactForm />
            </section>
          </SectionThemeScope>
        </section>
      </main>

      <Footer />

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--site-primary)] text-white transition-all duration-300 hover:opacity-90 ${showBackToTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
      >
        <svg className="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}

export default HomePage
