// File: client/src/components/HomePage/AboutRegionalCombined.jsx
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
                </div>
            </section>
        </SectionThemeScope>
    );
};

export default AboutRegionalCombined;
