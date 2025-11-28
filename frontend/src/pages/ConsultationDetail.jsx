// src/pages/ConsultationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks điều hướng
import { 
  Calendar, Clock, MapPin, Link as LinkIcon, FileText, 
  ChevronLeft, X, Plus, Download, CheckCircle
} from 'lucide-react';
// import { mockSessions } from '../api'; // Import dữ liệu giả
import { sessionApi } from '../api'; // Import API

// --- HELPER COMPONENTS --- (giữ nguyên)
const ToggleSwitch = ({ isOn, onToggle, disabled }) => (
  <div onClick={() => !disabled && onToggle(!isOn)} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-green-500' : 'bg-gray-300'} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}>
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
  </div>
);

const ConsultationDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate(); // Hàm để quay lại trang trước
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  // const [locationToggle, setLocationToggle] = useState(true);
  const [loading, setLoading] = useState(true); // thêm setloading cho thật tí
  

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
          const data = await sessionApi.getById(id);
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
      const confirmSave = window.confirm("Bạn có chắc chắn muốn lưu thay đổi?");
      if(confirmSave) {
          try {
             
             await sessionApi.update(id, formData);
             alert("Lưu thành công!");
             setIsEditing(false);
          } catch (error) {
             alert("Lỗi khi lưu dữ liệu!");
          }
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
      <button onClick={() => navigate('/tutor/sessions/')} className="flex items-center gap-1 text-gray-500 hover:text-[#006D77] mb-4 text-sm font-medium transition-colors">
        <ChevronLeft size={20} /> Quay lại danh sách
      </button>

      {/* Header Detail */}
      <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#102A43] tracking-tight">{formData.title}</h2>
          <div className="flex gap-2 mt-2">
            {formData.status === 3 ? (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded">Sắp diễn ra</span>
            ) : (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">Đã kết thúc</span>
            )}
            <span className="bg-gray-50 text-gray-600 border border-gray-200 text-xs px-3 py-1 rounded-full font-bold">Chuyên môn</span>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
             <button onClick={() => setIsEditing(false)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors">Hủy</button>
             <button onClick={handleSave} className="bg-[#006D77] hover:bg-[#00565e] text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-colors flex items-center gap-1"><CheckCircle size={14}/> Lưu</button>
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
                    {isEditing ? <input type="date" name="date" className={inputStyle} defaultValue={formData.date} onChange={handleChange} /> : <div className={inputStyle}>{formData.displayDate}</div>}
                </div>
                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1.5 flex items-center gap-1"><Clock size={12} /> Thời gian</label>
                    {isEditing ? (
                        <div className="flex items-center gap-1"><input type="time" className={inputStyle} defaultValue={formData.startTime} /><span className="text-gray-400">-</span><input type="time" className={inputStyle} defaultValue={formData.endTime} /></div>
                    ) : (<div className={inputStyle}>{formData.startTime} - {formData.endTime} ({formData.duration})</div>)}
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
      

              {isEditing ? (
                formData.isOnline ? (
                    <select name="location" className={inputStyle} value={formData.location} onChange={handleChange}>
                        <option value="Google Meet">Google Meet</option>
                        <option value="Zoom">Zoom</option>
                    </select>
                ) : (
                    <input type="text" name="location" className={inputStyle} value={formData.location} onChange={handleChange} placeholder="Nhập tên phòng, địa chỉ..." />
                )
              ) : (
                <div className={`${inputStyle} font-medium text-[#006D77]`}>{formData.location || "Chưa xác định"}</div>
              )}
            </div>
             
             {/* <div>
              <label className="text-xs uppercase font-bold text-gray-500 mb-1.5 flex items-center gap-1"><LinkIcon size={12} /> Link tham gia</label>
               <div className="relative">
                 {isEditing ? <input type="text" name="meetLink" className={`${inputStyle} pl-8 text-blue-600`} value={formData.meetLink || "Chưa có link"} /> : <div className={`${inputStyle} pl-8 text-blue-600 underline truncate`}>{formData.meetLink}</div>}
                 <LinkIcon size={14} className="absolute left-3 top-3 text-gray-400" />
               </div>
            </div> */}
            <div>
              <label className="text-xs uppercase font-bold text-gray-500 mb-1.5 flex items-center gap-1"><LinkIcon size={12} /> Link tham gia</label>
               <div className="relative">
                 {isEditing ? (
                    <input 
                        type="text" 
                        name="meetLink" 
                        // Logic khóa: Nếu KHÔNG phải Online thì khóa lại
                        disabled={!formData.isOnline} 
                        
                        // Logic giao diện: Nếu Offline thì xám, Online thì trắng
                        className={`${inputStyle} pl-8 ${!formData.isOnline ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-blue-600 bg-white'}`}
                        
                        // Logic dữ liệu: Nếu Offline thì rỗng, Online thì hiện link
                        value={!formData.isOnline ? "" : (formData.meetLink || "")} 
                        
                        onChange={handleChange} 
                        placeholder={!formData.isOnline ? "Chỉ khả dụng khi chọn hình thức Online" : "Dán link họp vào đây..."}
                    />
                 ) : (
                    // CHẾ ĐỘ XEM
                    formData.isOnline ? (
                        <a href={formData.meetLink} target="_blank" rel="noreferrer" className={`${inputStyle} pl-8 text-blue-600 underline truncate block hover:text-blue-800`}>
                            {formData.meetLink || "Chưa cập nhật link"}
                        </a>
                    ) : (
                        <div className={`${inputStyle} pl-8 text-gray-400 italic`}>Không có link (Offline)</div>
                    )
                 )}
                 <LinkIcon size={14} className="absolute left-3 top-3 text-gray-400" />
               </div>
            </div>
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
