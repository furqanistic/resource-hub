// File: client/src/components/HomePAge/Hero.jsx
import heroImg from '@/assets/CloudLogos/hero-img.jpg'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import React from 'react'

const Hero = ({ content }) => {
  const { t, language } = useLanguage()
  const useSpanishCopy = language === 'es'
  const heroTitle = useSpanishCopy
    ? content?.heroTitleEs || content?.heroTitle || t('home.heroTitle')
    : content?.heroTitle || t('home.heroTitle')
  const heroDescription1 = useSpanishCopy
    ? content?.heroDescription1Es || content?.heroDescription1 || t('home.heroDescription1')
    : content?.heroDescription1 || t('home.heroDescription1')
  const heroDescription2 = useSpanishCopy
    ? content?.heroDescription2Es || content?.heroDescription2 || t('home.heroDescription2')
    : content?.heroDescription2 || t('home.heroDescription2')
  const heroCta = useSpanishCopy
    ? content?.heroCtaEs || content?.heroCta || t('home.heroCta')
    : content?.heroCta || t('home.heroCta')
  const heroImageAlt = useSpanishCopy
    ? content?.heroImageAltEs || content?.heroImageAlt || t('home.heroImageAlt')
    : content?.heroImageAlt || t('home.heroImageAlt')
  const heroImageSrc = content?.heroImageUrl?.trim() ? content.heroImageUrl : heroImg

  const scrollToDirectory = () => {
    const directorySection = document.getElementById('directory')
    if (!directorySection) return
    directorySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', '/#directory')
  }

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[var(--site-background)] py-12 sm:py-20 lg:py-28">
      {/* Dynamic Background Elements - Clean replacement */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
        <div className="absolute inset-0 bg-[radial-gradient(var(--site-secondary-soft)_1px,transparent_1px)] bg-[length:32px_32px]" />
      </div>


      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[var(--site-primary-soft)]/20 border border-[var(--site-primary-soft)]/30 text-[var(--site-primary)] text-xs font-bold tracking-widest uppercase"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--site-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--site-primary)]"></span>
              </span>
              {t('home.communityHubBadge')}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-[var(--site-primary)] mb-8">
              {heroTitle}
            </h1>

            <div className="flex flex-col gap-6 text-[17px] sm:text-[18px] leading-relaxed text-[var(--site-text)] mb-10 max-w-2xl">
              <p className="opacity-90">{heroDescription1}</p>
              <p className="opacity-80 border-l-4 border-[var(--site-primary-soft)] pl-6 italic">{heroDescription2}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Button
                size="lg"
                onClick={scrollToDirectory}
                className="group relative h-14 w-full sm:w-auto rounded-2xl bg-[var(--site-primary)] px-10 text-base font-bold text-white transition-all hover:scale-[1.02] hover:bg-[var(--site-primary)]/90 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {heroCta}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden border-[8px] border-white/30 backdrop-blur-sm">
              <img 
                src={heroImageSrc} 
                alt={heroImageAlt} 
                className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--site-primary)]/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 sm:-left-12 z-20 p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 min-w-[200px]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-[var(--site-primary)] text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--site-primary)]">100+</div>
                  <div className="text-xs font-medium text-[var(--site-text-soft)]">{t('home.verifiedResources')}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


export default Hero
