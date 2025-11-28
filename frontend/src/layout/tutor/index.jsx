import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const TutorLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA] font-sans text-[#334E68]">
            <Header />
            <main className="flex-grow p-4 sm:p-6 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default TutorLayout;
