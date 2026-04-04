import React, { useState, useEffect } from 'react';
import { profileApi } from '../../api/ProfileApi';

const FORMAT_OPTIONS = ['Online', 'Offline', 'Hybrid'];
const CLASS_SIZE_OPTIONS = ['1-1', 'Nhóm nhỏ (<20)', 'Nhóm vừa (<40)', 'Seminar (>40)'];
const AVAILABILITY_OPTIONS = ['Ca 1 (6h - 11h)', 'Ca 2 (11h - 16h)', 'Ca 3 (16h - 21h)'];
const METHOD_OPTIONS = ['Tư vấn', 'Hội thảo', 'Dạy chuyên môn', 'Luyện kỹ năng'];
const DOMAIN_MAPPING = {
    "Du lịch": [
        "Văn hóa trong du lịch",
        "Quản trị và điều hành",
        "Marketing du lịch"
    ],
    "IT": [
        "Lập trình phát triển ứng dụng",
        "Kiến trúc phân tích phần mềm",
        "Hạ tầng và vận hành",
        "Trí tuệ nhân tạo và dữ liệu",
        "Cấu trúc dữ liệu và giải thuật",
        "Toán (Đại số và Xác suất)"
    ],
    "Điện-điện tử": [
        "Viễn thông",
        "Thiết kế mạch và phần cứng",
        "Hệ thống và tự động hóa",
        "Hệ thống nhúng và IoT"
    ],
    "Xây dựng": [
        "Thiết kế và mô phỏng cấu trúc",
        "Địa kỹ thuật và nền móng",
        "Bản vẽ và mô hình hóa thông tin",
        "Quản lý và thi công"
    ],
    "Chính trị học": [
        "Nghiên cứu xã hội",
        "Phân tích chính sách",
        "Tham luận"
    ],
    "Đời sống": [],
    "Kinh tế học": [
        "Kế toán",
        "Tài chính và đầu tư",
        "Thị trường và kinh doanh",
        "Kinh tế lượng và thống kê"
    ],
    "Quản lý công nghiệp": [
        "Phân tích và kinh doanh",
        "Tối ưu hóa và vận hành",
        "Quản lý chất lượng",
        "Quản lý chuỗi cung ứng"
    ]
};
const DOMAIN_OPTIONS = Object.keys(DOMAIN_MAPPING);
const SOFT_SKILLS_OPTIONS = ["Giao tiếp", "Tư duy và nhận thức", "Làm việc nhóm, lãnh đạo", "Quản lý"];
const DEV_PATH_OPTIONS = ['Định hướng nghề nghiệp', 'Khởi nghiệp', 'NCKH', 'Nâng cao bản thân', 'Đồ án'];

