// API liên quan tới danh sách Tutor trong trang Student nhé ae
// API liên quan tới danh sách Tutor trong trang Student nhé ae
const BASE_URL = 'http://127.0.0.1:8000';

export const studentTutorApi = {
    getRecommendedTutor: async (studentId) => {
    try {
        const response = await fetch(`${BASE_URL}/student/${studentId}/tutors`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const rawData = await response.json();

        const tutorDict = rawData.tutors || rawData; 

        // --- BƯỚC 2: CHUYỂN DICTIONARY THÀNH LIST ---
        // Object.entries giúp lấy luôn cả Key "ss2" làm ID
        const dataArray = Object.entries(tutorDict).map(([key, value]) => {
            // Bỏ qua nếu value không phải là object (để lọc bỏ mấy cái dòng message vớ vẩn)
            if (typeof value !== 'object' || value === null) return null;
            
            return {
                ...value,        // Lấy hết name, time, duration...
                tutor_id: key  // Lấy key "ss2" gán vào biến session_id
            };
        }).filter(item => item !== null); // Lọc bỏ mấy cái null

        // --- BƯỚC 3: MAP SANG GIAO DIỆN ---
        return dataArray.map(item => ({
            id: item.id,
            name: item.name,           
            major: item.major,              
            mail: item.mail,
            phone: item.phone,
            strength: item.strength,
            description: item.description,
            rate: item.rate,
            registered: item.registered
        }));

        } catch (error) {
        console.error("Lỗi API:", error);
        return []; 
        }
    },
};