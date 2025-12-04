import { ChevronRight, Search, Star, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tutorStudentApi } from '../../../api/TutorStudent';

const Student = () => {
    const navigate = useNavigate();
    const { uID } = useParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [favorites, setFavorites] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Use uID from params
    const currentTutorId = uID || 't_00001';

    useEffect(() => {
        async function fetchStudents() {
            try {
                setLoading(true);
                const data = await tutorStudentApi.getAll(currentTutorId);
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
                // Fallback to mock data if API fails
                setStudents(mockStudents);
            } finally {
                setLoading(false);
            }
        }
        fetchStudents();
    }, [currentTutorId]);

    // Filter students by search
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText]);

    // Toggle favorite
    const handleToggleFavorite = (studentId, e) => {
        e.stopPropagation();
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(studentId)) {
                newFavorites.delete(studentId);
            } else {
                newFavorites.add(studentId);
            }
            return newFavorites;
        });
    };

    // Navigate to student detail
    const handleStudentClick = (studentId) => {
        navigate(`/tutor/student/${studentId}`);
    };

    return (
        <div className="h-full font-sans">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#102A43]">Tất cả học viên theo học</h2>
                <p className="text-sm text-gray-500">Danh sách các học viên đang theo học với bạn</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[600px]">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên học viên"
                            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm bg-[#f8f9fa] focus:bg-white focus:outline-blue-500 transition-all"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {/* Student List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>Đang tải danh sách học viên...</p>
                    </div>
                ) : filteredStudents.length > 0 ? (
                    <>
                        <div className="space-y-0 border-t border-gray-200">
                            {displayedStudents.map((student, index) => (
                                <div
                                    key={student.id}
                                    onClick={() => handleStudentClick(student.id)}
                                    className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors group"
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center shrink-0 border border-purple-200">
                                        <User size={24} className="text-purple-600" />
                                    </div>

                                    {/* Student Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base text-gray-900 mb-1">
                                            {student.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>
                                                Thời gian bắt đầu theo học: {student.startDate || 'Chưa có thông tin'}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span>
                                                Thời gian đã theo học: {student.studyDuration || 'Mới bắt đầu'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Icons */}
                                    <div className="flex items-center gap-3">
                                        {/* Star Icon */}
                                        <button
                                            onClick={(e) => handleToggleFavorite(student.id, e)}
                                            className={`p-2 rounded-full transition-colors ${favorites.has(student.id)
                                                ? 'text-yellow-500'
                                                : 'text-gray-400 hover:text-yellow-500'
                                                }`}
                                        >
                                            <Star
                                                size={20}
                                                className={favorites.has(student.id) ? 'fill-current' : ''}
                                            />
                                        </button>

                                        {/* Chevron Icon */}
                                        <ChevronRight
                                            size={20}
                                            className="text-gray-400 group-hover:text-gray-600 transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200 mt-4">
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
                                                className={`px-3 py-1.5 text-sm rounded transition-colors ${currentPage === pageNum
                                                    ? 'bg-blue-600 text-white font-semibold'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>Không có học viên nào được tìm thấy.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Mock data for fallback
const mockStudents = [
    {
        id: '2312593',
        name: 'Nguyễn Thành Phát',
        startDate: '15/10/2025',
        studyDuration: '2 tháng',
        totalHours: 45,
        totalSessions: 12
    },
    {
        id: '2312329',
        name: 'Bùi Trọng Nguyên',
        startDate: '18/10/2025',
        studyDuration: '2 tháng',
        totalHours: 38,
        totalSessions: 10
    },
    {
        id: '2312185',
        name: 'Phan Trọng Bảo Nam',
        startDate: '20/10/2025',
        studyDuration: '1 tháng',
        totalHours: 25,
        totalSessions: 8
    },
    {
        id: '2213696',
        name: 'Nguyễn Chí Trung',
        startDate: '25/10/2025',
        studyDuration: '1 tháng',
        totalHours: 18,
        totalSessions: 6
    },
    {
        id: '2212050',
        name: 'Lương Vĩnh Minh',
        startDate: '28/10/2025',
        studyDuration: '1 tháng',
        totalHours: 15,
        totalSessions: 5
    },
    {
        id: '2212209',
        name: 'Nguyễn Quang Nghiêm',
        startDate: '01/11/2025',
        studyDuration: '3 tuần',
        totalHours: 12,
        totalSessions: 4
    }
];

export default Student;
