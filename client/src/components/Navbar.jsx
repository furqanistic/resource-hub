// File: client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/logo.avif';
import { ModeToggle } from './ModeToggle';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Directory', path: '/directory' },
        { name: 'Resources', path: '/resources' },
        { name: 'About', path: '/about' },
        { name: 'Partners', path: '/partners' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <img
                            src={logo}
                            alt="CHOICE Logo"
                            className="h-10 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation Links - Centered */}
                    <div className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={cn(
                                    "font-medium transition-colors duration-200 text-sm relative py-1 px-2 group",
                                    isActive(link.path)
                                        ? "text-teal-600"
                                        : "text-slate-700 dark:text-slate-300 hover:text-teal-600"
                                )}
                            >
                                {link.name}
                                <span className={cn(
                                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-teal-600 transition-all duration-300 ease-out",
                                    isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                                )}></span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <ModeToggle className="hover:scale-105 transition-transform" />
                        <Link
                            to="/join"
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-teal-500/20 active:scale-95"
                        >
                            JOIN US
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <ModeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
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
                        "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t dark:border-slate-800",
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
                                        ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 px-4 block">
                            <Link
                                to="/join"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full block text-center bg-teal-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold tracking-wide"
                            >
                                JOIN US
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
