import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const partners = [
    'RiverCities Transit',
    'Washington State Health Care Authority (HCA)',
    'Destination Hope & Recovery',
    'Grays Harbor Transit',
    'Washington State Department of Health (DOH)',
    'Wahkiakum County',
    'Paratransit Services',
    'Behavioral Health Resources (BHR)',
    'Community Health Plan of Washington (CHPW)',
    'Greater Columbia River Behavioral Health Administrative Services Organization (GCRBHASO)',
    'Cascade Regional Health Network (CRHN)',
    'Arbor Health',
    'Disability Rights Washington (Disability Mobility Initiative)',
    'Community Transportation Association of the Northwest (CTANW)',
    'Community in Motion',
    'Coastal Community Action Program (Coastal CAP)',
    'Olympic Ambulance',
    'Coastal Washington Council of Governments (CWCOG)',
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } },
};

const PartnersPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="grow py-32 px-6 sm:px-12 container mx-auto">
                <div className="max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-6xl font-bold mb-16 text-primary tracking-tight text-center"
                    >
                        Partners
                    </motion.h1>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {partners.map((partner, index) => (
                            <motion.a
                                key={index}
                                variants={itemVariants}
                                href="#" // Placeholder link
                                className="group flex items-center justify-between p-4 rounded-lg bg-card border border-white/10 hover:border-primary hover:scale-[1.02] transition-all duration-300 shadow-sm"
                            >
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-left grow pr-4">
                                    {partner}
                                </span>
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PartnersPage;
