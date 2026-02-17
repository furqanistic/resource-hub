// File: client/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <img src="/logo.avif" alt="CHOICE Logo" className="h-12 w-auto object-contain" />
                </div>

                {/* Right: Copyright */}
                <div className="text-black text-sm text-center md:text-right">
                    All Rights Reserved. 2026
                </div>
            </div>
        </footer>
    );
};

export default Footer;
