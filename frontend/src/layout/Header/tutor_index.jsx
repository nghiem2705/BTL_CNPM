import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { User, Bell, GraduationCap, LogOut } from 'lucide-react';

const TutorHeader = () => {
  const [imgError, setImgError] = useState(false);
  const { uID } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State lưu thông tin user (để hiển thị tên)
  const [userInfo, setUserInfo] = useState({ name: "Giảng Viên", id: uID || "GV..." });

  useEffect(() => {
    // Lấy thông tin user từ localStorage (đã lưu lúc Login)
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.user) {
        setUserInfo({
          name: parsedUser.user.name || "Giảng Viên",
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

  // Nếu không có uID (trường hợp hiếm), dùng mặc định hoặc quay về login
  const basePath = uID ? `/tutor/${uID}` : '/tutor';

  return (
    <header className="bg-[#006D77] text-white h-16 px-4 sm:px-6 flex justify-between items-center shadow-md z-20 sticky top-0">
      <div className="flex items-center gap-4 sm:gap-8">

        {/* Logo -> Về trang Dashboard của Tutor đó */}
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

          <NavLink to={`${basePath}/create`} className={navLinkClass}>
            Thêm lịch
          </NavLink>

          <NavLink to={`${basePath}/sessions`} className={navLinkClass}>
            Lịch của tôi
          </NavLink>

          <NavLink to={`${basePath}/students`} className={navLinkClass}>
            Học viên
          </NavLink>

        </nav>
      </div>

      {/* Profile Section (Hiển thị tên thật) */}
      <div className="flex items-center gap-4">

        <div className="relative cursor-pointer opacity-80 hover:opacity-100">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </div>

        <div className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 cursor-pointer p-1.5 rounded-lg transition-colors ${isDropdownOpen ? "bg-[#005058] ring-1 ring-[#00838f]" : "hover:bg-[#005058]"
              }`}
          >
            <div className="text-right hidden lg:block">
              <p className="text-xs font-bold">{userInfo.name}</p> {/* Hiện tên thật */}
              <p className="text-[10px] opacity-70">{userInfo.id} - Giảng viên</p>
            </div>
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-[#006D77] border-2 border-white shadow-sm">
              <User size={20} />
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 text-gray-800 border border-gray-100 animate-fade-in-up origin-top-right">
              <div className="px-4 py-3 border-b border-gray-100 mb-1">
                <p className="text-sm font-bold text-gray-900 truncate">{userInfo.name}</p>
                <p className="text-xs text-gray-500 truncate">{userInfo.id}</p>
              </div>

              <NavLink
                to={`${basePath}/profile`}
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <User size={16} className="text-gray-500" />
                Xem thông tin cá nhân
              </NavLink>

              <button
                onClick={() => {
                  localStorage.removeItem('userInfo');
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default TutorHeader;