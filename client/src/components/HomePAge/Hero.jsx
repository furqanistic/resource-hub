// File: client/src/components/HomePAge/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Marquee from '@/components/ui/marquee';
import heroImg from '@/assets/CloudLogos/hero-img.avif';
import { Link } from 'react-router-dom';

// Importing logos
import logo1 from '@/assets/CloudLogos/brandLogo-1.png';
import logo2 from '@/assets/CloudLogos/brnadLogo-2.avif';
import logo3 from '@/assets/CloudLogos/brandLogo-3.png';
import logo4 from '@/assets/CloudLogos/brandLogo-4.png';
import logo6 from '@/assets/CloudLogos/brandLogo-6.png';

const logos = [
    { src: logo1, alt: 'Partner 1' },
    { src: logo2, alt: 'Partner 2' },
    { src: logo3, alt: 'Partner 3' },
    { src: logo4, alt: 'Partner 4' },
    { src: logo6, alt: 'Partner 5' },
];

const Hero = () => {
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
        <section className="relative overflow-hidden bg-white dark:bg-background pt-20 pb-10">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-30 dark:opacity-10">
                <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[0%] w-[25%] h-[25%] bg-accent/20 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 lg:mb-20">
                    {/* Left Column: Content */}
                    <motion.div
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                        className="flex flex-col justify-center text-center lg:text-left"
                    >
                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]"
                        >
                            Find a Ride in <br className="hidden sm:block" />
                            <span className="text-primary font-black relative px-1">
                                Your County
                                <span className="absolute bottom-1 left-0 w-full h-2 bg-primary/10 -z-10 rounded-sm"></span>
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-lg sm:text-xl text-slate-600 dark:text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Free or low-cost rides to the doctor, the store, and more.
                            We're here to help you get where you need to go.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Button
                                size="default"
                                className="group w-full sm:w-auto px-8 h-11 text-sm font-semibold shadow-sm hover:shadow-primary/20 hover:-translate-y-0.5 transition-all"
                            >
                                Start My Search
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Link to="/join" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="default"
                                    className="w-full group px-8 h-11 text-sm font-semibold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-accent/50 hover:-translate-y-0.5 transition-all"
                                >
                                    Join Us
                                    <UserPlus className="ml-2 w-4 h-4 group-hover:scale-105 transition-transform" />
                                </Button>
                            </Link>
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
                            className="relative z-10 rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-border"
                        >
                            <img
                                src={heroImg}
                                alt="Supportive driver providing transportation"
                                className="w-full aspect-4/3 object-cover"
                            />
                        </motion.div>
                    </motion.div>
                </div>
                {/* Integrated Logo Cloud */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="border-t border-slate-200 dark:border-border pt-10 overflow-hidden"
                >
                    <p className="text-center text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-[0.2em] mb-10">
                        Trusted by our community partners
                    </p>

                    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background py-4">
                        <Marquee pauseOnHover className="[--gap:4rem] [--duration:50s]">
                            {logos.map((logo, index) => (
                                <div key={index} className="flex items-center justify-center px-4  dark:grayscale grayscale-0 hover:opacity-100 transition-all duration-500">
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        className="h-16 sm:h-20 lg:h-24 w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </Marquee>
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-white dark:from-background"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-white dark:from-background"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
