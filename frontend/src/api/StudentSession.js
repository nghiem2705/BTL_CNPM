
// Ở đây chứa các API liên quan tới Session trong trnag Student nhé
const BASE_URL = 'http://127.0.0.1:8000';

export const studentSessionApi = {
    getUnregisterSession: async (/*trong này là tham số nè*/ ) => {
        // try ....
    },

    getRegisteredSession: async (uID) => {
        try {
            const response = await fetch(`${BASE_URL}/student/${uID}/sessions/registered`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const rawData = await response.json();

            const sessionsDict = rawData.sessions || rawData; 

            const dataArray = Object.entries(sessionsDict).map(([key, value]) => {

                if (typeof value !== 'object' || value === null) return null;
                
                return {
                    ...value,        // Lấy hết name, time, duration...
                    session_id: key  // Lấy key "ss2" gán vào biến session_id
                };
            }).filter(item => item !== null); 
            return dataArray.map(item => ({
                id: item.session_id,           
                title: item.name,              
                tutor: item.tutor,
                date: item.date,
                displayDate: convertDateToDisplay(item.date),
                
                startTime: item.time,          
                endTime: calculateEndTime(item.time, item.duration), 
                duration: (item.duration || 0) + " phút", 
                
                status: item.status, 
                location: item.address,
                meetLink: item.link,
                description: item.description,
                note: item.note,
                files: []
            }));
            

        } catch (error) {
        console.error("Lỗi API:", error);
        return []; 
        }
    },
    getSessionById: async (uID, id) => {
        try {
        const response = await fetch(`${BASE_URL}/student/${uID}/sessions/registered/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Không tìm thấy');
        
        const rootData = await response.json();
        // Backend trả về: { session: {...data...}, message: "..." }
        const item = rootData.session; // <--- LẤY ĐÚNG CÁI NÀY
        console.log("Item", item)
        // Map sang Frontend
        return {
            id: item.session_id,
            tutor: item.tutor, // id
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
        console.error("Lỗi getSessionById:", error);
        throw error;
        }
    },

    deleteSession: async (uID, id) => {
      try {
        const response = await fetch(`${BASE_URL}/student/${uID}/sessions/registered/${id}/`, {
            method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Lỗi khi xóa');
        return true;
      } catch (error) {
          throw error;
      }
  }, 

     getSessionDetail: async (uID, session_id) => {
        const response = await fetch(`${BASE_URL}/student/${uID}/sessions/registered/${session_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error('Lỗi khi xóa');

        return response.json();
    },


    // getTutorById: async (tutorId) => {
    //     try {
    //         const response = await fetch(`${BASE_URL}/tutor/${tutorId}/information/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         return {
    //             success: true,
    //             data: data
    //         };
    //     } catch (error) {
    //         console.error('Error fetching tutor by ID:', error);
    //         return {
    //             success: false,
    //             error: error.message
    //         };
    //     }
    // }

    getUnregisterSession: async (studentId) => {
        try {
        const response = await fetch(
            `${BASE_URL}/student/${studentId}/sessions/register/`,
            {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // { sessions: {...}, count: N }
        } catch (error) {
        console.error("Error fetching unregistered sessions:", error);
        throw error;
        }
    },
    registerSession: async (studentId, sessionId) => {
        try {
            // URL: /student/sessions/register/ (phải khớp backend)
            // Backend mong đợi method POST và body gồm { student_id, session_id }
            const response = await fetch(`${BASE_URL}/student/${studentId}/sessions/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: studentId,
                    session_id: sessionId
                })
            });

            if (!response.ok) throw new Error('Đăng ký thất bại');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
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
