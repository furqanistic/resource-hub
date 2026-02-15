import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Spotlight Card Component (Cleaned up and adapted)
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

    const handleFocus = () => setOpacity(1);
    const handleBlur = () => setOpacity(0);
    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 bg-card text-card-foreground shadow-sm transition-all duration-300 h-full",
                className
            )}
        >
            {/* Spotlight Gradient */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
                }}
            />
            {/* Content Container */}
            <div className="relative h-full z-10">{children}</div>
        </div>
    );
};


const servicesData = [
    {
        type: 'Transport',
        category: 'Door to door',
        title: 'disabled american veterans (DAV) washington',
        subtitle: 'door to door',
        details: [
            { label: 'Phone', value: '(888) 604-0234' },
            { label: 'Hours', value: 'Sun–Sat: Depends on availability' },
            { label: 'Access', value: 'Walker' },
            { label: 'Cost', value: 'Free for veterans' },
            { label: 'County', value: 'Lewis County' },
            { label: 'Schedule Method', value: 'Call Ahead' },
        ],
    },
    {
        type: 'Transport',
        category: 'Door to door',
        title: 'golden chariot',
        subtitle: 'door to door',
        details: [
            { label: 'Phone', value: '(360) 944-9833' },
            { label: 'Hours', value: 'Sun–Sat: 24 hours' },
            { label: 'Access', value: 'Foldable Wheelchair; Walker' },
            {
                label: 'Cost',
                value:
                    'Wheelchair Service: $100 One way (in county); $120 Round Trip (in county); Comfort Car Service: $50 One Way (in county); $60 Round Trip (in county) — Out of county rates vary',
            },
            { label: 'County', value: 'Lewis County' },
            { label: 'Schedule Method', value: 'Call Ahead' },
        ],
    },
    {
        type: 'Transport',
        category: 'Fixed route',
        title: 'grays harbor transit',
        subtitle: 'fixed route',
        details: [
            { label: 'Phone', value: '(360) 532-2770' },
            {
                label: 'Hours',
                value:
                    'Sun–Sat: 5:00 AM–10:00 PM; Sat–Sun 7:20 AM–8:45 PM',
            },
            {
                label: 'Access',
                value:
                    'Bike Rack; Foldable Wheelchair; Powerchair; Scooter; Walker; Wheelchair',
            },
            { label: 'Cost', value: 'Free' },
            { label: 'County', value: 'Pacific County' },
            { label: 'Schedule Method', value: 'Just Show Up' },
        ],
    },
    {
        type: 'Transport',
        category: 'On-demand',
        title: 'grays harbor transit ADA specialized van service',
        subtitle: 'on-demand',
        details: [
            { label: 'Phone', value: '(360) 532-2770' },
            {
                label: 'Hours',
                value:
                    'Sun–Sat: 5:00 AM–10:00 PM; Sat–Sun 7:20 AM–8:45 PM',
            },
            {
                label: 'Access',
                value:
                    'Foldable Wheelchair; Powerchair; Scooter; Walker; Wheelchair',
            },
            { label: 'Cost', value: 'Free' },
            { label: 'County', value: 'Clark County' },
            {
                label: 'Schedule Method',
                value: 'Call Ahead + Complete Application',
            },
        ],
    },
    {
        type: 'Transport',
        category: 'On-demand',
        title: 'grays harbor transit general public dial-a-ride',
        subtitle: 'on-demand',
        details: [
            { label: 'Phone', value: '(360) 532-2770' },
            { label: 'Hours', value: 'Mon–Fri: Route times vary' },
            {
                label: 'Access',
                value:
                    '"Bike Rack; Foldable Wheelchair; Powerchair; Scooter; Walker; Wheelchair"',
            },
            { label: 'Cost', value: 'Free' },
            { label: 'County', value: 'Grays Harbor County' },
            { label: 'Schedule Method', value: 'Call Ahead' },
        ],
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } },
};

const DirectoryPage = () => {
    const [searchName, setSearchName] = useState('');
    const [selectedCounty, setSelectedCounty] = useState('all');
    const [selectedService, setSelectedService] = useState('all');

    const filteredServices = servicesData.filter(service => {
        const matchesName = service.title.toLowerCase().includes(searchName.toLowerCase());
        const matchesCounty = selectedCounty === 'all' || service.details.some(d => d.label === 'County' && d.value === selectedCounty);
        const matchesService = selectedService === 'all' || service.category === selectedService;
        return matchesName && matchesCounty && matchesService;
    });

    const clearFilters = () => {
        setSearchName('');
        setSelectedCounty('all');
        setSelectedService('all');
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="grow py-20 px-6 sm:px-12 container mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                        Find Transportation Services
                    </h1>

                    {/* Filter Section */}
                    <div className="space-y-4 max-w-4xl">
                        <div className="flex items-center gap-2 mb-2 text-xl font-medium">
                            <Filter className="w-5 h-5 text-primary" />
                            <span>Filter Services</span>
                        </div>

                        <div className="w-full">
                            <Input
                                placeholder="Search by name"
                                className="bg-card border-white/10 focus-visible:ring-primary h-12 text-lg transition-all"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/2">
                                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                                    <SelectTrigger className="bg-card border-white/10 focus:ring-primary h-12">
                                        <SelectValue placeholder="All Counties" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Counties</SelectItem>
                                        <SelectItem value="Lewis County">Lewis County</SelectItem>
                                        <SelectItem value="Pacific County">Pacific County</SelectItem>
                                        <SelectItem value="Clark County">Clark County</SelectItem>
                                        <SelectItem value="Wahkiakum County">Wahkiakum County</SelectItem>
                                        <SelectItem value="Grays Harbor County">Grays Harbor County</SelectItem>
                                        <SelectItem value="Cowlitz County">Cowlitz County</SelectItem>
                                        <SelectItem value="Mason County">Mason County</SelectItem>
                                        <SelectItem value="Thurston County">Thurston County</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full md:w-1/2">
                                <Select value={selectedService} onValueChange={setSelectedService}>
                                    <SelectTrigger className="bg-card border-white/10 focus:ring-primary h-12">
                                        <SelectValue placeholder="All Services" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Services</SelectItem>
                                        <SelectItem value="Door to door">Door to door</SelectItem>
                                        <SelectItem value="On-demand">On-demand</SelectItem>
                                        <SelectItem value="Fixed route">Fixed route</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] h-11 px-8 transition-transform hover:scale-105"
                            >
                                Start My Search
                            </Button>
                            <Button
                                variant="outline"
                                className="border-border hover:bg-secondary/20 text-foreground h-11 px-8 bg-transparent transition-all"
                                onClick={clearFilters}
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Service Cards Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="h-full"
                                whileHover={{
                                    scale: 1.02,
                                    rotateX: 2,
                                    rotateY: 2,
                                    transition: { duration: 0.2 }
                                }}
                                style={{ perspective: 1000 }}
                            >
                                <SpotlightCard className="p-6">
                                    <h3 className="text-xl font-bold mb-1 leading-tight text-foreground group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6 text-sm font-medium">
                                        {service.subtitle}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                                        {service.details.map((detail, idx) => (
                                            <div key={idx} className={detail.value && detail.value.length > 50 ? "sm:col-span-2" : ""}>
                                                <div className="text-primary font-semibold mb-0.5">
                                                    {detail.label}
                                                </div>
                                                <div className="text-foreground/90 leading-relaxed">
                                                    {detail.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-muted-foreground">
                            No services found matching your criteria.
                        </div>
                    )}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default DirectoryPage;
