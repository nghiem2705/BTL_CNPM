// export default ConsultationRegister;
// src/pages/student/ConsultationRegister.jsx
import {
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Search,
  User,
  Loader // Thêm icon Loader
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

// Import API & Mock
import { studentSessionApi } from "../../../api/StudentSession";
import { mockSessionsRegister } from "../../../api/mock-data"; // Giữ lại làm fallback nếu cần
import ViewMorePopup from "../../../components/ViewMorePopup";

// --- 1. HÀM HỖ TRỢ TÍNH TOÁN THỜI GIAN (THÊM MỚI) ---
const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime) return "";
    const [hour, minute] = startTime.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + parseInt(durationMinutes || 0);
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    return `${newHour}:${newMinute.toString().padStart(2, '0')}`;
};

const convertDateToDisplay = (dateStr) => {
    if(!dateStr) return "";
    const date = new Date(dateStr);
    return `Thứ ${date.getDay() + 1}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const ConsultationRegister = () => {
  const { uID } = useParams();
  // State
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters & Pagination State
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedTutor, setSelectedTutor] = useState("Tất cả");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [sortOption, setSortOption] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Popup State
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  
  const sortRef = useRef(null);
  const tutorRef = useRef(null);
  const itemsPerPage = 4;

  // Available tutors (Tạm thời hardcode hoặc lấy từ API sau)
  const tutors = ["Tất cả", "Nguyễn Văn B", "Nguyễn Văn C"];

  // --- 2. FETCH DATA TỪ BACKEND ---
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await studentSessionApi.getUnregisterSession(uID);

        // Kiểm tra và map dữ liệu
        if (result.sessions && typeof result.sessions === "object") {
          const sessionsList = Object.values(result.sessions).map(
            (session) => ({
              id: session.id,
              title: session.name,
              
              // Map các trường thời gian để hiển thị ra giao diện
              date: session.date,
              displayDate: convertDateToDisplay(session.date), // Tính ngày đẹp (Thứ...)
              
              startTime: session.time, // Giờ bắt đầu
              endTime: calculateEndTime(session.time, session.duration), // Tính giờ kết thúc
              
              duration: session.duration,
              
              tutor: session.tutor,
              
              online: session.online,
              address: session.address,
              description: session.description,
              registered: false,
            })
          );
          setSessions(sessionsList);
        } else {
          setSessions([]);
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError(err.message || "Lỗi khi tải danh sách buổi học");
        // Fallback data mẫu nếu lỗi (tùy bạn có muốn giữ không)
        // setSessions(mockSessionsRegister); 
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [uID]);

  // --- 3. XỬ LÝ CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
      if (tutorRef.current && !tutorRef.current.contains(event.target)) {
        setIsTutorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 4. FILTER & SORT LOGIC ---
  const getProcessedSessions = () => {
    let processed = [...sessions];

    // Filter by tab
    switch (activeTab) {
      case "Hôm nay":
        const today = new Date().toISOString().split("T")[0];
        processed = processed.filter((s) => s.date === today);
        break;
      case "Tuần này":
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 6)
        );
        processed = processed.filter((s) => {
          const sessionDate = new Date(s.date);
          return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
        });
        break;
      case "Tháng này":
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        processed = processed.filter((s) => {
          const sessionDate = new Date(s.date);
          return (
            sessionDate.getMonth() === currentMonth &&
            sessionDate.getFullYear() === currentYear
          );
        });
        break;
      case "Tất cả":
      default:
        break;
    }

    // Filter by tutor
    if (selectedTutor !== "Tất cả") {
      processed = processed.filter((s) => s.tutor.name === selectedTutor);
    }

    // Search
    if (searchText) {
      processed = processed.filter((s) =>
        s.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sort
    processed.sort((a, b) => {
      switch (sortOption) {
        case "title":
          return a.title.localeCompare(b.title);
        case "duration":
          return parseInt(b.duration) - parseInt(a.duration);
        case "date":
        default:
          return new Date(a.date) - new Date(b.date);
      }
    });

    return processed;
  };

  const filteredSessions = getProcessedSessions();
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSessions = filteredSessions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const sortLabels = {
    date: "Sort by date",
    title: "Sort by session name",
    duration: "Sort by duration",
  };

  // --- 5. XỬ LÝ ĐĂNG KÝ (GỌI API) ---
  const handleRegister = async (sessionId) => {
    if (!window.confirm("Bạn có chắc muốn đăng ký buổi này?")) return;

    try {
        // Gọi API đăng ký thật
        await studentSessionApi.registerSession(uID, sessionId);
        
        alert("Đăng ký thành công!");
        
        // Cập nhật giao diện: Loại bỏ session vừa đăng ký khỏi danh sách này
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        
        if (isPopupOpen) setIsPopupOpen(false);

    } catch (error) {
        console.error(error);
        alert("Đăng ký thất bại! Vui lòng thử lại.");
    }
  };

  // Popup Handlers
  const handleViewMore = (session) => {
    setSelectedSession(session);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedSession(null);
  };

  // --- RENDER ---
  return (
    <div className="h-full font-sans">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#102A43]">Đăng ký buổi mới</h2>
        <p className="text-sm text-gray-500">Danh sách buổi tư vấn mới</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[600px]">
        
        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <Loader className="text-blue-600" size={32} />
              </div>
              <p className="text-gray-500">Đang tải danh sách buổi học...</p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && sessions.length === 0 && !error && (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-gray-500">Không có buổi học nào để đăng ký</p>
          </div>
        )}

        {/* DATA LIST */}
        {!loading && sessions.length > 0 && (
          <>
            {/* TABS */}
            <div className="flex gap-2 mb-4">
              {["Tất cả", "Hôm nay", "Tuần này", "Tháng này"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${
                    activeTab === tab
                      ? "bg-[#dbeafe] text-gray-800"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TOOLBAR */}
            <div className="flex gap-3 mb-6 relative z-10">
              {/* Tutor Filter */}
              <div className="relative" ref={tutorRef}>
                <button
                  onClick={() => setIsTutorOpen(!isTutorOpen)}
                  className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded bg-[#f8f9fa] text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors min-w-[140px] justify-between"
                >
                  <span>{selectedTutor}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      isTutorOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isTutorOpen && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                    {tutors.map((tutor) => (
                      <button
                        key={tutor}
                        onClick={() => {
                          setSelectedTutor(tutor);
                          setIsTutorOpen(false);
                          setCurrentPage(1);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group"
                      >
                        {tutor}
                        {selectedTutor === tutor && (
                          <Check size={14} className="text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded bg-[#f8f9fa] text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors min-w-[140px] justify-between"
                >
                  <span>{sortLabels[sortOption]}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      isSortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                    {[
                      { key: "date", label: "Sort by date" },
                      { key: "title", label: "Sort by session name" },
                      { key: "duration", label: "Sort by duration" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSortOption(opt.key);
                          setIsSortOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group"
                      >
                        {opt.label}
                        {sortOption === opt.key && (
                          <Check size={14} className="text-blue-600" />
                        )}
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
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Search
                  size={14}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
              </div>
            </div>

            {/* Session List */}
            <div className="space-y-4 mb-6">
              {displayedSessions.map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-300 rounded-xl p-4 bg-white hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    {/* Left: Tutor Avatar + Session Info */}
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shrink-0 border-2 border-blue-200">
                        <User size={20} className="text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            {session.tutor.name}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-gray-900 mb-2">
                          {session.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <p className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-500" />
                            {session.displayDate}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-500" />
                            {session.startTime} - {session.endTime} ({session.duration} phút)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewMore(session)}
                        className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                      >
                        Xem thêm
                      </button>
                      
                      {/* Nút Đăng Ký luôn hiện vì đây là list chưa đăng ký */}
                      <button
                          onClick={() => handleRegister(session.id)}
                          className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                      >
                          Đăng ký
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 text-sm rounded transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* View More Popup */}
      <ViewMorePopup
        session={selectedSession}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default ConsultationRegister;