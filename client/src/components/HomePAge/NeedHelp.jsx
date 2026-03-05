// File: client/src/components/HomePage/NeedHelp.jsx
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'
import React from 'react'

const NeedHelp = () => {
  const { t } = useLanguage()

  const jumpToContact = () => {
    const section = document.getElementById('contact')
    if (!section) return
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', '/#contact')
  }

  return (
    <section className="relative overflow-hidden bg-[var(--site-primary)] py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, white 0%, transparent 40%)' }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-1 gap-6 rounded-[2rem] bg-white/10 px-6 py-9 sm:px-10 sm:py-11 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <h2 className="text-2xl font-medium leading-tight text-white sm:text-3xl lg:text-4xl">{t('home.needHelpTitle')}</h2>

          <Button
            size="lg"
            onClick={jumpToContact}
            className="rounded-full bg-[var(--site-background)] px-8 py-6 text-base font-medium text-[var(--site-text)] transition-opacity hover:opacity-90 sm:text-lg"
          >
            {t('home.needHelpCta')}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default NeedHelp
