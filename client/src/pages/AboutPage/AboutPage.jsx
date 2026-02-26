import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSections } from '@/lib/api/cmsApi';

const AboutPage = () => {
    const { t } = useLanguage();
    const [aboutFields, setAboutFields] = useState({});

    useEffect(() => {
        let active = true;

        getSections()
            .then((sections) => {
                if (!active || !Array.isArray(sections)) return;
                const aboutSection = sections.find(
                    (section) => (section?.sectionId || section?.id) === 'about.page'
                );
                setAboutFields(aboutSection?.fields || {});
            })
            .catch(() => {});

        return () => {
            active = false;
        };
    }, []);

    const aboutTitle = aboutFields['about-title'] || t('about.title');
    const aboutP1 = aboutFields['about-p1'] || t('about.p1');
    const aboutP2 = aboutFields['about-p2'] || t('about.p2');
    const aboutP3 = aboutFields['about-p3'] || t('about.p3');
    const aboutP4 = aboutFields['about-p4'] || t('about.p4');

    return (
        <div className="min-h-screen bg-white text-black flex flex-col font-sans">
            <Navbar />

            <main className="grow py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-10">
                    <div className="space-y-6 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-black"
                        >
                            {aboutTitle}
                        </motion.h1>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8 text-left">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            {aboutP1}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            {aboutP2}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            {aboutP3}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            {aboutP4}
                        </motion.p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
