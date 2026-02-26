import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, ChevronUp, ExternalLink, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSections } from '@/lib/api/cmsApi';

import arborHealthLogo from '@/assets/Brand/Arbon Health.png';
import bhrLogo from '@/assets/Brand/Behavioral Health Resources BHR.png';
import crhnLogo from '@/assets/Brand/Cascade Regional Health Network (CRHN).png';
import coastalCapLogo from '@/assets/Brand/Coastal Community Action Program (Coastal CAP).png';
import cwcogLogo from '@/assets/Brand/Coastal Washington Council of Governments (CWCOG).png';
import chpwLogo from '@/assets/Brand/Community Health Plan of Washington (CHPW).png';
import ctanwLogo from '@/assets/Brand/Community Transportation Association of the Northwest (CTANW).png';
import cimLogo from '@/assets/Brand/Community in Motion.png';
import dhrLogo from '@/assets/Brand/Destination Hope & Recovery.png';
import dhrwLogo from '@/assets/Brand/Disability Mobility Initiative - Disability Rights Washington.png';
import ghtLogo from '@/assets/Brand/Grays Harbor Transit.png';
import gcrLogo from '@/assets/Brand/Greater Columbia River Behavioral Health Administrative Services Organization (GCRBHASO).png';
import oaLogo from '@/assets/Brand/Olympic Ambulance.png';
import paraLogo from '@/assets/Brand/Paratransit Services.png';
import rctLogo from '@/assets/Brand/RiverCities Transit.png';
import wahLogo from '@/assets/Brand/Wahkiakum County.png';
import dohLogo from '@/assets/Brand/Washington State Department of Health (DOH).png';
import hcaLogo from '@/assets/Brand/Washington State Health Care Authority (HCA).png';

