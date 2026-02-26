// File: client/src/components/HomePAge/Hero.jsx
import heroImg from '@/assets/CloudLogos/hero-img.jpg';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { resolveAssetUrl } from '@/lib/api/cmsApi';

import gcrLogo from '@/assets/Brand/Greater Columbia River Behavioral Health Administrative Services Organization (GCRBHASO).png';
import cwcogLogo from '@/assets/Brand/Coastal Washington Council of Governments (CWCOG).png';

const logos = [
    { name: 'Great Rivers BH-ASO', src: gcrLogo },
    { name: 'UnitedHealthcare', src: null },
    { name: 'Cowlitz-Wahkiakum Council of Governments', src: cwcogLogo },
];


const Hero = ({ fields = {} }) => {
    const { t } = useLanguage();

    const heroTitle = fields['hero-title'] || t('home.heroTitle');
    const heroDescription1 = fields['hero-description1'] || t('home.heroDescription1');
    const heroDescription2 = fields['hero-description2'] || t('home.heroDescription2');
    const heroCta = fields['hero-cta'] || t('home.heroCta');
    const heroImage = resolveAssetUrl(fields['hero-image']) || heroImg;

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <section className="relative overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#b1ccdf] rounded-none p-6 sm:p-10 lg:p-14">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-10 lg:gap-14 items-center">
                    {/* Left Column: Content */}
                    <motion.div
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                        className="flex flex-col justify-center text-left"
                    >
                        <motion.h1
                            variants={fadeInUp}
                            className="max-w-xl text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.01em] text-[#03385e] mb-4 leading-[1.08]"
                        >
                            {heroTitle}
                        </motion.h1>

                        <motion.div variants={fadeInUp} className="mb-6 sm:mb-8 space-y-3">
                            <p className="max-w-2xl text-[14px] sm:text-base text-black/90 leading-relaxed">
                                {heroDescription1}
                            </p>
                            <p className="max-w-2xl text-[14px] sm:text-base text-black/90 leading-relaxed">
                                {heroDescription2}
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 justify-start"
                        >
                            <Button
                                size="default"
                                className="group w-full sm:w-auto px-6 sm:px-8 h-11 text-sm font-semibold bg-[#03385e] text-white hover:bg-[#03385e]/90 shadow-sm hover:shadow-[#03385e]/20 transition-all rounded-none"
                            >
                                {heroCta}
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative max-w-lg lg:max-w-none mx-auto lg:mx-0"
                    >
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 rounded-xl overflow-hidden shadow-xl border border-black/5"
                        >
                            <img
                                src={heroImage}
                                alt={t('home.heroImageAlt')}
                                className="w-full aspect-4/3 object-cover"
                            />
                        </motion.div>
                    </motion.div>
                </div>
                </div>
                <div className="mt-12">
                    <p className="mb-4 text-center text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#03385e]/70">
                        {t('home.supportingPartners')}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        {logos.map((logo, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-center w-36 h-16"
                            >
                                {logo.src ? (
                                    <img
                                        src={logo.src}
                                        alt={logo.name}
                                        className="max-h-full max-w-full object-contain grayscale opacity-70"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center rounded-sm bg-black/85 px-2">
                                        <span className="text-[10px] sm:text-xs text-white text-center leading-tight">
                                            {logo.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
