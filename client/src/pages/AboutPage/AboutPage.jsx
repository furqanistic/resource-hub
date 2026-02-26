import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import axiosInstance from '@/lib/axiosInstance';

const AboutPage = () => {
    const { t } = useLanguage();
    const [content, setContent] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchContent = async () => {
            try {
                const { data } = await axiosInstance.get('/content/about');
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

    const pageTitle = content?.title || t('about.title');
    const paragraphs = content?.paragraphs?.length
        ? content.paragraphs
        : [t('about.p1'), t('about.p2'), t('about.p3'), t('about.p4')];
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
                            {pageTitle}
                        </motion.h1>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8 text-left">
                        {paragraphs.map((paragraph, index) => (
                            <motion.p
                                key={`${paragraph.slice(0, 20)}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: "easeOut" }}
                                className="text-base sm:text-lg leading-relaxed text-black/80"
                            >
                                {paragraph}
                            </motion.p>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
