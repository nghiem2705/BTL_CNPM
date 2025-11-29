// const Login = () => {
//     return (
//         <>
//             Login
//         </>
//     )
// }

// export default Login;
// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, GraduationCap, Loader } from 'lucide-react';
import { SSOApi} from '../../api/Login'

const SSOLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || 'student';
  
  // State quản lý dữ liệu
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // --- GIẢ LẬP GỌI API ---
    // Sau này bạn sẽ thay đoạn này bằng API thật
    setTimeout(async () => {
        try {
          const result = await SSOApi.login(username, password, role);
          const uID = result.uID
          console.log("Kết quả API trả về:", result); 
          console.log("Kiểu dữ liệu:", typeof result);
          console.log("uID:", uID)
          // localStorage.setItem('userInfo', JSON.stringify(result));
          if (result.role == "tutor") {
            navigate(`/tutor/${uID}`);
          }
          else {
            navigate(`/student/${uID}`);
          }
        }

        catch (err) {
          setError(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng!');
        }

        finally {
          setLoading(false);
        } 
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 relative overflow-hidden font-sans">
      
      {/* ẢNH NỀN (Làm mờ) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center blur-sm scale-105"
        style={{ backgroundImage: "url('https://i.pinimg.com/736x/68/95/d2/6895d2761194d4067a5dfc5695a5505e.jpg')" }}
      ></div>
      <div className="absolute inset-0 z-0 bg-[#006D77]/80"></div> {/* Lớp phủ màu xanh thương hiệu */}

      {/* CARD ĐĂNG NHẬP */}
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md z-10 animate-fade-in-up mx-4">
        
        {/* Logo & Tiêu đề */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#006D77] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
             <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#102A43] uppercase tracking-wide">Cổng Đăng Nhập</h1>
          <p className="text-gray-500 text-sm mt-1">Hệ thống quản lý Tutor/Mentor</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Thông báo lỗi */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* Ô nhập Username */}
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <User size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Tên đăng nhập " 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]/50 focus:border-[#006D77] transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Ô nhập Password */}
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <Lock size={20} />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mật khẩu" 
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]/50 focus:border-[#006D77] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Nút ẩn hiện mật khẩu */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-[#006D77] transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Quên mật khẩu */}
          <div className="flex justify-end">
            <a href="#" className="text-xs font-bold text-[#006D77] hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          {/* Nút Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#006D77] hover:bg-[#00565e] text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : "ĐĂNG NHẬP"}
          </button>

        </form>

        {/* Footer Card */}
        <div className="mt-8 text-center text-xs text-gray-400">
          © 2025 HCMUT E-Learning System. <br/> All rights reserved.
        </div>

      </div>
    </div>
  );
};

export default SSOLogin;