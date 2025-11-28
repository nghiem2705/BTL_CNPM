import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, 
    Users, 
    BookOpen, 
    TrendingUp, 
    X, 
    ChevronRight,
    Clock,
    Award,
    Target
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const stats = {
        totalSessions: 12,
        upcomingSessions: 3,
        totalStudents: 25,
        completedSessions: 9
    };

    const recentSessions = [
        { id: 1, title: 'Lập trình Web Frontend', date: '2025-12-01', time: '13:00', status: 'upcoming' },
        { id: 2, title: 'Nhập môn Trí tuệ nhân tạo', date: '2025-10-29', time: '07:00', status: 'completed' },
        { id: 3, title: 'Ứng dụng đại số trong công nghệ', date: '2025-11-05', time: '10:00', status: 'upcoming' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8F4F8]">
            {/* Hero Section với ảnh background */}
            <div className="relative w-full h-72 md:h-80 lg:h-96 mb-8 rounded-2xl overflow-hidden shadow-md">
                <img 
                    src="/thumbnail-dashboard.jpg" 
                    alt="HCMUT Dashboard" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#006D77]/50 to-[#006D77]/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                            Hệ Thống E-Learning HCMUT
                        </h1>
                        <p className="text-lg md:text-xl opacity-95">
                            Chào mừng đến với chương trình Tutor/Mentor
                        </p>
                        <button
                            onClick={() => setShowPopup(true)}
                            className="mt-6 bg-white text-[#006D77] px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Tìm hiểu thêm về chương trình
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Tổng buổi học</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalSessions}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Calendar className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Sắp diễn ra</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.upcomingSessions}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <Clock className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Học viên</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Users className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Đã hoàn thành</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.completedSessions}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <Award className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Target className="text-[#006D77]" size={24} />
                        Thao tác nhanh
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/consultation/create')}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#006D77] to-[#00838f] text-white rounded-lg hover:shadow-lg transition-all group"
                        >
                            <span className="font-medium">Tạo buổi tư vấn mới</span>
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/consultation')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group"
                        >
                            <span className="font-medium text-gray-700">Xem lịch của tôi</span>
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group"
                        >
                            <span className="font-medium text-gray-700">Quản lý profile</span>
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                    </div>
                </div>

                {/* Recent Sessions */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BookOpen className="text-[#006D77]" size={24} />
                        Buổi học gần đây
                    </h2>
                    <div className="space-y-3">
                        {recentSessions.map((session) => (
                            <div
                                key={session.id}
                                className="p-4 border border-gray-200 rounded-lg hover:border-[#006D77] hover:shadow-md transition-all cursor-pointer"
                                onClick={() => navigate(`/consultation/${session.id}`)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 mb-1">{session.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {session.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {session.time}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        session.status === 'upcoming' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'bg-green-100 text-green-700'
                                    }`}>
                                        {session.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã hoàn thành'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popup Modal - Tutor/Mentor Program */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPopup(false)}>
                    <div 
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-[#006D77] to-[#00838f] text-white p-6 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold">Chương trình Tutor/Mentor</h2>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Users className="text-[#006D77]" size={24} />
                                    Giới thiệu
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Tại Trường Đại học Bách Khoa – ĐHQG TP.HCM (HCMUT), chương trình Tutor/Mentor được triển khai nhằm hỗ trợ sinh viên trong quá trình học tập và phát triển kỹ năng. Các Tutor có thể là giảng viên, nghiên cứu sinh, hoặc sinh viên năm trên có thành tích học tập tốt, được phân công để hướng dẫn và đồng hành cùng một nhóm sinh viên cụ thể.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Target className="text-[#006D77]" size={24} />
                                    Mục tiêu
                                </h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <ChevronRight className="text-[#006D77] mt-1" size={16} />
                                        <span>Hỗ trợ sinh viên đăng ký tham gia chương trình và lựa chọn tutor phù hợp</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ChevronRight className="text-[#006D77] mt-1" size={16} />
                                        <span>Tutor có thể thiết lập lịch rảnh, mở các buổi tư vấn trực tiếp hoặc trực tuyến</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ChevronRight className="text-[#006D77] mt-1" size={16} />
                                        <span>Hỗ trợ đặt lịch, hủy/đổi lịch, gửi thông báo tự động và nhắc lịch</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ChevronRight className="text-[#006D77] mt-1" size={16} />
                                        <span>Công cụ phản hồi và đánh giá chất lượng buổi học</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <TrendingUp className="text-[#006D77]" size={24} />
                                    Tính năng nổi bật
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">Quản lý thông tin</h4>
                                        <p className="text-sm text-gray-600">Quản lý hồ sơ tutor và sinh viên, lĩnh vực chuyên môn, nhu cầu hỗ trợ</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">Đặt lịch thông minh</h4>
                                        <p className="text-sm text-gray-600">Hệ thống đặt lịch linh hoạt với thông báo tự động</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">Đánh giá & Phản hồi</h4>
                                        <p className="text-sm text-gray-600">Theo dõi tiến bộ và đánh giá chất lượng buổi học</p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">Tích hợp hệ thống</h4>
                                        <p className="text-sm text-gray-600">Kết nối với HCMUT_SSO, HCMUT_DATACORE, HCMUT_LIBRARY</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowPopup(false);
                                        navigate('/profile');
                                    }}
                                    className="w-full bg-gradient-to-r from-[#006D77] to-[#00838f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-[1.02]"
                                >
                                    Thông tin chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
