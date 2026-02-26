// File: client/src/components/RegionalPartners.jsx
import React from 'react';
import { motion } from 'framer-motion';
import waMap from '@/assets/wa-map.avif';
import { useLanguage } from '@/contexts/LanguageContext';
import { resolveAssetUrl } from '@/lib/api/cmsApi';

const RegionalPartners = ({ fields = {} }) => {
    const { t } = useLanguage();
    const regionalTitleLine1 = fields['regional-title-1'] || t('home.regionalTitleLine1');
    const regionalTitleLine2 = fields['regional-title-2'] || t('home.regionalTitleLine2');
    const regionalP1 = fields['regional-p1'] || t('home.regionalP1');
    const regionalP2 = fields['regional-p2'] || t('home.regionalP2');
    const regionalImage = resolveAssetUrl(fields['regional-image']) || waMap;

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
                            {regionalTitleLine1}
                            <br />
                            {regionalTitleLine2}
                        </h2>

                        <div className="text-black text-base sm:text-lg leading-relaxed max-w-xl space-y-4">
                            <p>
                                {regionalP1}
                            </p>
                            <p>
                                {regionalP2}
                            </p>
                            <p>
                                {t('home.regionalP3')}
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
                                src={regionalImage}
                                alt={t('home.regionalMapAlt')}
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
