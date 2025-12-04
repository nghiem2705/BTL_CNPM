import {
    Calendar,
    ChevronLeft,
    Clock,
    FileText,
    Link as LinkIcon,
    MapPin,
    Plus,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { sessionApi } from '../../../api/TutorSession'; // Import API
import { validateSessionForm, displayValidationErrors, formatApiError } from '../../../utils/validation';

// Toggle Switch Component
const ToggleSwitch = ({ isOn, onToggle }) => (
    <div
        onClick={() => onToggle(!isOn)}
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-green-500' : 'bg-gray-300'
            }`}
    >
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
    </div>
);

const ConsultationCreate = () => {
    const navigate = useNavigate();
    const [locationToggle, setLocationToggle] = useState(true);
    const [specializationInput, setSpecializationInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const { uID } = useParams()
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        tutor: uID, //default
        student: [], // default
        date: '',
        startTime: '',
        duration: 0,
        description: '',
        isOnline: locationToggle, 

        meetLink: '', 
        note: '',
        
        location: '',
        files: []
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle specialization tags
    // const handleAddSpecialization = () => {
    //     if (specializationInput.trim() && !formData.specializations.includes(specializationInput.trim())) {
    //         setFormData({
    //             ...formData,
    //             specializations: [...formData.specializations, specializationInput.trim()]
    //         });
    //         setSpecializationInput('');
    //     }
    // };

    // const handleRemoveSpecialization = (index) => {
    //     setFormData({
    //         ...formData,
    //         specializations: formData.specializations.filter((_, i) => i !== index)
    //     });
    // };

    // Handle file upload
    // const handleFileUpload = (files) => {
    //     const newFiles = Array.from(files).map(file => ({
    //         name: file.name,
    //         size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    //         file: file
    //     }));
    //     setFormData({
    //         ...formData,
    //         files: [...formData.files, ...newFiles]
    //     });
    // };

    // const handleRemoveFile = (index) => {
    //     setFormData({
    //         ...formData,
    //         files: formData.files.filter((_, i) => i !== index)
    //     });
    // };

    // Drag and drop handlers
    // const handleDragOver = (e) => {
    //     e.preventDefault();
    //     setIsDragging(true);
    // };

    // const handleDragLeave = () => {
    //     setIsDragging(false);
    // };

    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     setIsDragging(false);
    //     const files = e.dataTransfer.files;
    //     if (files.length > 0) {
    //         handleFileUpload(files);
    //     }
    // };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setErrors({});
        
        // Prepare form data for validation
        const dataToValidate = {
            title: formData.title,
            date: formData.date,
            startTime: formData.startTime,
            duration: formData.duration,
            isOnline: locationToggle,
            meetLink: locationToggle ? formData.meetLink : '',
            location: !locationToggle ? formData.location : ''
        };
        
        // Validate form data
        const validation = validateSessionForm(dataToValidate);
        
        if (!validation.valid) {
            setErrors(validation.errors);
            alert(displayValidationErrors(validation.errors));
            return;
        }
        
        // Confirm submission
        const confirmSave = window.confirm("Bạn có chắc chắn muốn tạo buổi tư vấn này?");
        if (!confirmSave) return;
        
        setIsSubmitting(true);
        
        try {
            // Prepare data for API
            const submitData = {
                ...formData,
                isOnline: locationToggle,
                duration: parseInt(formData.duration)
            };
            
            await sessionApi.create(uID, submitData);
            alert('Tạo buổi tư vấn thành công!');
            navigate('/tutor/' + uID + '/sessions/');
        } catch (error) {
            console.error("Lỗi khi tạo buổi tư vấn:", error);
            const errorMessage = formatApiError(error);
            alert('Lỗi khi tạo buổi tư vấn: ' + errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Input style
    const inputStyle = "w-full border border-gray-300 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all shadow-sm";
    const labelStyle = "text-xs uppercase font-bold text-gray-500 mb-1.5 flex items-center gap-1";

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fade-in max-w-5xl mx-auto my-6">
            {/* Back button */}
            <button
                onClick={() => navigate(`/tutor/${uID}/sessions`)}
                className="flex items-center gap-1 text-gray-500 hover:text-[#006D77] mb-4 text-sm font-medium transition-colors"
            >
                <ChevronLeft size={20} /> Quay lại danh sách
            </button>

            {/* Form Header */}
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-[#102A43] tracking-tight">Tạo buổi tư vấn - Điền thông tin</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Main Form Fields */}
                    <div className="xl:col-span-2 space-y-5">
                        {/* Tiêu đề */}
                        <div>
                            <label className={labelStyle}>
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Nhập tiêu đề"
                                className={`${inputStyle} ${errors.title ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Ngày học và Thời gian */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelStyle}>
                                    <Calendar size={12} /> Ngày học <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className={`${inputStyle} ${errors.date ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {/* <Calendar size={12} className="absolute right-3 top-3 text-gray-400 pointer-events-none" /> */}
                                </div>
                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                            </div>
                            <div>
                                <label className={labelStyle}>
                                    <Clock size={12} /> Thời gian <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className={`${inputStyle} ${errors.startTime ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="Phút"
                                        min="15"
                                        max="480"
                                        step="5"
                                        className={`${inputStyle} ${errors.duration ? 'border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {(errors.startTime || errors.duration || errors.dateTime) && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.startTime || errors.duration || errors.dateTime}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Online hay offline */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className={labelStyle}>
                                    <MapPin size={12} /> Hình thức
                                </label>
                                <div className="flex items-center gap-2 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                    <span className={`text-[10px] font-bold ${locationToggle ? 'text-green-600' : 'text-gray-500'}`}>
                                        {locationToggle ? 'ON' : 'OFF'}
                                    </span>
                                    <ToggleSwitch isOn={locationToggle} onToggle={setLocationToggle} />
                                </div>
                            </div>
                        </div>

                        {/* Link tham gia (shown when location toggle is OFF) */}
                        {!locationToggle ? (
                            <div>
                                <label className={labelStyle}>
                                    <MapPin size={12} /> Địa điểm (phòng học) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Nhập địa chỉ"
                                        className={`${inputStyle} pl-8 ${errors.location ? 'border-red-500' : ''}`}
                                    />
                                    <MapPin size={12} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                            </div>
                        ) : (
                            <div>
                                <label className={labelStyle}>
                                    <LinkIcon size={12} /> Link tham gia
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        name="meetLink"
                                        value={formData.meetLink}
                                        onChange={handleChange}
                                        placeholder="Nhập đường dẫn (ví dụ: https://meet.google.com/...)"
                                        className={`${inputStyle} pl-8 ${errors.meetLink ? 'border-red-500' : ''}`}
                                    />
                                    <LinkIcon size={12} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                                {errors.meetLink && <p className="text-red-500 text-xs mt-1">{errors.meetLink}</p>}
                            </div>
                        )}

                        {/* Mô tả chi tiết */}
                        <div>
                            <label className="text-sm font-bold text-gray-800 mb-1.5 block">Mô tả chi tiết</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả..."
                                rows={4}
                                className={inputStyle}
                            />
                        </div>

                        {/* Ghi chú */}
                        <div>
                            <label className="text-sm font-bold text-gray-800 mb-1.5 block">Ghi chú</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Nhập thông tin bắt buộc"
                                rows={3}
                                className={inputStyle}
                            />
                        </div>

                        {/* Required field indicator */}
                        <p className="text-xs text-gray-500">
                            <span className="text-red-500">(*)</span> thông tin bắt buộc
                        </p>
                    </div>

                    {/* Right Column - Tài liệu */}
                    <div className="xl:col-span-1 flex flex-col gap-4">
                        <div className="border border-gray-200 rounded-xl p-4 flex-grow bg-gray-50">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Tài liệu</h3>

                            {/* Drag and drop area */}
                            <div
                                // onDragOver={handleDragOver}
                                // onDragLeave={handleDragLeave}
                                // onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                                    ? 'border-[#006D77] bg-blue-50'
                                    : 'border-gray-300 bg-gray-100'
                                    }`}
                            >
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <FileText size={32} className="text-gray-400" />
                                    <p className="text-xs text-gray-600 font-medium">Kéo thả file vào đây</p>
                                    <p className="text-[10px] text-gray-400">hoặc</p>
                                    <label className="bg-[#006D77] hover:bg-[#00565e] text-white px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors inline-block">
                                        <input
                                            type="file"
                                            multiple
                                            // onChange={(e) => handleFileUpload(e.target.files)}
                                            className="hidden"
                                        />
                                        Chọn file
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                    <button
                        // onClick= {}
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Plus size={16} /> {isSubmitting ? 'Đang tạo...' : 'Thêm mới'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsultationCreate;