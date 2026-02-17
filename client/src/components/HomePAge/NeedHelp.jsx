// File: client/src/components/HomePage/NeedHelp.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const NeedHelp = () => {
    return (
        <section className="relative py-20 bg-[#03385e] overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-medium text-white mb-8">
                        Need Extra Help?
                    </h2>

                    <Button
                        size="lg"
                        className="bg-[#b1ccdf] text-black font-medium px-8 py-6 text-lg rounded-none shadow-none hover:bg-[#b1ccdf]/90 transition-colors"
                    >
                        Start My Search
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default NeedHelp;
