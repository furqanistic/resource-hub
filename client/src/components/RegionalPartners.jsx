import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import waMap from '@/assets/wa-map.avif';

const counties = [
    "Grays Harbor",
    "Mason",
    "Thurston",
    "Lewis",
    "Pacific",
    "Wahkiakum",
    "Cowlitz",
    "Glenwood"
];

const RegionalPartners = () => {
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                                CHOICE Regional <span className="text-primary block mt-2">Partners</span>
                            </h2>

                            <div className="text-muted-foreground text-lg space-y-6 max-w-xl">
                                <p>
                                    We believe that healthy communities are built on strong relationships, where people and community members are connected with one another and to essential services.
                                </p>
                                <p>
                                    We are dedicated to working together on community-driven solutions to solve some our most complex challenges in the central western Washington state region.
                                </p>
                                <p>
                                    This is a CHOICE regional transportation resource hub. CHOICE is working with local partners to help you get where you need to go.
                                </p>
                            </div>
                        </div>

                        {/* Interactive Pill List */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {counties.map((county, index) => (
                                <motion.span
                                    key={county}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    className="px-4 py-2 bg-secondary/50 dark:bg-secondary/20 text-secondary-foreground text-sm font-medium rounded-full border border-border hover:border-primary/50 transition-colors cursor-default"
                                >
                                    {county}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative group">
                            {/* Map Image with Drop Shadow and Glow */}
                            <div className="relative z-10 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(var(--primary),0.2)] dark:shadow-[0_0_50px_rgba(var(--primary),0.15)] transition-shadow duration-500 group-hover:shadow-[0_0_40px_rgba(var(--primary),0.3)]">
                                <img
                                    src={waMap}
                                    alt="Washington State Map showing CHOICE Regional Partners"
                                    className="w-full h-auto object-contain transform transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                            </div>

                            {/* Decorative Glow/Pulse Elements (Simulated locations) */}
                            {/* Note: In a real implementation, these would be positioned absolutely based on % coordinates of the map */}
                            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                                <span className="relative flex h-6 w-6">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-6 w-6 bg-primary/20"></span>
                                </span>
                            </div>
                            <div className="absolute top-[40%] left-[45%] z-20 pointer-events-none delay-300">
                                <span className="relative flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 delay-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-accent/20"></span>
                                </span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default RegionalPartners;
