// Ở đây chứa các API liên quan tới Session trong trnag Student nhé
const BASE_URL = "http://127.0.0.1:8000";

export const studentSessionApi = {
  getUnregisterSession: async (/*trong này là tham số nè*/) => {
    // try ....
  },

  getRegisteredSession: async (/*trong này là tham số nè*/) => {
    // try ...
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
