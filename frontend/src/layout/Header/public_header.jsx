import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn } from 'lucide-react';

const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white h-20 px-8 flex justify-between items-center shadow-sm fixed w-full top-0 z-50">
      
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
         <div className="w-10 h-10 bg-[#006D77] rounded-full flex items-center justify-center text-white">
            <GraduationCap size={24} />
         </div>
         <span className="font-bold text-xl text-[#006D77] tracking-wider">HCMUT E-LEARNING</span>
      </div>

      {/* Menu Đơn giản */}
      <nav className="flex items-center gap-8 font-medium text-sm text-gray-600">
        <NavLink to="/" className="hover:text-[#006D77] transition-colors">Giới thiệu</NavLink>
        <NavLink to="/news" className="hover:text-[#006D77] transition-colors">Tin tức</NavLink>
        <NavLink to="/contact" className="hover:text-[#006D77] transition-colors">Liên hệ</NavLink>
      </nav>

      {/* Nút Đăng nhập */}
      <button 
        onClick={() => navigate('/select-role')} 
        className="bg-[#006D77] hover:bg-[#005058] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md flex items-center gap-2"
      >
        <LogIn size={18} /> Đăng Nhập
      </button>

    </header>
  );
};

export default PublicHeader;