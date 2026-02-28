// File: client/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-[var(--site-primary-soft)] bg-[var(--site-background)] py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <img src="/logo.avif" alt="CHOICE Logo" className="h-12 w-auto object-contain" />
                </div>

                {/* Right: Copyright */}
                <div className="text-sm text-center text-[var(--site-text)] md:text-right">
                    All Rights Reserved. 2026
                </div>
            </div>
        </footer>
    );
};

export default Footer;
