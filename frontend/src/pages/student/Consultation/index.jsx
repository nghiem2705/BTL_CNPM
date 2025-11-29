import {
    Calendar,
    Check,
    ChevronDown,
    Clock,
    Search,
    Star,
    User
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
// import { mockRegisteredSessions } from '../../../api/mock-data';
import { studentSessionApi } from '../../../api/StudentSession';


const Consultation = () => {
    const navigate = useNavigate();
    // const [sessions, setSessions] = useState(mockRegisteredSessions);
    const [sessions, setSessions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [selectedTutor, setSelectedTutor] = useState('Tất cả');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isTutorOpen, setIsTutorOpen] = useState(false);
    const [sortOption, setSortOption] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const sortRef = useRef(null);
    const tutorRef = useRef(null);
    const itemsPerPage = 4;
    const {uID} = useParams();

    // Available tutors
    const tutors = ['Tất cả', 'Nguyễn Văn B', 'Nguyễn Văn C'];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
            if (tutorRef.current && !tutorRef.current.contains(event.target)) {
                setIsTutorOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // THÊM DATA BẰNG USEEFFECT NHA 
    useEffect(() => {
        const fetchStudentData = async () => {
            if (!uID) return; // Nếu chưa có ID thì khoan chạy
            
            try {
                setLoading(true);
                // Gọi hàm dành riêng cho Student vừa viết ở api/index.js
                const data = await studentSessionApi.getRegisteredSession(uID);
                setSessions(data);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [uID]);

    // Process sessions with filters
    const getProcessedSessions = () => {
        let processed = [...sessions];

        // Filter by tab
        switch (activeTab) {
            case 'Đã kết thúc':
                processed = processed.filter(s => s.status === 2);
                break;
            case 'Sắp diễn ra':
                processed = processed.filter(s => s.status === 3);
                break;
            case 'Tháng này':
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                processed = processed.filter(s => {
                    const sessionDate = new Date(s.date);
                    return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
                });
                break;
            case 'Tất cả':
            default:
                break;
        }

        // Filter by tutor
        if (selectedTutor !== 'Tất cả') {
            processed = processed.filter(s => s.tutor.name === selectedTutor);
        }

        // Search
        if (searchText) {
            processed = processed.filter(s =>
                s.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Sort
        processed.sort((a, b) => {
            switch (sortOption) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'duration':
                    return parseInt(b.duration) - parseInt(a.duration);
                case 'date':
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        return processed;
    };

    const filteredSessions = getProcessedSessions();
    const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);

    // Sort labels
    const sortLabels = {
        'date': 'Sort by date',
        'title': 'Sort by session name',
        'duration': 'Sort by duration'
    };

    // Handle cancel session
    const handleCancel = async (e, uID, id, title) => {
        // if (window.confirm('Bạn có chắc chắn muốn hủy buổi tư vấn này?')) {
        //     setSessions(FormData.filter(s => s.id !== id));
        // }
        e.stopPropagation(); 
        
        if (window.confirm(`Bạn có chắc chắn muốn hủy buổi: "${title}"?`)) {
            try {
                await studentSessionApi.deleteSession(uID, id); 
                setSessions(prev => prev.filter(item => item.id !== id));
                alert("Đã hủy buổi thành công!");
            } catch (error) {
                alert("Lỗi khi xóa! Vui lòng thử lại.");
            }
        }
    };

    // Handle evaluate
    const handleEvaluate = (sessionId) => {
        // Navigate to evaluation page or open modal
        navigate(`/student/consultation/${sessionId}/evaluate`);
    };

    return (
        <div className="h-full font-sans">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#102A43]">Buổi tư vấn</h2>
                <p className="text-sm text-gray-500">Danh sách các buổi tư vấn đã đăng ký</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[600px]">
                {/* TABS */}
                <div className="flex gap-2 mb-4">
                    {['Tất cả', 'Đã kết thúc', 'Sắp diễn ra', 'Tháng này'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === tab
                                ? 'bg-[#dbeafe] text-gray-800'
                                : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* TOOLBAR */}
                <div className="flex gap-3 mb-6 relative z-10">
                    {/* Tutor Filter Dropdown */}
                    <div className="relative" ref={tutorRef}>
                        <button
                            onClick={() => setIsTutorOpen(!isTutorOpen)}
                            className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded bg-[#f8f9fa] text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors min-w-[140px] justify-between"
                        >
                            <span>{selectedTutor}</span>
                            <ChevronDown size={14} className={`transition-transform ${isTutorOpen ? 'rotate-180' : ''}`} />
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
                                        {selectedTutor === tutor && <Check size={14} className="text-blue-600" />}
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
                            <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSortOpen && (
                            <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                                {[
                                    { key: 'date', label: 'Sort by date' },
                                    { key: 'title', label: 'Sort by session name' },
                                    { key: 'duration', label: 'Sort by duration' }
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
                                        {sortOption === opt.key && <Check size={14} className="text-blue-600" />}
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
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                </div>

                {/* Session List */}
                <div className="space-y-4 mb-6">
                    {displayedSessions.length > 0 ? (
                        displayedSessions.map((session) => (
                            <div
                                key={session.id}
                                className="border border-gray-300 rounded-xl p-4 bg-white hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                            >
                                <div className="flex justify-between items-start">
                                    {/* Left: Tutor Avatar + Session Info */}
                                    <div className="flex gap-4 flex-1">
                                        {/* Tutor Avatar */}
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shrink-0 border-2 border-blue-200">
                                            <User size={20} className="text-blue-600" />
                                        </div>

                                        {/* Session Details */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {session.tutor.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                                </svg>
                                                <h3 className="font-bold text-base text-gray-900">
                                                    {session.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <p className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-gray-500" />
                                                    {session.displayDate}
                                                </p>
                                                <p className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-gray-500" />
                                                    {session.startTime} - {session.endTime} ({session.duration})
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Action Buttons */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => navigate(`/student/${uID}/sessions/registered/${session.id}`)}
                                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                                        >
                                            Xem chi tiết
                                        </button>
                                        {session.status === 'finished' ? (
                                            <button
                                                className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                                                disabled
                                            >
                                                Đã kết thúc
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => handleCancel(e, uID, session.id, session.title)}
                                                className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                                            >
                                                Hủy buổi
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEvaluate(session.id)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-bold px-4 py-2 rounded transition-colors flex items-center gap-1"
                                        >
                                            <Star size={14} />
                                            Đánh giá
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p>Không có buổi tư vấn nào được tìm thấy.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                                        className={`px-3 py-1.5 text-sm rounded transition-colors ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white font-semibold'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <>
                                    <span className="px-2 text-gray-400">...</span>
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Consultation;
