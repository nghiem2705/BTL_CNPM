import {
    Calendar,
    ChevronLeft,
    Clock,
    Download,
    FileText,
    Link as LinkIcon,
    MapPin,
    Star,
    User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockRegisteredSessions } from '../../../api/mock-data';

// Mock tutor data
const mockTutors = {
    'Nguyễn Văn B': {
        name: 'Nguyễn Văn B',
        rating: 4.5,
        specialization: 'Toán học',
        description: 'Giảng viên toán học với hơn 10 năm kinh nghiệm giảng dạy các môn toán học tại trường Đại học Bách khoa. Đã giúp hơn 200 học viên tốt nghiệp với tấm bằng "Xuất sắc" tại trường.',
        avatar: null
    },
    'Nguyễn Văn C': {
        name: 'Nguyễn Văn C',
        rating: 4.8,
        specialization: 'Toán học',
        description: 'Giảng viên toán học với nhiều năm kinh nghiệm trong giảng dạy và nghiên cứu.',
        avatar: null
    }
};

const ConsultationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Find session by id
        const foundSession = mockRegisteredSessions.find(s => s.id === parseInt(id));
        if (foundSession) {
            // Add additional data for detail view
            setSession({
                ...foundSession,
                location: 'Online - Google Meet',
                meetLink: 'https://meet.google.com/gfs-iocr-yks',
                description: 'Giúp người học hiểu rõ vai trò và ứng dụng của đại số trong các lĩnh vực công nghệ hiện đại như lập trình, trí tuệ nhân tạo, và xử lý dữ liệu, từ đó thấy được tầm quan trọng của môn học này trong thực tiễn.',
                note: 'Nhớ xem trước tài liệu nhé các em!',
                files: [{ name: 'Sample Q-A.pdf', type: 'PDF', size: '2.3 MB' }],
                specialization: 'Toán học'
            });
        }
    }, [id]);

    if (!session) {
        return (
            <div className="p-10 text-center text-gray-500">
                Đang tải hoặc không tìm thấy dữ liệu...
            </div>
        );
    }

    const tutor = mockTutors[session.tutor.name] || mockTutors['Nguyễn Văn B'];

    const handleDownload = (fileName) => {
        // Handle file download
        console.log('Downloading:', fileName);
        // In a real app, this would trigger a download
    };

    return (
        <div className="h-full font-sans bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/student/sessions/registered')}
                    className="flex items-center gap-1 text-gray-500 hover:text-[#1E88E5] mb-4 text-sm font-medium transition-colors"
                >
                    <ChevronLeft size={20} /> Quay lại danh sách
                </button>

                {/* Header with Title and Tags */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#102A43] mb-3">
                        {session.title}
                    </h1>
                    <div className="flex gap-2">
                        {session.status === 'upcoming' ? (
                            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded">
                                Sắp diễn ra
                            </span>
                        ) : (
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
                                Đã kết thúc
                            </span>
                        )}
                        <span className="bg-white text-gray-600 border border-gray-300 text-xs font-bold px-3 py-1 rounded">
                            {session.specialization}
                        </span>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Thông tin buổi tư vấn Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Thông tin buổi tư vấn
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                                            Ngày học
                                        </p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {session.displayDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock size={18} className="text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                                            Thời gian
                                        </p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {session.startTime} - {session.endTime} ({session.duration})
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                                            Địa điểm
                                        </p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {session.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <LinkIcon size={18} className="text-gray-500" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                                            Link tham gia
                                        </p>
                                        <a
                                            href={session.meetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                                        >
                                            {session.meetLink}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mô tả chi tiết Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Mô tả chi tiết
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {session.description}
                            </p>
                        </div>

                        {/* Tài liệu Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Tài liệu
                            </h2>
                            {session.files && session.files.length > 0 ? (
                                <div className="space-y-3">
                                    {session.files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="bg-blue-50 p-2 rounded">
                                                    <FileText size={20} className="text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {file.type} - {file.size}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(file.name)}
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Tải xuống"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Không có tài liệu
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Giảng viên Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Giảng viên
                            </h2>
                            <div className="text-center mb-4">
                                {/* Avatar */}
                                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-gray-200">
                                    <User size={32} className="text-[#8B6914]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {tutor.name}
                                </h3>
                                {/* Rating */}
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm font-semibold text-gray-900">
                                        {tutor.rating}
                                    </span>
                                </div>
                                {/* Specialization Tag */}
                                <span className="inline-block bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold px-3 py-1 rounded mb-3">
                                    {tutor.specialization}
                                </span>
                            </div>
                            {/* Description */}
                            <p className="text-sm text-gray-700 leading-relaxed mb-4 text-left">
                                {tutor.description}
                            </p>
                            {/* View Profile Button */}
                            <button
                                onClick={() => navigate(`/student/tutor/${tutor.name}`)}
                                className="w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                                Xem hồ sơ
                            </button>
                        </div>

                        {/* Ghi chú Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Ghi chú
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {session.note}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationDetail;
