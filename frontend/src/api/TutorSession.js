const BASE_URL = 'http://127.0.0.1:8000';

// Ở đây chứa các API liên quan tới Session trong trang tutor nhé ae
export const sessionApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}/sessions/`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });
      const rawData = await response.json();

      // --- BƯỚC 1: TÌM ĐÚNG CHỖ CHỨA DỮ LIỆU ---
      // Nếu backend trả về { sessions: {...} } thì lấy cái bên trong.
      // Nếu trả về trực tiếp {...} thì dùng luôn.
      const sessionsDict = rawData.sessions || rawData; 

      // --- BƯỚC 2: CHUYỂN DICTIONARY THÀNH LIST ---
      // Object.entries giúp lấy luôn cả Key "ss2" làm ID
      const dataArray = Object.entries(sessionsDict).map(([key, value]) => {
          // Bỏ qua nếu value không phải là object (để lọc bỏ mấy cái dòng message vớ vẩn)
          if (typeof value !== 'object' || value === null) return null;
          
          return {
            ...value,        // Lấy hết name, time, duration...
            session_id: key  // Lấy key "ss2" gán vào biến session_id
          };
      }).filter(item => item !== null); // Lọc bỏ mấy cái null

      // --- BƯỚC 3: MAP SANG GIAO DIỆN ---
      return dataArray.map(item => ({
        id: item.session_id,           
        title: item.name,              
        
        date: item.date,
        displayDate: convertDateToDisplay(item.date),
        
        startTime: item.time,          
        endTime: calculateEndTime(item.time, item.duration), 
        
        // Thêm kiểm tra để không bị "undefined phút"
        duration: (item.duration || 0) + " phút", 
        
        status: "upcoming", 
        location: item.address,
        meetLink: item.link, // Xử lý nếu online là boolean
        description: item.description,
        note: item.note,
        files: []
      }));

    } catch (error) {
      console.error("Lỗi API:", error);
      return []; 
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/sessions/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Không tìm thấy');
      
      const rootData = await response.json();
      // Backend trả về: { session: {...data...}, message: "..." }
      const item = rootData.session; // <--- LẤY ĐÚNG CÁI NÀY
      
      // Map sang Frontend
      return {
        id: item.session_id,
        title: item.name,
        date: item.date,
        displayDate: convertDateToDisplay(item.date),
        startTime: item.time,
        endTime: calculateEndTime(item.time, item.duration),
        duration: item.duration + " phút",
        status: item.status,
        isOnline: item.online,
        location: item.address,
        meetLink: item.link,
        description: item.description,
        note: item.note,
        files: item.document
      };
    } catch (error) {
      console.error("Lỗi getById:", error);
      throw error;
    }
  },
  /// Thêm hàm DELETE trong này rồi gọi trong Home->index.jsx nhé
  delete: async (id) => {
      try {
        const response = await fetch(`${BASE_URL}/sessions/${id}/`, {
            method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Lỗi khi xóa');
        return true;
      } catch (error) {
          throw error;
      }
  },
  /// Thêm hàm UPDATE trong này rồi gọi trong ConsultationDetail.jsx nhé
  update: async (id, frontendData) => {
    try {
        const backendPayload = {
            name: frontendData.title,
            tutor: frontendData.tutor,
            student: frontendData.students,
            date: frontendData.date,
            time: frontendData.startTime,
            duration: parseInt(frontendData.durationRaw || 60),
            description: frontendData.description,
            online: frontendData.isOnline, 
    
            link: frontendData.isOnline ? frontendData.meetLink : "", 
            note: frontendData.note,
          
            address: frontendData.location,
            document: frontendData.files
        };

        const response = await fetch(`${BASE_URL}/sessions/${id}/`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backendPayload)
        });
        
        if (!response.ok) throw new Error('Lỗi khi lưu');
        return await response.json();
    } catch (error) {
        throw error;
    }
  },

  /// Thêm một buổi tư vấn mới
  create: async (frontendData) => {
    try {
        const backendPayload = {
            name: frontendData.title,
            tutor: frontendData.tutor,
            student: frontendData.students,
            date: frontendData.date,
            time: frontendData.startTime,
            duration: parseInt(frontendData.duration),
            description: frontendData.description,
            online: frontendData.isOnline, 
    
            link: frontendData.isOnline ? frontendData.meetLink : "", 
            note: frontendData.note,
          
            address: frontendData.location,
            document: frontendData.files
        };

        const response = await fetch(`${BASE_URL}/tutor/${frontendData.tutor}/sessions/`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backendPayload)
        });
        
        if (!response.ok) throw new Error('Lỗi khi tạo mới');
        return await response.json();
    } catch (error) {
        throw error;
    }
  },
};

// --- HÀM PHỤ TRỢ ---
const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime) return "";
    const [hour, minute] = startTime.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + parseInt(durationMinutes || 0);
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    return `${newHour}:${newMinute.toString().padStart(2, '0')}`;
};

const convertDateToDisplay = (dateStr) => {
    if(!dateStr) return "";
    const date = new Date(dateStr);
    return `Thứ ${date.getDay() + 1}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// export default api;