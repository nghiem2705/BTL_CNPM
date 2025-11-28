import { Mail, Phone } from 'lucide-react';
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="space-y-4 text-sm text-gray-700">
                    {/* Technical Support Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Tổ kỹ thuật / Technician
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={14} className="text-gray-500" />
                            <a
                                href="mailto:ddthu@hcmut.edu.vn"
                                className="hover:text-[#1E88E5] hover:underline"
                            >
                                ddthu@hcmut.edu.vn
                            </a>
                        </div>
                    </div>

                    {/* Account Support Section */}
                    <div className="pt-4 border-t border-gray-200">
                        <p className="text-gray-700 mb-3">
                            <strong>Quý Thầy/Cô chưa có tài khoản</strong> (hoặc quên mật khẩu) nhà trường vui lòng liên hệ{' '}
                            <strong>Trung tâm Dữ liệu & Công nghệ Thông tin</strong>, phòng 109 nhà A5 để được hỗ trợ.
                        </p>
                        <p className="text-gray-600 mb-3 italic">
                            (For HCMUT account, please contact to: Data and Information Technology Center)
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={14} className="text-gray-500" />
                                <a
                                    href="mailto:dl-cntt@hcmut.edu.vn"
                                    className="hover:text-[#1E88E5] hover:underline"
                                >
                                    dl-cntt@hcmut.edu.vn
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone size={14} className="text-gray-500" />
                                <a
                                    href="tel:+84838647256"
                                    className="hover:text-[#1E88E5] hover:underline"
                                >
                                    ĐT (Tel.): (84-8) 38647256 - 7200
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
