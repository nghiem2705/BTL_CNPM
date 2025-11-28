import { Bell, GraduationCap, User } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const [imgError, setImgError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Navigation items configuration (left side)
    const navItems = [
        { label: 'Trang Chủ', path: '/tutor/home' },
        { label: 'Thư Viện', path: '/tutor/library' },
        // { label: 'Thêm Lịch', path: '/tutor/consultation/create' },
        { label: 'Lịch Của Tôi', path: '/tutor/consultation' },
    ];

    // Student switch button (right side)
    const studentPath = '/student';

    // Check if a route is active
    const isActive = (path) => {
        if (path === '/home') {
            return location.pathname === '/home' || location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <header className="bg-[#006D77] text-white h-16 px-4 sm:px-6 flex justify-between items-center shadow-md z-20 sticky top-0">
            <div className="flex items-center gap-4 sm:gap-8">
                {/* Logo & Branding */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm overflow-hidden flex-shrink-0">
                        {!imgError ? (
                            <img
                                src="https://cdn.haitrieu.com/wp-content/uploads/2021/09/Logo-DH-Bach-Khoa-HCMUT.png"
                                alt="Logo Bách Khoa"
                                className="w-full h-full object-contain"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <GraduationCap size={24} className="text-[#006D77]" />
                        )}
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="font-bold text-lg tracking-wide hidden sm:block">HCMUT</span>
                        <span className="text-[10px] opacity-80 uppercase tracking-wider hidden sm:block">E-Learning System</span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navItems.map((item) => {
                        const active = isActive(item.path);

                        return (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`rounded-md transition-all ${`px-3 py-2 ${active
                                    ? 'bg-[#005058] text-white shadow-inner border border-[#00838f]'
                                    : 'opacity-80 hover:opacity-100 hover:text-white'
                                    }`
                                    }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Right Side: Student Switch + Notifications + User Profile */}
            <div className="flex items-center gap-4">
                {/* Student Switch Button */}
                <button
                    onClick={() => navigate(studentPath)}
                    className={`hidden md:block px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname.startsWith(studentPath)
                            ? 'bg-[#005058] text-white shadow-inner border border-[#00838f]'
                            : 'opacity-80 hover:opacity-100 hover:text-white'
                        }`}
                >
                    Học Viên
                </button>

                {/* Notifications */}
                <div className="relative">
                    <Bell size={20} className="cursor-pointer opacity-80 hover:opacity-100" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#005058] p-1.5 rounded-lg transition-colors">
                    <div className="text-right hidden lg:block">
                        <p className="text-xs font-bold">Nguyễn Văn A</p>
                        <p className="text-[10px] opacity-70">GV001 - Giảng viên</p>
                    </div>
                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-[#006D77] border-2 border-white shadow-sm">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
