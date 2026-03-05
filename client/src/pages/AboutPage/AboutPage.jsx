// File: client/src/pages/AboutPage/AboutPage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionThemeScope from '@/components/SectionThemeScope';
import { useLanguage } from '@/contexts/LanguageContext';
import axiosInstance from '@/lib/axiosInstance';

const AboutPage = ({ embedded = false }) => {
    const { t, language } = useLanguage();
    const [content, setContent] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchContent = async () => {
            try {
                const { data } = await axiosInstance.get('/content/about');
                if (isMounted) {
                    setContent(data?.data?.content || null);
                }
            } catch {
                if (isMounted) {
                    setContent(null);
                }
            }
        };

        fetchContent();

        return () => {
            isMounted = false;
        };
    }, []);

    const prefersLocalizedCopy = language !== 'en';
    const translatedParagraphs = [t('about.p1'), t('about.p2'), t('about.p3'), t('about.p4')];
    const pageTitle = prefersLocalizedCopy ? t('about.title') : (content?.title || t('about.title'));
    const paragraphs = prefersLocalizedCopy
        ? translatedParagraphs
        : (content?.paragraphs?.length ? content.paragraphs : translatedParagraphs);

    const aboutContent = (
        <SectionThemeScope scopeKey="about-main">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="rounded-[2rem] bg-[var(--site-primary-soft)]/34 p-7 sm:p-9 lg:col-span-5"
                >
                    <h1 className="text-3xl font-medium leading-[1.08] tracking-tight text-[var(--site-primary)] sm:text-4xl lg:text-5xl">
                        {pageTitle}
                    </h1>
                </motion.div>

                <div className="grid gap-4 lg:col-span-7">
                    {paragraphs.map((paragraph, index) => (
                        <motion.p
                            key={`${paragraph.slice(0, 24)}-${index}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.15 + index * 0.1, ease: 'easeOut' }}
                            className="rounded-[1.4rem] bg-[var(--site-primary-soft)]/16 px-6 py-5 text-[15px] leading-relaxed text-[var(--site-text)] sm:text-base"
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </div>
            </div>
        </SectionThemeScope>
    );

    if (embedded) {
        return (
            <section id="about" className="scroll-mt-28 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {aboutContent}
            </section>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[var(--site-background)] text-[var(--site-text)] font-sans">
            <Navbar />
            <main className="grow px-4 py-10 sm:px-6 sm:py-12 lg:px-8">{aboutContent}</main>
            <Footer />
        </div>
    );
};

export default AboutPage;
