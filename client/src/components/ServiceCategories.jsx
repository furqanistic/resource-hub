// File: client/src/components/ServiceCategories.jsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Apple, Briefcase, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
    {
        title: "Rides to See a Doctor",
        icon: Stethoscope,
        color: "text-red-500", // Example accent
    },
    {
        title: "Rides for Food & Groceries",
        icon: Apple,
        color: "text-green-500",
    },
    {
        title: "Rides for Housing & Work",
        icon: Briefcase,
        color: "text-blue-500",
    },
    {
        title: "Buses & Public Transit",
        icon: Bus,
        color: "text-yellow-500",
    },
];

const SpotlightCard = ({ children, className = "" }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300",
                className
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};

const ServiceCategories = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
    };

    return (
        <section className="bg-background py-10 px-6 md:px-12">
            <div className="container mx-auto">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {categories.map((category, index) => (
                        <motion.div key={index} variants={item} className="h-full">
                            <SpotlightCard className="h-full group border-white/10 hover:border-primary transition-colors">
                                <div className="h-full p-6 sm:p-8 flex flex-col items-center justify-center text-center relative z-10">
                                    <div className={cn("mb-4 sm:mb-6 p-3 sm:p-4 rounded-full bg-secondary/30 group-hover:scale-110 transition-transform duration-300", category.color)}>
                                        <category.icon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-base sm:text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                                        {category.title}
                                    </h3>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ServiceCategories;
