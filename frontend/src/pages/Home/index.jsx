// src/pages/Home/index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Calendar, Clock, Search, Plus } from 'lucide-react';
import { mockSessions } from '../../api';

const Home = () => {
  const navigate = useNavigate(); // Hook chuyển trang
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('date');
  
  const getProcessedSessions = () => {
    let processed = [...mockSessions];
    if (searchText) processed = processed.filter(s => s.title.toLowerCase().includes(searchText.toLowerCase()));
    return processed;
  };

  const displayedSessions = getProcessedSessions();

  return (
    <div className="h-full"> 
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#006D77]">Buổi tư vấn</h2>
        <p className="text-sm text-gray-500">Quản lý danh sách các buổi tư vấn và lịch giảng dạy</p>
      </div>
      
      {/* Box chứa danh sách (Căn giữa cho đẹp) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-2xl mx-auto min-h-[500px]">
           {/* Tabs */}
           <div className="flex gap-4 mb-6 border-b border-gray-100 pb-2">
             {['Tất cả', 'Đã kết thúc', 'Sắp diễn ra'].map((tab, i) => (
                <button key={i} className={`pb-2 text-sm font-bold transition-all ${i===0 ? 'text-[#006D77] border-b-2 border-[#006D77]' : 'text-gray-400 hover:text-gray-600'}`}>{tab}</button>
             ))}
           </div>

           {/* Search */}
           <div className="flex gap-2 mb-6">
             <div className="relative flex-1">
               <input 
                  placeholder="Tìm kiếm..." 
                  className="w-full border border-gray-200 rounded-lg pl-9 py-2.5 text-sm bg-white focus:outline-none focus:border-[#006D77] transition-all"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
               />
               <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
             </div>
             <button className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-3 rounded-lg shadow-sm transition-colors"><Plus size={20}/></button>
           </div>

           {/* List Items */}
           <div className="space-y-4">
             {displayedSessions.map(item => (
               <div 
                  key={item.id} 
                  // SỰ KIỆN CLICK CHUYỂN TRANG
                  onClick={() => navigate(`/consultation/${item.id}`)}
                  className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#006D77] hover:shadow-md transition-all bg-white group relative overflow-hidden"
               >
                 {/* Thanh màu bên trái trang trí */}
                 <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'upcoming' ? 'bg-[#006D77]' : 'bg-red-500'}`}></div>

                 <div className="flex justify-between items-start mb-2 pl-3">
                    <h3 className="font-bold text-base text-[#102A43] group-hover:text-[#006D77] transition-colors">{item.title}</h3>
                    <div className={`w-2 h-2 rounded-full mt-2 ${item.status === 'upcoming' ? 'bg-blue-500' : 'bg-red-500'}`} />
                 </div>
                 <div className="text-sm text-gray-500 space-y-2 pl-3">
                    <p className="flex items-center gap-2"><Calendar size={14}/> {item.displayDate}</p>
                    <p className="flex items-center gap-2"><Clock size={14}/> {item.startTime} - {item.endTime}</p>
                 </div>
               </div>
             ))}
           </div>
      </div>
    </div>
  );
};

export default Home;
