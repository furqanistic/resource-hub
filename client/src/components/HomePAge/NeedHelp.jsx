// File: client/src/components/HomePage/NeedHelp.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const NeedHelp = () => {
    return (
        <section className="relative py-24 bg-slate-50 dark:bg-zinc-900/40 border-y border-slate-200 dark:border-white/5 overflow-hidden">
            {/* Spotlight Radial Gradient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(45, 212, 191, 0.08) 0%, rgba(0, 0, 0, 0) 70%)'
                }}
            />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2
                        className="text-4xl sm:text-5xl font-bold text-foreground mb-8 text-center [text-shadow:none] dark:[text-shadow:0_0_10px_rgba(255,255,255,0.3)]"
                    >
                        Need Extra Help?
                    </h2>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <Button
                            size="lg"
                            className="bg-primary text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-[0_0_30px_-5px_var(--primary)] hover:shadow-[0_0_50px_-5px_var(--primary)] transition-all duration-300 group"
                        >
                            Start My Search
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default NeedHelp;
