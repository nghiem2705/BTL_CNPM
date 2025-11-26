// src/pages/Home/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Search, Plus, Download, 
  ChevronDown, Check 
} from 'lucide-react';
import { mockSessions } from '../../api'; // Import dữ liệu giả

const Home = () => {
  const navigate = useNavigate();
  // Lấy dữ liệu trực tiếp từ file mock, không cần useEffect gọi API
  const [sessions] = useState(mockSessions); 
  const [searchText, setSearchText] = useState('');
  
  // State cho Menu Sort
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState('date');
  const sortRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xử lý Lọc & Sắp xếp
  const getProcessedSessions = () => {
    let processed = [...sessions];

    // 1. Tìm kiếm
    if (searchText) {
      processed = processed.filter(s => s.title.toLowerCase().includes(searchText.toLowerCase()));
    }

    // 2. Sắp xếp
    processed.sort((a, b) => {
      switch (sortOption) {
        case 'title': return a.title.localeCompare(b.title);
        case 'duration': 
          return parseInt(b.duration) - parseInt(a.duration); // Dài nhất lên đầu
        case 'date': 
        default: return new Date(b.date) - new Date(a.date); // Mới nhất lên đầu
      }
    });

    return processed;
  };

  const displayedSessions = getProcessedSessions();

  // Label hiển thị trên nút Sort
  const sortLabels = {
    'date': 'Sort by date',
    'title': 'Sort by session name',
    'duration': 'Sort by duration'
  };

  return (
    <div className="h-full font-sans"> 
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#102A43]">Buổi tư vấn</h2>
        <p className="text-sm text-gray-500">Quản lý danh sách các buổi tư vấn và lịch giảng dạy</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[600px]">
           
           {/* TABS */}
           <div className="flex gap-2 mb-4">
             {['Tất cả', 'Đã kết thúc', 'Sắp diễn ra', 'Tháng này'].map((tab, i) => (
                <button key={i} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${i===0 ? 'bg-[#dbeafe] text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {tab}
                </button>
             ))}
           </div>

           {/* TOOLBAR */}
           <div className="flex gap-3 mb-6 relative z-10">
             
             {/* --- DROPDOWN SORT (Giống ảnh) --- */}
             <div className="relative" ref={sortRef}>
               <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded bg-[#f8f9fa] text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors min-w-[140px] justify-between"
               >
                  <span>{sortLabels[sortOption]}</span>
                  <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`}/> 
               </button>

               {/* Menu xổ xuống */}
               {isSortOpen && (
                 <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                    {[
                      { key: 'date', label: 'Sort by date' },
                      { key: 'title', label: 'Sort by session name' },
                      { key: 'duration', label: 'Sort by duration' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => { setSortOption(opt.key); setIsSortOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group"
                      >
                        {opt.label}
                        {sortOption === opt.key && <Check size={14} className="text-blue-600"/>}
                      </button>
                    ))}
                 </div>
               )}
             </div>
             
             {/* Search Box */}
             <div className="relative flex-1">
               <input 
                  placeholder="Tìm kiếm tên chủ đề" 
                  className="w-full border border-gray-200 rounded pl-9 py-2 text-xs bg-[#f8f9fa] focus:bg-white focus:outline-blue-500 transition-all"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
               />
               <Search size={14} className="absolute left-3 top-2.5 text-gray-400"/>
             </div>

             <button className="bg-[#4CAF50] hover:bg-[#43a047] text-white p-2 rounded shadow-sm transition-colors">
               <Plus size={20}/>
             </button>
           </div>

           {/* --- DANH SÁCH ITEM (Giống ảnh) --- */}
           <div className="space-y-4">
             {displayedSessions.map(item => (
               <div key={item.id} className="border border-gray-300 rounded-xl p-4 bg-white hover:border-blue-400 transition-all relative group shadow-sm hover:shadow-md">
                 <div className="flex justify-between items-start">
                    
                    {/* BÊN TRÁI: Logo + Info */}
                    <div className="flex gap-4">
                        {/* Logo giả lập */}
                        <div className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center shrink-0 mt-1 text-gray-600">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                           </svg>
                        </div>

                        <div>
                            <h3 className="font-bold text-sm text-gray-900 mb-2">{item.title}</h3>
                            <div className="flex items-center gap-3 mb-1">
                                <p className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                    <Calendar size={14} className="text-gray-500"/> {item.displayDate}
                                </p>
                                {item.status === 'upcoming' ? (
                                    <span className="bg-[#0ea5e9] text-white px-2 py-0.5 rounded text-[10px] font-bold">Sắp diễn ra</span>
                                ) : (
                                    <span className="bg-[#ff4d4f] text-white px-2 py-0.5 rounded text-[10px] font-bold">Đã kết thúc</span>
                                )}
                            </div>
                            <p className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Clock size={14} className="text-gray-500"/> {item.startTime} - {item.endTime} ({item.duration})
                            </p>
                        </div>
                    </div>

                    {/* BÊN PHẢI: Buttons */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/consultation/${item.id}`)}
                        className="bg-[#1e40af] hover:bg-blue-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      
                      <button className="bg-[#475569] hover:bg-gray-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors">
                        Hủy buổi
                      </button>

                      <button className="bg-[#0d9488] hover:bg-teal-700 text-white p-1.5 rounded-full transition-colors">
                        <Download size={14}/>
                      </button>
                    </div>
                 </div>
               </div>
             ))}
           </div>
      </div>
    </div>
  );
};

export default Home;
