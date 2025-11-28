import {
    Calendar,
    Clock,
    Link as LinkIcon,
    MapPin,
    X
} from 'lucide-react';
import React from 'react';

const ViewMorePopup = ({ session, isOpen, onClose, onRegister }) => {
    if (!isOpen || !session) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            Buổi tư vấn
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Tên chủ đề */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">
                                Tên chủ đề
                            </label>
                            <p className="text-base text-gray-900 font-medium">
                                {session.title}
                            </p>
                        </div>

                        {/* Tổ chức bởi */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">
                                Tổ chức bởi
                            </label>
                            <p className="text-base text-gray-900 font-medium">
                                {session.tutor.name}
                            </p>
                        </div>

                        {/* Thông tin buổi tư vấn */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold mb-3 block">
                                Thông tin buổi tư vấn
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    {/* Ngày học */}
                                    <div className="flex items-start gap-3">
                                        <Calendar size={18} className="text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                Ngày học
                                            </p>
                                            <p className="text-sm text-gray-900 font-medium">
                                                {session.displayDate}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Địa điểm */}
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                Địa điểm
                                            </p>
                                            <p className="text-sm text-gray-900 font-medium">
                                                {session.location || 'Online - Google Meet'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {/* Thời gian */}
                                    <div className="flex items-start gap-3">
                                        <Clock size={18} className="text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                Thời gian
                                            </p>
                                            <p className="text-sm text-gray-900 font-medium">
                                                {session.startTime} - {session.endTime} ({session.duration})
                                            </p>
                                        </div>
                                    </div>

                                    {/* Link tham gia */}
                                    <div className="flex items-start gap-3">
                                        <LinkIcon size={18} className="text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                Link tham gia
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Ẩn
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mô tả chi tiết */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">
                                Mô tả chi tiết
                            </label>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {session.description || 'Giúp người học hiểu rõ vai trò và ứng dụng của đại số trong các lĩnh vực công nghệ hiện đại như lập trình, trí tuệ nhân tạo, và xử lý dữ liệu, từ đó thấy được tầm quan trọng của môn học này trong thực tiễn.'}
                            </p>
                        </div>
                    </div>

                    {/* Footer with Register Button */}
                    <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Đóng
                        </button>
                        {!session.registered && (
                            <button
                                onClick={() => {
                                    onRegister(session.id);
                                    onClose();
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Đăng ký
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewMorePopup;
