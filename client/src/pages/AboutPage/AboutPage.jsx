import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutPage = () => {
    const { t } = useLanguage();
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
                            {t('about.title')}
                        </motion.h1>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8 text-left">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            {t('about.p1')}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            {t('about.p2')}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            {t('about.p3')}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            {t('about.p4')}
                        </motion.p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
