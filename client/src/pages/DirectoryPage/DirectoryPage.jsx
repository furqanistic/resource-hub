// File: client/src/pages/DirectoryPage/DirectoryPage.jsx
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import SectionThemeScope from '@/components/SectionThemeScope';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
    Filter,
    Search
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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
                "relative overflow-hidden border border-[var(--site-primary-soft)] bg-[var(--site-background)] text-[var(--site-text)] transition-colors duration-200 flex flex-col group min-h-[380px]",
                "hover:border-[var(--site-primary-soft)]",
                className
            )}
        >
            {/* Spotlight Gradient */}
            {enableSpotlight && (
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                    style={{
                        opacity,
                        background: `radial-gradient(360px circle at ${position.x}px ${position.y}px, var(--site-primary-soft), transparent 80%)`,
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

const DirectoryPage = ({ embedded = false }) => {
    const { t } = useLanguage();
    const [servicesData, setServicesData] = useState([]);
    // Input State (Controlled by user interaction)
    const [searchTerm, setSearchTerm] = useState('');
    const [countyFilter, setCountyFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
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
            if (isMounted) {
                setIsLoading(true);
            }

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
            } finally {
                if (isMounted) {
                    setIsLoading(false);
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

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        if (embedded) {
            const section = document.getElementById('directory');
            section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

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

    const sectionYClass = embedded ? 'py-8 sm:py-10' : 'py-16 sm:py-24';
    const headingSpacingClass = embedded ? 'mb-8 sm:mb-10' : 'mb-12 sm:mb-16';
    const filterCardClass = embedded ? 'p-5 sm:p-6 mb-8' : 'p-8 sm:p-10 mb-16';
    const resultWrapClass = embedded ? 'pb-8' : 'pb-20';
    const emptyStateClass = embedded ? 'py-16' : 'py-40';
    const paginationTopClass = embedded ? 'mt-10' : 'mt-16';

    const directoryContent = (
        <SectionThemeScope scopeKey="directory-main">
                <div className={`bg-[var(--site-background)] ${sectionYClass} relative overflow-hidden`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 ${headingSpacingClass}`}>
                            <div className="max-w-2xl">
                                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[var(--site-primary-soft)]/20 border border-[var(--site-primary-soft)]/30 text-[var(--site-primary)] text-xs font-bold tracking-widest uppercase">
                                    {t('nav.directory')}
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--site-primary)] tracking-tight leading-[1.1]">
                                    {t('directory.title')}
                                </h1>
                            </div>
                        </div>

                        {/* Search and Filters Section */}
                        <div className={`relative group ${filterCardClass} rounded-[2.5rem] bg-white border border-[var(--site-primary-soft)]/30 transition-all duration-500 hover:border-[var(--site-primary)]/40 overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--site-primary-soft)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-12 w-12 rounded-2xl bg-[var(--site-primary-soft)]/20 flex items-center justify-center transition-transform group-hover:scale-110">
                                        <Filter className="w-5 h-5 text-[var(--site-primary)]" />
                                    </div>
                                    <h2 className="text-xl font-bold text-[var(--site-text)]">{t('directory.filterTitle')}</h2>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                                    <div className="lg:col-span-12 relative">
                                        <Input
                                            placeholder={t('directory.searchByName')}
                                            className="h-14 w-full rounded-2xl border border-[var(--site-primary-soft)]/50 bg-[var(--site-background)]/50 text-[var(--site-text)] placeholder:text-[var(--site-text-soft)] focus-visible:ring-2 focus-visible:ring-[var(--site-primary)]/20 focus-visible:border-[var(--site-primary)] transition-all shadow-none"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="lg:col-span-4">
                                        <Select
                                            value={countyFilter}
                                            onValueChange={(value) => {
                                                setCountyFilter(value);
                                                setCountyQuery('');
                                            }}
                                            key={`county-${countyFilter}`}
                                        >
                                            <SelectTrigger className="h-14 w-full rounded-2xl border border-[var(--site-primary-soft)]/50 bg-[var(--site-background)]/50 text-[var(--site-text)] transition-all focus:ring-2 focus:ring-[var(--site-primary)]/20 focus:border-[var(--site-primary)] shadow-none">
                                                <SelectValue placeholder={t('directory.allCounties')} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[var(--site-primary-soft)] p-2">
                                                <div className="p-2 sticky top-0 bg-white z-10 mb-2">
                                                    <Input
                                                        placeholder={t('directory.searchCounties')}
                                                        value={countyQuery}
                                                        onChange={(e) => setCountyQuery(e.target.value)}
                                                        className="h-10 rounded-xl border border-[var(--site-primary-soft)] bg-[var(--site-background)]"
                                                    />
                                                </div>
                                                <SelectItem value="all" className="rounded-xl">{t('directory.allCounties')}</SelectItem>
                                                {filteredCounties.map(county => (
                                                    <SelectItem key={county} value={county} className="rounded-xl">{county}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="lg:col-span-4">
                                        <Select
                                            value={serviceFilter}
                                            onValueChange={(value) => {
                                                setServiceFilter(value);
                                                setServiceQuery('');
                                            }}
                                            key={`service-${serviceFilter}`}
                                        >
                                            <SelectTrigger className="h-14 w-full rounded-2xl border border-[var(--site-primary-soft)]/50 bg-[var(--site-background)]/50 text-[var(--site-text)] transition-all focus:ring-2 focus:ring-[var(--site-primary)]/20 focus:border-[var(--site-primary)] shadow-none">
                                                <SelectValue placeholder={t('directory.allServices')} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[var(--site-primary-soft)] p-2">
                                                <div className="p-2 sticky top-0 bg-white z-10 mb-2">
                                                    <Input
                                                        placeholder={t('directory.searchServices')}
                                                        value={serviceQuery}
                                                        onChange={(e) => setServiceQuery(e.target.value)}
                                                        className="h-10 rounded-xl border border-[var(--site-primary-soft)] bg-[var(--site-background)]"
                                                    />
                                                </div>
                                                <SelectItem value="all" className="rounded-xl">{t('directory.allServices')}</SelectItem>
                                                {filteredServicesList.map(service => (
                                                    <SelectItem key={service} value={service} className="rounded-xl">{service}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="lg:col-span-4">
                                        <Select
                                            value={accessibilityFilter}
                                            onValueChange={(value) => {
                                                setAccessibilityFilter(value);
                                                setAccessibilityQuery('');
                                            }}
                                            key={`accessibility-${accessibilityFilter}`}
                                        >
                                            <SelectTrigger className="h-14 w-full rounded-2xl border border-[var(--site-primary-soft)]/50 bg-[var(--site-background)]/50 text-[var(--site-text)] transition-all focus:ring-2 focus:ring-[var(--site-primary)]/20 focus:border-[var(--site-primary)] shadow-none">
                                                <SelectValue placeholder={t('directory.allAccessibility')} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[var(--site-primary-soft)] p-2">
                                                <div className="p-2 sticky top-0 bg-white z-10 mb-2">
                                                    <Input
                                                        placeholder={t('directory.searchAccessibility')}
                                                        value={accessibilityQuery}
                                                        onChange={(e) => setAccessibilityQuery(e.target.value)}
                                                        className="h-10 rounded-xl border border-[var(--site-primary-soft)] bg-[var(--site-background)]"
                                                    />
                                                </div>
                                                <SelectItem value="all" className="rounded-xl">{t('directory.allAccessibility')}</SelectItem>
                                                {filteredAccessibilityList.map(a => (
                                                    <SelectItem key={a} value={a} className="rounded-xl">{a}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-[var(--site-primary-soft)]/30">
                                    <Button
                                        className="h-14 px-10 rounded-2xl bg-[var(--site-primary)] text-white text-base font-bold shadow-none transition-all hover:scale-105 active:scale-95"
                                        onClick={() => setCurrentPage(1)}
                                    >
                                        {t('directory.startSearch')}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="h-14 px-8 rounded-2xl text-[var(--site-primary)] text-base font-bold hover:bg-[var(--site-primary-soft)]/20"
                                        onClick={clearFilters}
                                    >
                                        {t('directory.clearAll')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${resultWrapClass}`}>
                    {/* Service Cards Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="border border-[var(--site-primary-soft)] bg-[var(--site-background)] p-6 rounded-none">
                                    <div className="h-5 w-2/3 bg-[var(--site-primary-soft)] rounded-sm mb-3 animate-pulse" />
                                    <div className="h-4 w-1/3 bg-[var(--site-primary-soft)] rounded-sm mb-6 animate-pulse" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        <div>
                                            <div className="h-4 w-20 bg-[var(--site-primary-soft)] rounded-sm mb-2 animate-pulse" />
                                            <div className="h-3 w-full bg-[var(--site-primary-soft)] rounded-sm mb-1 animate-pulse" />
                                            <div className="h-3 w-5/6 bg-[var(--site-primary-soft)] rounded-sm animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="h-4 w-20 bg-[var(--site-primary-soft)] rounded-sm mb-2 animate-pulse" />
                                            <div className="h-3 w-full bg-[var(--site-primary-soft)] rounded-sm mb-1 animate-pulse" />
                                            <div className="h-3 w-4/5 bg-[var(--site-primary-soft)] rounded-sm animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="h-4 w-20 bg-[var(--site-primary-soft)] rounded-sm mb-2 animate-pulse" />
                                            <div className="h-3 w-full bg-[var(--site-primary-soft)] rounded-sm mb-1 animate-pulse" />
                                            <div className="h-3 w-3/4 bg-[var(--site-primary-soft)] rounded-sm animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="h-4 w-20 bg-[var(--site-primary-soft)] rounded-sm mb-2 animate-pulse" />
                                            <div className="h-3 w-full bg-[var(--site-primary-soft)] rounded-sm mb-1 animate-pulse" />
                                            <div className="h-3 w-2/3 bg-[var(--site-primary-soft)] rounded-sm animate-pulse" />
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
                                    className="h-full group/card"
                                >
                                    <div className="relative h-full flex flex-col p-6 rounded-[1.8rem] bg-white border border-[var(--site-primary-soft)]/30 transition-all duration-500 hover:border-[var(--site-primary)]/40 hover:-translate-y-1.5 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--site-primary-soft)]/5 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                        
                                        <div ref={getPreviewHeight} className="relative z-10 flex flex-col gap-3" style={{ minHeight: maxPreviewHeight ? `${maxPreviewHeight}px` : undefined }}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-0.5 rounded-full bg-[var(--site-primary-soft)] transition-all duration-500 group-hover/card:w-10 group-hover/card:bg-[var(--site-primary)]" />
                                                    </div>
                                                    <h3 className="text-[17px] font-bold leading-tight text-[var(--site-primary)] tracking-tight mb-1">
                                                        {service.title}
                                                    </h3>
                                                    <p className="text-[var(--site-text-soft)] text-[13px] font-medium leading-relaxed">
                                                        {service.subtitle}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3 mt-2">
                                                {previewDetails.map((detail, idx) => (
                                                    <div key={idx} className="flex flex-col">
                                                        <div className="text-[var(--site-primary)] font-bold text-[10px] uppercase tracking-wider mb-0.5 opacity-80">
                                                            {t(detail.labelKey)}
                                                        </div>
                                                        <div className="text-[var(--site-text)] text-[12px] leading-tight line-clamp-2 font-medium">
                                                            {detail.value}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={cn("relative z-10 mt-3 pt-4 space-y-3 border-t border-[var(--site-primary-soft)]/20", isExpanded ? "block" : "hidden")}>
                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                {remainingDetails.map((detail, idx) => (
                                                    <div key={idx} className="flex flex-col">
                                                        <div className="text-[var(--site-primary)] font-bold text-[10px] uppercase tracking-wider mb-0.5 opacity-80">
                                                            {t(detail.labelKey)}
                                                        </div>
                                                        <div className="text-[var(--site-text)] text-[12px] leading-tight font-medium">
                                                            {detail.value}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {remainingDetails.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => toggleService(cardKey)}
                                                className="relative z-10 mt-5 w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--site-primary-soft)]/10 text-[11px] font-bold text-[var(--site-primary)] hover:bg-[var(--site-primary)] hover:text-white transition-all duration-300"
                                            >
                                                {isExpanded ? t('partners.showLess') : t('partners.readMore')}
                                                <svg className={cn("w-3.5 h-3.5 transition-transform duration-300", isExpanded ? "rotate-180" : "")} viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                );
                            })
                        ) : (
                            <div className={`col-span-full ${emptyStateClass} flex flex-col items-center justify-center text-center space-y-4`}>
                                <div className="p-6 rounded-3xl bg-[var(--site-primary-soft)] text-[var(--site-text-soft)]">
                                    <Search className="w-12 h-12 opacity-20" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{t('directory.noServicesTitle')}</h3>
                                    <p className="text-[var(--site-text-soft)] max-w-xs">
                                        {t('directory.noServicesBody')}
                                    </p>
                                </div>
                                <Button variant="link" onClick={clearFilters} className="text-[var(--site-primary)] font-bold">
                                    {t('directory.clearFilters')}
                                </Button>
                            </div>
                        )}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className={paginationTopClass}>
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
                                            className="cursor-pointer hover:bg-[var(--site-primary-soft)] hover:text-[var(--site-primary)]"
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
        </SectionThemeScope>
    );

    if (embedded) {
        return (
            <section id="directory" className="scroll-mt-28">
                {directoryContent}
            </section>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--site-background)] text-[var(--site-text)] flex flex-col font-sans">
            <Navbar />
            <main className="grow">{directoryContent}</main>
            <Footer />
        </div>
    );
};

export default DirectoryPage;