const StudentSurvey = ({ uID, role = 'student', isEditing = false, initialFeatures = null, onSuccess, onClose = () => { } }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState(() => {
        if (initialFeatures) {
            const hf = initialFeatures.hard_filters || {};
            const hs = initialFeatures.hard_skills || {};
            const sp = hs.specific_skills || {};
            const vb = initialFeatures.vibe || {};

            return {
                format: hf.format || '',
                availability: hf.availability || [],
                class_size: hf.class_size || '',
                method: hs.method || [],
                domain: Array.isArray(hs.domain) ? hs.domain : (hs.domain ? [hs.domain] : []),
                soft_skills: sp.soft_skills || [],
                domain_skills: sp.domain_skills || [],
                life_skills: sp.life_skills || 0,
                development_path: vb.development_path || [],
                energy_scale: vb.energy_scale || 3
            };
        }
        return {
            format: '',
            availability: [],
            class_size: '',
            method: [],
            domain: [],
            soft_skills: [],
            domain_skills: [],
            life_skills: 0,
            development_path: [],
            energy_scale: 3
        };
    });

    const handleCheckboxArray = (field, val) => {
        setFormData(prev => {
            const arr = prev[field];
            if (arr.includes(val)) {
                return { ...prev, [field]: arr.filter(x => x !== val) };
            } else {
                return { ...prev, [field]: [...arr, val] };
            }
        });
    };

    const handleRadio = (field, val) => {
        setFormData({ ...formData, [field]: val });
    };

    const submitSurvey = async () => {
        if (!formData.format || !formData.class_size || !formData.domain || formData.availability.length === 0) {
            alert("Vui lòng điền đầy đủ các thông tin bắt buộc (Hình thức, Quy mô lớp, Lĩnh vực, và ít nhất 1 ca rảnh).");
            return;
        }

        setLoading(true);

        try {
            let res;
            if (role === 'tutor') {
                res = await profileApi.getTutorProfile(uID);
            } else {
                res = await profileApi.getStudentProfile(uID);
            }

            if (res.success) {
                let profile = res.data.profile;

                // Keep the text, append the features
                let oldDesc = profile.description || {};
                let text = typeof oldDesc === 'string' ? oldDesc : (oldDesc.text || "");

                profile.description = {
                    text: text,
                    features: {
                        hard_filters: {
                            format: formData.format,
                            availability: formData.availability,
                            class_size: formData.class_size
                        },
                        hard_skills: {
                            method: formData.method,
                            domain: formData.domain,
                            specific_skills: {
                                soft_skills: formData.soft_skills,
                                domain_skills: formData.domain_skills,
                                life_skills: formData.life_skills
                            }
                        },
                        vibe: {
                            development_path: formData.development_path,
                            energy_scale: formData.energy_scale
                        }
                    }
                };

                // Update via API
                if (role === 'tutor') {
                    await profileApi.updateTutorProfile(uID, profile);
                } else {
                    await profileApi.updateStudentProfile(uID, profile);
                }

                onSuccess(profile.description.features);
            } else {
                alert("Lỗi khi tải thông tin cá nhân");
            }
        } catch (e) {
            console.error(e);
            alert("Có lỗi xảy ra: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto w-full font-sans">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up">

                <div className="relative text-center mb-8 border-b pb-4">
                    {isEditing && (
                        <button
                            onClick={onClose}
                            className="absolute right-0 top-0 p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    )}
                    <h2 className="text-3xl font-bold text-[#102A43] mb-2">
                        {isEditing ? "Chỉnh sửa Thông tin (Đặc trưng cá nhân)" : "Xin chào! 👋"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {isEditing
                            ? "Cập nhật các kỹ năng và yêu cầu mới nhất của bạn để AI tái thiết lập lại không gian gợi ý."
                            : "Đây là lần đầu bạn đăng nhập. Hãy hoàn thành khảo sát ngắn này để hệ thống gợi ý cho bạn những người hướng dẫn (Mentor) phù hợp nhất nhé."}
                    </p>
                </div>

                <div className="space-y-8">

                    {/* HARD FILTERS */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-[#006D77] mb-4 border-b pb-2">1. Điều kiện tiên quyết</h3>

                        {/* Format */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Hình thức học <span className="text-red-500">*</span></label>
                            <div className="flex gap-4 flex-wrap">
                                {FORMAT_OPTIONS.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 border rounded-lg hover:border-[#006D77] transition-all">
                                        <input type="radio" name="format" value={opt} checked={formData.format === opt} onChange={() => handleRadio('format', opt)} className="w-4 h-4 text-[#006D77]" />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Class Size */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Quy mô lớp <span className="text-red-500">*</span></label>
                            <div className="flex gap-4 flex-wrap">
                                {CLASS_SIZE_OPTIONS.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 border rounded-lg hover:border-[#006D77] transition-all">
                                        <input type="radio" name="class_size" value={opt} checked={formData.class_size === opt} onChange={() => handleRadio('class_size', opt)} className="w-4 h-4 text-[#006D77]" />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Thời gian rảnh <span className="text-red-500">*</span></label>
                            <div className="flex gap-4 flex-wrap">
                                {AVAILABILITY_OPTIONS.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 border rounded-lg hover:border-[#006D77] transition-all">
                                        <input type="checkbox" checked={formData.availability.includes(opt)} onChange={() => handleCheckboxArray('availability', opt)} className="w-4 h-4 rounded text-[#006D77]" />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* HARD SKILLS */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-[#006D77] mb-4 border-b pb-2">2. Kỹ năng cốt lõi</h3>

                        {/* Domain */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Lĩnh vực chuyên môn quan tâm (Chọn 1-3) <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {DOMAIN_OPTIONS.map(opt => {
                                    const isChecked = formData.domain.includes(opt);
                                    const disabled = !isChecked && formData.domain.length >= 3;
                                    return (
                                        <label key={opt} className={`flex items-center gap-2 cursor-pointer bg-white px-3 py-2 border rounded-lg transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#006D77]'}`}>
                                            <input type="checkbox" checked={isChecked} disabled={disabled} onChange={() => handleCheckboxArray('domain', opt)} className="w-4 h-4 rounded text-[#006D77]" />
                                            <span className="text-sm truncate">{opt}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Domain Skills (Hiển thị theo domain) */}
                        {formData.domain.length > 0 && formData.domain.some(d => DOMAIN_MAPPING[d]?.length > 0) && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Kỹ năng chuyên môn cụ thể (Chọn từ các lĩnh vực trên)</label>
                                <div className="flex gap-3 flex-wrap">
                                    {formData.domain.flatMap(d => DOMAIN_MAPPING[d] || []).map((opt, i) => (
                                        <label key={`ds-${i}`} className="flex items-center gap-2 cursor-pointer bg-blue-50 px-3 py-2 border border-blue-100 rounded-lg hover:border-blue-300 transition-all text-sm">
                                            <input type="checkbox" checked={formData.domain_skills.includes(opt)} onChange={() => handleCheckboxArray('domain_skills', opt)} className="w-3 h-3 rounded" />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Method */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Phương pháp học phù hợp</label>
                            <div className="flex gap-4 flex-wrap">
                                {METHOD_OPTIONS.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 border rounded-lg hover:border-[#006D77] transition-all">
                                        <input type="checkbox" checked={formData.method.includes(opt)} onChange={() => handleCheckboxArray('method', opt)} className="w-4 h-4 rounded text-[#006D77]" />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Soft Skills */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Kỹ năng mềm muốn cải thiện</label>
                            <div className="flex gap-3 flex-wrap">
                                {SOFT_SKILLS_OPTIONS.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 border rounded-lg hover:border-[#006D77] transition-all text-sm">
                                        <input type="checkbox" checked={formData.soft_skills.includes(opt)} onChange={() => handleCheckboxArray('soft_skills', opt)} className="w-3 h-3 rounded" />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* VIBE & DEVELOPMENT PATH */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-[#006D77] mb-4 border-b pb-2">3. Định hướng & Phong cách dạy</h3>

                        {/* Development path */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Hướng phát triển mong muốn</label>
                            <div className="flex gap-3 flex-wrap">
                                {DEV_PATH_OPTIONS.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 border rounded-lg hover:border-[#006D77] transition-all text-sm">
                                        <input type="checkbox" checked={formData.development_path.includes(opt)} onChange={() => handleCheckboxArray('development_path', opt)} className="w-3 h-3 rounded" />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Energy scale */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Mức năng lượng & phong cách làm việc (Energy Scale)</label>
                            <div className="flex items-center gap-4 bg-white p-4 border rounded-lg w-full">
                                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Trầm tính, 1-1</span>
                                <input
                                    type="range"
                                    min="1" max="5" step="1"
                                    value={formData.energy_scale}
                                    onChange={(e) => setFormData({ ...formData, energy_scale: parseInt(e.target.value) })}
                                    className="w-full accent-[#006D77] cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Sôi nổi, đám đông</span>
                            </div>
                            <div className="text-center mt-2 text-[#006D77] font-bold text-lg">{formData.energy_scale} / 5</div>
                        </div>
                    </div>

                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex justify-end gap-3 border-t pt-4">
                    {isEditing && (
                        <button
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all"
                        >
                            Huỷ
                        </button>
                    )}
                    <button
                        onClick={submitSurvey}
                        disabled={loading}
                        className="bg-[#006D77] hover:bg-[#00565e] text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi' : 'Hoàn thành hồ sơ & Bắt đầu')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentSurvey;
