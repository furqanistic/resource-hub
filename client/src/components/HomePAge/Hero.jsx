// File: client/src/components/HomePAge/Hero.jsx
import heroImg from '@/assets/CloudLogos/hero-img.jpg';
import { Button } from '@/components/ui/button';
import Marquee from '@/components/ui/marquee';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

import logo1 from '@/assets/CloudLogos/Logo 1.avif';
import logo2 from '@/assets/CloudLogos/Logo 2.avif';
import logo3 from '@/assets/CloudLogos/Logo 3.avif';
import logo4 from '@/assets/CloudLogos/Logo 4.avif';
import logo5 from '@/assets/CloudLogos/Logo 5.avif';

const logos = [
    { src: logo1, alt: 'Partner 1' },
    { src: logo2, alt: 'Partner 2' },
    { src: logo3, alt: 'Partner 3' },
    { src: logo4, alt: 'Partner 4' },
    { src: logo5, alt: 'Partner 5' },
];


const Hero = () => {
    const { t } = useLanguage();
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
        <section className="relative overflow-hidden bg-white py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#b1ccdf] rounded-none p-10 sm:p-12 lg:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Left Column: Content */}
                    <motion.div
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                        className="flex flex-col justify-center text-left"
                    >
                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#03385e] mb-5 leading-[1.12]"
                        >
                            {t('home.heroTitleLine1')}
                            <br className="hidden sm:block" />
                            {t('home.heroTitleLine2')}
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xs sm:text-sm text-black mb-8 whitespace-nowrap"
                        >
                            {t('home.heroSubtitle')}
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 justify-start"
                        >
                            <Button
                                size="default"
                                className="group w-full sm:w-auto px-8 h-11 text-sm font-semibold bg-[#03385e] text-white hover:bg-[#03385e]/90 shadow-sm hover:shadow-[#03385e]/20 transition-all rounded-none"
                            >
                                {t('home.heroCta')}
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 rounded-xl overflow-hidden shadow-xl border border-black/5"
                        >
                            <img
                                src={heroImg}
                                alt={t('home.heroImageAlt')}
                                className="w-full aspect-4/3 object-cover"
                            />
                        </motion.div>
                    </motion.div>
                </div>
                </div>
                <div className="mt-12">
                    <Marquee speed={18} pauseOnHover className="[--gap:2.5rem]">
                        {logos.map((logo, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-center w-44 h-32"
                            >
                                <img
                                    src={logo.src}
                                    alt={`${t('home.partnerLogoAlt')} ${index + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        ))}
                    </Marquee>
                </div>
            </div>
        </section>
    );
};

export default Hero;
