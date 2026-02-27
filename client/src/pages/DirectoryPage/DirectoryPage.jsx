// File: client/src/pages/DirectoryPage/DirectoryPage.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
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
import { useLanguage } from '@/contexts/LanguageContext';

import axiosInstance from '@/lib/axiosInstance';

// Spotlight Card Component (Cleaned up and adapted)
const SpotlightCard = ({ children, className = "", enableSpotlight = true }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        if (!enableSpotlight) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => enableSpotlight && setOpacity(1);
    const handleBlur = () => enableSpotlight && setOpacity(0);
    const handleMouseEnter = () => enableSpotlight && setOpacity(1);
    const handleMouseLeave = () => enableSpotlight && setOpacity(0);

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
            {enableSpotlight && (
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                    style={{
                        opacity,
                        background: `radial-gradient(360px circle at ${position.x}px ${position.y}px, rgba(3, 56, 94, 0.06), transparent 80%)`,
                    }}
                />
            )}
            {/* Content Container */}
            <div className="relative h-full z-10 flex flex-col">{children}</div>
        </div>
    );
};

const mapService = (item) => ({
    type: item.serviceCategory || 'Transport',
    category: item.serviceCategory || '',
    title: item.providerName,
    subtitle: item.serviceTypes || 'Transportation Service',
    url: item.websiteUrl,
    accessibility: item.accessibility || '',
    details: [
        { key: 'phone', labelKey: 'directory.detail.phone', value: item.phone },
        { key: 'hours', labelKey: 'directory.detail.hours', value: item.serviceTimes },
        { key: 'access', labelKey: 'directory.detail.access', value: item.accessibility },
        { key: 'cost', labelKey: 'directory.detail.cost', value: item.cost },
        { key: 'county', labelKey: 'directory.detail.county', value: item.countiesServed },
    ].filter(detail => detail.value),
});

const supportedCounties = [
    'Thurston',
    'Mason',
    'Lewis',
    'Cowlitz',
    'Pacific',
    'Grays Harbor',
    'Wahkiakum',
];

const typeOfHelpOptions = [
    'Medical care',
    'Mental health care',
    'Substance use support',
    'Pregnancy and perinatal services',
    'Pharmacy / prescriptions',
    'Food and groceries',
    'Housing services',
    'Social services and benefits',
    'Employment and job support',
    'Youth services',
    'Senior services',
    'Disability services',
];

