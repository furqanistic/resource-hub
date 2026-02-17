// File: client/src/pages/DirectoryPage/DirectoryPage.jsx
import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Filter,
    Search
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
                "relative overflow-hidden border border-black/10 bg-white text-black transition-colors duration-200 flex flex-col group min-h-[380px]",
                "hover:border-black/20",
                className
            )}
        >
            {/* Spotlight Gradient */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(360px circle at ${position.x}px ${position.y}px, rgba(3, 56, 94, 0.06), transparent 80%)`,
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
    const [isLoading, setIsLoading] = useState(false);
    const [countyQuery, setCountyQuery] = useState('');
    const [serviceQuery, setServiceQuery] = useState('');

    // Extract unique counties and services for filter dropdowns with useMemo
    const allCounties = useMemo(() => [...new Set(servicesData.flatMap(service =>
        service.details.find(d => d.label === 'County')?.value.split(',').map(c => c.trim()) || []
    ))].sort(), []);

    const allServices = useMemo(() => [...new Set(servicesData.flatMap(service =>
        service.category.split(',').map(s => s.trim()) || []
    ))].sort(), []);

    const filteredCounties = useMemo(() => {
        if (!countyQuery.trim()) return allCounties;
        const q = countyQuery.toLowerCase();
        return allCounties.filter(c => c.toLowerCase().includes(q));
    }, [allCounties, countyQuery]);

    const filteredServicesList = useMemo(() => {
        if (!serviceQuery.trim()) return allServices;
        const q = serviceQuery.toLowerCase();
        return allServices.filter(s => s.toLowerCase().includes(q));
    }, [allServices, serviceQuery]);

    const filteredServices = servicesData.filter(service => {
        const matchesName = service.title.toLowerCase().includes(searchTerm.toLowerCase());

        const serviceCounties = service.details.find(d => d.label === 'County')?.value.toLowerCase() || '';
        const matchesCounty = countyFilter === 'all' || serviceCounties.includes(countyFilter.toLowerCase());

        const serviceTypes = service.category.toLowerCase();
        const matchesService = serviceFilter === 'all' || serviceTypes.includes(serviceFilter.toLowerCase());

        return matchesName && matchesCounty && matchesService;
    });

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Reset page when ACTIVE filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, countyFilter, serviceFilter]);

    React.useEffect(() => {
        setIsLoading(true);
        const t = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(t);
    }, [searchTerm, countyFilter, serviceFilter, currentPage]);

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCountyFilter('all');
        setServiceFilter('all');
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col font-sans">
            <Navbar />

            <main className="grow">
                <div className="bg-[#f6f9fb] py-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl md:text-6xl font-medium text-black tracking-tight">
                            Find Transportation Services
                        </h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center gap-3 text-black mb-6">
                        <Filter className="w-6 h-6 text-[#03385e]" />
                        <span className="text-xl font-medium">Filter Services</span>
                    </div>

                    <div className="space-y-5">
                        <div className="relative">
                            <Input
                                placeholder="Search by name"
                                className="bg-white border border-black/30 h-12 rounded-lg w-full text-black placeholder:text-black/60 focus-visible:ring-0 focus-visible:border-[#03385e]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <Select
                                value={countyFilter}
                                onValueChange={(value) => {
                                    setCountyFilter(value);
                                    setCountyQuery('');
                                }}
                                key={`county-${countyFilter}`}
                            >
                                <SelectTrigger className="w-full bg-white border border-black/40 h-12 rounded-lg text-black focus-visible:ring-0 focus-visible:border-[#03385e]">
                                    <SelectValue placeholder="All Counties" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg max-h-75 border-black/20">
                                    <div className="p-2">
                                        <Input
                                            placeholder="Search counties"
                                            value={countyQuery}
                                            onChange={(e) => setCountyQuery(e.target.value)}
                                            className="h-9 bg-white border border-black/30 rounded-md text-black placeholder:text-black/50 focus-visible:ring-0 focus-visible:border-[#03385e]"
                                        />
                                    </div>
                                    <SelectItem value="all">All Counties</SelectItem>
                                    {filteredCounties.map(county => (
                                        <SelectItem
                                            key={county}
                                            value={county}
                                            className="data-[highlighted]:bg-[#03385e]/10 data-[highlighted]:text-black"
                                        >
                                            {county}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={serviceFilter}
                                onValueChange={(value) => {
                                    setServiceFilter(value);
                                    setServiceQuery('');
                                }}
                                key={`service-${serviceFilter}`}
                            >
                                <SelectTrigger className="w-full bg-white border border-black/40 h-12 rounded-lg text-black focus-visible:ring-0 focus-visible:border-[#03385e]">
                                    <SelectValue placeholder="All Services" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg max-h-75 border-black/20">
                                    <div className="p-2">
                                        <Input
                                            placeholder="Search services"
                                            value={serviceQuery}
                                            onChange={(e) => setServiceQuery(e.target.value)}
                                            className="h-9 bg-white border border-black/30 rounded-md text-black placeholder:text-black/50 focus-visible:ring-0 focus-visible:border-[#03385e]"
                                        />
                                    </div>
                                    <SelectItem value="all">All Services</SelectItem>
                                    {filteredServicesList.map(service => (
                                        <SelectItem
                                            key={service}
                                            value={service}
                                            className="data-[highlighted]:bg-[#03385e]/10 data-[highlighted]:text-black"
                                        >
                                            {service}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <Button
                                className="bg-[#03385e] hover:bg-[#03385e]/90 text-white h-12 px-8 rounded-none font-medium shadow-none"
                                onClick={() => setCurrentPage(1)}
                            >
                                Start My Search
                            </Button>
                            <Button
                                variant="outline"
                                className="border border-[#03385e] text-[#03385e] h-12 px-8 rounded-none font-medium hover:bg-transparent"
                                onClick={clearFilters}
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    {/* Service Cards Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="border border-black/10 bg-white p-6 rounded-none">
                                    <div className="h-5 w-2/3 bg-black/10 rounded-sm mb-3 animate-pulse" />
                                    <div className="h-4 w-1/3 bg-black/10 rounded-sm mb-6 animate-pulse" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        <div>
                                            <div className="h-4 w-20 bg-black/10 rounded-sm mb-2 animate-pulse" />
                                            <div className="h-3 w-full bg-black/10 rounded-sm mb-1 animate-pulse" />
                                            <div className="h-3 w-5/6 bg-black/10 rounded-sm animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="h-4 w-20 bg-black/10 rounded-sm mb-2 animate-pulse" />
                                            <div className="h-3 w-full bg-black/10 rounded-sm mb-1 animate-pulse" />
                                            <div className="h-3 w-4/5 bg-black/10 rounded-sm animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="h-4 w-20 bg-black/10 rounded-sm mb-2 animate-pulse" />
                                            <div className="h-3 w-full bg-black/10 rounded-sm mb-1 animate-pulse" />
                                            <div className="h-3 w-3/4 bg-black/10 rounded-sm animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="h-4 w-20 bg-black/10 rounded-sm mb-2 animate-pulse" />
                                            <div className="h-3 w-full bg-black/10 rounded-sm mb-1 animate-pulse" />
                                            <div className="h-3 w-2/3 bg-black/10 rounded-sm animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            key={`${searchTerm}-${countyFilter}-${serviceFilter}`}
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
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
                                    <SpotlightCard className="p-6 bg-white border border-black/10 shadow-none hover:shadow-none hover:border-black/20 rounded-none">
                                        <h3 className="text-xl font-medium mb-1 leading-tight text-black tracking-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-black/70 mb-5 text-sm font-normal leading-relaxed">
                                            {service.subtitle}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                            {service.details.map((detail, idx) => (
                                                <div key={idx}>
                                                    <div className="text-[#03385e] font-semibold text-sm mb-1">
                                                        {detail.label}
                                                    </div>
                                                    <div
                                                        className="text-black text-xs leading-snug"
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 4,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {detail.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </SpotlightCard>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-6 rounded-3xl bg-[#03385e]/10 text-black/50">
                                    <Search className="w-12 h-12 opacity-20" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">No Services Found</h3>
                                    <p className="text-black/60 max-w-xs">
                                        We couldn't find any services matching your current filters. Try adjusting your search criteria.
                                    </p>
                                </div>
                                <Button variant="link" onClick={clearFilters} className="text-[#03385e] font-bold">
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
                                            className="cursor-pointer hover:bg-[#03385e]/10 hover:text-[#03385e]"
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
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DirectoryPage;
