// import React, { useState } from 'react';
// import { User, Bell, GraduationCap } from 'lucide-react';

// const Header = () => {
//   const [imgError, setImgError] = useState(false);

//   return (
//     <header className="bg-[#006D77] text-white h-16 px-4 sm:px-6 flex justify-between items-center shadow-md z-20 sticky top-0">
//       <div className="flex items-center gap-4 sm:gap-8">
//         {/* Logo & Branding */}
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm overflow-hidden flex-shrink-0">
//               {!imgError ? (
//                 <img 
//                     src="https://cdn.haitrieu.com/wp-content/uploads/2021/09/Logo-DH-Bach-Khoa-HCMUT.png" 
//                     alt="Logo Bách Khoa" 
//                     className="w-full h-full object-contain"
//                     onError={() => setImgError(true)} 
//                 />
//               ) : (
//                 <GraduationCap size={24} className="text-[#006D77]" /> 
//               )}
//           </div>
//           <div className="flex flex-col leading-tight">
//               <span className="font-bold text-lg tracking-wide hidden sm:block">HCMUT</span>
//               <span className="text-[10px] opacity-80 uppercase tracking-wider hidden sm:block">E-Learning System</span>
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
//           {['Trang Chủ', 'Thư Viện', 'Thêm Lịch'].map((item) => (
//              <a key={item} href="#" className="opacity-80 hover:opacity-100 hover:text-white transition-all">{item}</a>
//           ))}
//           <a href="#" className="bg-[#005058] text-white px-4 py-2 rounded-md shadow-inner border border-[#00838f]">Lịch Của Tôi</a>
//           <a href="#" className="opacity-80 hover:opacity-100 transition-all">Học Viên</a>
//         </nav>
//       </div>

//       {/* User Profile */}
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <Bell size={20} className="cursor-pointer opacity-80 hover:opacity-100" />
//           <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
//         </div>
//         <div className="flex items-center gap-2 cursor-pointer hover:bg-[#005058] p-1.5 rounded-lg transition-colors">
//           <div className="text-right hidden lg:block">
//               <p className="text-xs font-bold">Nguyễn Văn A</p>
//               <p className="text-[10px] opacity-70">GV001 - Giảng viên</p>
//           </div>
//           <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-[#006D77] border-2 border-white shadow-sm">
//               <User size={20} />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // <--- Import quan trọng
import { User, Bell, GraduationCap } from 'lucide-react';

const Header = () => {
  const [imgError, setImgError] = useState(false);

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
          
          <NavLink to="/tutor" end className={navLinkClass}>
            Trang Chủ
          </NavLink>

          <NavLink to="/library" className={navLinkClass}>
            Thư Viện
          </NavLink>

          {/* Trang tạo mới sắp làm */}
          <NavLink to="/tutor/create" className={navLinkClass}>
            Thêm Lịch
          </NavLink>

          {/* Nút nổi bật riêng biệt */}
          <NavLink to="/tutor/sessions"  className={navLinkClass}
            // className={({ isActive }) => 
            //     `px-4 py-2 rounded-md shadow-inner border transition-all ${
            //         isActive 
            //         ? "bg-[#004c54] border-white text-white font-bold" 
            //         : "bg-[#005058] border-[#00838f] text-white hover:bg-[#00454d]"
            //     }`
            // }
          >
            Lịch Của Tôi
          </NavLink>

          <NavLink to="/tutor/students" className={navLinkClass}>
            Học Viên
          </NavLink>


        </nav>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        
        {/* Nút thông báo giữ nguyên (hoặc link tới /notifications nếu muốn) */}
        <div className="relative">
          <Bell size={20} className="cursor-pointer opacity-80 hover:opacity-100" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </div>

        {/* --- SỬA ĐOẠN NÀY THÀNH NAVLINK --- */}
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex items-center gap-2 cursor-pointer p-1.5 rounded-lg transition-colors ${
               isActive ? "bg-[#005058] ring-1 ring-[#00838f]" : "hover:bg-[#005058]"
            }`
          }
        >
          <div className="text-right hidden lg:block">
              <p className="text-xs font-bold">Nguyễn Văn A</p>
              <p className="text-[10px] opacity-70">GV001 - Giảng viên</p>
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

export default Header;