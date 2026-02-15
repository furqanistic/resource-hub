// File: client/src/pages/DirectoryPage/DirectoryPage.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Filter,
    Search,
    X,
    Phone,
    Clock,
    CreditCard,
    MapPin,
    Calendar,
    Accessibility,
    ExternalLink,
    ChevronRight,
    MapPinned
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const getDetailIcon = (label) => {
    const iconMap = {
        'Phone': <Phone className="w-4 h-4" />,
        'Hours': <Clock className="w-4 h-4" />,
        'Access': <Accessibility className="w-4 h-4" />,
        'Cost': <CreditCard className="w-4 h-4" />,
        'County': <MapPin className="w-4 h-4" />,
        'Schedule Method': <Calendar className="w-4 h-4" />,
    };
    return iconMap[label] || <ChevronRight className="w-4 h-4" />;
};


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
                "relative overflow-hidden rounded-2xl border border-white/10 bg-card text-card-foreground shadow-2xl transition-all duration-300 flex flex-col group min-h-[500px]",
                "hover:border-primary/40 hover:shadow-primary/10 hover:bg-card/80",
                className
            )}
        >
            {/* Spotlight Gradient */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(var(--primary-rgb), 0.1), transparent 80%)`,
                }}
            />
            {/* Content Container */}
            <div className="relative h-full z-10 flex flex-col">{children}</div>
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
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 20 } },
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
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
            <Navbar />

            <main className="grow py-20 px-6 sm:px-12 container mx-auto max-w-7xl">
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                    >
                        <MapPinned className="w-4 h-4" />
                        <span>Transportation Directory</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                        Find Transportation <br />Services
                    </h1>

                    {/* Filter Section */}
                    <div className="space-y-6 max-w-4xl p-8 rounded-3xl bg-card/30 border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-2 text-xl font-bold tracking-tight">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Filter className="w-5 h-5" />
                            </div>
                            <span>Quick Filters</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search by name"
                                    className="pl-10 bg-background/50 border-white/10 focus-visible:ring-primary h-12 text-lg transition-all rounded-xl"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </div>

                            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                                <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary h-12 rounded-xl">
                                    <SelectValue placeholder="All Counties" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
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

                            <Select value={selectedService} onValueChange={setSelectedService}>
                                <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary h-12 rounded-xl">
                                    <SelectValue placeholder="All Services" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Services</SelectItem>
                                    <SelectItem value="Door to door">Door to door</SelectItem>
                                    <SelectItem value="On-demand">On-demand</SelectItem>
                                    <SelectItem value="Fixed route">Fixed route</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] h-12 px-8 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => { }}
                            >
                                Start My Search
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-white/5 text-foreground h-12 px-8 bg-transparent transition-all rounded-xl font-medium"
                                onClick={clearFilters}
                            >
                                Reset Filters
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="h-full"
                                whileHover={{
                                    y: -8,
                                    transition: { duration: 0.3, ease: "easeOut" }
                                }}
                            >
                                <SpotlightCard className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 py-1.5 px-3.5 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-sm transition-all duration-300">
                                            {service.category}
                                        </Badge>
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/10">
                                            <ExternalLink className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black mb-2 leading-tight text-foreground group-hover:text-primary transition-colors tracking-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-8 text-sm font-medium leading-relaxed">
                                        {service.subtitle}
                                    </p>

                                    <div className="space-y-5 mb-8 grow">
                                        {service.details.map((detail, idx) => (
                                            <div key={idx} className="flex gap-4 group/detail">
                                                <div className="mt-1 shrink-0 w-8 h-8 rounded-xl bg-card border border-white/10 flex items-center justify-center text-primary/70 group-hover/detail:text-primary group-hover/detail:scale-110 transition-all duration-300">
                                                    {getDetailIcon(detail.label)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                                                        {detail.label}
                                                    </span>
                                                    <span className="text-foreground text-sm font-bold leading-tight">
                                                        {detail.value}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Button className="w-full mt-auto rounded-xl h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all duration-300 border-none shadow-xl shadow-primary/20 group-hover:scale-[1.02]">
                                        Contact Service
                                        <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </SpotlightCard>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-6 rounded-3xl bg-secondary/20 text-muted-foreground">
                                <Search className="w-12 h-12 opacity-20" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">No Services Found</h3>
                                <p className="text-muted-foreground max-w-xs">
                                    We couldn't find any services matching your current filters. Try adjusting your search criteria.
                                </p>
                            </div>
                            <Button variant="link" onClick={clearFilters} className="text-primary font-bold">
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default DirectoryPage;
