// // src/api/index.js

// export const mockSessions = [
//   {
//     id: 1,
//     title: "Ứng dụng đại số trong công nghệ",
//     date: "2025-11-05",
//     displayDate: "Thứ tư, 5/11/2025",
//     startTime: "10:00",
//     endTime: "11:30",
//     duration: "90 phút",
//     status: "upcoming", 
//     location: "Google Meet",
//     meetLink: "https://meet.google.com/gfs-iocr-yks",
//     description: "Giúp người học hiểu rõ vai trò và ứng dụng của đại số...",
//     note: "Nhớ xem trước tài liệu chương 1 nhé các em!",
//     files: [{ name: "Slide_Chuong_1.pdf", size: "2.3 MB" }]
//   },
//   {
//     id: 2,
//     title: "Nhập môn Trí tuệ nhân tạo (AI Basics)",
//     date: "2025-10-29",
//     displayDate: "Thứ tư, 29/10/2025",
//     startTime: "07:00",
//     endTime: "08:30",
//     duration: "90 phút",
//     status: "finished",
//     location: "Google Meet",
//     meetLink: "",
//     description: "Giới thiệu các khái niệm cơ bản về AI...",
//     note: "Đã tổng kết điểm danh.",
//     files: []
//   },
//   {
//     id: 3,
//     title: "Lập trình Web Frontend với ReactJS",
//     date: "2025-12-01",
//     displayDate: "Thứ hai, 01/12/2025",
//     startTime: "13:00",
//     endTime: "16:00",
//     duration: "180 phút",
//     status: "upcoming", 
//     location: "Phòng 201-H6",
//     meetLink: "",
//     description: "Hướng dẫn thực hành ReactJS...",
//     note: "Yêu cầu mang laptop...",
//     files: [{ name: "React_Cheatsheet.pdf", size: "1.5 MB" }]
//   }
// ];
// src/api/index.js

// Định nghĩa URL gốc của server Django
// src/api/index.js

// const BASE_URL = 'http://127.0.0.1:8000';

// // --- Hàm map dữ liệu (Dùng chung cho cả getAll và getById) ---
// const mapBackendToFrontend = (item) => ({
//     id: item.session_id,           
//     title: item.name,              
//     date: item.date,
//     displayDate: convertDateToDisplay(item.date),
//     startTime: item.time,          
//     endTime: calculateEndTime(item.time, item.duration), 
//     duration: item.duration + " phút", 
//     durationRaw: item.duration, // Lưu số gốc để tiện chỉnh sửa
//     status: "upcoming", // Logic check status tùy bạn
//     location: item.address || "Google Meet",
//     meetLink: item.online || "", // Giả sử backend trả link ở trường 'online'
//     description: item.description,
//     note: item.note,
//     files: [] 
// });

// export const sessionApi = {
//   getAll: async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/sessions/`);
//       if (!response.ok) throw new Error('Lỗi tải dữ liệu');

//       const backendData = await response.json();
      
//       // --- BƯỚC SỬA QUAN TRỌNG Ở ĐÂY ---
      
//       // 1. Kiểm tra xem backendData là Object hay Array
//       let dataArray = [];
      
//       if (Array.isArray(backendData)) {
//           // Nếu Backend đã trả về List ([]) thì dùng luôn
//           dataArray = backendData;
//       } else {
//           // Nếu Backend trả về Object ({"ss1": {...}})
//           // Chúng ta dùng Object.entries để chuyển nó thành List
//           // Và lấy cái Key ("ss1") nhét vào làm ID
//           dataArray = Object.entries(backendData).map(([key, value]) => ({
//               ...value,          // Lấy toàn bộ thông tin bên trong (name, time...)
//               session_id: key    // Lấy key "ss2" gán vào trường session_id
//           }));
//       }

//       // 2. Map dữ liệu sang format Frontend (Code cũ)
//       const frontendData = dataArray.map(item => ({
//         id: item.session_id,           
//         title: item.name,              
//         date: item.date,
//         displayDate: convertDateToDisplay(item.date),
//         startTime: item.time,          
//         // ... (các trường còn lại giữ nguyên như cũ)
//         endTime: calculateEndTime(item.time, item.duration), 
//         duration: item.duration + " phút", 
//         status: "upcoming", 
//         location: item.address,
//         description: item.description,
//         files: []
//       }));

//       return frontendData;

//     } catch (error) {
//       console.error("API Error:", error);
//       return []; // Trả về mảng rỗng để không bị crash web
//     }
//   }
// };

// // ... Các hàm helper calculateEndTime, convertDateToDisplay giữ nguyên ...

// // --- Các hàm phụ trợ (Helper functions) ---

// // Hàm tính giờ kết thúc (VD: 10:00 + 90p = 11:30)
// const calculateEndTime = (startTime, durationMinutes) => {
//     if (!startTime) return "";
//     // Giả sử startTime dạng "10:00"
//     const [hour, minute] = startTime.split(':').map(Number);
//     const totalMinutes = hour * 60 + minute + parseInt(durationMinutes);
    
//     const newHour = Math.floor(totalMinutes / 60);
//     const newMinute = totalMinutes % 60;
    
//     return `${newHour}:${newMinute.toString().padStart(2, '0')}`;
// };

// // Hàm giả lập check status
// const checkStatus = (date, time) => {
//     // Bạn có thể viết logic so sánh ngày giờ hiện tại ở đây
//     return "upcoming"; 
// };

// // Hàm format ngày hiển thị
// const convertDateToDisplay = (dateStr) => {
//     // VD: 2025-11-05 -> Thứ tư, 5/11/2025
//     if(!dateStr) return "";
//     const date = new Date(dateStr);
//     return `Thứ ${date.getDay() + 1}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
// };
// src/api/index.js

const BASE_URL = 'http://127.0.0.1:8000';

export const sessionApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}/sessions/`);
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
        meetLink: item.online === true ? "Online" : "", // Xử lý nếu online là boolean
        description: item.description,
        files: []
      }));

    } catch (error) {
      console.error("Lỗi API:", error);
      return []; 
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/sessions/${id}/`);
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
        status: "upcoming",
        location: item.address,
        meetLink: item.online === true ? "Online" : "",
        description: item.description,
        files: []
      };
    } catch (error) {
      console.error("Lỗi getById:", error);
      throw error;
    }
  },
  
  // ... (Giữ nguyên các hàm getById, update) ...
};

// --- HÀM PHỤ TRỢ (Copy y nguyên) ---
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