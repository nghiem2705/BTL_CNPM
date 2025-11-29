// Ở đây chứa các API liên quan tới Session trong trnag Student nhé
const BASE_URL = "http://127.0.0.1:8000";

export const studentSessionApi = {
  // Lấy tất cả buổi học mà student chưa đăng ký
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

  // Lấy tất cả buổi học mà student đã đăng ký
  getRegisteredSession: async (studentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/student/${studentId}/sessions/registered/`,
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
      console.error("Error fetching registered sessions:", error);
      throw error;
    }
  },

  // Lấy chi tiết buổi học đã đăng ký
  getRegisteredSessionDetail: async (studentId, sessionId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/student/${studentId}/sessions/registered/${sessionId}/`,
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
      return data;
    } catch (error) {
      console.error("Error fetching session detail:", error);
      throw error;
    }
  },

  // Đăng ký buổi học (dùng URL param)
  registerSession: async (studentId, sessionId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/student/${studentId}/sessions/${sessionId}/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error registering session:", error);
      throw error;
    }
  },

  // Hủy đăng ký buổi học
  unregisterSession: async (studentId, sessionId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/student/${studentId}/sessions/${sessionId}/unregister/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error unregistering session:", error);
      throw error;
    }
  },
};

// --- HÀM PHỤ TRỢ ---
const calculateEndTime = (startTime, durationMinutes) => {
  if (!startTime) return "";
  const [hour, minute] = startTime.split(":").map(Number);
  const totalMinutes = hour * 60 + minute + parseInt(durationMinutes || 0);
  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;
  return `${newHour}:${newMinute.toString().padStart(2, "0")}`;
};

const convertDateToDisplay = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `Thứ ${date.getDay() + 1}, ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
};

// export default api;
