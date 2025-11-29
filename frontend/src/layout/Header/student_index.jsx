import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom'; 
import { User, Bell, GraduationCap } from 'lucide-react';

const StudentHeader = () => {
  const [imgError, setImgError] = useState(false);
  const { uID } = useParams(); // Lấy ID từ URL
  
  // State lưu thông tin user (để hiển thị tên)
  const [userInfo, setUserInfo] = useState({ name: "Sinh Viên", id: uID || "SV..." });

  useEffect(() => {
      // Lấy thông tin user từ localStorage (đã lưu lúc Login)
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.user) {
              setUserInfo({
                  name: parsedUser.user.name || "Sinh Viên",
                  id: parsedUser.uID || uID
              });
          }
      }
  }, [uID]);

  // Hàm tạo class highlight
  const navLinkClass = ({ isActive }) => 
    isActive 
      ? "text-white opacity-100 font-bold border-b-2 border-white pb-1 transition-all" 
      : "opacity-80 hover:opacity-100 hover:text-white transition-all pb-1 border-b-2 border-transparent"; 

  // Đường dẫn gốc có kèm ID
  const basePath = uID ? `/student/${uID}` : '/student';

  return (
    <header className="bg-[#006D77] text-white h-16 px-4 sm:px-6 flex justify-between items-center shadow-md z-20 sticky top-0">
      <div className="flex items-center gap-4 sm:gap-8">
        
        {/* Logo -> Về trang Dashboard của Student đó */}
        <NavLink to={basePath} className="flex items-center gap-3 group">
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

        {/* Navigation Menu (Đã update link có uID) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          
          <NavLink to={basePath} end className={navLinkClass}>
            Trang chủ
          </NavLink>

          <NavLink to={`${basePath}/library`} className={navLinkClass}>
            Thư viện
          </NavLink>

          <NavLink to={`${basePath}/tutors`} className={navLinkClass}>
            Tutor
          </NavLink>

          <NavLink to={`${basePath}/sessions/register`} className={navLinkClass}>
            Đăng ký buổi
          </NavLink>

          <NavLink to={`${basePath}/sessions/registered`} className={navLinkClass}>
            Buổi tư vấn
          </NavLink>

        </nav>
      </div>

      {/* Profile Section (Hiển thị tên thật) */}
      <div className="flex items-center gap-4">
        
        <div className="relative cursor-pointer opacity-80 hover:opacity-100">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </div>

        <NavLink 
          to={`${basePath}/profile`} 
          className={({ isActive }) => 
            `flex items-center gap-2 cursor-pointer p-1.5 rounded-lg transition-colors ${
               isActive ? "bg-[#005058] ring-1 ring-[#00838f]" : "hover:bg-[#005058]"
            }`
          }
        >
          <div className="text-right hidden lg:block">
              <p className="text-xs font-bold">{userInfo.name}</p> {/* Hiện tên thật */}
              <p className="text-[10px] opacity-70">{userInfo.id} - Sinh viên</p>
          </div>
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-[#006D77] border-2 border-white shadow-sm">
              <User size={20} />
          </div>
        </NavLink>

      </div>
    </header>
  );
};

export default StudentHeader;