import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/10">
            <Navbar />

            <main className="grow py-24 sm:py-32 px-6 sm:px-12 container mx-auto">
                <div className="max-w-3xl mx-auto space-y-16">
                    {/* Headline */}
                    <div className="space-y-6 text-center sm:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary"
                        >
                            About the Initiative
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-xl text-muted-foreground max-w-2xl"
                        >
                            Bridging the gap between community needs and available transportation resources.
                        </motion.p>
                    </div>

                    {/* About Content */}
                    <div className="grid gap-8">
                        {/* Section 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="border-none shadow-none bg-transparent">
                                <CardContent className="p-0 sm:p-0">
                                    <div className="pl-6 border-l-2 border-primary/30 space-y-4">
                                        <p className="text-lg leading-relaxed text-muted-foreground">
                                            This initiative was born out of a coalition of partners under the <span className="font-semibold text-foreground">Great Rivers BH-ASO Transportation Collaborative</span>. They were seeking solutions for people in the region who struggled to find transportation for their physical and mental health needs.
                                        </p>
                                        <p className="text-lg leading-relaxed text-muted-foreground">
                                            Through multiple community surveys, the group discovered a major gap: people didn't know which resources existed or how to access them.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Section 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Card className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card/80 transition-colors duration-500">
                                <CardContent className="p-8 sm:p-10">
                                    <p className="text-lg sm:text-xl font-medium leading-relaxed text-foreground/90">
                                        <span className="text-primary font-bold">CHOICE Regional Health Network</span>, as a regional leader in Social Determinants of Health (SDOH), took the lead on hosting this hub. <span className="text-primary font-bold">UnitedHealthcare (UHC)</span> helped develop the resource framework based directly on community input.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
