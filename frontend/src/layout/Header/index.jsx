import React, { useState } from 'react';
import { User, Bell, GraduationCap } from 'lucide-react';

const Header = () => {
  const [imgError, setImgError] = useState(false);

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
          {['Trang Chủ', 'Thư Viện', 'Thêm Lịch'].map((item) => (
             <a key={item} href="#" className="opacity-80 hover:opacity-100 hover:text-white transition-all">{item}</a>
          ))}
          <a href="#" className="bg-[#005058] text-white px-4 py-2 rounded-md shadow-inner border border-[#00838f]">Lịch Của Tôi</a>
          <a href="#" className="opacity-80 hover:opacity-100 transition-all">Học Viên</a>
        </nav>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={20} className="cursor-pointer opacity-80 hover:opacity-100" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </div>
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
