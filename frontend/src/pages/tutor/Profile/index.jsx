import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    BookOpen,
    Save,
    Edit,
    X,
    TrendingUp,
    Calendar,
    Award,
    BarChart3,
    Target,
    GraduationCap
} from 'lucide-react';
import { profileApi } from '../../../api/ProfileApi';
import StudentSurvey from '../../../components/Survey/StudentSurvey';

const TutorProfile = () => {
    const navigate = useNavigate();
    const { uID } = useParams();  // Get uID from URL params
    const [isEditing, setIsEditing] = useState(false);
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const currentUserId = uID || 't_00002';  // Fallback to mock if no uID

    const [profileData, setProfileData] = useState({
        uID: currentUserId,
        name: '',
        mail: '',
        phone: '',
        description: '',
        major: '',
        strength: [],
        demand: [],
        rate: 0,
        role: 'tutor'
    });

    const [statistics, setStatistics] = useState({
        totalSessions: 0,
        completedSessions: 0,
        upcomingSessions: 0,
        totalStudents: 0,
        averageRating: 0,
        totalHours: 0,
        subjects: []
    });

    const [newSubject, setNewSubject] = useState('');
    const [newDemand, setNewDemand] = useState('');

    useEffect(() => {
        fetchProfile();
        // fetchStatistics();  // TODO: Implement statistics endpoint later
    }, [currentUserId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await profileApi.getTutorProfile(currentUserId);

            if (response.success && response.data.profile) {
                setProfileData({
                    ...response.data.profile,
                    uID: currentUserId
                });
                setStatistics(response.data.statistics);
            } else {
                console.error('Failed to fetch profile:', response.error);
                // Fallback to mock data
                setProfileData({
                    uID: currentUserId,
                    name: 'Lê Minh Tuấn',
                    mail: 'tuan.le@gmail.com',
                    phone: '0387181895',
                    description: 'Giảng viên với nhiều năm kinh nghiệm trong lĩnh vực Kỹ thuật Điện và Khoa học Máy tính.',
                    major: 'ee',
                    strength: ['ee_circuit', 'cs_algo', 'cs_ml'],
                    demand: [],
                    rate: 4.2,
                    role: 'tutor'
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback to mock data
            setProfileData({
                uID: currentUserId,
                name: 'Lê Minh Tuấn',
                mail: 'tuan.le@gmail.com',
                phone: '0387181895',
                description: 'Giảng viên với nhiều năm kinh nghiệm trong lĩnh vực Kỹ thuật Điện và Khoa học Máy tính.',
                major: 'ee',
                strength: ['ee_circuit', 'cs_algo', 'cs_ml'],
                demand: [],
                rate: 4.2,
                role: 'tutor'
            });
        } finally {
            setLoading(false);
        }
    };

    // const fetchStatistics = async () => {
    //     try {
    //         const response = await api.get(`user/statistics/?uID=${currentUserId}`);
    //         if (response.data.statistics) {
    //             setStatistics(response.data.statistics);
    //         } else {
    //             // Mock statistics
    //             setStatistics({
    //                 totalSessions: 12,
    //                 completedSessions: 9,
    //                 upcomingSessions: 3,
    //                 totalStudents: 25,
    //                 averageRating: 4.2,
    //                 totalHours: 18,
    //                 subjects: ['Kỹ thuật Điện', 'Thuật toán', 'Machine Learning']
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error fetching statistics:', error);
    //         // Mock statistics
    //         setStatistics({
    //             totalSessions: 12,
    //             completedSessions: 9,
    //             upcomingSessions: 3,
    //             totalStudents: 25,
    //             averageRating: 4.2,
    //             totalHours: 18,
    //             subjects: ['Kỹ thuật Điện', 'Thuật toán', 'Machine Learning']
    //         });
    //     }
    // };

    const handleSave = async () => {
        try {
            setSaving(true);
            const updateData = {
                name: profileData.name,
                mail: profileData.mail,
                phone: profileData.phone,
                description: profileData.description,
                major: profileData.major,
                strength: profileData.strength,
                demand: profileData.demand
            };

            const response = await profileApi.updateTutorProfile(currentUserId, updateData);

            if (response.success) {
                // Cập nhật lại profile data từ response
                if (response.data.profile) {
                    setProfileData({
                        ...response.data.profile,
                        uID: currentUserId
                    });
                }
                setIsEditing(false);
                alert('Cập nhật thông tin thành công!');
            } else {
                throw new Error(response.error || 'Update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Có lỗi xảy ra khi cập nhật thông tin! ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleAddSubject = () => {
        if (newSubject.trim() && !profileData.strength.includes(newSubject.trim())) {
            setProfileData({
                ...profileData,
                strength: [...profileData.strength, newSubject.trim()]
            });
            setNewSubject('');
        }
    };

    const handleRemoveSubject = (index) => {
        setProfileData({
            ...profileData,
            strength: profileData.strength.filter((_, i) => i !== index)
        });
    };

    const handleAddDemand = () => {
        if (newDemand.trim() && !profileData.demand.includes(newDemand.trim())) {
            setProfileData({
                ...profileData,
                demand: [...profileData.demand, newDemand.trim()]
            });
            setNewDemand('');
        }
    };

    const handleRemoveDemand = (index) => {
        setProfileData({
            ...profileData,
            demand: profileData.demand.filter((_, i) => i !== index)
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77] mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    const inputStyle = isEditing
        ? "w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all"
        : "w-full bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700 pointer-events-none border border-transparent";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8F4F8] pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#006D77] to-[#00838f] text-white p-6 rounded-b-2xl shadow-lg mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <User size={40} className="text-[#006D77]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{profileData.name || 'Chưa có tên'}</h1>
                            <p className="text-sm opacity-90">
                                {profileData.role === 'tutor' ? 'Giảng viên' : 'Sinh viên'} • {profileData.major?.toUpperCase() || 'N/A'}
                            </p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white text-[#006D77] px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
                        >
                            <Edit size={18} />
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <User className="text-[#006D77]" size={24} />
                            Thông tin cá nhân
                        </h2>

                        <div className="space-y-4">
                            {/* Họ và tên */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className={inputStyle}
                                        placeholder="Nhập họ và tên"
                                    />
                                ) : (
                                    <div className={inputStyle}>{profileData.name || 'Chưa cập nhật'}</div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Mail size={16} className="text-gray-500" />
                                    Email <span className="text-red-500">*</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={profileData.mail}
                                        onChange={(e) => setProfileData({ ...profileData, mail: e.target.value })}
                                        className={inputStyle}
                                        placeholder="Nhập email"
                                    />
                                ) : (
                                    <div className={inputStyle}>{profileData.mail || 'Chưa cập nhật'}</div>
                                )}
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Phone size={16} className="text-gray-500" />
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className={inputStyle}
                                        placeholder="Nhập số điện thoại"
                                    />
                                ) : (
                                    <div className={inputStyle}>{profileData.phone || 'Chưa cập nhật'}</div>
                                )}
                            </div>

                            {/* Giới thiệu */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Giới thiệu
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={typeof profileData.description === 'string' ? profileData.description : (profileData.description?.text || '')}
                                        onChange={(e) => {
                                            setProfileData({
                                                ...profileData,
                                                description: typeof profileData.description === 'string'
                                                    ? e.target.value
                                                    : { ...profileData.description, text: e.target.value }
                                            });
                                        }}
                                        className={inputStyle}
                                        rows={4}
                                        placeholder="Nhập giới thiệu về bản thân..."
                                    />
                                ) : (
                                    <div className={`${inputStyle} min-h-[100px]`}>
                                        {typeof profileData.description === 'string' ? (profileData.description || 'Chưa có giới thiệu') : (profileData.description?.text || 'Chưa có giới thiệu')}
                                    </div>
                                )}
                            </div>

                            {/* Đặc trưng giảng dạy (Khảo sát AI) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Đặc trưng Kỹ năng Giảng dạy (Dành cho AI Tìm kiếm)
                                </label>
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                                    {profileData.description?.features?.hard_filters ? (
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p><span className="font-semibold">Lĩnh vực chuyên môn:</span> {
                                                Array.isArray(profileData.description.features.hard_skills?.domain) 
                                                  ? profileData.description.features.hard_skills.domain.join(', ')
                                                  : profileData.description.features.hard_skills?.domain || 'Chưa rõ'
                                            }</p>
                                            <p><span className="font-semibold">Hình thức dạy:</span> {profileData.description.features.hard_filters.format} ({profileData.description.features.hard_filters.class_size})</p>
                                            <p><span className="font-semibold">Phương pháp dạy:</span> {(profileData.description.features.hard_skills?.method || []).join(', ')}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm mb-3">Hồ sơ kỹ năng còn trống. Hãy cập nhật để Sinh viên có thể tìm thấy bạn.</p>
                                    )}
                                    
                                    <button
                                        onClick={() => setIsSurveyOpen(true)}
                                        className="mt-3 bg-[#006D77] hover:bg-[#00565e] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md"
                                    >
                                        Cập nhật Kỹ năng (Khảo sát AI)
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 bg-gradient-to-r from-[#006D77] to-[#00838f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            fetchProfile();
                                        }}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Statistics */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <BarChart3 className="text-[#006D77]" size={24} />
                            Thống kê học tập
                        </h2>

                        <div className="space-y-4">
                            {/* Total Sessions */}
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">Tổng buổi học</span>
                                    <Calendar className="text-blue-600" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{statistics.totalSessions}</p>
                            </div>

                            {/* Completed Sessions */}
                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">Đã kết thúc</span>
                                    <Award className="text-green-600" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{statistics.completedSessions}</p>
                            </div>

                            {/* Upcoming Sessions */}
                            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">Sắp diễn ra</span>
                                    <Target className="text-orange-600" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{statistics.upcomingSessions}</p>
                            </div>

                            {/* Total Students (for tutor) */}
                            {profileData.role === 'tutor' && (
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600">Học viên</span>
                                        <GraduationCap className="text-purple-600" size={20} />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">{statistics.totalStudents}</p>
                                </div>
                            )}

                            {/* Average Rating */}
                            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">Đánh giá trung bình</span>
                                    <TrendingUp className="text-yellow-600" size={20} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold text-gray-800">{statistics.averageRating.toFixed(1)}</p>
                                    <span className="text-sm text-gray-500">/ 5.0</span>
                                </div>
                            </div>

                            {/* Total Hours */}
                            <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">Tổng giờ dạy</span>
                                    <Calendar className="text-teal-600" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{statistics.totalHours}h</p>
                            </div>

                            {/* Subjects */}
                            {statistics.subjects && statistics.subjects.length > 0 && (
                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Môn học đã dạy</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {statistics.subjects.map((subject, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
        </div>
            {isSurveyOpen && (
                <StudentSurvey 
                    uID={currentUserId}
                    role="tutor"
                    isEditing={true}
                    initialFeatures={profileData.description?.features || null}
                    onClose={() => setIsSurveyOpen(false)}
                    onSuccess={(updatedFeatures) => {
                        setProfileData({
                            ...profileData,
                            description: {
                                ...profileData.description,
                                features: updatedFeatures
                            }
                        });
                        setIsSurveyOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default TutorProfile;