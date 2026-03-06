// File: client/src/pages/ResourcesPage/ResourcesPage.jsx
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import SectionThemeScope from '@/components/SectionThemeScope';
import { useLanguage } from '@/contexts/LanguageContext';
import axiosInstance from '@/lib/axiosInstance';
import React, { useEffect, useMemo, useState } from 'react';

const ResourcesPage = ({ embedded = false }) => {
    const { t, language } = useLanguage();
    const [content, setContent] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchContent = async () => {
            try {
                const { data } = await axiosInstance.get('/content/resources');
                if (isMounted) {
                    setContent(data?.data?.content || null);
                }
            } catch (error) {
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

    const fallbackResources = useMemo(
        () => [
            {
                id: 'cwcog',
                title: t('resources.cwcogTitle'),
                description: t('resources.cwcogDesc'),
                ctaLabel: t('resources.cwcogCta'),
                href: 'https://www.cwcog.org/mobility-management/',
            },
            {
                id: 'gr-bhaso',
                title: t('resources.grTitle'),
                description: t('resources.grDesc'),
                ctaLabel: t('resources.grCta'),
                href: 'https://www.grbhaso.org',
            },
        ],
        [t]
    );

    const useSpanishCopy = language === 'es';
    const resources = content?.resources?.length
        ? content.resources.map((resource) => ({
            ...resource,
            title: useSpanishCopy ? (resource?.titleEs || resource?.title) : resource?.title,
            description: useSpanishCopy ? (resource?.descriptionEs || resource?.description) : resource?.description,
            ctaLabel: useSpanishCopy ? (resource?.ctaLabelEs || resource?.ctaLabel) : resource?.ctaLabel,
        }))
        : fallbackResources;
    const pageTitle = useSpanishCopy
        ? (content?.titleEs || content?.title || t('resources.title'))
        : (content?.title || t('resources.title'));
    const pageSubtitle = useSpanishCopy
        ? (content?.subtitleEs || content?.subtitle || t('resources.subtitle'))
        : (content?.subtitle || t('resources.subtitle'));
    const sectionYClass = embedded ? 'py-8 sm:py-10' : 'py-16 sm:py-24';
    const headingSpaceClass = embedded ? 'mb-8' : 'mb-16';
    const cardGapClass = embedded ? 'gap-6 lg:gap-8' : 'gap-8 lg:gap-10';
    const cardPadClass = embedded ? 'p-6 sm:p-7' : 'p-8 sm:p-10';

    const resourcesContent = (
        <SectionThemeScope scopeKey="resources-main">
            <div className={`bg-[var(--site-background)] ${sectionYClass} relative overflow-hidden`}>
                {/* Subtle background decoration */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--site-primary-soft)]/10 blur-[100px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 ${headingSpaceClass}`}>
                        <div className="max-w-2xl">
                            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[var(--site-primary-soft)]/20 border border-[var(--site-primary-soft)]/30 text-[var(--site-primary)] text-xs font-bold tracking-widest uppercase">
                                {t('nav.resources')}
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--site-primary)] tracking-tight leading-[1.1]">
                                {pageTitle}
                            </h2>
                            <p className="mt-6 text-[16px] sm:text-[17px] text-[var(--site-text-soft)] leading-relaxed">
                                {pageSubtitle}
                            </p>
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 ${cardGapClass}`}>
                        {resources.map((resource, idx) => (
                            <div
                                key={resource.id || resource.title}
                                className={`group relative flex flex-col ${cardPadClass} rounded-[2.5rem] bg-white border border-[var(--site-primary-soft)]/30 transition-all duration-500 hover:border-[var(--site-primary)]/50 hover:-translate-y-2 overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--site-primary-soft)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                
                                <div className="relative z-10">
                                    <div className="w-12 h-1.5 rounded-full bg-[var(--site-primary-soft)] mb-8 transition-all duration-500 group-hover:w-20 group-hover:bg-[var(--site-primary)]" />
                                    
                                    <h3 className="text-2xl sm:text-3xl font-bold text-[var(--site-primary)] mb-4">
                                        {resource.title}
                                    </h3>
                                    
                                    <p className="text-[15px] sm:text-[16px] text-[var(--site-text-soft)] leading-relaxed mb-10">
                                        {resource.description}
                                    </p>
                                    
                                    <div className="mt-auto">
                                        <a
                                            href={resource.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--site-primary-soft)]/20 border border-[var(--site-primary-soft)]/30 text-sm font-bold text-[var(--site-primary)] transition-all duration-300 hover:bg-[var(--site-primary)] hover:text-white group/btn"
                                        >
                                            {resource.ctaLabel}
                                            <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionThemeScope>
    );

    if (embedded) {
        return (
            <section id="resources" className="scroll-mt-28">
                {resourcesContent}
            </section>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[var(--site-background)] text-[var(--site-text)] font-sans">
            <Navbar />
            <main className="flex-grow">{resourcesContent}</main>
            <Footer />
        </div>
    );
};

export default ResourcesPage;
