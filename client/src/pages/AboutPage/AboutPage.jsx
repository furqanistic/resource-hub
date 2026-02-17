import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutPage = () => {
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
                            About &amp; Partners
                        </motion.h1>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8 text-left">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            This initiative was born out of a coalition of partners under the Great Rivers BH-ASO Transportation Collaborative. They were seeking solutions for people in the region who struggled to find transportation for their physical and mental health needs. Through multiple community surveys, the group discovered a major gap: people didn't know which resources existed or how to access them.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
                            className="text-base sm:text-lg leading-relaxed text-black/80"
                        >
                            CHOICE Regional Health Network, as a regional leader in Social Determinants of Health (SDOH), took the lead on hosting this hub. UnitedHealthcare (UHC) helped develop the resource framework based directly on community input.
                        </motion.p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
