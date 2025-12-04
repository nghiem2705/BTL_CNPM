// src/pages/ConsultationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks điều hướng
import { 
  Calendar, Clock, MapPin, Link as LinkIcon, FileText, 
  ChevronLeft, X, Plus, Download, CheckCircle
} from 'lucide-react';
// import { mockSessions } from '../api'; // Import dữ liệu giả
import { sessionApi } from '../../../api/TutorSession'; // Import API
import { validateSessionForm, displayValidationErrors, formatApiError } from '../../../utils/validation';

// --- HELPER COMPONENTS --- (giữ nguyên)
const ToggleSwitch = ({ isOn, onToggle, disabled }) => (
  <div onClick={() => !disabled && onToggle(!isOn)} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-green-500' : 'bg-gray-300'} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}>
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
  </div>
);

const ConsultationDetail = () => {
  const { uID, id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate(); // Hàm để quay lại trang trước
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  // const [locationToggle, setLocationToggle] = useState(true);
  const [loading, setLoading] = useState(true); // thêm setloading cho thật tí
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const labelStyle = "text-xs uppercase font-bold text-gray-500 mb-1.5 flex items-center gap-1";

  // Tìm dữ liệu dựa trên ID khi vào trang
  // useEffect(() => {
  //   const session = mockSessions.find(s => s.id === parseInt(id));
  //   if (session) {
  //     setFormData(session);
  //   }
  // }, [id]);
  // 1. HÀM GỌI API LẤY CHI TIẾT SESSION (có sửa)
  useEffect(() => {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          const data = await sessionApi.getById(uID, id);
          setFormData(data);
          
          // Tự động bật/tắt toggle dựa trên địa điểm
          const isOnline = data.location === 'Google Meet' || data.location === 'Zoom';
          // setLocationToggle(isOnline);
        } catch (error) {
          console.error(error);
          alert("Không tìm thấy lớp học này!");
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      if (id) fetchDetail();
    }, [id, navigate]);

  if (!formData) return <div className="p-10 text-center text-gray-500">Đang tải hoặc không tìm thấy dữ liệu...</div>;

  // 2. HÀM XỬ LÝ NHẬP LIỆU (giữ nguyên)
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const inputStyle = isEditing
    ? "w-full border border-gray-300 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all shadow-sm"
    : "w-full bg-[#F1F5F9] rounded-lg px-3 py-2.5 text-sm text-gray-700 pointer-events-none border border-transparent";

  // 3. HÀM LƯU DỮ LIỆU MỚI (thêm mới, hàm này gọi API update)
  // const handleSave = () => {
  //     const confirmSave = window.confirm("Bạn có chắc chắn muốn lưu thay đổi?");
  //     if(confirmSave) {
  //         setTimeout(() => { alert("Lưu thành công!"); setIsEditing(false); }, 500);
  //     }
  // };
  const handleSave = async () => {
      // Clear previous errors
      setErrors({});
      
      // Prepare data for validation
      const dataToValidate = {
          title: formData.title,
          date: formData.date,
          startTime: formData.startTime,
          duration: parseInt(formData.duration),
          isOnline: formData.isOnline,
          meetLink: formData.isOnline ? formData.meetLink : '',
          location: !formData.isOnline ? formData.location : ''
      };
      
      // Validate form data
      const validation = validateSessionForm(dataToValidate);
      
      if (!validation.valid) {
          setErrors(validation.errors);
          alert(displayValidationErrors(validation.errors));
          return;
      }
      
      const confirmSave = window.confirm("Bạn có chắc chắn muốn lưu thay đổi?");
      if(!confirmSave) return;
      
      setIsSubmitting(true);
      
      try {
         await sessionApi.update(uID, id, formData);
         alert("Lưu thành công!");
         setIsEditing(false);
         window.location.reload();
      } catch (error) {
         console.error("Lỗi khi lưu dữ liệu:", error);
         const errorMessage = formatApiError(error);
         alert("Lỗi khi lưu dữ liệu: " + errorMessage);
      } finally {
         setIsSubmitting(false);
      }
    };
  // 4. HÀM LOGIC ONLINE/OFFLINE (hàm này mới -> có sửa html ở chỗ location với link)
  const handleToggleChange = (newStatus) => {
      setFormData(prev => ({
          ...prev,
          isOnline: newStatus,
          // Nếu chuyển sang Online -> Gợi ý Google Meet
          // Nếu chuyển sang Offline 
          location: newStatus ? (prev.location === 'Google Meet' || prev.location === 'Zoom' ? prev.location : 'Google Meet') : ''
      }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fade-in max-w-5xl mx-auto my-6">
      
      {/* Nút Quay lại */}
      <button onClick={() => navigate(`/tutor/${uID}/sessions/`)} className="flex items-center gap-1 text-gray-500 hover:text-[#006D77] mb-4 text-sm font-medium transition-colors">
        <ChevronLeft size={20} /> Quay lại danh sách
      </button>

      {/* Header Detail */}
      <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
        <div>
          {/*Tiêu đề */}
          {isEditing ? (
              <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="text-2xl font-bold text-[#102A43] tracking-tight border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
          ) : (
              <h2 className="text-2xl font-bold text-[#102A43] tracking-tight">
                  {formData.title}
              </h2>
          )}
          {/*trạng thái*/}
          <div className="flex gap-2 mt-2">
            {formData.status === 3 ? (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded">Sắp diễn ra</span>
            ) : (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">Đã kết thúc</span>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
             <button 
               onClick={() => {
                 setIsEditing(false);
                 setErrors({});
               }} 
               className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors"
               disabled={isSubmitting}
             >
               Hủy
             </button>
             <button 
               onClick={handleSave} 
               className={`bg-[#006D77] hover:bg-[#00565e] text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-colors flex items-center gap-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
               disabled={isSubmitting}
             >
               <CheckCircle size={14}/> {isSubmitting ? 'Đang lưu...' : 'Lưu'}
             </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium text-xs transition-colors shadow-sm">Chỉnh sửa</button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cột Thông tin */}
        <div className="xl:col-span-2 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1.5 flex items-center gap-1"><Calendar size={12} /> Ngày học</label>
                    {isEditing ? (
                      <>
                        <input 
                          type="date" 
                          name="date" 
                          className={`${inputStyle} ${errors.date ? 'border-red-500' : ''}`} 
                          defaultValue={formData.date} 
                          onChange={handleChange} 
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                      </>
                    ) : (
                      <div className={inputStyle}>{formData.displayDate}</div>
                    )}
                </div>
                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1.5 flex items-center gap-1"><Clock size={12} /> Thời gian</label>
                      {isEditing ? (
                        <>
                          <div className="flex items-center gap-1">
                            <input 
                              type="time" 
                              name="startTime"
                              className={`${inputStyle} ${errors.startTime ? 'border-red-500' : ''}`} 
                              defaultValue={formData.startTime}
                              onChange={handleChange}
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
                        </>
                      ) : (
                        <div className={inputStyle}>{formData.startTime} - {formData.endTime} ({formData.duration} phút)</div>
                      )}
                </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs uppercase font-bold text-gray-500 flex items-center gap-1"><MapPin size={12} /> ĐỊA CHỈ</label>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                  <span className={`text-[10px] font-bold ${formData.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                      {formData.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                  <div className="scale-75 origin-right">
                      <ToggleSwitch 
                          isOn={formData.isOnline} 
                          onToggle={handleToggleChange} 
                          disabled={!isEditing} 
                      />
                  </div>
                </div>
              </div>
            </div>

            {/* Link tham gia (shown when location toggle is OFF) */}
            {!formData.isOnline ? (
                <div>
                    <label className={labelStyle}>
                        <MapPin size={12} /> Địa điểm (phòng học)
                    </label>
                    {isEditing ? (
                    <>
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
                    </>
                    ): (
                    <div className={`${inputStyle} font-medium text-[#006D77]`}>{formData.location || "Chưa xác định"}</div>
                    )}
                </div>
            ) : (
                <div>
                    <label className={labelStyle}>
                        <LinkIcon size={12} /> Link tham gia
                    </label>
                    {isEditing ? (
                    <>
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
                    </>
                    ): (
                    <div className={`${inputStyle} font-medium text-[#006D77]`}>{formData.meetLink || "Chưa xác định"}</div>
                    )}
                </div>
            )}

            <div>
              <label className="text-sm font-bold text-gray-800 mb-1.5 block">Mô tả chi tiết</label>
               {isEditing ? <textarea rows={4} className={inputStyle} defaultValue={formData.description} /> : <div className="bg-[#F1F5F9] rounded-lg p-3 text-sm text-gray-700 leading-relaxed min-h-[100px]">{formData.description}</div>}
            </div>
        </div>

        {/* Cột Tài liệu */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="border border-gray-200 rounded-xl p-4 flex-grow bg-gray-50 h-full">
             <h3 className="text-sm font-bold text-gray-800 mb-3">Tài liệu đính kèm</h3>
             {formData.files?.length > 0 ? formData.files.map((doc, idx) => (
               <div key={idx} className="bg-white p-2.5 rounded-lg mb-2 flex items-center gap-3 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="bg-blue-50 p-1.5 rounded"><FileText className="text-blue-600" size={16} /></div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-gray-700 truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-500">{doc.size}</p>
                  </div>
                  {isEditing ? <X size={14} className="text-gray-400 hover:text-red-500"/> : <Download size={14} className="text-gray-400 group-hover:text-[#006D77]"/>}
               </div>
             )) : <p className="text-xs text-gray-400 italic text-center py-4">Không có tài liệu</p>}
             
             {isEditing && (
                <div className="mt-3 border-2 border-dashed border-[#006D77]/30 bg-blue-50/50 rounded-lg p-4 text-center text-[#006D77] text-xs cursor-pointer hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-1">
                    <Plus size={16} /> Thêm tài liệu
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetail;
