// File: client/src/pages/Home/HomePage.jsx
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/HomePAge/Hero'
import RegionalPartners from '@/components/HomePAge/RegionalPartners'
import ServiceCategories from '@/components/HomePAge/ServiceCategories'
import NeedHelp from '@/components/HomePAge/NeedHelp'
import ContactForm from '@/components/HomePAge/ContactForm'
import Footer from '@/components/Footer'
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
      } catch (error) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary/20">
      <Navbar />
      <main>
        <Hero content={homeContent} />
        <RegionalPartners />
        <ServiceCategories />
        <NeedHelp />
        <ContactForm />
      </main>
      <Footer />
    </div >
  )
}

export default HomePage
