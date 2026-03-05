import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const SECTION_TARGETS = ['about', 'directory', 'resources', 'partners', 'contact'];
const STICKY_NAV_OFFSET = 96;

const scrollToSectionWithOffset = (sectionId, behavior = 'smooth') => {
    const section = document.getElementById(sectionId);
    if (!section) return false;

    const nextTop = section.getBoundingClientRect().top + window.scrollY - STICKY_NAV_OFFSET;
    window.scrollTo({
        top: Math.max(0, nextTop),
        behavior,
    });
    return true;
};

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeScrollTarget, setActiveScrollTarget] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.about'), path: '/#about', scrollTarget: 'about' },
        { name: t('nav.directory'), path: '/#directory', scrollTarget: 'directory' },
        { name: t('nav.resources'), path: '/#resources', scrollTarget: 'resources' },
        { name: t('nav.partners'), path: '/#partners', scrollTarget: 'partners' },
        { name: t('nav.contact') || 'Contact', path: '/#contact', scrollTarget: 'contact' },
        { name: t('nav.adminLogin'), path: '/admin/login' },
    ];

    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveScrollTarget(null);
            return;
        }

        const sections = SECTION_TARGETS
            .map((target) => document.getElementById(target))
            .filter(Boolean);

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visibleEntries.length > 0) {
                    setActiveScrollTarget(visibleEntries[0].target.id);
                    return;
                }

                if (window.scrollY < 120) {
                    setActiveScrollTarget(null);
                }
            },
            {
                root: null,
                rootMargin: '-30% 0px -55% 0px',
                threshold: [0.1, 0.25, 0.4, 0.6, 0.8],
            }
        );

        sections.forEach((section) => observer.observe(section));

        const handleTopReset = () => {
            if (window.scrollY < 120) {
                setActiveScrollTarget(null);
            }
        };

        window.addEventListener('scroll', handleTopReset, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleTopReset);
        };
    }, [location.pathname]);

    const isActive = (link) => {
        const hashTarget = location.hash ? location.hash.replace('#', '') : null;

        if (link.path === '/') {
            return location.pathname === '/' && !activeScrollTarget && !hashTarget;
        }

        if (link.scrollTarget) {
            if (location.pathname !== '/') return false;
            return activeScrollTarget === link.scrollTarget || (!activeScrollTarget && hashTarget === link.scrollTarget);
        }

        return location.pathname === link.path;
    };

    const handleNavClick = (event, link) => {
        if (link.path === '/') {
            setIsMobileMenuOpen(false);

            if (location.pathname === '/') {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.replaceState(null, '', '/');
                setActiveScrollTarget(null);
            }

            return;
        }

        if (!link.scrollTarget) {
            setIsMobileMenuOpen(false);
            return;
        }

        event.preventDefault();
        setIsMobileMenuOpen(false);

        if (location.pathname === '/') {
            const didScroll = scrollToSectionWithOffset(link.scrollTarget, 'smooth');
            if (didScroll) {
                window.history.replaceState(null, '', `/#${link.scrollTarget}`);
                setActiveScrollTarget(link.scrollTarget);
            }
            return;
        }

        navigate(`/#${link.scrollTarget}`);
    };

    const LanguageToggle = ({ compact = false }) => (
        <div
            className={cn(
                'flex items-center rounded-full bg-[var(--site-primary-soft)]/40 p-1',
                compact ? 'text-[11px]' : 'text-xs'
            )}
            role="group"
            aria-label={t('nav.language')}
        >
            <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                    'rounded-full px-3 py-1.5 font-semibold tracking-wide transition-colors',
                    language === 'en' ? 'bg-[var(--site-primary)] text-white' : 'text-[var(--site-text)] opacity-80 hover:opacity-100'
                )}
                aria-pressed={language === 'en'}
            >
                EN
            </button>
            <button
                type="button"
                onClick={() => setLanguage('es')}
                className={cn(
                    'rounded-full px-3 py-1.5 font-semibold tracking-wide transition-colors',
                    language === 'es' ? 'bg-[var(--site-primary)] text-white' : 'text-[var(--site-text)] opacity-80 hover:opacity-100'
                )}
                aria-pressed={language === 'es'}
            >
                ES
            </button>
        </div>
    );

    return (
        <nav className="sticky top-0 z-50 w-full bg-[color-mix(in_srgb,var(--site-background)_84%,transparent)] backdrop-blur-xl">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4">
                    <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <img src="/logo.avif" alt="CHOICE Logo" className="h-11 w-auto sm:h-12" />
                    </Link>

                    <div className="hidden md:flex justify-center">
                        <div className="inline-flex items-center gap-1 rounded-full bg-[var(--site-primary-soft)]/35 p-1.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={(event) => handleNavClick(event, link)}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-[15px] font-medium transition-colors',
                                        isActive(link)
                                            ? 'bg-[var(--site-primary)] text-white'
                                            : 'text-[var(--site-text)]/90 hover:bg-[var(--site-background)]/75 hover:text-[var(--site-primary)]'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center justify-end">
                        <LanguageToggle />
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-3 md:hidden">
                        <LanguageToggle compact />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="rounded-full bg-[var(--site-primary-soft)]/45 p-2 text-[var(--site-primary)] transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div
                    className={cn(
                        'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
                        isMobileMenuOpen ? 'max-h-[28rem] pb-4 opacity-100' : 'max-h-0 opacity-0'
                    )}
                >
                    <div className="space-y-1 rounded-2xl bg-[var(--site-primary-soft)]/25 p-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={(event) => handleNavClick(event, link)}
                                className={cn(
                                    'block rounded-xl px-4 py-3 text-base font-medium transition-colors',
                                    isActive(link)
                                        ? 'bg-[var(--site-primary)] text-white'
                                        : 'text-[var(--site-text)]/90 hover:bg-[var(--site-background)]/75 hover:text-[var(--site-primary)]'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