const DirectoryPage = () => {
    const { t } = useLanguage();
    const [servicesData, setServicesData] = useState([]);
    // Input State (Controlled by user interaction)
    const [searchTerm, setSearchTerm] = useState('');
    const [countyFilter, setCountyFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [countyQuery, setCountyQuery] = useState('');
    const [serviceQuery, setServiceQuery] = useState('');
    const [accessibilityFilter, setAccessibilityFilter] = useState('all');
    const [accessibilityQuery, setAccessibilityQuery] = useState('');
    const [expandedServiceIndices, setExpandedServiceIndices] = useState([]);
    const [maxPreviewHeight, setMaxPreviewHeight] = useState(0);
    const previewHeightsRef = useRef([]);

    // Extract unique counties and services for filter dropdowns with useMemo
    const allCounties = useMemo(() => supportedCounties, []);

    const allServices = useMemo(() => typeOfHelpOptions, []);

    const allAccessibility = useMemo(() => [...new Set(servicesData
        .map(service => service.accessibility)
        .filter(Boolean)
    )].sort(), []);

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

    const filteredAccessibilityList = useMemo(() => {
        if (!accessibilityQuery.trim()) return allAccessibility;
        const q = accessibilityQuery.toLowerCase();
        return allAccessibility.filter(a => a.toLowerCase().includes(q));
    }, [allAccessibility, accessibilityQuery]);

    const filteredServices = servicesData.filter(service => {
        const matchesName = service.title.toLowerCase().includes(searchTerm.toLowerCase());

        const serviceCounties = service.details.find(d => d.key === 'county')?.value.toLowerCase() || '';
        const matchesCounty = countyFilter === 'all' || serviceCounties.includes(countyFilter.toLowerCase());

        const serviceTypes = (service.category || '')
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
        const matchesService = serviceFilter === 'all' || serviceTypes.includes(serviceFilter.toLowerCase());

        const matchesAccessibility = accessibilityFilter === 'all' || (service.accessibility || '').toLowerCase().includes(accessibilityFilter.toLowerCase());

        return matchesName && matchesCounty && matchesService && matchesAccessibility;
    });

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Reset page when ACTIVE filters change
    useEffect(() => {
        let isMounted = true;

        const fetchServices = async () => {
            try {
                const { data } = await axiosInstance.get('/directory');
                const list = data?.data?.services || [];
                if (isMounted) {
                    setServicesData(list.map((service) => mapService(service)));
                }
            } catch (error) {
                if (isMounted) {
                    setServicesData([]);
                }
            }
        };

        fetchServices();

        return () => {
            isMounted = false;
        };
    }, []);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, countyFilter, serviceFilter, accessibilityFilter]);

    React.useEffect(() => {
        setExpandedServiceIndices([]);
    }, [currentPage]);

    React.useEffect(() => {
        setIsLoading(true);
        const t = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(t);
    }, [searchTerm, countyFilter, serviceFilter, accessibilityFilter, currentPage]);

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
        setAccessibilityFilter('all');
    };

    const toggleService = (index) => {
        setExpandedServiceIndices((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const registerPreviewHeight = (index, height) => {
        previewHeightsRef.current[index] = height;
    };

    React.useEffect(() => {
        const heights = previewHeightsRef.current.filter(Boolean);
        if (!heights.length) return;
        const nextMax = Math.max(...heights);
        if (nextMax !== maxPreviewHeight) {
            setMaxPreviewHeight(nextMax);
        }
    }, [currentServices, maxPreviewHeight]);

    return (
        <div className="min-h-screen bg-white text-black flex flex-col font-sans">
            <Navbar />

            <main className="grow">
                <div className="bg-[#f6f9fb] border-b border-black/5">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black tracking-tight leading-[1.05]">
                                {t('directory.title')}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_20px_60px_-50px_rgba(3,56,94,0.4)]">
                        <div className="flex items-center justify-between gap-3 px-6 sm:px-8 py-6 border-b border-black/5">
                            <div className="flex items-center gap-3 text-black">
                                <div className="h-10 w-10 rounded-full bg-[#03385e]/10 flex items-center justify-center">
                                    <Filter className="w-5 h-5 text-[#03385e]" />
                                </div>
                                <div>
                                    <div className="text-lg font-semibold">{t('directory.filterTitle')}</div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 sm:px-8 py-6 space-y-5">
                            <div className="relative">
                                <Input
                                    placeholder={t('directory.searchByName')}
                                    className="bg-white border border-black/15 h-12 rounded-xl w-full text-black placeholder:text-black/50 focus-visible:ring-0 focus-visible:border-[#03385e]/40 shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                <Select
                                    value={countyFilter}
                                    onValueChange={(value) => {
                                        setCountyFilter(value);
                                        setCountyQuery('');
                                    }}
                                    key={`county-${countyFilter}`}
                                >
                                    <SelectTrigger className="w-full bg-white border border-black/15 h-12 rounded-xl text-black focus-visible:ring-0 focus-visible:border-[#03385e]/40 shadow-sm">
                                        <SelectValue placeholder={t('directory.allCounties')} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl max-h-75 border-black/10">
                                        <div className="p-2">
                                            <Input
                                                placeholder={t('directory.searchCounties')}
                                                value={countyQuery}
                                                onChange={(e) => setCountyQuery(e.target.value)}
                                                className="h-9 bg-white border border-black/20 rounded-md text-black placeholder:text-black/50 focus-visible:ring-0 focus-visible:border-[#03385e]/40"
                                            />
                                        </div>
                                        <SelectItem value="all">{t('directory.allCounties')}</SelectItem>
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
                                    <SelectTrigger className="w-full bg-white border border-black/15 h-12 rounded-xl text-black focus-visible:ring-0 focus-visible:border-[#03385e]/40 shadow-sm">
                                        <SelectValue placeholder={t('directory.allServices')} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl max-h-75 border-black/10">
                                        <div className="p-2">
                                            <Input
                                                placeholder={t('directory.searchServices')}
                                                value={serviceQuery}
                                                onChange={(e) => setServiceQuery(e.target.value)}
                                                className="h-9 bg-white border border-black/20 rounded-md text-black placeholder:text-black/50 focus-visible:ring-0 focus-visible:border-[#03385e]/40"
                                            />
                                        </div>
                                        <SelectItem value="all">{t('directory.allServices')}</SelectItem>
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

                                <Select
                                    value={accessibilityFilter}
                                    onValueChange={(value) => {
                                        setAccessibilityFilter(value);
                                        setAccessibilityQuery('');
                                    }}
                                    key={`accessibility-${accessibilityFilter}`}
                                >
                                    <SelectTrigger className="w-full bg-white border border-black/15 h-12 rounded-xl text-black focus-visible:ring-0 focus-visible:border-[#03385e]/40 shadow-sm">
                                        <SelectValue placeholder={t('directory.allAccessibility')} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl max-h-75 border-black/10">
                                        <div className="p-2">
                                            <Input
                                                placeholder={t('directory.searchAccessibility')}
                                                value={accessibilityQuery}
                                                onChange={(e) => setAccessibilityQuery(e.target.value)}
                                                className="h-9 bg-white border border-black/20 rounded-md text-black placeholder:text-black/50 focus-visible:ring-0 focus-visible:border-[#03385e]/40"
                                            />
                                        </div>
                                        <SelectItem value="all">{t('directory.allAccessibility')}</SelectItem>
                                        {filteredAccessibilityList.map((accessibility) => (
                                            <SelectItem
                                                key={accessibility}
                                                value={accessibility}
                                                className="data-[highlighted]:bg-[#03385e]/10 data-[highlighted]:text-black"
                                            >
                                                {accessibility}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                                <Button
                                    className="bg-[#03385e] hover:bg-[#03385e]/90 text-white h-12 px-8 rounded-xl font-medium shadow-none"
                                    onClick={() => setCurrentPage(1)}
                                >
                                    {t('directory.startSearch')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border border-[#03385e]/40 text-[#03385e] h-12 px-8 rounded-xl font-medium hover:bg-[#03385e]/5"
                                    onClick={clearFilters}
                                >
                                    {t('directory.clearAll')}
                                </Button>
                            </div>
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
                        <div
                            key={`${searchTerm}-${countyFilter}-${serviceFilter}`}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
                        >
                        {currentServices.length > 0 ? (
                            currentServices.map((service, index) => {
                                const previewDetails = service.details.slice(0, 2);
                                const remainingDetails = service.details.slice(2);
                                const cardKey = startIndex + index;
                                const isExpanded = expandedServiceIndices.includes(cardKey);
                                const getPreviewHeight = (node) => {
                                    if (!node) return;
                                    registerPreviewHeight(index, node.getBoundingClientRect().height);
                                };
                                return (
                                <div
                                    key={cardKey}
                                    className="h-full"
                                >
                                    <SpotlightCard enableSpotlight={false} className="p-6 bg-white border border-black/10 shadow-none hover:shadow-none hover:border-black/20 rounded-none min-h-0">
                                        <div ref={getPreviewHeight} className="flex flex-col gap-3" style={{ minHeight: maxPreviewHeight ? `${maxPreviewHeight}px` : undefined }}>
                                            <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-medium mb-1 leading-tight text-black tracking-tight">
                                                    {service.title}
                                                </h3>
                                                <p className="text-black/70 mb-4 text-sm font-normal leading-relaxed">
                                                    {service.subtitle}
                                                </p>
                                            </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                            {previewDetails.map((detail, idx) => (
                                                <div key={idx}>
                                                    <div className="text-[#03385e] font-semibold text-sm mb-1">
                                                        {t(detail.labelKey)}
                                                    </div>
                                                    <div
                                                        className="text-black text-xs leading-snug"
                                                        style={
                                                            isExpanded
                                                                ? undefined
                                                                : {
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 3,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                }
                                                        }
                                                    >
                                                        {detail.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        </div>

                                        {remainingDetails.length > 0 && (
                                            <div className={cn("mt-4 pt-4 border-t border-black/5", isExpanded ? "block" : "hidden")}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                                    {remainingDetails.map((detail, idx) => (
                                                        <div key={idx}>
                                                            <div className="text-[#03385e] font-semibold text-sm mb-1">
                                                                {t(detail.labelKey)}
                                                            </div>
                                                            <div className="text-black text-xs leading-snug">
                                                                {detail.value}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {remainingDetails.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => toggleService(cardKey)}
                                                className="mt-4 w-full inline-flex items-center justify-end gap-2 text-xs font-semibold text-[#03385e] hover:text-[#03385e]/80"
                                            >
                                                {isExpanded ? t('partners.showLess') : t('partners.readMore')}
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path
                                                        d={isExpanded
                                                            ? "M5.23 12.23a.75.75 0 0 0 1.06 1.06L10 9.56l3.71 3.73a.75.75 0 1 0 1.06-1.06l-4.24-4.25a.75.75 0 0 0-1.06 0L5.23 12.23z"
                                                            : "M14.77 7.77a.75.75 0 0 0-1.06-1.06L10 10.44 6.29 6.71a.75.75 0 0 0-1.06 1.06l4.24 4.25a.75.75 0 0 0 1.06 0l4.24-4.25z"
                                                        }
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </SpotlightCard>
                                </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-6 rounded-3xl bg-[#03385e]/10 text-black/50">
                                    <Search className="w-12 h-12 opacity-20" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{t('directory.noServicesTitle')}</h3>
                                    <p className="text-black/60 max-w-xs">
                                        {t('directory.noServicesBody')}
                                    </p>
                                </div>
                                <Button variant="link" onClick={clearFilters} className="text-[#03385e] font-bold">
                                    {t('directory.clearFilters')}
                                </Button>
                            </div>
                        )}
                        </div>
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
