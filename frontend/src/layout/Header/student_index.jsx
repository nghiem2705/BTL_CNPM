import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Bell, GraduationCap } from 'lucide-react';

const StudentHeader = () => {
  const [imgError, setImgError] = useState(false);
{/* sửa thành nav link để active nha ae, tag a ko active được */}
  // Hàm tạo class để highlight menu đang chọn
  const navLinkClass = ({ isActive }) => 
    isActive 
      ? "text-white opacity-100 font-bold border-b-2 border-white pb-1 transition-all" // Style khi đang chọn
      : "opacity-80 hover:opacity-100 hover:text-white transition-all pb-1 border-b-2 border-transparent"; // Style bình thường

  return (
    <header className="bg-[#006D77] text-white h-16 px-4 sm:px-6 flex justify-between items-center shadow-md z-20 sticky top-0">
      <div className="flex items-center gap-4 sm:gap-8">
        
        {/* Logo & Branding */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
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
        </NavLink>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          
          <NavLink to="/student" end className={navLinkClass}>
            Trang Chủ
          </NavLink>

          <NavLink to="/student/library" className={navLinkClass}>
            Thư Viện
          </NavLink>

          <NavLink to="/student/tutors" className={navLinkClass}>
            Tutor
          </NavLink>

          <NavLink to="/student/sessions/register"  className={navLinkClass}>
            Đăng ký buổi
          </NavLink>

          <NavLink to="/student/sessions/registered" className={navLinkClass}>
            Buổi tư vấn
          </NavLink>


        </nav>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-4">

        <div className="relative">
          <Bell size={20} className="cursor-pointer opacity-80 hover:opacity-100" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </div>

        <NavLink 
          to="/student/profile" 
          className={({ isActive }) => 
            `flex items-center gap-2 cursor-pointer p-1.5 rounded-lg transition-colors ${
               isActive ? "bg-[#005058] ring-1 ring-[#00838f]" : "hover:bg-[#005058]"
            }`
          }
        >
          <div className="text-right hidden lg:block">
              <p className="text-xs font-bold">Nguyễn Văn AB</p>
              <p className="text-[10px] opacity-70">2312329 - Sinh viên</p>
          </div>
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-[#006D77] border-2 border-white shadow-sm">
              <User size={20} />
          </div>
        </NavLink>
        {/* ---------------------------------- */}

      </div>
    </header>
  );
};

export default StudentHeader