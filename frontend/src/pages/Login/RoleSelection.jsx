// src/pages/Login/RoleSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const handleSelectRole = (role) => {
    navigate('/login', { state: { role: role } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#102A43] mb-2">Chào mừng đến với HCMUT E-Learning</h1>
        <p className="text-gray-500">Vui lòng chọn vai trò của bạn để tiếp tục</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        
        {/*Sinh Viên */}
        <div 
          onClick={() => handleSelectRole('student')}
          className="bg-white p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-[#006D77] hover:shadow-xl cursor-pointer transition-all group flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:bg-[#006D77] group-hover:text-white transition-colors">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Sinh Viên / Học Viên</h3>
          <p className="text-sm text-gray-500 mb-6">Truy cập khóa học, tài liệu và lịch học cá nhân.</p>
          <span className="text-[#006D77] font-bold flex items-center gap-2 group-hover:underline">
            Đăng nhập Sinh viên <ArrowRight size={16}/>
          </span>
        </div>

        {/* Tuto */}
        <div 
          onClick={() => handleSelectRole('tutor')}
          className="bg-white p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-[#006D77] hover:shadow-xl cursor-pointer transition-all group flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6 group-hover:bg-[#006D77] group-hover:text-white transition-colors">
            <GraduationCap size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Giảng Viên / Tutor</h3>
          <p className="text-sm text-gray-500 mb-6">Quản lý lịch dạy, học viên và tài liệu giảng dạy.</p>
          <span className="text-[#006D77] font-bold flex items-center gap-2 group-hover:underline">
            Đăng nhập Giảng viên <ArrowRight size={16}/>
          </span>
        </div>

      </div>
      
      {/* {quay lại} */}
      <button onClick={() => navigate('/')} className="mt-12 text-gray-400 hover:text-gray-600 underline text-sm">
        Quay lại trang chủ
      </button>
    </div>
  );
};

export default RoleSelection;