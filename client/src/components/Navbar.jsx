// File: client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.directory'), path: '/#directory', scrollTarget: 'directory' },
        { name: t('nav.resources'), path: '/#resources', scrollTarget: 'resources' },
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.partners'), path: '/partners' },
        { name: t('nav.adminLogin'), path: '/admin/login' },
    ];

    const isActive = (link) => {
        if (link.scrollTarget) {
            return location.pathname === '/' && location.hash === `#${link.scrollTarget}`;
        }

        return location.pathname === link.path;
    };

    const handleNavClick = (event, link) => {
        if (!link.scrollTarget) {
            setIsMobileMenuOpen(false);
            return;
        }

        event.preventDefault();
        setIsMobileMenuOpen(false);

        if (location.pathname === '/') {
            const section = document.getElementById(link.scrollTarget);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.history.replaceState(null, '', `/#${link.scrollTarget}`);
            }
            return;
        }

        navigate(`/#${link.scrollTarget}`);
    };

    const LanguageToggle = ({ compact = false }) => (
        <div
            className={cn(
                "flex items-center gap-2 rounded-full border border-[var(--site-primary-soft)] bg-[var(--site-background)] p-1 shadow-sm",
                compact ? "text-[11px]" : "text-xs"
            )}
            role="group"
            aria-label={t('nav.language')}
        >
            <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                    "px-3 py-1 rounded-full font-semibold tracking-wide transition-colors",
                    language === 'en'
                        ? "bg-[var(--site-primary)] text-white"
                        : "text-[var(--site-text)] opacity-80 hover:opacity-100 hover:text-[var(--site-primary)]"
                )}
                aria-pressed={language === 'en'}
            >
                EN
            </button>
            <button
                type="button"
                onClick={() => setLanguage('es')}
                className={cn(
                    "px-3 py-1 rounded-full font-semibold tracking-wide transition-colors",
                    language === 'es'
                        ? "bg-[var(--site-primary)] text-white"
                        : "text-[var(--site-text)] opacity-80 hover:opacity-100 hover:text-[var(--site-primary)]"
                )}
                aria-pressed={language === 'es'}
            >
                ES
            </button>
        </div>
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[var(--site-primary-soft)] bg-[var(--site-background)]">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <img
                            src="/logo.avif"
                            alt="CHOICE Logo"
                            className="h-12 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation Links - Centered */}
                    <div className="hidden md:flex flex-1 items-center justify-center gap-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={(event) => handleNavClick(event, link)}
                                className={cn(
                                    "font-medium transition-colors duration-200 text-base tracking-wide relative py-1",
                                    isActive(link)
                                        ? "text-[var(--site-primary)]"
                                        : "text-[var(--site-text)] opacity-80 hover:text-[var(--site-primary)] hover:opacity-100"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <LanguageToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <LanguageToggle compact />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="rounded-md p-2 text-[var(--site-primary)] transition-colors hover:bg-[var(--site-primary-soft)] focus:outline-none"
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

                {/* Mobile Menu */}
                <div
                    className={cn(
                        "md:hidden overflow-hidden border-t border-[var(--site-primary-soft)] bg-[var(--site-background)] transition-all duration-300 ease-in-out",
                        isMobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={(event) => handleNavClick(event, link)}
                                className={cn(
                                    "block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200",
                                    isActive(link)
                                        ? "bg-[var(--site-primary-soft)] text-[var(--site-primary)]"
                                        : "text-[var(--site-text)] opacity-80 hover:bg-[var(--site-primary-soft)] hover:text-[var(--site-primary)] hover:opacity-100"
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