export const basePartners = [
    { name: 'RiverCities Transit', logo: rctLogo, url: 'https://www.rctransit.org', description: 'RiverCities Transit – We are here, to get you there.', descriptionEs: 'RiverCities Transit – Estamos aquí para llevarte allí.' },
    { name: 'Washington State Health Care Authority (HCA)', logo: hcaLogo, url: 'https://www.hca.wa.gov', description: 'Home | Washington State Health Care Authority', descriptionEs: 'Inicio | Autoridad de Atención Médica del Estado de Washington' },
    {
        name: 'Greater Columbia River Behavioral Health Administrative Services Organization (GCRBHASO)',
        logo: gcrLogo,
        url: 'https://www.grbhaso.org',
        description: [
            'Great Rivers Behavioral Health Administrative Services Organization',
            'Great Rivers Behavioral Health Administrative Services Organization, Great Rivers BHASO, Great Rivers BH, Great Rivers BH-ASO. Great Rivers ASO, Lewis County Crisis, Wahkiakum County Crisis, Cowlitz County Crisis, Pacific County Crisis, Grays Harbor County Crisis',
            'Great Rivers Behavioral Health Administrative Services Organization',
        ].join('\n'),
        descriptionEs: [
            'Organización Administrativa de Servicios de Salud Conductual Great Rivers',
            'Great Rivers Behavioral Health Administrative Services Organization, Great Rivers BHASO, Great Rivers BH, Great Rivers BH-ASO. Great Rivers ASO, Lewis County Crisis, Wahkiakum County Crisis, Cowlitz County Crisis, Pacific County Crisis, Grays Harbor County Crisis',
            'Organización Administrativa de Servicios de Salud Conductual Great Rivers',
        ].join('\n'),
    },
    {
        name: 'Community Health Plan of Washington (CHPW)',
        logo: chpwLogo,
        url: 'https://www.chpw.org',
        description: [
            'Home',
            'Looking for Washington State Apple Health (Medicaid) information? Community Health Plan of WA can help! Learn more about eligibility and more.',
            'Washington State Local Health Insurance',
        ].join('\n'),
        descriptionEs: [
            'Inicio',
            '¿Buscas información sobre Apple Health (Medicaid) del estado de Washington? Community Health Plan of WA puede ayudar. Aprende más sobre elegibilidad y más.',
            'Seguro médico local del Estado de Washington',
        ].join('\n'),
    },
    {
        name: 'Behavioral Health Resources (BHR)',
        logo: bhrLogo,
        url: 'https://www.bhr.org',
        description: [
            'Home - Behavioral Health Resources',
            'BHR is a multi-county non profit provider for behavioral health and substance use disorder treatment.',
            'Behavioral Health Resources - Helping People Live Healthy Lives',
        ].join('\n'),
        descriptionEs: [
            'Inicio - Behavioral Health Resources',
            'BHR es un proveedor sin fines de lucro que atiende a varios condados para tratamiento de salud conductual y trastornos por uso de sustancias.',
            'Behavioral Health Resources - Ayudando a las personas a vivir vidas saludables',
        ].join('\n'),
    },
    { name: 'Paratransit Services', logo: paraLogo, url: 'https://www.paratransit.net', description: ['Paratransit Services', 'Paratransit Services'].join('\n'), descriptionEs: ['Paratransit Services', 'Paratransit Services'].join('\n') },
    { name: 'Wahkiakum County', logo: wahLogo, url: 'https://www.co.wahkiakum.wa.us', description: 'Wahkiakum County, WA | Official Website', descriptionEs: 'Condado de Wahkiakum, WA | Sitio web oficial' },
    { name: 'Washington State Department of Health (DOH)', logo: dohLogo, url: 'https://doh.wa.gov', description: 'Washington State Department of Health', descriptionEs: 'Departamento de Salud del Estado de Washington' },
    { name: 'Grays Harbor Transit', logo: ghtLogo, url: 'https://www.ghtransit.com', description: ['Grays Harbor Transit', 'Grays Harbor Transit Home Page'].join('\n'), descriptionEs: ['Grays Harbor Transit', 'Página de inicio de Grays Harbor Transit'].join('\n') },
    {
        name: 'Destination Hope & Recovery',
        logo: dhrLogo,
        url: 'https://www.destinationhopeandrecovery.com',
        description: [
            'Case Management Specialists | Destination Hope & Recovery | Washington',
            'At Destination Hope & Recovery, We offer specialized case management on a personal level to our most at risk individuals in our community. Ranging from Employment and Housing, to Behavioral Health and Judicial Services, or goal is to connect those most in vulnerable to the resources they need to not only survive, but succeed.',
            'DHR',
        ].join('\n'),
        descriptionEs: [
            'Especialistas en gestión de casos | Destination Hope & Recovery | Washington',
            'En Destination Hope & Recovery ofrecemos gestión de casos especializada a nivel personal para las personas más vulnerables de nuestra comunidad. Desde empleo y vivienda hasta servicios de salud conductual y judiciales, nuestro objetivo es conectar a quienes más lo necesitan con los recursos para no solo sobrevivir, sino prosperar.',
            'DHR',
        ].join('\n'),
    },
    {
        name: 'Cascade Regional Health Network (CRHN)',
        logo: crhnLogo,
        url: 'https://www.crhn.org',
        description: [
            'CHOICE Regional Health Network | health equity | 724 Columbia Street Northwest, Olympia, WA, USA',
            'At CHOICE Regional Health Network our mission is to improve community health in Central Western Washington through the collective planning and action of health care leaders. Our vision: better health for everyone at less cost.',
            'CHOICE Regional',
            'Home',
        ].join('\n'),
        descriptionEs: [
            'CHOICE Regional Health Network | equidad en salud | 724 Columbia Street Northwest, Olympia, WA, USA',
            'En CHOICE Regional Health Network nuestra misión es mejorar la salud comunitaria en el centro-oeste de Washington mediante la planificación y acción colectiva de líderes de salud. Nuestra visión: mejor salud para todos a menor costo.',
            'CHOICE Regional',
            'Inicio',
        ].join('\n'),
    },
    { name: 'Arbor Health', logo: arborHealthLogo, url: 'https://www.myarborhealth.org', logoClass: 'invert', description: 'Arbor Health is your community healthcare provider, offering a wide range of medical services to support your health and well-being.', descriptionEs: 'Arbor Health es su proveedor de atención médica comunitaria y ofrece una amplia gama de servicios médicos para apoyar su salud y bienestar.' },
    { name: 'Disability Rights Washington (Disability Mobility Initiative)', logo: dhrwLogo, url: 'https://www.dr-wa.org', description: 'Advocating for the rights of people with disabilities and improving transportation accessibility across Washington state.', descriptionEs: 'Defendiendo los derechos de las personas con discapacidades y mejorando la accesibilidad del transporte en todo el estado de Washington.' },
    {
        name: 'Community Transportation Association of the Northwest (CTANW)',
        logo: ctanwLogo,
        url: 'https://www.ctanw.org',
        description: [
            'Community Transportation Association of the Northwest',
            'CTANW provides our members, partners and communities with tools, resources and information, and advocates for favorable policies and practices so they can provide equal opportunities and mobility and transportation options for all people, particularly those with specialized transportation needs.',
        ].join('\n'),
        descriptionEs: [
            'Community Transportation Association of the Northwest',
            'CTANW brinda a nuestros miembros, socios y comunidades herramientas, recursos e información, y aboga por políticas y prácticas favorables para que puedan ofrecer igualdad de oportunidades y opciones de movilidad y transporte para todas las personas, en especial aquellas con necesidades de transporte especializado.',
        ].join('\n'),
    },
    { name: 'Community in Motion', logo: cimLogo, url: 'https://www.communityinmotion.org', description: 'Welcome | Community in Motion: The means to stay mobile', descriptionEs: 'Bienvenido | Community in Motion: Los medios para mantenerse en movimiento' },
    { name: 'Coastal Community Action Program (Coastal CAP)', logo: coastalCapLogo, url: 'https://www.coastalcap.org', description: 'Coastal Community Action Program | Part of the Community Action Network fighting to eliminate Poverty', descriptionEs: 'Coastal Community Action Program | Parte de la Community Action Network que lucha para eliminar la pobreza' },
    { name: 'Olympic Ambulance', logo: oaLogo, url: 'https://www.olympicambulance.com', description: 'Providing professional medical transportation services with a focus on patient care and safety.', descriptionEs: 'Ofrece servicios profesionales de transporte médico con enfoque en la atención del paciente y la seguridad.' },
    {
        name: 'Coastal Washington Council of Governments (CWCOG)',
        logo: cwcogLogo,
        url: 'https://www.cwcog.org',
        description: [
            'Cowlitz-Wahkiakum Council of Governments • CWCOG • Home',
            'CWCOG is a regional planning organization serving Cowlitz and Wahkiakum counties with programs in economic development, transportation, and community planning.',
            'Cowlitz-Wahkiakum Council of Governments',
        ].join('\n'),
        descriptionEs: [
            'Cowlitz-Wahkiakum Council of Governments • CWCOG • Inicio',
            'CWCOG es una organización regional de planificación que sirve a los condados de Cowlitz y Wahkiakum con programas de desarrollo económico, transporte y planificación comunitaria.',
            'Cowlitz-Wahkiakum Council of Governments',
        ].join('\n'),
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            type: 'spring', 
            damping: 25, 
            stiffness: 400 
        } 
    },
};

