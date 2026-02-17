// File: client/src/components/RegionalPartners.jsx
import React from 'react';
import { motion } from 'framer-motion';
import waMap from '@/assets/wa-map.avif';

const RegionalPartners = () => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left Column: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-6"
                    >
                        <h2 className="text-4xl sm:text-5xl font-semibold text-black leading-tight">
                            CHOICE Regional
                            <br />
                            Partners
                        </h2>

                        <div className="text-black text-base sm:text-lg leading-relaxed max-w-xl space-y-4">
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
                    </motion.div>

                    {/* Right Column: Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative">
                            <img
                                src={waMap}
                                alt="Washington State Map showing CHOICE Regional Partners"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default RegionalPartners;
