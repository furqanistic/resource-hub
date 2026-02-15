// File: client/src/components/Footer.jsx
import React from 'react';
import logo from '@/assets/logo.avif';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-white/10 py-10">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <img src={logo} alt="CHOICE Logo" className="h-12 w-auto object-contain" />
                </div>

                {/* Right: Copyright */}
                <div className="text-muted-foreground text-sm text-center md:text-right">
                    All Rights Reserved. 2026
                </div>
            </div>
        </footer>
    );
};

export default Footer;
