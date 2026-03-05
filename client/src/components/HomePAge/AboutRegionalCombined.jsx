// File: client/src/components/HomePage/AboutRegionalCombined.jsx
import waMap from '@/assets/wa-map.avif';
import SectionThemeScope from '@/components/SectionThemeScope';
import { useLanguage } from '@/contexts/LanguageContext';
import axiosInstance from '@/lib/axiosInstance';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const AboutRegionalCombined = () => {
    const { t, language } = useLanguage();
    const [aboutContent, setAboutContent] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchAbout = async () => {
            try {
                const { data } = await axiosInstance.get('/content/about');
                if (isMounted) setAboutContent(data?.data?.content || null);
            } catch {
                if (isMounted) setAboutContent(null);
            }
        };
        fetchAbout();
        return () => { isMounted = false; };
    }, []);

    const prefersLocalizedCopy = language !== 'en';
    const aboutTitle = prefersLocalizedCopy ? t('about.title') : (aboutContent?.title || t('about.title'));
    const titleParts = aboutTitle.includes('&')
        ? aboutTitle.split('&').map((part) => part.trim())
        : aboutTitle.includes(' y ')
            ? aboutTitle.split(' y ').map((part) => part.trim())
            : [aboutTitle];
    const titleConnector = aboutTitle.includes('&') ? '&' : (aboutTitle.includes(' y ') ? 'y' : null);
    const placeholders = [t('about.p1'), t('about.p2'), t('about.p3'), t('about.p4')];
    const aboutParagraphs = prefersLocalizedCopy
        ? placeholders
        : (aboutContent?.paragraphs?.length ? aboutContent.paragraphs : placeholders);

    return (
        <SectionThemeScope scopeKey="home-regional">
            <section id="about" className="scroll-mt-28 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--site-background)] relative overflow-hidden">
                {/* Decorative background elements replaced with subtle overlay */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--site-primary-soft)]/5 to-transparent pointer-events-none" />



                <div className="mx-auto max-w-7xl relative z-10">
                    <div className="flex flex-col gap-12 lg:gap-20">
                        {/* Upper Part: About Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="lg:col-span-5 relative"
                            >
                                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[var(--site-primary-soft)]/20 border border-[var(--site-primary-soft)]/30 text-[var(--site-primary)] text-sm font-bold tracking-wider uppercase">
                                    {t('nav.about')}
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-[var(--site-primary)]">
                                    {titleParts.map((part, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && titleConnector && <span className="text-[var(--site-text-soft)] mx-2">{titleConnector}</span>}
                                            {part.trim()}
                                        </React.Fragment>
                                    ))}
                                </h2>
                                <div className="mt-8 h-1.5 w-24 rounded-full bg-gradient-to-r from-[var(--site-primary)] to-transparent" />
                            </motion.div>

                            <div className="lg:col-span-7 flex flex-col gap-6">
                                {aboutParagraphs.map((p, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: i * 0.12 }}
                                        className="group relative p-1"
                                    >
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--site-primary-soft)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <p className="relative z-10 text-[16px] sm:text-[17px] leading-relaxed text-[var(--site-text)] pl-6 border-l-2 border-[var(--site-primary-soft)]/40 hover:border-[var(--site-primary)] transition-colors duration-300 py-1">
                                            {p}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--site-primary-soft)] to-transparent opacity-30" />

                        {/* Lower Part: Regional Partners Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="lg:col-span-6 order-2 lg:order-1"
                            >
                                <div className="relative group p-2">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--site-primary)] to-[var(--site-secondary)] rounded-[2.5rem] opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500" />
                                    <div className="relative rounded-[2.2rem] bg-white/40 backdrop-blur-md border border-white/50 p-6 sm:p-10 overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-[var(--site-primary-soft)]/5 to-transparent pointer-events-none" />
                                        <img 
                                            src={waMap} 
                                            alt={t('home.regionalMapAlt')} 
                                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105 pointer-events-none" 
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                                className="lg:col-span-6 order-1 lg:order-2"
                            >
                                <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-6 rounded-full bg-[var(--site-primary-soft)]/20 border border-[var(--site-primary-soft)]/30 text-[var(--site-primary)] text-xs font-bold tracking-[0.15em] uppercase">
                                    <span className="w-2 h-2 rounded-full bg-[var(--site-primary)] animate-pulse" />
                                    {t('home.regionalImpact')}
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-bold leading-tight text-[var(--site-primary)] mb-8">
                                    {t('home.regionalTitleLine1')} <br />
                                    <span className="text-[var(--site-text-soft)]">{t('home.regionalTitleLine2')}</span>
                                </h3>

                                <div className="flex flex-col gap-6 text-[16px] sm:text-[17px] leading-relaxed text-[var(--site-text)]">
                                    {[t('home.regionalP1'), t('home.regionalP2'), t('home.regionalP3')].map((text, idx) => (
                                        <motion.p 
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                            className="relative pl-8"
                                        >
                                            <span className="absolute left-0 top-3 w-4 h-[2px] bg-[var(--site-primary-soft)] rounded-full" />
                                            {text}
                                        </motion.p>
                                    ))}
                                </div>
                                
                                <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-[var(--site-primary)]/5 to-transparent border border-[var(--site-primary-soft)]/20">
                                    <p className="text-sm font-medium italic text-[var(--site-primary)] opacity-80">
                                        "{t('home.regionalP2')}"
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </SectionThemeScope>
    );
};

export default AboutRegionalCombined;
