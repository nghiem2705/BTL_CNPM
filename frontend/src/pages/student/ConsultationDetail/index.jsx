// src/pages/student/ConsultationDetail.jsx
import {
    Calendar,
    ChevronLeft,
    Clock,
    Download,
    FileText,
    Link as LinkIcon,
    MapPin,
    Star,
    User,
    Loader
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentSessionApi } from '../../../api/StudentSession'; // Import API

const ConsultationDetail = () => {
    const { id, uID } = useParams();
    const navigate = useNavigate();
    
    // State
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 1. TẢI DỮ LIỆU
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const data = await studentSessionApi.getSessionById(uID, id);
                setFormData(data);
            } catch (error) {
                console.error(error);
                alert("Không tìm thấy lớp học này!");
                navigate(`/student/${uID}/sessions/registered`);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetail();
    }, [id, uID, navigate]);

    // 2. HÀM RENDER TRẠNG THÁI (STATUS)
    const renderStatus = (status) => {
        const s = parseInt(status); 
        switch (s) {
            case 1:
                return <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded">Đang xử lý</span>;
            case 2:
                return <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">Đã kết thúc</span>;
            case 3:
                return <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded">Sắp diễn ra</span>;
            default:
                return <span className="bg-gray-400 text-white text-xs font-bold px-3 py-1 rounded">Không xác định</span>;
        }
    };

    const handleDownload = (fileName) => {
        console.log('Downloading:', fileName);
        alert(`Đang tải file: ${fileName}`);
    };

    // --- RENDER LOADING ---
    if (loading) {
        return <div className="h-screen flex items-center justify-center gap-2 text-gray-500"><Loader className="animate-spin" /> Đang tải dữ liệu...</div>;
    }

    // --- RENDER DATA ---
    if (!formData) return null;

    // Lấy thông tin tutor an toàn
    const tutor = formData.tutor || {};

    return (
        <div className="h-full font-sans bg-gray-50 min-h-screen animate-fade-in">
            <div className="max-w-6xl mx-auto px-4 py-6">
                
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/student/${uID}/sessions/registered`)}
                    className="flex items-center gap-1 text-gray-500 hover:text-[#1E88E5] mb-4 text-sm font-medium transition-colors"
                >
                    <ChevronLeft size={20} /> Quay lại danh sách
                </button>

                {/* Header with Title and Tags */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#102A43] mb-3">
                        {formData.title}
                    </h1>
                    <div className="flex gap-2 items-center">
                        {/* Gọi hàm render status */}
                        {renderStatus(formData.status)}
                        
                        {/* Tag chuyên môn (nếu có) */}
                        {formData.specialization && (
                            <span className="bg-white text-gray-600 border border-gray-300 text-xs font-bold px-3 py-1 rounded">
                                {formData.specialization}
                            </span>
                        )}
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
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Ngày học</p>
                                        <p className="text-sm text-gray-900 font-medium">{formData.displayDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock size={18} className="text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Thời gian</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {formData.startTime} - {formData.endTime} ({formData.duration})
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Địa điểm</p>
                                        <p className="text-sm text-gray-900 font-medium">{formData.location || "Chưa cập nhật"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <LinkIcon size={18} className="text-gray-500" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Link tham gia</p>
                                        {formData.meetLink && formData.meetLink !== "Online" ? (
                                            <a
                                                href={formData.meetLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                                            >
                                                {formData.meetLink}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-500 italic">
                                                {formData.meetLink === "Online" ? "Link sẽ cập nhật sau" : "Không có link"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mô tả chi tiết Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Mô tả chi tiết</h2>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {formData.description || "Không có mô tả."}
                            </p>
                        </div>

                        {/* Tài liệu Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Tài liệu</h2>
                            {formData.files && formData.files.length > 0 ? (
                                <div className="space-y-3">
                                    {formData.files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="bg-blue-50 p-2 rounded">
                                                    <FileText size={20} className="text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{file.type} - {file.size}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDownload(file.name)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Tải xuống">
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Không có tài liệu.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Giảng viên Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Giảng viên</h2>
                            <div className="text-center mb-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-gray-200">
                                    <User size={32} className="text-[#8B6914]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {tutor.name || "Chưa cập nhật tên"}
                                </h3>
                                
                                {/* Rating (nếu có) */}
                                {tutor.rate && (
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-semibold text-gray-900">{tutor.rate}</span>
                                    </div>
                                )}

                                {/* Major / Specialization */}
                                {tutor.major && (
                                    <span className="inline-block bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold px-3 py-1 rounded mb-3">
                                        {tutor.major}
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-sm text-gray-700 leading-relaxed mb-4 text-left">
                                {tutor.description || "Chưa có thông tin giới thiệu."}
                            </p>
                            
                            {/* --- ĐÃ SỬA LỖI Ở ĐÂY --- */}
                            <button
                                onClick={() => navigate(`/student/${uID}/tutor/${tutor.id}`)}
                                className="w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                                Xem hồ sơ
                            </button>
                        </div>

                        {/* Ghi chú Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Ghi chú</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {formData.note || "Không có ghi chú nào."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationDetail;