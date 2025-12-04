// API liên quan tới danh sách Tutor trong trang Student nhé ae
const BASE_URL = 'http://127.0.0.1:8000';

export const studentTutorApi = {
    getRecommendedTutor: async (studentId, filterStatus = 'all', keyword = '') => {
        try {
            const params = new URLSearchParams({
                filter_status: filterStatus,
                keyword: keyword
            });

            const response = await fetch(`${BASE_URL}/student/${studentId}/tutors?${params}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const rawData = await response.json();

            const tutorDict = rawData.tutors || rawData;

            const dataArray = Object.entries(tutorDict).map(([key, value]) => {
                if (typeof value !== 'object' || value === null) return null;

                return {
                    ...value,
                    tutor_id: key
                };
            }).filter(item => item !== null);

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

    followTutor: async (studentId, tutorId) => {
        try {
            const response = await fetch(`${BASE_URL}/student/${studentId}/follow/${tutorId}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Đăng ký thất bại');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    unfollowTutor: async (studentId, tutorId) => {
        try {
            const response = await fetch(`${BASE_URL}/student/${studentId}/follow/${tutorId}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Đăng ký thất bại');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};