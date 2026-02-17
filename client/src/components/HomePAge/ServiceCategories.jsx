// File: client/src/components/ServiceCategories.jsx
import React from 'react';

const categories = [
    {
        title: "Rides to See a Doctor",
        icon: (
            <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 sm:h-14 sm:w-14">
                <circle cx="32" cy="32" r="22" fill="#111111" />
                <rect x="29" y="20" width="6" height="24" rx="2" fill="#ffffff" />
                <rect x="20" y="29" width="24" height="6" rx="2" fill="#ffffff" />
            </svg>
        ),
    },
    {
        title: "Rides for Food & Groceries",
        icon: (
            <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 sm:h-14 sm:w-14">
                <path
                    d="M42 20c-2.5 0-4.7 1.2-6 2.6-1.3-1.4-3.5-2.6-6-2.6-6.6 0-12 5.4-12 12.1C18 44 27.4 52 36 52s18-8 18-19.9C54 25.4 48.6 20 42 20z"
                    fill="#d6403f"
                />
                <path d="M38.5 12c-2.9 0-5.3 1.8-6.1 4.3 2.7.2 5.5-1.3 6.7-3.5.5-.9.6-1.7-.6-1.7z" fill="#2e6b3f" />
                <rect x="31" y="12" width="3" height="8" rx="1.5" fill="#2e6b3f" />
            </svg>
        ),
    },
    {
        title: "Rides for Housing & Work",
        icon: (
            <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 sm:h-14 sm:w-14">
                <path d="M16 30l16-14 16 14v18H16V30z" fill="#0b5b8d" />
                <path d="M20 30h24v18H20V30z" fill="#0b5b8d" />
                <path d="M28 48V36h8v12" fill="#ffffff" />
                <path d="M16 28l16-14 16 14" fill="none" stroke="#0b5b8d" strokeWidth="3" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        title: "Buses & Public Transit",
        icon: (
            <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 sm:h-14 sm:w-14">
                <rect x="16" y="14" width="32" height="36" rx="6" fill="#0b5b8d" />
                <rect x="20" y="18" width="24" height="14" rx="2" fill="#ffffff" />
                <rect x="20" y="34" width="24" height="6" rx="2" fill="#0b5b8d" />
                <circle cx="24" cy="48" r="3" fill="#0b5b8d" />
                <circle cx="40" cy="48" r="3" fill="#0b5b8d" />
            </svg>
        ),
    },
];

const ServiceCategories = () => {
    return (
        <section className="bg-white py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-[#f2f6f9] rounded-none p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[220px]"
                        >
                            <div className="mb-6">{category.icon}</div>
                            <h3 className="text-lg sm:text-xl font-medium text-black leading-snug">
                                {category.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceCategories;
