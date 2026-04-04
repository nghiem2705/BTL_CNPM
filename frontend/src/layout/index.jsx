import React, { useState, useEffect } from 'react';
// import Header from './Header';
import { GraduationCap } from 'lucide-react';
import StudentSurvey from '../components/Survey/StudentSurvey';
import { profileApi } from '../api/ProfileApi';

const Layout = ({ children, header }) => {
  const [showSurvey, setShowSurvey] = useState(false);
  const [uID, setUID] = useState(null);

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.role === 'student' && userInfo.uID) {
        setUID(userInfo.uID);
        // Check if features.hard_filters is missing or empty
        const features = userInfo.user?.description?.features || {};
        if (!features.hard_filters || !features.hard_filters.format) {
          setShowSurvey(true);
        }
      }
    } catch (e) {
      console.error("Error reading userInfo for survey check", e);
    }
  }, []);

  const handleSurveySuccess = async () => {
    setShowSurvey(false);
    // Refresh local storage so survey doesn't pop up again
    if (uID) {
        try {
            const res = await profileApi.getStudentProfile(uID);
            if (res.success) {
                const storedInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
                storedInfo.user = res.data.profile;
                localStorage.setItem('userInfo', JSON.stringify(storedInfo));
            }
        } catch (e) {}
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] font-sans text-[#334E68]">
      {showSurvey && uID && <StudentSurvey uID={uID} onSuccess={handleSurveySuccess} />}

      {/* <Header />  chỗ này thay bằng biến để trong app.jsx gọi hàm */}
      <div className="w-full z-50">
         {header}
      </div>

      <main className="flex-grow p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#243B53] text-white text-xs p-8 mt-auto border-t-4 border-[#006D77]">
        <div className="max-w-6xl mx-auto opacity-80 space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
             <GraduationCap size={24} />
             <span className="font-bold text-lg tracking-wide">HCMUT E-Learning</span>
          </div>
          <p className="font-medium uppercase tracking-wider text-[#BCCCDC]">Tổ kỹ thuật / Technician Support</p>
          <p>Email: <a href="mailto:ddtbua@hcmut.edu.vn" className="text-[#48C0E0] hover:underline">ddtbua@hcmut.edu.vn</a></p>
          <p>ĐT (Tel.): (84-8) 38647256 - 7200</p>
          <div className="pt-6 border-t border-white/10 mt-4 text-[10px] opacity-60">
            © 2025 Ho Chi Minh City University of Technology. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
