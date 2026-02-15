// File: client/src/pages/ResourcesPage/ResourcesPage.jsx
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ResourcesPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow flex items-center justify-center">
                <h1 className="text-3xl font-bold text-foreground">
                    Resources Coming Soon
                </h1>
            </main>

            <Footer />
        </div>
    );
};

export default ResourcesPage;
