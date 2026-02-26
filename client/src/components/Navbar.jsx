// File: client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { language, setLanguage, t } = useLanguage();

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.directory'), path: '/directory' },
        { name: t('nav.resources'), path: '/resources' },
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.partners'), path: '/partners' },
        { name: 'Login', path: '/dashboard' },
    ];

    const isActive = (path) => location.pathname === path;
    const LanguageToggle = ({ compact = false }) => (
        <div
            className={cn(
                "flex items-center gap-2 rounded-full border border-[#03385e]/20 bg-white/90 p-1 shadow-sm",
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
                        ? "bg-[#03385e] text-white"
                        : "text-[#03385e]/70 hover:text-[#03385e]"
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
                        ? "bg-[#03385e] text-white"
                        : "text-[#03385e]/70 hover:text-[#03385e]"
                )}
                aria-pressed={language === 'es'}
            >
                ES
            </button>
        </div>
    );

    return (
        <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
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
                                className={cn(
                                    "font-medium transition-colors duration-200 text-base tracking-wide relative py-1",
                                    isActive(link.path)
                                        ? "text-[#03385e]"
                                        : "text-[#03385e]/80 hover:text-[#03385e]"
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
                            className="p-2 rounded-md text-[#03385e] hover:bg-slate-100 focus:outline-none transition-colors"
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
                        "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-slate-200",
                        isMobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200",
                                    isActive(link.path)
                                        ? "bg-slate-100 text-[#03385e]"
                                        : "text-[#03385e]/80 hover:bg-slate-100 hover:text-[#03385e]"
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
