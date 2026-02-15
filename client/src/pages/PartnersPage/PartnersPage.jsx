import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/10">
            <Navbar />

            <main className="grow py-24 sm:py-32 px-6 sm:px-12 container mx-auto">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="space-y-6 text-center sm:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary"
                        >
                            Partners
                        </motion.h1>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {partners.map((partner, index) => (
                            <motion.a
                                key={index}
                                variants={itemVariants}
                                href="#" // Placeholder link
                                className="block h-full"
                            >
                                <Card className="h-full bg-card/50 hover:bg-card/100 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md group">
                                    <CardContent className="p-6 flex items-center justify-between gap-4 h-full">
                                        <span className="text-base font-medium text-muted-foreground group-hover:text-primary transition-colors text-left line-clamp-2">
                                            {partner}
                                        </span>
                                        <ExternalLink className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                                    </CardContent>
                                </Card>
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