const PartnersPage = () => {
    const { t, language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [partnerFields, setPartnerFields] = useState({});

    useEffect(() => {
        let active = true;

        getSections()
            .then((sections) => {
                if (!active || !Array.isArray(sections)) return;
                const partnersSection = sections.find(
                    (section) => (section?.sectionId || section?.id) === 'partners.page'
                );
                setPartnerFields(partnersSection?.fields || {});
            })
            .catch(() => {});

        return () => {
            active = false;
        };
    }, []);

    const partners = useMemo(() => {
        return basePartners.map((partner, index) => ({
            ...partner,
            name: partnerFields[`partner-name-${index}`] || partner.name,
            url: partnerFields[`partner-url-${index}`] || partner.url,
            logo: partnerFields[`partner-logo-${index}`] || partner.logo,
            description: partnerFields[`partner-description-${index}`] || partner.description,
            descriptionEs:
                partnerFields[`partner-description-es-${index}`] || partner.descriptionEs,
        }));
    }, [partnerFields]);

    const toggleExpanded = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const filteredPartners = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return partners;
        return partners.filter(p => {
            const description = language === 'es' ? (p.descriptionEs || p.description) : p.description;
            return p.name.toLowerCase().includes(query) ||
                (description && description.toLowerCase().includes(query));
        });
    }, [language, searchQuery, partners]);

    return (
        <div className="min-h-screen bg-[#fcfdfe] text-[#03385e] flex flex-col font-sans selection:bg-[#b1ccdf]/30">
            <Navbar />

            <main className="grow py-12 sm:py-16 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto mb-10 relative group"
                    >
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-black/20 group-focus-within:text-[#03385e] transition-colors" />
                        </div>
                        <Input
                            type="text"
                            placeholder={t('partners.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-12 bg-white border-black/10 rounded-xl focus-visible:ring-[#03385e]/10 focus-visible:border-[#03385e]/30 transition-all text-sm shadow-none"
                        />
                    </motion.div>

                    {/* Grid Layout */}
                    <AnimatePresence mode="wait">
                        {filteredPartners.length > 0 ? (
                            <motion.div
                                key="partners-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {filteredPartners.map((partner) => (
                                    <motion.div
                                        key={partner.name}
                                        variants={itemVariants}
                                        className="group"
                                    >
                                        <div 
                                            className={cn(
                                                "h-full flex flex-col bg-white rounded-2xl border border-black/[0.04] transition-all duration-300 overflow-hidden shadow-none",
                                                expandedIndex === partners.indexOf(partner) ? "ring-1 ring-[#03385e]/10" : ""
                                            )}
                                        >
                                            <div className="p-5 flex flex-col h-full">
                                                <div className="flex items-start justify-between gap-4 mb-4">
                                                    <div className="h-24 w-full flex items-center justify-center bg-[#f8fafc]/50 border border-black/[0.02] rounded-xl p-4 overflow-hidden">
                                                        <img
                                                            src={partner.logo}
                                                            alt={partner.name}
                                                            className={cn(
                                                                "h-full w-full object-contain filter transition-transform duration-500 group-hover:scale-110",
                                                                partner.logoClass || ''
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-baseline justify-between gap-3 mb-2">
                                                    <h3 className="text-[15px] font-bold text-[#03385e] leading-tight group-hover:text-[#03385e]/80 transition-colors">
                                                        {partner.name}
                                                    </h3>
                                                    <a 
                                                        href={partner.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 rounded-lg bg-[#f8fafc] hover:bg-[#03385e] text-black/20 hover:text-white transition-all duration-300 shrink-0"
                                                    >
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </a>
                                                </div>

                                                <div className="grow">
                                                    {(() => {
                                                        const description = language === 'es'
                                                            ? (partner.descriptionEs || partner.description)
                                                            : partner.description;
                                                        if (!description) return null;
                                                        return (
                                                            <div className="relative">
                                                                <motion.p 
                                                                    initial={false}
                                                                    animate={{ height: expandedIndex === partners.indexOf(partner) ? "auto" : "2.5rem" }}
                                                                    className={cn(
                                                                        "text-[13px] text-black/50 leading-relaxed overflow-hidden",
                                                                        expandedIndex === partners.indexOf(partner) ? "" : "line-clamp-2"
                                                                    )}
                                                                >
                                                                    {description}
                                                                </motion.p>
                                                                
                                                                {description.length > 80 && (
                                                                    <button
                                                                        onClick={(e) => toggleExpanded(e, partners.indexOf(partner))}
                                                                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#03385e]/60 hover:text-[#03385e] transition-colors"
                                                                    >
                                                                        {expandedIndex === partners.indexOf(partner) ? (
                                                                            <>{t('partners.showLess')} <ChevronUp className="w-3 h-3" /></>
                                                                        ) : (
                                                                            <>{t('partners.readMore')} <ChevronDown className="w-3 h-3" /></>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-black/[0.02] flex items-center justify-end">
                                                    <a 
                                                        href={partner.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs font-bold text-[#03385e]/70 hover:text-[#03385e] flex items-center gap-1 group/link"
                                                    >
                                                        {t('partners.website')} <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="no-results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20 bg-white rounded-2xl border border-dashed border-black/10"
                            >
                                <p className="text-sm text-black/30 text-center">{t('partners.noResults')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PartnersPage;
