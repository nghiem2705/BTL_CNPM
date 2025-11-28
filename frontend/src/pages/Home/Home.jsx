// src/pages/Home.jsx
import React from 'react';
import { Info, Bell, ArrowRight } from 'lucide-react';
/// NÀY LÀ DASHBOARD DÙNG CHUNG CHO CẢ 3 GIAO DIỆN (KHÁCH, TUTOR, STDUENT)
const Home = () => {

//   const bannerImage = "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop"; 
  const bannerImage = "https://i.pinimg.com/1200x/ee/4d/eb/ee4debcb146702a7e84c6e1239958dfa.jpg"; 


  return (
    <div className="w-full bg-gray-100 min-h-screen font-sans animate-fade-in">
      
      {/* --- SECTION 1: HERO BANNER --- */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {/* Banneer */}
        <img 
          src={bannerImage} 
          alt="University Campus" 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Card thông tin */}
        <div className="absolute top-10 left-6 md:top-16 md:left-20 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-md border border-white/50 animate-in slide-in-from-left-10 duration-700">
          <div className="flex items-start gap-3">
            <Info className="text-blue-900 mt-1 shrink-0" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Chương trình Tutor/ Mentor</h2>
              <p className="text-sm text-gray-600 mb-4">Tầm nhìn và sứ mệnh chương trình</p>
              
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2 rounded shadow-sm transition-colors uppercase tracking-wide">
                Thông tin Chi Tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  BẢNG THÔNG BÁO*/}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 pb-10">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-h-[300px]">
          
          {/* Header của bảng thông báo */}
          <div className="bg-white border-b border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-600 uppercase flex items-center gap-2">
              <Bell size={16} /> Thông báo chung - Thông báo hệ thống
            </h3>
          </div>

          <div className="p-6 space-y-6">
            
            {/* */}
            <div className="group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                   <Info size={20} className="text-gray-500 group-hover:text-blue-600 transition-colors"/>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-800 group-hover:text-blue-700 transition-colors uppercase mb-1">
                    TIÊU ĐỀ THÔNG BÁO
                  </h4>
                  <p className="text-sm text-gray-600">NỘI DUNG</p>
                </div>
              </div>
            </div>

            {/* Thông báo */}
            <div className="border-t border-gray-100 pt-4 group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                   <Info size={20} className="text-gray-500 group-hover:text-blue-600 transition-colors"/>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-800 group-hover:text-blue-700 transition-colors uppercase mb-1">
                    Lịch bảo trì hệ thống tháng 12
                  </h4>
                  <p className="text-sm text-gray-600">Hệ thống sẽ tạm ngưng hoạt động từ 23:00 - 02:00 ngày 01/12/2025 để nâng cấp.</p>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>

    </div>
  );
};

export default Home;