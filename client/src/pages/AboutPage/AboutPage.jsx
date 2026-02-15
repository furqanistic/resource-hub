// File: client/src/pages/AboutPage/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="grow py-32 px-6 sm:px-12 container mx-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-6xl font-bold mb-16 text-primary tracking-tight"
                    >
                        About & Partners
                    </motion.h1>

                    {/* Content */}
                    <div className="space-y-12">
                        {/* Paragraph 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative pl-6 md:pl-8 border-l-2 border-primary/50"
                        >
                            <div className="p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm">
                                <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
                                    This initiative was born out of a coalition of partners under the Great Rivers BH-ASO Transportation Collaborative. They were seeking solutions for people in the region who struggled to find transportation for their physical and mental health needs. Through multiple community surveys, the group discovered a major gap: people didn't know which resources existed or how to access them.
                                </p>
                            </div>
                        </motion.div>

                        {/* Paragraph 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="relative pl-6 md:pl-8 border-l-2 border-primary/50"
                        >
                            <div className="p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm">
                                <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
                                    CHOICE Regional Health Network, as a regional leader in Social Determinants of Health (SDOH), took the lead on hosting this hub. UnitedHealthcare (UHC) helped develop the resource framework based directly on community input.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
