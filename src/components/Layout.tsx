import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
    return (
        <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex flex-col ${className}`}>
            <div className="max-w-4xl mx-auto w-full flex-grow">
                {children}
            </div>
            <footer className="text-center mt-12 pb-4 text-gray-400 text-sm font-medium">
                made by 승연샘
            </footer>
        </div>
    );
};
