import React from 'react';
import { BookOpen } from 'lucide-react';

const Library = () => {
    return (
        <div className="h-full font-sans">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#102A43]">Thư viện số</h2>
                <p className="text-sm text-gray-500">Kho tài liệu học tập và tham khảo</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[600px] flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4">
                        <BookOpen size={40} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Thư viện số chưa cập nhật
                    </h3>
                    <p className="text-gray-600">
                        Vui lòng quay lại sau
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Library;
