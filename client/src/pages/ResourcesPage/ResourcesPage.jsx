// File: client/src/pages/ResourcesPage/ResourcesPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import axiosInstance from '@/lib/axiosInstance';

const ResourcesPage = () => {
    const { t } = useLanguage();
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

    const resources = content?.resources?.length ? content.resources : fallbackResources;
    const pageTitle = content?.title || t('resources.title');
    const pageSubtitle = content?.subtitle || t('resources.subtitle');
    return (
        <div className="min-h-screen flex flex-col bg-[var(--site-background)] text-[var(--site-text)] font-sans">
            <Navbar />

            <main className="flex-grow">
                <section className="bg-[#f6f9fb] border-b border-black/5">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black tracking-tight leading-[1.05]">
                                {pageTitle}
                            </h1>
                            <p className="mt-4 text-sm sm:text-base text-black/60">
                                {pageSubtitle}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resources.map((resource) => (
                            <div
                                key={resource.id || resource.title}
                                className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_20px_60px_-50px_rgba(3,56,94,0.4)]"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-black">
                                        {resource.title}
                                    </h2>
                                </div>
                                <p className="mt-3 text-sm sm:text-base text-black/60 leading-relaxed">
                                    {resource.description}
                                </p>
                                <div className="mt-6">
                                    <a
                                        href={resource.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#03385e] hover:text-[#03385e]/80"
                                    >
                                        {resource.ctaLabel}
                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M5 10a.75.75 0 0 1 .75-.75h6.69L9.22 6.03a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H5.75A.75.75 0 0 1 5 10z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ResourcesPage;
