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

const StudentProfile = () => {
    const navigate = useNavigate();
    const { uID } = useParams();  // Get uID from URL params
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const currentUserId = uID || 's_00001';  // Fallback to mock if no uID

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
        role: 'student'
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
            const response = await profileApi.getStudentProfile(currentUserId);

            if (response.success && response.data.profile) {
                setProfileData({
                    ...response.data.profile,
                    uID: currentUserId,
                    role: 'student' // Ensure role is student
                });
            } else {
                console.error('Failed to fetch profile:', response.error);
                // Fallback to mock data
                setProfileData({
                    uID: currentUserId,
                    name: 'Nguyễn Văn A',
                    mail: 'nguyenvana@gmail.com',
                    phone: '0987654321',
                    description: 'Sinh viên năm 3 chuyên ngành Khoa học Máy tính.',
                    major: 'cs',
                    strength: [],
                    demand: ['cs_algo', 'cs_db'],
                    rate: 0,
                    role: 'student'
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback to mock data
            setProfileData({
                uID: currentUserId,
                name: 'Nguyễn Văn A',
                mail: 'nguyenvana@gmail.com',
                phone: '0987654321',
                description: 'Sinh viên năm 3 chuyên ngành Khoa học Máy tính.',
                major: 'cs',
                strength: [],
                demand: ['cs_algo', 'cs_db'],
                rate: 0,
                role: 'student'
            });
        } finally {
            setLoading(false);
        }
    };

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

            const response = await profileApi.updateStudentProfile(currentUserId, updateData);

            if (response.success) {
                // Cập nhật lại profile data từ response
                if (response.data.profile) {
                    setProfileData({
                        ...response.data.profile,
                        uID: currentUserId,
                        role: 'student'
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
                                        value={profileData.description}
                                        onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                                        className={inputStyle}
                                        rows={4}
                                        placeholder="Nhập giới thiệu về bản thân..."
                                    />
                                ) : (
                                    <div className={`${inputStyle} min-h-[100px]`}>
                                        {profileData.description || 'Chưa có giới thiệu'}
                                    </div>
                                )}
                            </div>

                            {/* Nhu cầu thêm (cho student) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nhu cầu / Môn học quan tâm
                                </label>
                                {isEditing ? (
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newDemand}
                                                onChange={(e) => setNewDemand(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDemand())}
                                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/20"
                                                placeholder="Thêm nhu cầu"
                                            />
                                            <button
                                                onClick={handleAddDemand}
                                                className="bg-[#006D77] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00565e] transition-colors"
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(profileData.demand || []).map((demand, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                                                >
                                                    {demand}
                                                    <button
                                                        onClick={() => handleRemoveDemand(index)}
                                                        className="hover:text-red-600"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(profileData.demand || []).length > 0 ? (
                                            profileData.demand.map((demand, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                                                >
                                                    {demand}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic">Chưa có thông tin</span>
                                        )}
                                    </div>
                                )}
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
                                    <span className="text-sm font-medium text-gray-600">Đã hoàn thành</span>
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

                            {/* Average Rating (Optional for student, maybe hide?) */}
                            {/* <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">Đánh giá trung bình</span>
                                    <TrendingUp className="text-yellow-600" size={20} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold text-gray-800">{statistics.averageRating.toFixed(1)}</p>
                                    <span className="text-sm text-gray-500">/ 5.0</span>
                                </div>
                            </div> */}

                            {/* Total Hours */}
                            <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">Tổng giờ học</span>
                                    <Calendar className="text-teal-600" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{statistics.totalHours}h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
