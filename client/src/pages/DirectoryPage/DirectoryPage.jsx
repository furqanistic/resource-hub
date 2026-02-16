// File: client/src/pages/DirectoryPage/DirectoryPage.jsx
import React, { useState, useRef, useMemo } from 'react';
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
    MapPinned,
    Loader2
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import rawServicesData from '@/lib/data/Transportation Services in Washington.json';

const getDetailIcon = (label) => {
    const iconMap = {
        'Phone': <Phone className="w-4 h-4" />,
        'Hours': <Clock className="w-4 h-4" />,
        'Access': <Accessibility className="w-4 h-4" />,
        'Cost': <CreditCard className="w-4 h-4" />,
        'County': <MapPin className="w-4 h-4" />,
        'Website': <ExternalLink className="w-4 h-4" />,
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
                "relative overflow-hidden rounded-2xl border border-white/10 bg-card text-card-foreground shadow-2xl transition-all duration-300 flex flex-col group min-h-[400px]",
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

// Transform raw data to match component structure
const servicesData = rawServicesData.map(item => ({
    type: item["Service Category"] || 'Transport',
    category: item["Service Type(s)"] || 'General',
    title: item["Provider Name"],
    subtitle: item["Service Type(s)"] || 'Transportation Service',
    url: item["Website Url"],
    details: [
        { label: 'Phone', value: item["Phone"] },
        { label: 'Hours', value: item["Service Times"] },
        { label: 'Access', value: item["Accessibility"] },
        { label: 'Cost', value: item["Cost"] },
        { label: 'County', value: item["Counties Served"] },
        // { label: 'Website', value: item["Website Url"] } // Optional to show as detail
    ].filter(detail => detail.value) // Filter out missing details
}));

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
    // Input State (Controlled by user interaction)
    const [searchTerm, setSearchTerm] = useState('');
    const [countyFilter, setCountyFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');

    // Active Filter State (Applied only when "Start My Search" is clicked)
    const [activeSearch, setActiveSearch] = useState('');
    const [activeCounty, setActiveCounty] = useState('all');
    const [activeService, setActiveService] = useState('all');

    const [isSearching, setIsSearching] = useState(false);

    // Extract unique counties and services for filter dropdowns with useMemo
    const allCounties = useMemo(() => [...new Set(servicesData.flatMap(service =>
        service.details.find(d => d.label === 'County')?.value.split(',').map(c => c.trim()) || []
    ))].sort(), []);

    const allServices = useMemo(() => [...new Set(servicesData.flatMap(service =>
        service.category.split(',').map(s => s.trim()) || []
    ))].sort(), []);

    const filteredServices = servicesData.filter(service => {
        const matchesName = service.title.toLowerCase().includes(activeSearch.toLowerCase());

        const serviceCounties = service.details.find(d => d.label === 'County')?.value.toLowerCase() || '';
        const matchesCounty = activeCounty === 'all' || serviceCounties.includes(activeCounty.toLowerCase());

        const serviceTypes = service.category.toLowerCase();
        const matchesService = activeService === 'all' || serviceTypes.includes(activeService.toLowerCase());

        return matchesName && matchesCounty && matchesService;
    });

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Reset page when ACTIVE filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [activeSearch, activeCounty, activeService]);

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = () => {
        setIsSearching(true);
        // Simulate network delay for better UX
        setTimeout(() => {
            setActiveSearch(searchTerm);
            setActiveCounty(countyFilter);
            setActiveService(serviceFilter);
            setIsSearching(false);
        }, 600);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCountyFilter('all');
        setServiceFilter('all');

        setActiveSearch('');
        setActiveCounty('all');
        setActiveService('all');
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <Select
                                value={countyFilter}
                                onValueChange={setCountyFilter}
                                key={`county-${countyFilter}`}
                            >
                                <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary h-12 rounded-xl">
                                    <SelectValue placeholder="All Counties" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl max-h-[300px]">
                                    <SelectItem value="all">All Counties</SelectItem>
                                    {allCounties.map(county => (
                                        <SelectItem key={county} value={county}>{county}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={serviceFilter}
                                onValueChange={setServiceFilter}
                                key={`service-${serviceFilter}`}
                            >
                                <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary h-12 rounded-xl">
                                    <SelectValue placeholder="All Services" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl max-h-[300px]">
                                    <SelectItem value="all">All Services</SelectItem>
                                    {allServices.map(service => (
                                        <SelectItem key={service} value={service}>{service}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] h-12 px-8 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    'Start My Search'
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-white/5 text-foreground h-12 px-8 bg-transparent transition-all rounded-xl font-medium w-full sm:w-auto"
                                onClick={clearFilters}
                                disabled={isSearching}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Service Cards Grid */}
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-muted-foreground font-medium">Finding the best services for you...</p>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
                    >
                        {currentServices.length > 0 ? (
                            currentServices.map((service, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="h-full"
                                    whileHover={{
                                        y: -8,
                                        transition: { duration: 0.3, ease: "easeOut" }
                                    }}
                                >
                                    <SpotlightCard className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 py-1 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-sm transition-all duration-300">
                                                {service.category}
                                            </Badge>
                                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/10">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black mb-1 leading-tight text-foreground group-hover:text-primary transition-colors tracking-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-4 text-xs font-medium leading-relaxed">
                                            {service.subtitle}
                                        </p>

                                        <div className="space-y-3 mb-6 grow">
                                            {service.details.map((detail, idx) => (
                                                <div key={idx} className="flex gap-3 group/detail">
                                                    <div className="mt-0.5 shrink-0 w-6 h-6 rounded-lg bg-card border border-white/10 flex items-center justify-center text-primary/70 group-hover/detail:text-primary group-hover/detail:scale-110 transition-all duration-300">
                                                        {getDetailIcon(detail.label)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">
                                                            {detail.label}
                                                        </span>
                                                        <span className="text-foreground text-xs font-bold leading-tight">
                                                            {detail.value}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            className="w-full mt-auto rounded-lg h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all duration-300 border-none shadow-xl shadow-primary/20 group-hover:scale-[1.02] text-sm"
                                            onClick={() => service.url && window.open(service.url, '_blank')}
                                            disabled={!service.url}
                                        >
                                            {service.url ? 'Visit Website' : 'No Website Available'}
                                            <ChevronRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-16">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            isActive={currentPage === page}
                                            onClick={() => handlePageChange(page)}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default DirectoryPage;
