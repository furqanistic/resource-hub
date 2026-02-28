// File: client/src/components/HomePage/NeedHelp.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const NeedHelp = () => {
    const { t } = useLanguage();
    return (
        <section className="relative overflow-hidden bg-[var(--site-primary)] py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-medium text-white mb-8">
                        {t('home.needHelpTitle')}
                    </h2>

                    <Button
                        size="lg"
                        className="rounded-none bg-[var(--site-background)] px-8 py-6 text-lg font-medium text-[var(--site-text)] shadow-none transition-opacity hover:opacity-90"
                    >
                        {t('home.needHelpCta')}
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default NeedHelp;
