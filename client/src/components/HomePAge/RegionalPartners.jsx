// File: client/src/components/RegionalPartners.jsx
import waMap from '@/assets/wa-map.avif'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'
import React from 'react'

const RegionalPartners = () => {
  const { t } = useLanguage()

  return (
    <section className="overflow-hidden bg-[var(--site-background)] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="rounded-[2rem] bg-[var(--site-primary-soft)]/36 p-6 sm:p-8 lg:col-span-7"
          >
            <h2 className="text-3xl font-semibold leading-[1.08] tracking-tight text-[var(--site-primary)] sm:text-4xl">
              <span className="block">{t('home.regionalTitleLine1')}</span>
              <span className="block">{t('home.regionalTitleLine2')}</span>
            </h2>

            <div className="mt-6 grid gap-4 text-[15px] leading-relaxed text-[var(--site-text)] sm:text-base lg:text-[17px]">
              <p>{t('home.regionalP1')}</p>
              <p>{t('home.regionalP2')}</p>
              <p>{t('home.regionalP3')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="h-full rounded-[2rem] bg-[var(--site-primary-soft)]/22 p-4 sm:p-5">
              <div className="h-full overflow-hidden rounded-[1.3rem] bg-[var(--site-background)]/85 p-3 sm:p-4">
                <img src={waMap} alt={t('home.regionalMapAlt')} className="h-full w-full object-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default RegionalPartners
